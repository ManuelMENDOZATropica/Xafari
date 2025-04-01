const { DataTypes } = require("sequelize");
const database = require("../config/database");

const house = database.define("house", {
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
  element: {
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

module.exports = house;
