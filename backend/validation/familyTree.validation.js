const { body, param } = require("express-validator");

exports.createFamilyTreeValidation = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("members").isArray().optional(),
  body("members.*")
    .isString()
    .notEmpty()
    .withMessage("Family member is not valid"),
  body("adminId").isUUID().withMessage("Valid admin ID is required"),
];

exports.updateFamilyTreeValidation = [
  param("id").isUUID().withMessage("Valid event ID is required"),
  body("name").isString().optional().notEmpty().withMessage("Name is required"),
  body("members").isArray().optional(),
  body("members.*")
    .isString()
    .notEmpty()
    .withMessage("Family member is not valid"),
  body("adminId").optional().isUUID().withMessage("Valid admin ID is required"),
];

exports.familyTreeIdParam = [
  param("id").isUUID().withMessage("Valid family tree ID is required"),
];
