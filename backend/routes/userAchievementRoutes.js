const express = require("express");
const router = express.Router({ mergeParams: true });
const userAchievementController = require("../controllers/userAchievementController");
const {
  userAchievementValidation,
  achievementParamsValidation,
} = require("../validation/userAchievement.validation");

// CREATE
router.post(
  ["/user-achievements/:userId", "/user-achievement/:userId"],
  userAchievementValidation,
  userAchievementController.addAchievement
);

router.post(
  "/",
  userAchievementValidation,
  userAchievementController.addAchievement
);

// DELETE
router.delete(
  ["/user-achievements/:userId/:achievementId", "/user-achievement/:userId/:achievementId"],
  achievementParamsValidation,
  userAchievementController.deleteAchievement
);

router.delete(
  "/:achievementId",
  achievementParamsValidation,
  userAchievementController.deleteAchievement
);

// UPDATE (PUT)
router.put(
  ["/user-achievements/:userId/:achievementId", "/user-achievement/:userId/:achievementId"],
  userAchievementValidation,
  userAchievementController.updateAchievement
);

router.put(
  "/:achievementId",
  userAchievementValidation,
  userAchievementController.updateAchievement
);

// UPDATE (POST)
router.post(
  "/:achievementId",
  userAchievementValidation,
  userAchievementController.updateAchievement
);

module.exports = router;
