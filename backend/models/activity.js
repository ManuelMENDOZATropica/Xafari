const { DataTypes } = require("sequelize");
const database = require("../config/database");
const { BadRequestError, ValidationError } = require("../utils/errors");

const activity = database.define("activity", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    unique: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("Xperiencia", "Xecreto", "Xelfie", "Event"),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  minAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: {
      isInt: true,
      min: 0,
    },
  },
  maxAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: true,
      min: 1,
    },
    defaultValue: null,
  },
});

module.exports = activity;
