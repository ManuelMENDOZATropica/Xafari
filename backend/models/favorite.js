const { DataTypes } = require("sequelize");
const database = require("../config/database");

const favorite = database.define("favorite", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM("Xperiencia", "Xecreto", "Xelfie", "Event"),
    allowNull: false,
  },
});

module.exports = favorite;
