const { DataTypes } = require("sequelize");
const database = require("../config/database");

const familyTree = database.define("familyTree", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  admin: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
});

module.exports = familyTree;
