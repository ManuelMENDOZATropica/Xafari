const { DataTypes } = require("sequelize");
const database = require("../config/database");

const achievement = database.define("achievement", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM("Amuleto", "Follaje"),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = achievement;
