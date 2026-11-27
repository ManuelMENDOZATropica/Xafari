const { body } = require("express-validator");

const answer = body("correctAnswer").optional({ values: "null" }).isString().trim().isLength({ min: 1, max: 50 });

exports.createXperienciaValidation = [
  body("isValidable").optional().isBoolean().withMessage("isValidable must be boolean").toBoolean(),
  answer,
];
exports.updateXperienciaValidation = exports.createXperienciaValidation;
