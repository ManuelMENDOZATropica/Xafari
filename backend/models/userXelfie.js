const { DataTypes } = require("sequelize");
const database = require("../config/database");

const userXelfie = database.define("userXelfie", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  xelfieUrl: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});

module.exports = userXelfie;
