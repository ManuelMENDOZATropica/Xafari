const express = require("express");
const router = express.Router();
const { checkSchema, matchedData } = require("express-validator");

const achievementController = require("../controllers/achievementController");
const { ValidationError } = require("../utils/errors");

const AchievementSchema = {
  name: {
    trim: true,
    notEmpty: {
      errorMessage: "Name cannot be empty",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  description: {
    trim: true,
    notEmpty: {
      errorMessage: "Description cannot be empty",
    },
    isString: {
      errorMessage: "Description must be a string",
    },
  },
  type: {
    trim: true,
    isString: true,
    isIn: {
      options: [["Amuleto", "Follaje"]],
      errorMessage: `Type must be "Amuleto" or "Follaje"`,
    },
  },
  imageUrl: {
    trim: true,
    isURL: true,
    notEmpty: {
      errorMessage: "imageUrl cannot be empty",
    },
    isString: {
      errorMessage: "imageUrl must be a string",
    },
  },
  activityId: {
    trim: true,
    isString: {
      errorMessage: "activityId must be a string",
    },
  },
  houseId: {
    trim: true,
    isString: {
      errorMessage: "houseId must be a string",
    },
  },
};

const validateAchievementData = async (req, res, next) => {
  const result = (
    await checkSchema(
      req.method == "POST" && req.params.id
        ? Object.fromEntries(
            Object.entries(AchievementSchema).map(([field, value]) => [
              field,
              {
                ...value,
                optional: true,
              },
            ])
          )
        : AchievementSchema,
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
  "/achievement",
  validateAchievementData,
  achievementController.createAchievement
);
router.get("/achievement/:id", achievementController.getAchievement);
router.delete("/achievement/:id", achievementController.deleteAchievement);
router.post(
  "/achievement/:id",
  validateAchievementData,
  achievementController.updateAchievement
);

module.exports = router;
