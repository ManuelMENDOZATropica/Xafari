const { body } = require("express-validator");

exports.createXecretoValidation = [
  body("clues").optional().isArray({ max: 50 }),
  body("clues.*.text").isString().notEmpty().withMessage("Clue text is not valid"),
  body("clues.*.correctAnswer").isString().notEmpty().withMessage("Clue correct answer is not valid"),
];
exports.updateXecretoValidation = exports.createXecretoValidation;

exports.checkAnswerValidation = [
  body("clueId").isUUID().withMessage("Valid clue ID is required"),
  body("answer").isString().isLength({ max: 200 }).withMessage("Answer is required"),
];
