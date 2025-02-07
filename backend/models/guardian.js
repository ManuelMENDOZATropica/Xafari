const { DataTypes } = require("sequelize");
const database = require("../config/database");

const guardian = database.define("guardian", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

exports.default = guardian;
