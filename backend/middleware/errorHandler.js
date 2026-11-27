const logger = require("../utils/logger");
const { handleSequelizeError } = require("../utils/errors");

// Error handler a nivel app: formato {error, details?}, nunca stack ni SQL.
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  const httpErr = handleSequelizeError(err);
  const status = httpErr.status || 500;

  if (status >= 500) {
    logger.error(`${req.method} ${req.originalUrl} → ${err && (err.stack || err.message || err)}`);
  }

  if (res.headersSent) return;

  const body = { error: status >= 500 ? "Internal server error" : httpErr.message };
  if (status < 500 && httpErr.details && httpErr.details.length) {
    body.details = httpErr.details.map((d) =>
      typeof d === "string" ? d : d.issue || d.msg || String(d)
    );
  }
  if (httpErr.extra) Object.assign(body, httpErr.extra);
  if (httpErr.extra && httpErr.extra.retryAfter) {
    res.set("Retry-After", String(httpErr.extra.retryAfter));
  }
  res.status(status).json(body);
};

module.exports = errorMiddleware;
