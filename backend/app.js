const express = require("express");
const helmet = require("helmet");

const routes = require("./routes/index");

const app = express();

// A-03: Security headers
app.use(helmet());

// M-04: Body size limit (1mb) to prevent DoS via large payloads
app.use(express.json({ limit: "1mb" }));

// A-01: Restrict CORS to known origins only
const ALLOWED_ORIGINS = [
  "https://xafari.onrender.com",
  "https://xafari-phi.vercel.app",   // frontend producción
  process.env.FRONTEND_URL,           // configurable via env var
  "http://localhost:5173",            // dev
  "http://localhost:4173",            // dev preview
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(routes);

module.exports = app;
