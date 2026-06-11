const { stripDangerousFields } = require("../utils/stripDangerousFields");
const { sanitizeRequestQuery } = require("../utils/safeQuery");

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const sanitizeIncomingRequest = (req, res, next) => {
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeRequestQuery(req.query, req.originalUrl || req.url);
  }

  if (MUTATING_METHODS.has(req.method) && req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
    req.body = stripDangerousFields(req.body);
  }

  return next();
};

module.exports = { sanitizeIncomingRequest };
