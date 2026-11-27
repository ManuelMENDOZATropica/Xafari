const { body, param } = require("express-validator");

exports.grantValidation = [
  param("userId").isUUID().withMessage("userId must be a valid UUID"),
  body("achievementId").isUUID().withMessage("Valid achievement ID is required"),
  body("amount").optional().isInt({ min: 1, max: 1000 }).withMessage("amount must be a positive integer").toInt(),
];
exports.updateValidation = [
  param("userId").isUUID().withMessage("userId must be a valid UUID"),
  param("achievementId").isUUID().withMessage("achievementId must be a valid UUID"),
  body("amount").isInt({ min: 1, max: 1000 }).withMessage("amount must be a positive integer").toInt(),
];
exports.paramsValidation = [
  param("userId").isUUID().withMessage("userId must be a valid UUID"),
  param("achievementId").isUUID().withMessage("achievementId must be a valid UUID"),
];
