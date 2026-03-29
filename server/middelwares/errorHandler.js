const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";
  const errors = Array.isArray(err.errors)
    ? err.errors
    : Array.isArray(err.details)
      ? err.details
      : undefined;

  console.error("[server.errorHandler]", {
    path: req.originalUrl,
    method: req.method,
    statusCode,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
