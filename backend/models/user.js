const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Xecreto = require("./xecreto");
const UserXecreto = require("./userXecreto");

const Xelfie = require("./xelfie");
const UserXelfie = require("./userXelfie");

const Xperiencia = require("./xperiencia");
const UserXperiencia = require("./userXperiencia");

const Casa = require("./casa");
const UserCasa = require("./userCasa");

const user = database.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      isInt: true,
    },
  },
  num_brazalete: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  qr_iptv: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

user.belongsToMany(Xecreto, {
  through: UserXecreto,
  foreignKey: "user_id",
  otherKey: "xecreto_id",
});

user.belongsToMany(Xelfie, {
  through: UserXelfie,
  foreignKey: "user_id",
  otherKey: "xecreto_id",
});

user.belongsToMany(Xperiencia, {
  through: UserXperiencia,
  foreignKey: "user_id",
  otherKey: "xecreto_id",
});

module.exports = user;
