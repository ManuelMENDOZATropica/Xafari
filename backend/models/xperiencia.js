const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Casa = require("./casa");

const xperiencia = database.define("xperiencia", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  familiar: {
    type: DataTypes.BOOLEAN,
  },
  min_age: {
    type: DataTypes.INTEGER,
  },
  max_age: {
    type: DataTypes.INTEGER,
  },
});

xperiencia.belongsTo(Casa, {
  foreignKey: "casa_id",
});

Casa.hasMany(xperiencia, {
  foreignKey: "casa_id",
});

module.exports = xperiencia;
