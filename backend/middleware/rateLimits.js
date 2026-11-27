const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const env = require("../config/env");

// En tests se saltan para que las suites no choquen con los límites.
const skip = () => env.isTest;

const base = {
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip,
};

// Límite general por IP. Generoso: en el parque muchos visitantes comparten IP pública.
const generalLimiter = rateLimit({
  ...base,
  windowMs: env.RATE_LIMIT_WINDOW_MIN * 60 * 1000,
  limit: env.RATE_LIMIT_MAX,
  message: { error: "Demasiadas peticiones. Intenta de nuevo en unos minutos." },
});

// Login: por IP + email (no bloquea a toda la red del parque por un usuario).
const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: env.LOGIN_LIMIT_MAX,
  keyGenerator: (req) => {
    const email =
      req.body && typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    return `${ipKeyGenerator(req.ip)}|${email}`;
  },
  message: { error: "Demasiados intentos. Por favor espera 15 minutos e intenta de nuevo." },
});

const registerLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: env.REGISTER_LIMIT_MAX,
  message: { error: "Demasiados intentos de registro. Intenta en 1 hora." },
});

module.exports = { generalLimiter, loginLimiter, registerLimiter };
