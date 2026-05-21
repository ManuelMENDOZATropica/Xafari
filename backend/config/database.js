require("dotenv").config();
const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];

let database;
if (config.url) {
  const { url, ...options } = config;
  database = new Sequelize(url, options);
} else {
  database = new Sequelize(config);
}

module.exports = database;
