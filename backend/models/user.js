const { DataTypes } = require("sequelize");
const database = require("../config/database");

const user = database.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reservationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ["password"],
      },
    },
    scopes: {
      withPassword: { attributes: {} }, // Allows fetching password when needed
    },
  }
);

user.prototype.toJSON = function () {
  let values = { ...this.get() };

  delete values.password; // Remove password from JSON output

  return values;
};

module.exports = user;
