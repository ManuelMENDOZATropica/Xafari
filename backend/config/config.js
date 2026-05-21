const logger = require("../utils/logger");

module.exports = {
  development: {
    dialect: "sqlite",
    storage: "database.sqlite",
    logging: (msg) => logger.info(msg),
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: (msg) => logger.info(msg),
  },
};
