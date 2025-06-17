const { handleSequelizeError } = require("../utils/errors");

const express = require("express");
const router = express.Router();

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
const docsRoutes = require("./docsRoutes")
const errorMiddleware = require("../middleware/errorHandler");
const authMiddleware = require("../middleware/authHandler");

// router.use(authMiddleware)

router.use("/users", usersRoutes);
router.use("/houses", housesRoutes);
router.use("/xecretos", xecretoRoutes);
router.use("/xelfies", xelfieRoutes);
router.use("/xperiencias", xperienciaRoutes);
router.use("/events", eventsRoutes);
router.use("/family-trees", familyTreeRoutes);
router.use("/achievements", achievementRoutes);
router.use("/user-avatar", userAvatarRoutes);
router.use("/user-activities", userActivityRoutes);
router.use("/user-xelfies", userXelfiesRoutes);
router.use("/user-preferences", userPreferenceRoutes);
router.use("/docs", docsRoutes)


router.use(errorMiddleware);

module.exports = router;
