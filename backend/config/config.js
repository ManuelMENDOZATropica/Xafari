const logger = require("../utils/logger");


module.exports = {
  development: {
    dialect: "sqlite",
    storage: "database.sqlite",
    logging: (msg)=> logger.info(msg)
  },
  test: {
    dialect: "sqlite",
    storage: "memory",
    logging: (msg)=> logger.info(msg)
  },
  production: {
    username: process.env.DB_USERNAME || "prod_user",
    password: process.env.DB_PASSWORD || "prod_password",
    database: process.env.DB_NAME || "prod_db",
    host: process.env.DB_HOST || "prod_db_host",
    dialect: "postgres",
  },
};
