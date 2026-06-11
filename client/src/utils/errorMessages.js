const SERVER_MESSAGE_RU = {
  "Password is required": "Пароль обязателен",
  "Password must be at least 8 characters": "Пароль должен содержать минимум 8 символов",
  "Password must be at least 8 characters long": "Пароль должен содержать минимум 8 символов",
  "Password must not exceed 128 characters": "Пароль не должен превышать 128 символов",
  "Password must contain at least one uppercase letter":
    "Пароль должен содержать хотя бы одну заглавную букву",
  "Password must contain at least one lowercase letter":
    "Пароль должен содержать хотя бы одну строчную букву",
  "Password must contain at least one number": "Пароль должен содержать хотя бы одну цифру",
  "Password must contain at least one special character":
    "Пароль должен содержать хотя бы один спецсимвол",
  "Password is too common, please choose a more secure password":
    "Пароль слишком простой, выберите более надёжный",
  "Password must not contain sequential characters":
    "Пароль не должен содержать последовательности символов (123, abc)",
  "Password must not contain repeated characters":
    "Пароль не должен содержать повторяющиеся символы (aaa)",
  "Password does not meet requirements": "Пароль не соответствует требованиям",
  "Password was used recently. Please choose a different password.":
    "Этот пароль уже использовался недавно. Выберите другой.",
  "Email is required": "Эл. почта обязательна",
  "Invalid email format": "Некорректный формат эл. почты",
  "First name is required": "Имя обязательно",
  "First Name is required": "Имя обязательно",
  "Last name is required": "Фамилия обязательна",
  "Last Name is required": "Фамилия обязательна",
  "Username or email is required": "Укажите имя пользователя или эл. почту",
  "User already exists. Please try another email.":
    "Пользователь уже существует. Используйте другую эл. почту.",
  "Invalid email or password. Please try again.":
    "Неверный email или пароль. Попробуйте ещё раз.",
  "Login failed": "Не удалось войти",
  "Please fill in all fields": "Заполните все поля",
};

const translateApiMessage = (message, locale = "en") => {
  if (!message || !String(locale).startsWith("ru")) {
    return message;
  }

  return (
    SERVER_MESSAGE_RU[message] ||
    message
      .split(/\.\s+/)
      .map((part) => SERVER_MESSAGE_RU[part.trim()] || part.trim())
      .filter(Boolean)
      .join(". ")
  );
};

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
      .map((item) => {
        const raw = item?.message || item?.msg;
        return translateApiMessage(raw, locale);
      })
      .filter(Boolean)
      .join(". ");
  }
  if (Array.isArray(data?.errors) && typeof data.errors[0] === "string") {
    return data.errors.map((item) => translateApiMessage(item, locale)).filter(Boolean).join(". ");
  }

  const message = data?.message || data?.error || error.message;
  return translateApiMessage(message, locale) || getErrorMessage("common", "unknownError", locale);
};

export const getLocalizedError = (error, locale = "en") => {
  if (!error) return getErrorMessage("common", "unknownError", locale);

  const status = error.response?.status;
  const message = extractApiErrorMessage(error, locale);

  if (status === 400) {
    if (message?.includes("Password") || message?.includes("password")) {
      return translateApiMessage(message, locale) || getErrorMessage("auth", "passwordWeak", locale);
    }
    return translateApiMessage(message, locale) || getErrorMessage("common", "validationFailed", locale);
  }

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
