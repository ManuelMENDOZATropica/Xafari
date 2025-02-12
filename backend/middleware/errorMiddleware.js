const logger = require("../utils/logger");

const errorMiddleware = async (err, req, res, next) => {
  logger.error(err);

  res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error",
  });
};

module.exports = errorMiddleware;
