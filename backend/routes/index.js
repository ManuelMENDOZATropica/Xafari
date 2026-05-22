const { handleSequelizeError } = require("../utils/errors");

const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

// A-02: Rate limiting — max 10 intentos por IP cada 15 minutos en endpoints de auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Por favor espera 15 minutos e intenta de nuevo." },
});

router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

const usersRoutes = require("./userRoutes");
const housesRoutes = require("./houseRoutes");
const xecretoRoutes = require("./xecretoRoutes");
const xelfieRoutes = require("./xelfieRoutes");
const xperienciaRoutes = require("./xperienciaRoutes");
const eventsRoutes = require("./eventRoutes");
const familyTreeRoutes = require("./familyTreeRoutes");
const achievementRoutes = require("./achievementRoutes");

const userActivityRoutes = require("./userActivityRoutes");
const userAvatarRoutes = require("./userAvatarRoutes")
const userXelfiesRoutes = require("./userXelfieRoutes");
const userPreferenceRoutes = require("./userPreferenceRoutes");
const userAchievementRoutes = require("./userAchievementRoutes");
const activityRoutes = require("./activityRoutes");
const docsRoutes = require("./docsRoutes")
const leaderboardRoutes = require("./leaderboardRoutes");
const userController = require("../controllers/userController");
const errorMiddleware = require("../middleware/errorHandler");
const authMiddleware = require("../middleware/authHandler");

// router.use(authMiddleware)

router.post("/login", authLimiter, userController.login);
router.put("/user", authMiddleware, userController.updateCurrentUser);

router.use("/users", usersRoutes);
router.use("/user", usersRoutes);

router.use("/houses", housesRoutes);
router.use("/house", housesRoutes);

router.use("/xecretos", xecretoRoutes);
router.use("/xecreto", xecretoRoutes);

router.use("/xelfies", xelfieRoutes);
router.use("/xelfie", xelfieRoutes);

router.use("/xperiencias", xperienciaRoutes);
router.use("/xperiencia", xperienciaRoutes);

router.use("/events", eventsRoutes);
router.use("/event", eventsRoutes);

router.use("/family-trees", familyTreeRoutes);
router.use("/familyTree", familyTreeRoutes);

router.use("/achievements", achievementRoutes);
router.use("/achievement", achievementRoutes);

router.use("/user-avatar", userAvatarRoutes);

router.use("/user-activities", userActivityRoutes);
router.use("/user-activity", userActivityRoutes);

router.use("/user-xelfies", userXelfiesRoutes);
router.use("/user-xelfie", userXelfiesRoutes);

router.use("/user-preferences", userPreferenceRoutes);
router.use("/user-preference", userPreferenceRoutes);

router.use("/activities", activityRoutes);
router.use("/activity", activityRoutes);

router.use("/leaderboard", leaderboardRoutes);

router.use("/", userAchievementRoutes);

router.use("/docs", docsRoutes)

router.use(errorMiddleware);

module.exports = router;
