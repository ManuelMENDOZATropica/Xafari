const { DataTypes, STRING } = require("sequelize");
const database = require("../config/database");

const Casa = require("./casa");

const xecreto = database.define("xecreto", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  qr: {
    type: STRING,
    unique: true,
    allowNull: false,
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

xecreto.belongsTo(Casa, {
  foreignKey: "casa_id",
});

Casa.hasMany(xecreto, {
  foreignKey: "casa_id",
});

module.exports = xecreto;
