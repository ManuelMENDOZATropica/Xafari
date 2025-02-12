const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Casa = require("./casa");

const insignia = database.define("insignia", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

insignia.belongsTo(Casa, {
  foreignKey: "casa_id",
});

module.exports = insignia;
