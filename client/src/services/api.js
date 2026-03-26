import axios from "axios";
import { constant } from "constant";
import { toast } from "react-toastify";

// Axios interceptor for global error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/auth/sign-in";
      toast.error("Session expired. Please login again.");
    }

    // Handle other errors
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    // Don't show toast for cancelled requests
    if (!axios.isCancel(error)) {
      console.error("API Error:", errorMessage);
    }

    return Promise.reject(error);
  }
);

const getStoredToken = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token;
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

export const postApi = async (path, data, login, isFormData = false) => {
  try {
    const token = getStoredToken();

    const headers = {};

    if (isFormData) {
      headers["Content-Type"] = "multipart/form-data";
    } else {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const result = await axios.post(constant?.baseUrl + path, data, {
      headers: headers,
    });

    persistAuth(result, login);
    return result;
  } catch (e) {
    // Error is already handled by interceptor
    throw e;
  }
};

export const postApiBlob = async (path, data = {}) => {
  try {
    return await axios.post(constant?.baseUrl + path, data, {
      headers: {
        Authorization: getStoredToken(),
      },
      responseType: "blob",
    });
  } catch (e) {
    throw e;
  }
};

export const putApi = async (path, data, id) => {
  try {
    return await axios.put(constant?.baseUrl + path, data, {
      headers: {
        Authorization: getStoredToken(),
      },
    });
  } catch (e) {
    throw e;
  }
};

export const deleteApi = async (path, param) => {
  try {
    const result = await axios.delete(constant?.baseUrl + path + param, {
      headers: {
        Authorization: getStoredToken(),
      },
    });

    if (result?.data?.token) {
      localStorage.setItem("token", result.data.token);
    }

    return result;
  } catch (e) {
    throw e;
  }
};

export const deleteManyApi = async (path, data) => {
  try {
    const result = await axios.post(constant?.baseUrl + path, data, {
      headers: {
        Authorization: getStoredToken(),
      },
    });

    if (result?.data?.token) {
      localStorage.setItem("token", result.data.token);
    }

    return result;
  } catch (e) {
    throw e;
  }
};

export const getApi = async (path, id) => {
  try {
    const result = await axios.get(constant?.baseUrl + path + (id || ""), {
      headers: {
        Authorization: getStoredToken(),
      },
    });

    return result?.data || result;
  } catch (e) {
    throw e;
  }
};
