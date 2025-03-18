const { DataTypes, STRING } = require("sequelize");
const database = require("../config/database");

const User = require("./user");
const Xelfie = require("./xelfie");

const userXelfie = database.define("userXelfie", {
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
  },
  xelfie_id: {
    type: DataTypes.UUID,
    references: {
      model: Xelfie,
      key: "id",
    },
  },
  xelfie_url: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
  completed_at: {
    type: DATE,
    allowNull: false,
  },
});

module.exports = userXelfie;
