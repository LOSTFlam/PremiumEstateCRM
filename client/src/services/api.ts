import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { constant } from "constant";
import { toast } from "react-toastify";
import { clearAuthStorage, persistUser } from "utils/authStorage";

interface PersistOptions {
  rememberMe?: boolean;
  isFormData?: boolean;
  requestConfig?: AxiosRequestConfig;
}

interface GetOptions {
  params?: Record<string, unknown>;
  useCache?: boolean;
  cacheKey?: string;
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
  silent?: boolean;
}

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: constant?.baseUrl,
  timeout: 30000,
  withCredentials: true,
});

const requestCache = new Map<string, CacheEntry>();
const GET_CACHE_DURATION = 5 * 60 * 1000;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (_value?: unknown) => void;
  reject: (_reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const getCsrfToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const buildHeaders = (
  isFormData = false,
  headers: Record<string, string> = {}
): Record<string, string> => {
  const nextHeaders: Record<string, string> = { ...headers };

  if (isFormData) {
    nextHeaders["Content-Type"] = "multipart/form-data";
  } else if (!nextHeaders["Content-Type"]) {
    nextHeaders["Content-Type"] = "application/json";
  }

  const csrfToken = getCsrfToken();
  if (csrfToken) {
    nextHeaders["X-CSRF-Token"] = csrfToken;
  }

  return nextHeaders;
};

const shouldSkipAuthRedirect = (url = ""): boolean =>
  url.includes("/api/user/login") ||
  url.includes("/api/user/register") ||
  url.includes("/api/user/refresh-token");

const getCacheEntry = (cacheKey: string): unknown | null => {
  const entry = requestCache.get(cacheKey);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > GET_CACHE_DURATION) {
    requestCache.delete(cacheKey);
    return null;
  }

  return entry.data;
};

const setCacheEntry = (cacheKey: string, data: unknown): void => {
  requestCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
};

const buildCacheKey = (path: string, params?: Record<string, unknown>): string =>
  `${path}:${JSON.stringify(params || {})}`;

const isSilentRequest = (config?: AxiosRequestConfig): boolean => {
  const headers = config?.headers as
    | (Record<string, string> & { get?: (_key: string) => string | undefined })
    | undefined;

  return (
    headers?.["X-Silent-Request"] === "true" ||
    headers?.["x-silent-request"] === "true" ||
    headers?.get?.("X-Silent-Request") === "true" ||
    headers?.get?.("x-silent-request") === "true"
  );
};

apiClient.interceptors.request.use((config) => {
  const existingHeaders =
    typeof config.headers?.toJSON === "function"
      ? (config.headers.toJSON() as Record<string, string>)
      : (config.headers as Record<string, string>);
  const contentType = existingHeaders?.["Content-Type"] || existingHeaders?.["content-type"];
  const headers = buildHeaders(contentType === "multipart/form-data", existingHeaders);

  Object.keys(headers).forEach((key) => {
    config.headers.set(key, headers[key]);
  });
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const silentRequest = isSilentRequest(originalRequest);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    if (silentRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !shouldSkipAuthRedirect(originalRequest?.url || "")) {
      if (originalRequest._retry) {
        clearAuthStorage();
        window.location.href = "/auth/sign-in";
        toast.error("Session expired. Please login again.");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/api/user/refresh-token");
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearAuthStorage();
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
  }
);

const normalizeGetArgs = (
  path: string,
  idOrOptions?: string | number | Record<string, unknown>,
  maybeOptions?: GetOptions
): { url: string; params: Record<string, unknown>; options: GetOptions } => {
  let url = path;
  let params: Record<string, unknown> = {};
  let options: GetOptions = {};

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
      "signal" in idOrOptions ||
      "silent" in idOrOptions;

    if (hasOptionKeys) {
      options = idOrOptions as GetOptions;
      params = (idOrOptions as GetOptions).params || {};
    } else {
      params = idOrOptions;
      options = maybeOptions || {};
    }
  }

  return { url, params, options };
};

const normalizeWriteArgs = (
  loginOrOptions?: PersistOptions | boolean,
  isFormData?: boolean
): PersistOptions => {
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

export const clearApiCache = (prefix = ""): void => {
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

export const postApi = async (
  path: string,
  data: unknown,
  login?: PersistOptions | boolean,
  isFormData = false
): Promise<AxiosResponse> => {
  const {
    rememberMe,
    isFormData: useFormData,
    requestConfig,
  } = normalizeWriteArgs(login, isFormData);

  const result = await apiClient.post(path, data, {
    ...requestConfig,
    headers: buildHeaders(useFormData, (requestConfig?.headers || {}) as Record<string, string>),
  });

  if (result?.data?.user) {
    persistUser(result.data.user, !!rememberMe);
  }

  return result;
};

export const postApiBlob = async (path: string, data: unknown = {}): Promise<AxiosResponse> => {
  return apiClient.post(path, data, {
    headers: buildHeaders(false),
    responseType: "blob",
  });
};

export const putApi = async (
  path: string,
  data: unknown,
  _id?: string | number
): Promise<AxiosResponse> => {
  return apiClient.put(path, data, {
    headers: buildHeaders(false),
  });
};

export const deleteApi = async (path: string, param: string): Promise<AxiosResponse> => {
  return apiClient.delete(path + param, {
    headers: buildHeaders(false),
  });
};

export const deleteManyApi = async (path: string, data: unknown): Promise<AxiosResponse> => {
  return apiClient.post(path, data, {
    headers: buildHeaders(false),
  });
};

export const getApi = async (
  path: string,
  id?: string | number | Record<string, unknown>
): Promise<unknown> => {
  const { url, params, options } = normalizeGetArgs(path, id);
  const useCache = Boolean(options.useCache);
  const cacheKey = options.cacheKey || buildCacheKey(url, params);

  if (useCache) {
    const cached = getCacheEntry(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const headers = buildHeaders(false, options.headers);
  if (options.silent) {
    headers["X-Silent-Request"] = "true";
  }

  const result = await apiClient.get(url, {
    params,
    timeout: options.timeout,
    signal: options.signal,
    headers,
  });

  const normalized = result?.data || result;
  if (useCache) {
    setCacheEntry(cacheKey, normalized);
  }

  return normalized;
};

export default {
  postApi,
  postApiBlob,
  putApi,
  deleteApi,
  deleteManyApi,
  getApi,
  clearApiCache,
};
