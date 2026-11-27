const { body } = require("express-validator");

function range(value, { req }) {
  const { startDate, endDate } = req.body;
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    throw new Error("Date values are invalid");
  }
  return true;
}

exports.createEventValidation = [
  body("startDate").isISO8601({ strict: true }).withMessage("Date values are invalid").custom(range),
  body("endDate").isISO8601({ strict: true }).withMessage("Date values are invalid").custom(range),
];

exports.updateEventValidation = [
  body("startDate").optional().isISO8601({ strict: true }).withMessage("Date values are invalid").custom(range),
  body("endDate").optional().isISO8601({ strict: true }).withMessage("Date values are invalid").custom(range),
];
