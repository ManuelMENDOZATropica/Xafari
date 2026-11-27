const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const database = require("../config/database");

const BCRYPT_ROUNDS = 10;
const BCRYPT_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
const ROLES = ["user", "admin"];

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
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
      set(value) {
        this.setDataValue(
          "email",
          typeof value === "string" ? value.trim().toLowerCase() : value
        );
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
      allowNull: true,
      defaultValue: "",
    },
    pronouns: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    casa: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: "user",
      validate: { isIn: [ROLES] },
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: { attributes: { include: ["password"] } },
    },
  }
);

// Hashea la contraseña en cualquier create/update que la cambie
// (también en User.update(...) gracias a individualHooks en beforeBulkUpdate).
async function hashPassword(instance) {
  if (!instance.changed("password")) return;
  const pwd = instance.getDataValue("password");
  if (typeof pwd === "string" && !BCRYPT_RE.test(pwd)) {
    instance.setDataValue("password", await bcrypt.hash(pwd, BCRYPT_ROUNDS));
  }
}
user.addHook("beforeSave", hashPassword);
user.addHook("beforeBulkUpdate", (options) => {
  if (options.fields && options.fields.includes("password")) {
    options.individualHooks = true;
  }
});

user.prototype.checkPassword = function (plain) {
  const hash = this.getDataValue("password");
  if (!hash || typeof plain !== "string") return Promise.resolve(false);
  return bcrypt.compare(plain, hash);
};

user.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  delete values.tokenVersion;
  return values;
};

user.ROLES = ROLES;
user.BCRYPT_RE = BCRYPT_RE;

module.exports = user;
