const { getDatabaseStatus, isDatabaseReady } = require("../utils/databaseState");

const requireDatabase = (_req, res, next) => {
  if (isDatabaseReady()) {
    next();
    return;
  }

  res.status(503).json({
    success: false,
    code: "DATABASE_UNAVAILABLE",
    message: "Database is temporarily unavailable. Please try again later.",
    database: getDatabaseStatus(),
  });
};

module.exports = requireDatabase;
