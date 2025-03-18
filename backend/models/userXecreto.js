const { DataTypes, STRING, DATE } = require("sequelize");
const database = require("../config/database");

const User = require("./user");
const Xecreto = require("./xecreto");

const userXecreto = database.define("userXecreto", {
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
  },
  xecreto_id: {
    type: DataTypes.UUID,
    references: {
      model: Xecreto,
      key: "id",
    },
  },
  xecreto_url: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
  completed_at: {
    type: DATE,
    allowNull: false,
  },
});

module.exports = userXecreto;
