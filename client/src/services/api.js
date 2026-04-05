import axios from "axios";
import { constant } from "constant";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: constant?.baseUrl,
  timeout: 30000,
  withCredentials: true,
});

const requestCache = new Map();
const GET_CACHE_DURATION = 5 * 60 * 1000;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const getStoredToken = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token;
};

const clearStoredAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

const persistAuth = (result, rememberMe) => {
  if (!result?.data?.token) {
    return;
  }

  const storage = rememberMe ? localStorage : sessionStorage;
  const fallbackStorage = rememberMe ? sessionStorage : localStorage;

  storage.setItem("token", result.data.token);
  storage.setItem("user", JSON.stringify(result.data.user));
  fallbackStorage.removeItem("token");
  fallbackStorage.removeItem("user");
};

const updateStoredToken = (token) => {
  const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
  storage.setItem("token", token);
};

const buildHeaders = (isFormData = false, headers = {}) => {
  const token = getStoredToken();
  const nextHeaders = {
    ...headers,
  };

  if (isFormData) {
    nextHeaders["Content-Type"] = "multipart/form-data";
  } else if (!nextHeaders["Content-Type"]) {
    nextHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    nextHeaders.Authorization = `Bearer ${token}`;
  }

  return nextHeaders;
};

const shouldSkipAuthRedirect = (url = "") =>
  url.includes("/api/user/login") ||
  url.includes("/api/user/register") ||
  url.includes("/api/user/refresh-token");

const getCacheEntry = (cacheKey) => {
  const entry = requestCache.get(cacheKey);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > GET_CACHE_DURATION) {
    requestCache.delete(cacheKey);
    return null;
  }

  return entry.data;
};

const setCacheEntry = (cacheKey, data) => {
  requestCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
};

const buildCacheKey = (path, params) => `${path}:${JSON.stringify(params || {})}`;

apiClient.interceptors.request.use((config) => ({
  ...config,
  headers: buildHeaders(
    config?.headers?.["Content-Type"] === "multipart/form-data",
    config.headers,
  ),
}));

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    if (error.response?.status === 401 && !shouldSkipAuthRedirect(originalRequest?.url || "")) {
      if (originalRequest._retry) {
        clearStoredAuth();
        window.location.href = "/auth/sign-in";
        toast.error("Session expired. Please login again.");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await apiClient.post("/api/user/refresh-token");
        const newToken = refreshResponse.data.token;
        updateStoredToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearStoredAuth();
        window.location.href = "/auth/sign-in";
        toast.error("Session expired. Please login again.");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else if (error.response?.status === 429) {
      toast.error("Too many requests. Please wait a moment.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage,
    });

    return Promise.reject(error);
  },
);

const normalizeGetArgs = (path, idOrOptions, maybeOptions) => {
  let url = path;
  let params = {};
  let options = {};

  if (typeof idOrOptions === "string" || typeof idOrOptions === "number") {
    url = `${path}${idOrOptions}`;
    options = maybeOptions || {};
  } else if (idOrOptions && typeof idOrOptions === "object" && !Array.isArray(idOrOptions)) {
    const hasOptionKeys =
      "params" in idOrOptions ||
      "useCache" in idOrOptions ||
      "cacheKey" in idOrOptions ||
      "headers" in idOrOptions ||
      "timeout" in idOrOptions ||
      "signal" in idOrOptions;

    if (hasOptionKeys) {
      options = idOrOptions;
      params = idOrOptions.params || {};
    } else {
      params = idOrOptions;
      options = maybeOptions || {};
    }
  }

  return { url, params, options };
};

const normalizeWriteArgs = (loginOrOptions, isFormData) => {
  if (loginOrOptions && typeof loginOrOptions === "object" && !Array.isArray(loginOrOptions)) {
    return {
      rememberMe: Boolean(loginOrOptions.rememberMe),
      isFormData: Boolean(loginOrOptions.isFormData),
      requestConfig: loginOrOptions.requestConfig || {},
    };
  }

  return {
    rememberMe: Boolean(loginOrOptions),
    isFormData: Boolean(isFormData),
    requestConfig: {},
  };
};

export const clearApiCache = (prefix = "") => {
  if (!prefix) {
    requestCache.clear();
    return;
  }

  Array.from(requestCache.keys()).forEach((key) => {
    if (key.startsWith(prefix)) {
      requestCache.delete(key);
    }
  });
};

export const postApi = async (path, data, login, isFormData = false) => {
  const { rememberMe, isFormData: useFormData, requestConfig } = normalizeWriteArgs(
    login,
    isFormData,
  );

  const result = await apiClient.post(path, data, {
    ...requestConfig,
    headers: buildHeaders(useFormData, requestConfig.headers),
  });

  persistAuth(result, rememberMe);
  return result;
};

export const postApiBlob = async (path, data = {}) => {
  return apiClient.post(path, data, {
    headers: buildHeaders(false),
    responseType: "blob",
  });
};

export const putApi = async (path, data, id) => {
  return apiClient.put(path, data, {
    headers: buildHeaders(false),
  });
};

export const deleteApi = async (path, param) => {
  return apiClient.delete(path + param, {
    headers: buildHeaders(false),
  });
};

export const deleteManyApi = async (path, data) => {
  return apiClient.post(path, data, {
    headers: buildHeaders(false),
  });
};

export const getApi = async (path, id) => {
  const { url, params, options } = normalizeGetArgs(path, id);
  const useCache = Boolean(options.useCache);
  const cacheKey = options.cacheKey || buildCacheKey(url, params);

  if (useCache) {
    const cached = getCacheEntry(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const result = await apiClient.get(url, {
    params,
    timeout: options.timeout,
    signal: options.signal,
    headers: buildHeaders(false, options.headers),
  });

  const normalized = result?.data || result;
  if (useCache) {
    setCacheEntry(cacheKey, normalized);
  }

  return normalized;
};
