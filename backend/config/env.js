// Configuración central leída del entorno. Todo lo que depende de variables
// de entorno pasa por aquí para que los valores por defecto y las
// validaciones de producción estén en un solo lugar.
require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";
const isTest = NODE_ENV === "test";

// Secretos: en producción son obligatorios; en desarrollo y tests se usan
// valores fijos para que el proyecto arranque sin .env.
const DEV_JWT_SECRET = "xafari-dev-jwt-secret-solo-local";
const DEV_QR_SECRET = "xafari-dev-qr-secret-solo-local";

function list(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function int(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

const DEFAULT_CORS_ORIGINS = isProduction
  ? ["https://xafari-phi.vercel.app"]
  : [
      "http://localhost:5173",
      "https://localhost:5173",
      "http://localhost:5174",
      "https://localhost:5174",
      "http://localhost:4173",
      "https://localhost:4173",
    ];

const env = {
  NODE_ENV,
  isProduction,
  isTest,
  PORT: int(process.env.PORT, 3000),
  JWT_SECRET: process.env.JWT_SECRET || (isProduction ? null : DEV_JWT_SECRET),
  QR_SECRET: process.env.QR_SECRET || (isProduction ? null : DEV_QR_SECRET),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  PUBLIC_APP_URL: (process.env.PUBLIC_APP_URL || "https://xafari-phi.vercel.app").replace(/\/+$/, ""),
  CORS_ORIGINS: [
    ...new Set([
      ...(process.env.CORS_ORIGINS ? list(process.env.CORS_ORIGINS) : DEFAULT_CORS_ORIGINS),
      ...list(process.env.FRONTEND_URL), // compatibilidad con la variable anterior
    ]),
  ],
  // Saltos de proxy delante de la app (Render = 1). "false" lo desactiva.
  TRUST_PROXY:
    process.env.TRUST_PROXY === "false"
      ? false
      : int(process.env.TRUST_PROXY, 1),
  RATE_LIMIT_WINDOW_MIN: int(process.env.RATE_LIMIT_WINDOW_MIN, 15),
  RATE_LIMIT_MAX: int(process.env.RATE_LIMIT_MAX, 1000),
  LOGIN_LIMIT_MAX: int(process.env.LOGIN_LIMIT_MAX, 10),
  REGISTER_LIMIT_MAX: int(process.env.REGISTER_LIMIT_MAX, 30),
  XPERIENCIA_COOLDOWN_SECONDS: int(process.env.XPERIENCIA_COOLDOWN_SECONDS, 180),
  TIMEZONE: process.env.APP_TIMEZONE || "America/Cancun",
  ENABLE_DOCS:
    process.env.ENABLE_DOCS !== undefined
      ? process.env.ENABLE_DOCS === "true"
      : !isProduction,
};

function assertProductionSecrets() {
  if (!isProduction) return;
  const missing = ["JWT_SECRET", "QR_SECRET", "DATABASE_URL"].filter(
    (k) => !process.env[k]
  );
  if (missing.length) {
    throw new Error(
      `Faltan variables de entorno obligatorias en producción: ${missing.join(", ")}`
    );
  }
}

module.exports = { ...env, assertProductionSecrets };
