const USER_KEY = "user";

const readStorage = () => {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getStoredUser = () => readStorage();

export const isAuthenticatedUser = () => Boolean(readStorage()?.role);

export const persistUser = (user, rememberMe = true) => {
  if (!user) return;
  const primary = rememberMe ? localStorage : sessionStorage;
  const secondary = rememberMe ? sessionStorage : localStorage;
  primary.setItem(USER_KEY, JSON.stringify(user));
  secondary.removeItem(USER_KEY);
};

export const clearAuthStorage = () => {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};
