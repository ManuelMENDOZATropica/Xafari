const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  createUserValidation,
  updateUserValidation,
  userIdParam,
} = require("../validation/user.validation");

const userController = require("../controllers/userController");

const { validateRequest } = require("../middleware/validateRequest");

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,                   // máx 5 registros por IP por hora
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de registro. Intenta en 1 hora." },
});

router.get("/:id", userIdParam, validateRequest, userController.getUser);

router.post(
  "/",
  registerLimiter,
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
