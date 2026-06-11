const DANGEROUS_FIELDS = new Set([
  "role",
  "roles",
  "password",
  "refreshToken",
  "refreshTokenExpiry",
  "failedLoginAttempts",
  "lockedUntil",
  "passwordHistory",
  "isBlocked",
  "blockReason",
  "deleted",
  "verificationStatus",
  "moderationStatus",
]);

/**
 * Remove privileged fields from request bodies before Mongoose writes.
 * Dynamic CRM modules may still pass custom fields through.
 */
const stripDangerousFields = (body = {}, options = {}) => {
  const { allowCreateBy = false, preservePassword = false } = options;
  const safe = { ...(body || {}) };

  DANGEROUS_FIELDS.forEach((field) => {
    if (preservePassword && field === "password") {
      return;
    }
    delete safe[field];
  });

  if (!allowCreateBy) {
    delete safe.createBy;
  }

  return safe;
};

module.exports = { stripDangerousFields, DANGEROUS_FIELDS };
