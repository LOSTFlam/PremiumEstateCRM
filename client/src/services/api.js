import axios from "axios";
import { constant } from "constant";

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

export const postApi = async (path, data, login) => {
  try {
    const token = getStoredToken();

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const result = await axios.post(constant?.baseUrl + path, data, {
      headers: headers,
    });

    persistAuth(result, login);
    return result;
  } catch (e) {
    return e;
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
    console.error(e);
    return e;
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
    console.error(e);
    return e;
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
    console.error(e);
    return e;
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
    console.error(e);
    return e;
  }
};

export const getApi = async (path, id) => {
  try {
    const result = await axios.get(constant?.baseUrl + path + (id || ""), {
      headers: {
        Authorization: getStoredToken(),
      },
    });

    return result;
  } catch (e) {
    return e;
  }
};
