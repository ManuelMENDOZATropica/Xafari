const { body, param } = require("express-validator");

exports.createUserActivityValidation = [
  body("userId").isUUID().withMessage("Valid user ID is required"),
  body("activityId").isUUID().withMessage("Valid activity ID is required"),
  body("startedAt")
    .isString()
    .notEmpty()
    .isISO8601()
    .custom((value, { req }) => {
      const completedAt = new Date(req.body.completedAt);

      if (new Date(value) == "Invalid Date" || completedAt < new Date(value)) {
        return false;
      }

      req.body.startDate = new Date(value);
      return true;
    })
    .withMessage("startedAt is not valid"),
  body("completedAt")
    .isString()
    .notEmpty()
    .isISO8601()
    .custom((value, { req }) => {
      const completedAt = new Date(value);

      if (completedAt == "Invalid Date") {
        return false;
      }

      req.body.completedAt = completedAt;
      return true;
    }),
];

exports.updateUserActivityValidation = [
  body("startedAt")
    .optional()
    .isString()
    .notEmpty()
    .isISO8601()
    .custom((value, { req }) => {
      const completedAt = new Date(req.body.completedAt);

      if (new Date(value) == "Invalid Date" || completedAt < new Date(value)) {
        return false;
      }

      req.body.startDate = new Date(value);
      return true;
    })
    .withMessage("startedAt is not valid"),
  body("completedAt")
    .optional()
    .isString()
    .notEmpty()
    .isISO8601()
    .custom((value, { req }) => {
      const completedAt = new Date(value);

      if (completedAt == "Invalid Date") {
        return false;
      }

      req.body.completedAt = completedAt;
      return true;
    }),
];

exports.userActivityIdParam = [
  param("id").isUUID().withMessage("Valid user ID is required"),
];
