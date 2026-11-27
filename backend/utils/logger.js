const winston = require("winston");

const { combine, timestamp, printf, errors } = winston.format;

const customFormat = printf(
  ({ level, message, stack, timestamp: ts }) => `${ts} ${level}: ${stack || message}`
);

module.exports = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "test" ? "error" : "info"),
  silent: process.env.NODE_ENV === "test" && !process.env.LOG_LEVEL,
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    customFormat
  ),
  transports: [new winston.transports.Console()],
});
