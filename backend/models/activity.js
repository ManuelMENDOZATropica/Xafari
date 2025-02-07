const { DataTypes } = require("sequelize");
const database = require("../config/database");

const Guardian = require("./guardian").default;

const Activity = database.define("activity", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

Activity.belongsTo(Guardian, {
  foreignKey: {
    field: "guardianId",
    allowNull: false,
  },
  onDelete: "cascade",
});

exports.default = Activity;
