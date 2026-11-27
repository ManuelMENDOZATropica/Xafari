const { body } = require("express-validator");

const fields = [
  body("rating").optional({ values: "null" }).isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5").toInt(),
  body("comment").optional({ values: "null" }).isString().isLength({ max: 1000 }),
  body("isFavorite").optional().isBoolean().toBoolean(),
];

exports.createUserPreferenceValidation = [
  body("activityId").isUUID().withMessage("Valid activity ID is required"),
  ...fields,
];
exports.updateUserPreferenceValidation = fields;
