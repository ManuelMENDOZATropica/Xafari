const { param } = require("express-validator");

exports.xelfieIdParam = [
  param("id").notEmpty().withMessage("Valid xelfie ID is required"),
];
