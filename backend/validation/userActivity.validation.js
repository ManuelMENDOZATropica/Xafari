const { body } = require("express-validator");

exports.completeActivityValidation = [
  body("activityId").isUUID().withMessage("Valid activity ID is required"),
  body("code").optional({ values: "null" }).isString().isLength({ max: 64 }),
  body("answer").optional({ values: "null" }).isString().isLength({ max: 50 }),
];
