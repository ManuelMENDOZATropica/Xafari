const { body, param } = require("express-validator");

exports.createFamilyTreeValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("Name cannot be empty"),
  body("members").isArray().optional(),
  body("members.*")
    .isString()
    .notEmpty()
    .withMessage("Family member is not valid"),
  body("adminId").isUUID().withMessage("Valid admin ID is required"),
];

exports.updateFamilyTreeValidation = [
  param("familyId").notEmpty().withMessage("Valid family tree ID is required"),
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("Name cannot be empty"),
  body("members").isArray().optional(),
  body("members.*")
    .isString()
    .notEmpty()
    .withMessage("Family member is not valid"),
  body("adminId").optional().isUUID().withMessage("Valid admin ID is required"),
];

exports.familyTreeIdParam = [
  param("familyId").notEmpty().withMessage("Valid family tree ID is required"),
];
