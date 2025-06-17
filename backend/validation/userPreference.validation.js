const { body, param } = require("express-validator");

exports.createUserPreferenceValidation = [
  body("userId").isUUID().withMessage("Valid user ID is required"),
  body("activityId").isUUID().withMessage("Valid activity ID is required"),
  body("comment").isString().notEmpty().withMessage("Comment is required"),
  body("rating").isInt({ min: 0, max: 5 }).withMessage("Ratinng is not valid"),
];

exports.updateUserPreferenceValidation = [
  param("id").isUUID().withMessage("Valid user preference ID is required"),
  body("comment")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Comment is required"),
  body("rating")
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage("Ratinng is not valid"),
];

exports.userPreferenceParamValidation = [
  param("id").isUUID().withMessage("Valid user Preference ID is required"),
];
