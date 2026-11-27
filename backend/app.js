const express = require("express");
const helmet = require("helmet");

const env = require("./config/env");
const routes = require("./routes/index");
const { globalAuth } = require("./middleware/authHandler");
const { generalLimiter } = require("./middleware/rateLimits");
const errorMiddleware = require("./middleware/errorHandler");

const app = express();

// Render (y cualquier PaaS) pone un proxy delante: sin esto req.ip es la IP del
// proxy y los rate limits se vuelven globales.
app.set("trust proxy", env.TRUST_PROXY);
app.set("docsEnabled", env.ENABLE_DOCS);
app.disable("x-powered-by");

app.use(helmet());

// CORS con lista explícita de orígenes (CORS_ORIGINS, separados por coma).
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.vary("Origin");
  if (origin && env.CORS_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Max-Age", "600");
  }
  if (req.method === "OPTIONS") return res.sendStatus(origin && env.CORS_ORIGINS.includes(origin) ? 204 : 403);
  next();
});

app.use(generalLimiter);
app.use(express.json({ limit: "1mb" }));

// Auth global: todo requiere token salvo la lista de públicas (ver authHandler).
app.use(globalAuth);

app.use(routes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorMiddleware);

module.exports = app;
