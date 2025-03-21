const { DataTypes } = require("sequelize");
const database = require("../config/database");

const xecreto = database.define("xecreto", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

module.exports = xecreto;
