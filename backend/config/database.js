const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];

require("dotenv").config();

const database = new Sequelize(config);

module.exports = database;
