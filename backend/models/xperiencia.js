const { DataTypes } = require("sequelize");
const database = require("../config/database");

const xperiencia = database.define("xperiencia", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  qrCode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  isValidable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = xperiencia;
