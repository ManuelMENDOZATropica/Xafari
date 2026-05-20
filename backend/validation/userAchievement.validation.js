const { param, body } = require("express-validator");

exports.userAchievementValidation = [
  param("userId").notEmpty(),
  body("achievementId").isString().notEmpty(),
  body("amount").isInt({ min: 1 }),
];

exports.achievementParamsValidation = [
  param("userId").notEmpty(),
  param("achievementId").isString().notEmpty(),
];
