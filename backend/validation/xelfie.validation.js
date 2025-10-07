const { param } = require("express-validator");

exports.xelfieIdParam = [
  param("id").isUUID().withMessage("Valid xelfie ID is required"),
];
