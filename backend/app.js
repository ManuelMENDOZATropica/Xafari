const express = require("express");

const errorMiddleware = require("./middleware/errorMiddleware");

const userRoutes = require("./routes/userRoutes");
const houseRoutes = require("./routes/houseRoutes");
const xecretoRoutes = require("./routes/xecretoRoutes");
const xelfieRoutes = require("./routes/xelfieRoutes");
const xperienciaRoutes = require("./routes/xperienciaRoutes");
const eventRouter = require("./routes/eventRoutes");
const familyTreeRouter = require("./routes/familyTreeRoutes");
const achievementRouter = require("./routes/achievementRoutes");
const userActivityRouter = require("./routes/userActivityRouter");
const userAchievementRouter = require("./routes/userAchievementRouter");
const userXelfieRouter = require("./routes/userXelfieRouter");

const app = express();

app.use(express.json());

app.use(userRoutes);
app.use(houseRoutes);
app.use(xecretoRoutes);
app.use(xelfieRoutes);
app.use(xperienciaRoutes);
app.use(eventRouter);
app.use(familyTreeRouter);
app.use(achievementRouter);
app.use(userActivityRouter);
app.use(userAchievementRouter);
app.use(userXelfieRouter);

app.use(errorMiddleware);

module.exports = app;
