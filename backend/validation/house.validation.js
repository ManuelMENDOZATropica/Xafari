const { body, param } = require("express-validator");

exports.createHouseValidation = [
  body("name").trim().notEmpty().withMessage("Name cannot be empty"),
  body("animal").trim().notEmpty().withMessage("Animal cannot be empty"),
  body("element").trim().notEmpty().withMessage("Element cannot be empty"),
];

exports.updateHouseValidation = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("animal").optional().trim().notEmpty().withMessage("Animal cannot be empty"),
  body("element").optional().trim().notEmpty().withMessage("Element cannot be empty"),
];

exports.houseIdParam = [
  param("id").notEmpty().withMessage("Valid house ID is required"),
];
