const { DataTypes } = require("sequelize");
const database = require("../config/database");

const User = require("./user");
const Casa = require("./casa");

const userCasa = database.define("userCasa", {
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
  },
  casa_id: {
    type: DataTypes.UUID,
    references: {
      model: Casa,
      key: "id",
    },
  },
});

module.exports = userCasa;
