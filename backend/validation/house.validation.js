const { body } = require("express-validator");

const f = (required, name, msg) =>
  (required ? body(name) : body(name).optional()).isString().trim().notEmpty().withMessage(msg).isLength({ max: 100 });

exports.createHouseValidation = [
  f(true, "name", "Name cannot be empty"),
  f(true, "animal", "Animal cannot be empty"),
  f(true, "element", "Element cannot be empty"),
];
exports.updateHouseValidation = [
  f(false, "name", "Name cannot be empty"),
  f(false, "animal", "Animal cannot be empty"),
  f(false, "element", "Element cannot be empty"),
];
