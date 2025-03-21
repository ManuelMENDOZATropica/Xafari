const { DataTypes } = require("sequelize");
const database = require("../config/database");

const userActivity = database.define("userActivity", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  activityId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = userActivity;
