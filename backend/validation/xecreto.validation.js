const { body, param } = require("express-validator");

exports.createXecretoValidation = [
  body("clues").isArray(),
  body("clues.*.text").isString().withMessage("Clue text is not valid"),
  body("clues.*.correctAnswer")
    .isString()
    .withMessage("Clue correct answer is not valid"),
];

exports.updateXecretoValidation = [
  param("id").isUUID().withMessage("Valid xecreto ID is required"),
  body("clues").optional().isArray(),
  body("clues.*.text")
    .optional()
    .isString()
    .withMessage("Clue text is not valid"),
  body("cluess.*.correctAnswer")
    .optional()
    .isString()
    .withMessage("Clue correct answer is not valid"),
];

exports.xecretoIdParam = [
  param("id").isUUID().withMessage("Valid xecreto ID is required"),
];
