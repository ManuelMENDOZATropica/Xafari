const { Sequelize } = require("sequelize");
const { NODE_ENV } = require("./env");

const config = require("./config")[NODE_ENV] || require("./config").development;

let database;
if (config.url) {
  const { url, ...options } = config;
  database = new Sequelize(url, options);
} else {
  database = new Sequelize(config);
}

module.exports = database;
