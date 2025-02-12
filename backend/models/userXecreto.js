const { DataTypes, STRING } = require("sequelize");
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
  },
});


module.exports = userXecreto;
