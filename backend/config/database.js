const { Sequelize } = require("sequelize");
const logger = require("../utils/logger");

require("dotenv").config();

/*const database = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: "postgres",
    logging: (msg) => logger.info(msg),
  }
);

*/

const database = new Sequelize("sqlite:./test.sqlite", {
  logging: (msg) => logger.debug(msg),
});
module.exports = database;
