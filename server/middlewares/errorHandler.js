const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";
  const errors = Array.isArray(err.errors)
    ? err.errors
    : Array.isArray(err.details)
      ? err.details
      : undefined;

  // Console statement removed

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
