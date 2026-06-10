const ERROR_MESSAGES = {
  en: {
    auth: {
      sessionExpired: "Your session has expired. Please log in again.",
      invalidCredentials: "Invalid email or password. Please try again.",
      accountLocked:
        "Account temporarily locked due to too many failed attempts. Please try again later.",
      passwordMismatch: "Current password is incorrect.",
      passwordReuse: "New password must be different from your recent passwords.",
      passwordWeak:
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
      registerFailed: "Registration failed. Please try again.",
      tokenRefreshFailed: "Unable to refresh session. Please log in again.",
    },
    network: {
      serverError: "Server error. Please try again later.",
      tooManyRequests: "Too many requests. Please wait a moment.",
      networkOffline: "You appear to be offline. Please check your connection.",
      requestTimeout: "Request timed out. Please try again.",
      unknownError: "An unexpected error occurred. Please try again.",
    },
    properties: {
      notFound: "Property not found.",
      createFailed: "Failed to create property. Please try again.",
      updateFailed: "Failed to update property. Please try again.",
      deleteFailed: "Failed to delete property. Please try again.",
      uploadFailed: "Failed to upload files. Please try again.",
    },
    leads: {
      notFound: "Lead not found.",
      createFailed: "Failed to create lead. Please try again.",
      updateFailed: "Failed to update lead. Please try again.",
      deleteFailed: "Failed to delete lead. Please try again.",
    },
    common: {
      permissionDenied: "You do not have permission to perform this action.",
      notFound: "The requested resource was not found.",
      validationFailed: "Please check your input and try again.",
      saveFailed: "Failed to save changes. Please try again.",
      loadFailed: "Failed to load data. Please try again.",
    },
  },
  ru: {
    auth: {
      sessionExpired: "Ваша сессия истекла. Пожалуйста, войдите снова.",
      invalidCredentials: "Неверный email или пароль. Попробуйте ещё раз.",
      accountLocked:
        "Аккаунт временно заблокирован из-за слишком многих неудачных попыток. Попробуйте позже.",
      passwordMismatch: "Текущий пароль неверен.",
      passwordReuse: "Новый пароль должен отличаться от недавних.",
      passwordWeak:
        "Пароль должен содержать минимум 8 символов, заглавную и строчную буквы, цифру и спецсимвол.",
      registerFailed: "Регистрация не удалась. Попробуйте ещё раз.",
      tokenRefreshFailed: "Не удалось обновить сессию. Пожалуйста, войдите снова.",
    },
    network: {
      serverError: "Ошибка сервера. Попробуйте позже.",
      tooManyRequests: "Слишком много запросов. Подождите немного.",
      networkOffline: "Нет подключения к интернету. Проверьте соединение.",
      requestTimeout: "Время запроса истекло. Попробуйте ещё раз.",
      unknownError: "Произошла непредвиденная ошибка. Попробуйте ещё раз.",
    },
    properties: {
      notFound: "Объект не найден.",
      createFailed: "Не удалось создать объект. Попробуйте ещё раз.",
      updateFailed: "Не удалось обновить объект. Попробуйте ещё раз.",
      deleteFailed: "Не удалось удалить объект. Попробуйте ещё раз.",
      uploadFailed: "Не удалось загрузить файлы. Попробуйте ещё раз.",
    },
    leads: {
      notFound: "Лид не найден.",
      createFailed: "Не удалось создать лид. Попробуйте ещё раз.",
      updateFailed: "Не удалось обновить лид. Попробуйте ещё раз.",
      deleteFailed: "Не удалось удалить лид. Попробуйте ещё раз.",
    },
    common: {
      permissionDenied: "У вас нет прав для выполнения этого действия.",
      notFound: "Запрошенный ресурс не найден.",
      validationFailed: "Проверьте введённые данные и попробуйте снова.",
      saveFailed: "Не удалось сохранить изменения. Попробуйте ещё раз.",
      loadFailed: "Не удалось загрузить данные. Попробуйте ещё раз.",
    },
  },
};

export const getErrorMessage = (category, key, locale = "en") => {
  const messages = ERROR_MESSAGES[locale] || ERROR_MESSAGES.en;
  return messages[category]?.[key] || messages.common?.unknownError || "An error occurred";
};

export const extractApiErrorMessage = (error, locale = "en") => {
  if (!error) return getErrorMessage("common", "unknownError", locale);

  const data = error.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors
      .map((item) => item?.message || item?.msg)
      .filter(Boolean)
      .join(". ");
  }
  if (Array.isArray(data?.errors) && typeof data.errors[0] === "string") {
    return data.errors.join(". ");
  }

  return (
    data?.message ||
    data?.error ||
    error.message ||
    getErrorMessage("common", "unknownError", locale)
  );
};

export const getLocalizedError = (error, locale = "en") => {
  if (!error) return getErrorMessage("common", "unknownError", locale);

  const status = error.response?.status;
  const message = extractApiErrorMessage(error, locale);

  if (status === 401) {
    if (message?.includes("expired") || message?.includes("Session")) {
      return getErrorMessage("auth", "sessionExpired", locale);
    }
    if (message?.includes("locked")) {
      return getErrorMessage("auth", "accountLocked", locale);
    }
    return getErrorMessage("auth", "invalidCredentials", locale);
  }

  if (status === 403) {
    return getErrorMessage("common", "permissionDenied", locale);
  }

  if (status === 404) {
    return getErrorMessage("common", "notFound", locale);
  }

  if (status === 429) {
    return getErrorMessage("network", "tooManyRequests", locale);
  }

  if (status >= 500) {
    return getErrorMessage("network", "serverError", locale);
  }

  if (error.code === "ECONNABORTED" || message?.includes("timeout")) {
    return getErrorMessage("network", "requestTimeout", locale);
  }

  if (!navigator.onLine) {
    return getErrorMessage("network", "networkOffline", locale);
  }

  return message || getErrorMessage("common", "unknownError", locale);
};

export default { getErrorMessage, getLocalizedError, extractApiErrorMessage, ERROR_MESSAGES };
