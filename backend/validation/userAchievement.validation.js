exports.userAchievementValidation = [
  param("userId").isUUID(),
  body("achievementId").isString().notEmpty(),
  body("amount").isInt({ min: 1 }),
];

exports.achievementParamsValidation = [
  param("userId").isUUID(),
  param("achievementId").isString().notEmpty(),
];
