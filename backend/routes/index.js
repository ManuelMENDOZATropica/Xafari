const express = require("express");
const env = require("../config/env");
const userController = require("../controllers/userController");
const { loginLimiter } = require("../middleware/rateLimits");
const { loginValidation } = require("../validation/user.validation");
const { validateRequest, asyncHandler } = require("../middleware/validateRequest");

const router = express.Router();

// Públicas (la lista vive en middleware/authHandler.js → isPublic)
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
router.post("/login", loginLimiter, loginValidation, validateRequest, asyncHandler(userController.login));
router.use("/leaderboard", require("./leaderboardRoutes"));

// Usuarios: /users (registro y por id) y /user (alias del usuario del token)
router.use("/users", require("./userRoutes"));
router.use("/user", require("./currentUserRoutes"));

// Catálogo: GET público, escritura solo admin
router.use("/houses", require("./houseRoutes"));
router.use("/activities", require("./activityRoutes"));
router.use("/xecretos", require("./xecretoRoutes"));
router.use("/xelfies", require("./xelfieRoutes"));
router.use("/xperiencias", require("./xperienciaRoutes"));
router.use("/events", require("./eventRoutes"));
router.use("/achievements", require("./achievementRoutes"));

// Progreso del usuario del token
router.use("/user-activities", require("./userActivityRoutes"));
router.use("/user-xelfies", require("./userXelfieRoutes"));
router.use("/user-preferences", require("./userPreferenceRoutes"));
router.use("/user-achievements", require("./userAchievementRoutes"));

router.use("/family-trees", require("./familyTreeRoutes"));

if (env.ENABLE_DOCS) {
  router.use("/docs", require("./docsRoutes"));
}

module.exports = router;
