const { DataTypes } = require("sequelize");
const database = require("../config/database");

const user = database.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      isInt: true,
    },
  },
  suiteNumber: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      isInt: true,
    },
  },
});

exports.default = user;
