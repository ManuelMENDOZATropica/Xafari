const { body, param } = require("express-validator");

exports.createAchievementValidation = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("Description is required"),

  body("type")
    .isString()
    .notEmpty()
    .isIn(["Amuleto", "Follaje"])
    .withMessage(`Type must be "Amuleto" or "Follaje"`),
  body("imageUrl").isURL().notEmpty().withMessage("ImageUrl is not valid"),
  param("activityId").isUUID().withMessage("Valid activity ID is required"),
  param("houseId").isUUID().withMessage("Valid house ID is required"),
];

exports.updateAchievementValidation = [
  param("id").isUUID().withMessage("Valid achievement ID is required"),
  body("name").optional().isString().notEmpty().withMessage("Name is required"),
  body("description")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Description is required"),

  body("type")
    .optional()
    .isString()
    .notEmpty()
    .isIn(["Amuleto", "Follaje"])
    .withMessage(`Type must be "Amuleto" or "Follaje"`),
  body("imageUrl")
    .optional()
    .isURL()
    .notEmpty()
    .withMessage("ImageUrl is not valid"),
];

exports.achievementIdParam = [
  param("id").isUUID().withMessage("Valid achievement ID is required"),
];
