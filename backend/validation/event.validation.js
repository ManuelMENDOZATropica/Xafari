const { body, param } = require("express-validator");

exports.createEventValidation = [
  body("startDate")
    .isString()
    .notEmpty()
    .isISO8601()
    .withMessage("Date values are invalid")
    .custom((value, { req }) => {
      const endDate = new Date(req.body.endDate);

      if (new Date(value) == "Invalid Date" || endDate < new Date(value)) {
        throw new Error("Date values are invalid");
      }

      req.body.startDate = new Date(value);
      return true;
    })
    .withMessage("Date values are invalid"),
  body("endDate")
    .isString()
    .notEmpty()
    .isISO8601()
    .withMessage("Date values are invalid")
    .custom((value, { req }) => {
      const endDate = new Date(value);

      if (endDate == "Invalid Date") {
        throw new Error("Date values are invalid");
      }

      req.body.endDate = endDate;
      return true;
    })
    .withMessage("Date values are invalid"),
];

exports.updateEventValidation = [
  param("id").notEmpty().withMessage("Valid event ID is required"),
  body("startDate")
    .optional()
    .isString()
    .notEmpty()
    .isISO8601()
    .withMessage("Date values are invalid")
    .custom((value, { req }) => {
      const endDate = new Date(req.body.endDate);

      if (new Date(value) == "Invalid Date" || endDate < new Date(value)) {
        throw new Error("Date values are invalid");
      }

      req.body.startDate = new Date(value);
      return true;
    })
    .withMessage("Date values are invalid"),

  body("endDate")
    .optional()
    .isString()
    .notEmpty()
    .isISO8601()
    .withMessage("Date values are invalid")
    .custom((value, { req }) => {
      const endDate = new Date(value);

      if (endDate == "Invalid Date") {
        throw new Error("Date values are invalid");
      }

      req.body.endDate = endDate;
      return true;
    })
    .withMessage("Date values are invalid"),
];

exports.eventIdParam = [
  param("id").notEmpty().withMessage("Valid event ID is required"),
];
