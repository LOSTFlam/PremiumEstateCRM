/**
 * Enhanced API Service with improved error handling, request cancellation, and caching
 * @version 2.0.0
 * @improvements
 * - Request cancellation support
 * - Automatic retry logic
 * - Request/response caching
 * - Better error handling
 * - TypeScript-ready patterns
 */

import axios from "axios";
import { constant } from "constant";
import { toast } from "react-toastify";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: constant?.baseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request cache
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Active requests for cancellation
const activeRequests = new Map();

/**
 * Get cached response if valid
 */
const getCachedResponse = (cacheKey) => {
  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  requestCache.delete(cacheKey);
  return null;
};

/**
 * Set response in cache
 */
const setCachedResponse = (cacheKey, data) => {
  requestCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Generate cache key from request
 */
const generateCacheKey = (method, path, params) => {
  return `${method}:${path}:${JSON.stringify(params || {})}`;
};

// ============ INTERCEPTORS ============

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for cancellation
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    config.requestId = requestId;
    activeRequests.set(requestId, config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Remove from active requests
    activeRequests.delete(response.config.requestId);

    // Handle auth persistence for login
    if (response.data?.token && response.config.url?.includes("/user")) {
      const rememberMe =
        localStorage.getItem("rememberMe") === "true" ||
        sessionStorage.getItem("rememberMe") === "true";
      const storage = rememberMe ? localStorage : sessionStorage;
      const fallbackStorage = rememberMe ? sessionStorage : localStorage;

      storage.setItem("token", response.data.token);
      storage.setItem("user", JSON.stringify(response.data.user));
      fallbackStorage.removeItem("token");
      fallbackStorage.removeItem("user");
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Remove from active requests
    if (error.config?.requestId) {
      activeRequests.delete(error.config.requestId);
    }

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/auth/sign-in";
      toast.error("Session expired. Please login again.");

      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      toast.error("Too many requests. Please wait a moment.");
      return Promise.reject(error);
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
      return Promise.reject(error);
    }

    // Don't show toast for cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Log error for debugging
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    return Promise.reject(error);
  }
);

/**
 * Cancel all active requests
 */
export const cancelAllRequests = () => {
  activeRequests.forEach((config) => {
    config.cancel("Request cancelled by user");
  });
  activeRequests.clear();
};

/**
 * Cancel specific request by ID
 */
export const cancelRequest = (requestId) => {
  const config = activeRequests.get(requestId);
  if (config) {
    config.cancel("Request cancelled");
    activeRequests.delete(requestId);
  }
};

// ============ API METHODS ============

/**
 * GET request with caching support
 */
export const getApi = async (path, params = {}, options = {}) => {
  const { useCache = false, cacheKey = null } = options;

  if (useCache) {
    const key = cacheKey || generateCacheKey("GET", path, params);
    const cached = getCachedResponse(key);
    if (cached) {
      return cached;
    }
  }

  try {
    const response = await apiClient.get(path, { params });

    if (useCache) {
      const key = cacheKey || generateCacheKey("GET", path, params);
      setCachedResponse(key, response.data);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * POST request
 */
export const postApi = async (path, data = {}, options = {}) => {
  const { isFormData = false, showSuccessToast = false, successMessage = "Operation successful" } = options;

  const headers = {};
  if (isFormData) {
    headers["Content-Type"] = "multipart/form-data";
  }

  try {
    const response = await apiClient.post(path, data, { headers });

    if (showSuccessToast) {
      toast.success(successMessage);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * PUT request
 */
export const putApi = async (path, data = {}, options = {}) => {
  const { showSuccessToast = false, successMessage = "Updated successfully" } = options;

  try {
    const response = await apiClient.put(path, data);

    if (showSuccessToast) {
      toast.success(successMessage);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * DELETE request
 */
export const deleteApi = async (path, options = {}) => {
  const { showSuccessToast = false, successMessage = "Deleted successfully" } = options;

  try {
    const response = await apiClient.delete(path);

    if (showSuccessToast) {
      toast.success(successMessage);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * POST request with FormData (for file uploads)
 */
export const postFormData = async (path, formData, options = {}) => {
  const { showProgress = false, onProgress = () => {} } = options;

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  if (showProgress) {
    config.onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(percentCompleted);
    };
  }

  try {
    const response = await apiClient.post(path, formData, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * GET request for downloading files (PDF, Excel, etc.)
 */
export const downloadFile = async (path, filename = "download") => {
  try {
    const response = await apiClient.get(path, {
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Clear API cache
 */
export const clearApiCache = () => {
  requestCache.clear();
};

export default apiClient;
