const logger = require("../utils/logger");

const errorMiddleware = async (err, req, res, next) => {
  logger.error(err);

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: err.message || "Internal server error",
    ...(err.details ? { details: err.details.map(i=> i.issue) } : {}),
  });
};

module.exports = errorMiddleware;
