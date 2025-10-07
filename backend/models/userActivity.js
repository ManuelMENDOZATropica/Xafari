const { DataTypes } = require("sequelize");
const database = require("../config/database");

const userActivity = database.define("userActivity", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
});

module.exports = userActivity;
