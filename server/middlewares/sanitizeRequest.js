const { stripDangerousFields } = require("../utils/stripDangerousFields");
const { sanitizeRequestQuery } = require("../utils/safeQuery");

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const AUTH_PASSWORD_PATHS = [
  /\/api\/user\/register\b/i,
  /\/api\/user\/login\b/i,
  /\/api\/user\/admin-register\b/i,
  /\/api\/user\/change-password\b/i,
  /\/api\/user\/reset-password\b/i,
  /\/api\/user\/forgot-password\b/i,
];

const shouldPreservePassword = (url = "") =>
  AUTH_PASSWORD_PATHS.some((pattern) => pattern.test(url));

const sanitizeIncomingRequest = (req, res, next) => {
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeRequestQuery(req.query, req.originalUrl || req.url);
  }

  if (MUTATING_METHODS.has(req.method) && req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
    req.body = stripDangerousFields(req.body, {
      preservePassword: shouldPreservePassword(req.originalUrl || req.url),
    });
  }

  return next();
};

module.exports = { sanitizeIncomingRequest };
