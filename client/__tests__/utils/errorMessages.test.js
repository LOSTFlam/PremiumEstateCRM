const { getErrorMessage, getLocalizedError } = require("../utils/errorMessages");

describe("Error Messages Utility", () => {
  describe("getErrorMessage", () => {
    it("should return English message by default", () => {
      const message = getErrorMessage("auth", "sessionExpired");
      expect(message).toBe("Your session has expired. Please log in again.");
    });

    it("should return Russian message when locale is ru", () => {
      const message = getErrorMessage("auth", "sessionExpired", "ru");
      expect(message).toBe("Ваша сессия истекла. Пожалуйста, войдите снова.");
    });

    it("should fallback to English for unknown locale", () => {
      const message = getErrorMessage("auth", "sessionExpired", "fr");
      expect(message).toBe("Your session has expired. Please log in again.");
    });

    it("should return fallback for unknown category", () => {
      const message = getErrorMessage("unknown", "key");
      expect(message).toContain("An error occurred");
    });
  });

  describe("getLocalizedError", () => {
    it("should handle 401 with expired message", () => {
      const error = {
        response: {
          status: 401,
          data: { message: "Session expired" },
        },
      };
      const message = getLocalizedError(error, "en");
      expect(message).toBe("Your session has expired. Please log in again.");
    });

    it("should handle 403 forbidden", () => {
      const error = {
        response: {
          status: 403,
          data: { message: "Forbidden" },
        },
      };
      const message = getLocalizedError(error, "ru");
      expect(message).toBe("У вас нет прав для выполнения этого действия.");
    });

    it("should handle 429 too many requests", () => {
      const error = {
        response: {
          status: 429,
          data: { message: "Rate limited" },
        },
      };
      const message = getLocalizedError(error);
      expect(message).toBe("Too many requests. Please wait a moment.");
    });

    it("should handle 500 server error", () => {
      const error = {
        response: {
          status: 500,
          data: { message: "Internal error" },
        },
      };
      const message = getLocalizedError(error, "ru");
      expect(message).toBe("Ошибка сервера. Попробуйте позже.");
    });

    it("should handle timeout errors", () => {
      const error = {
        code: "ECONNABORTED",
        message: "timeout of 30000ms exceeded",
      };
      const message = getLocalizedError(error);
      expect(message).toBe("Request timed out. Please try again.");
    });

    it("should handle null error gracefully", () => {
      const message = getLocalizedError(null);
      expect(message).toContain("error occurred");
    });
  });
});
