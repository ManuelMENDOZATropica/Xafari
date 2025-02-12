const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Casa = require("./casa");

const xelfie = database.define("xelfie", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    unique: true,
  },
  familiar: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  min_age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
  },
  max_age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
  },
});

xelfie.belongsTo(Casa, {
  foreignKey: "casa_id",
});

Casa.hasMany(xelfie, {
  foreignKey: "casa_id",
});

module.exports = xelfie;
