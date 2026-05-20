const express = require("express");
const router = express.Router();

const {
  createUserValidation,
  updateUserValidation,
  userIdParam,
} = require("../validation/user.validation");

const userController = require("../controllers/userController");

const { validateRequest } = require("../middleware/validateRequest");

router.get("/:id", userIdParam, validateRequest, userController.getUser);

router.post(
  "/",
  createUserValidation,
  validateRequest,
  userController.createUser
);

router.post(
  "/:id",
  updateUserValidation,
  validateRequest,
  userController.updateUser
);

router.put(
  "/:id",
  updateUserValidation,
  validateRequest,
  userController.updateUser
);

router.delete("/:id", userIdParam, validateRequest, userController.deleteUser);

const userActivityRoutes = require("./userActivityRoutes");
const userXelfieRoutes = require("./userXelfieRoutes");
const userAchievementRoutes = require("./userAchievementRoutes");

router.use("/:userId/activity", userActivityRoutes);
router.use("/:userId/xelfie", userXelfieRoutes);
router.use("/:userId/achievement", userAchievementRoutes);

module.exports = router;
