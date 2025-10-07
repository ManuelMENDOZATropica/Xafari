const express = require("express");
const router = express.Router();
const userAchievementController = require("../controllers/userAchievementController");
const {
  userAchievementValidation,
  achievementParamsValidation,
} = require("../validation/userAchievement.validation");

router.post(
  "/user-achievements/:userId/",
  userAchievementValidation,
  userAchievementController.addAchievement
);

router.delete(
  "/user-achievements/:userId/:achievementId",
  achievementParamsValidation,
  userAchievementController.deleteAchievement
);

router.put(
  "/user-achievements/:userId/:achievementId",
  userAchievementValidation,
  userAchievementController.updateAchievement
);

module.exports = router;
