const { DataTypes, DATE } = require("sequelize");
const database = require("../config/database");

const userAchievement = database.define("userAchievement", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = userAchievement;
