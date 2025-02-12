const express = require("express");

const errorMiddleware = require("./middleware/errorMiddleware");

const userRoutes = require("./routes/userRoutes");
const casaRoutes = require("./routes/casaRoutes");
const xecretoRoutes = require("./routes/xecretoRoutes");
const xelfieRoutes = require("./routes/xelfieRoutes");
const xperienciaRoutes = require("./routes/xperienciaRoutes");

const app = express();

app.use(express.json());

app.use("/user", userRoutes);
app.use(["/casa", "/casas"], casaRoutes);
app.use(["/xecreto", "/xecretos"], xecretoRoutes);
app.use(["/xelfie", "/xelfies"], xelfieRoutes);
app.use(["/xperiencia", "/xperiencias"], xperienciaRoutes);

app.use(errorMiddleware);

module.exports = app;
