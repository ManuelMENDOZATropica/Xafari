const express = require("express");
const router = express.Router();
const { checkSchema, matchedData } = require("express-validator");

const userAchievementController = require("../controllers/userAchievementController");
const { ValidationError } = require("../utils/errors");

const userAchievementSchema = {
  amount: {
    isInt: {
      options: { min: 0 },
      errorMessage: "Amount is not valid",
    },
    optional: true
  },
  achievementId: {
    trim: true,
    notEmpty: {
      errorMessage: "AchievementId cannot be empty",
    },
    isString: {
      errorMessage: "AchievementId must be a string",
    },
  },
  completedAt: {
    trim: true,
    optional: true,
    notEmpty: {
      errorMessage: "completedAt date cannot be empty",
    },
    isISO8601: {
      errorMessage: "Must be a valid ISO 8601 date",
    },
    custom: {
      errorMessage: "Date values are invalid",
      options: (value, { req }) => {
        const completedAt = new Date(value);

        if (completedAt == "Invalid Date") {
          return false;
        }

        req.body.completedAt = completedAt;
        return true;
      },
    },
  },
};

const validateUserAchievement = async (req, _res, next) => {
  const result = (
    await checkSchema(
      req.method == "POST" && req.params.achievementId
        ? Object.fromEntries(
            Object.entries(userAchievementSchema).map(([field, value]) => [
              field,
              {
                ...value,
                optional: true,
              },
            ])
          )
        : userAchievementSchema,
      ["body"]
    ).run(req)
  )
    .map((res) => res.array())
    .flat();

  if (result.length) {
    return next(new ValidationError(result[0].msg));
  }
  req.body = matchedData(req);

  next();
};

router.post(
  "/user/:userId/achievement/",
  validateUserAchievement,
  userAchievementController.addAchievement
);

router.delete(
  "/user/:userId/achievement/:achievementId",
  userAchievementController.deleteAchievement
);

router.post(
  "/user/:userId/achievement/:achievementId",
  validateUserAchievement,
  userAchievementController.updateAchievement
);

module.exports = router;
