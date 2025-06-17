const logger = require("../utils/logger");

const errorMiddleware = async (err, req, res, next) => {
  logger.error(err);

  res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error",
    ...(err.details ? { details: err.details.map(i=> i.issue) } : {}),
  });
};

module.exports = errorMiddleware;
