const { DataTypes } = require("sequelize");
const database = require("../config/database");

const casa = database.define("casa", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  elemento: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  animal: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});

module.exports = casa;
