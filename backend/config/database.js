require("dotenv").config();
const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];

const database = new Sequelize(config);

module.exports = database;
