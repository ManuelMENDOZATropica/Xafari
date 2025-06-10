const { body, param } = require("express-validator");

exports.createHouseValidation = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("animal").isString().notEmpty().withMessage("Animal is required"),
  body("element").isString().notEmpty().withMessage("Animal is required"),
];

exports.updateHouseValidation = [
  param("id").isUUID().withMessage("Valid house ID is required"),
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("animal").isString().notEmpty().withMessage("Animal is required"),
  body("element").isString().notEmpty().withMessage("Animal is required"),
];

exports.houseIdParam = [
  param("id").isUUID().withMessage("Valid house ID is required"),
];
