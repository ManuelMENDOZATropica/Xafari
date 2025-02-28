const { DataTypes, STRING } = require("sequelize");
const database = require("../config/database");

const User = require("./user");
const Xperiencia = require("./xperiencia");

const userXperiencia = database.define("userXperiencia", {
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
  },
  xperiencia_id: {
    type: DataTypes.UUID,
    references: {
      model: Xperiencia,
      key: "id",
    },
  },
  xperiencia_url: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
  completed_at: {
    type: DATE,
    allowNull: false,
  },
});

module.exports = userXperiencia;
