const { DataTypes } = require("sequelize");
const database = require("../config/database");

const xelfie = database.define("xelfie", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
});

module.exports = xelfie;
