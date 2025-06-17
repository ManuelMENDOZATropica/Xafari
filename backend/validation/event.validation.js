const { body, param } = require("express-validator");

exports.createEventValidation = [
  body("startDate")
    .isString()
    .notEmpty()
    .isISO8601()
    .custom((value, { req }) => {
      const endDate = new Date(req.body.endDate);

      if (new Date(value) == "Invalid Date" || endDate < new Date(value)) {
        return false;
      }

      req.body.startDate = new Date(value);
      return true;
    })
    .withMessage("startDate is not valid"),
  body("endDate")
    .isString()
    .notEmpty()
    .isISO8601()
    .custom((value, { req }) => {
      const endDate = new Date(value);

      if (endDate == "Invalid Date") {
        return false;
      }

      req.body.endDate = endDate;
      return true;
    })
    .withMessage("startDate is not valid"),
];

exports.updateEventValidation = [
  param("id").isUUID().withMessage("Valid event ID is required"),
  body("startDate")
    .optional()
    .isString()
    .notEmpty()
    .isISO8601()
    .custom((value, { req }) => {
      const endDate = new Date(req.body.endDate);

      if (new Date(value) == "Invalid Date" || endDate < new Date(value)) {
        return false;
      }

      req.body.startDate = new Date(value);
      return true;
    })
    .withMessage("startDate is not valid"),

  body("endDate")
    .optional()
    .isString()
    .notEmpty()
    .isISO8601()
    .custom((value, { req }) => {
      const endDate = new Date(value);

      if (endDate == "Invalid Date") {
        return false;
      }

      req.body.endDate = endDate;
      return true;
    })
    .withMessage("startDate is not valid"),
];

exports.eventIdParam = [
  param("id").isUUID().withMessage("Valid event ID is required"),
];
