const { DataTypes } = require("sequelize");
const database = require("../config/database");

const event = database.define("event", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  eventLocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isEventActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = event;
