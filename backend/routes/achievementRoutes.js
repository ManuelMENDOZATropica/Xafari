const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievementController");
const {
  createAchievementValidation,
  achievementIdParam,
  updateAchievementValidation,
} = require("../validation/achievement.validation");
const { validateRequest } = require("../middleware/validateRequest");

router.get("/", achievementController.getAllAchievements);
router.post(
  "/",
  createAchievementValidation,
  validateRequest,
  achievementController.createAchievement
);

router.get(
  "/:id",
  achievementIdParam,
  validateRequest,
  achievementController.getAchievement
);

router.delete(
  "/:id",
  achievementIdParam,
  validateRequest,
  achievementController.deleteAchievement
);

router.post(
  "/:id",
  achievementIdParam,
  updateAchievementValidation,
  validateRequest,
  achievementController.updateAchievement
);

module.exports = router;
