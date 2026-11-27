const { User } = require("../models");
const { verifySession } = require("../utils/tokens");
const { AuthenticationError, ForbiddenError } = require("../utils/errors");

// Solo lo necesario para autorizar: nada de cargar el grafo completo.
const AUTH_ATTRIBUTES = ["id", "name", "role", "tokenVersion", "familyTreeId"];

function bearer(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
}

async function resolveUser(token) {
  let payload;
  try {
    payload = verifySession(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AuthenticationError("Sesión expirada. Inicia sesión de nuevo.");
    }
    throw new AuthenticationError("Token inválido");
  }
  const user = await User.findByPk(payload.id, { attributes: AUTH_ATTRIBUTES });
  if (!user) throw new AuthenticationError("Token inválido");
  // tokenVersion cambia al cambiar la contraseña → tokens anteriores dejan de valer.
  if ((payload.tv || 0) !== (user.tokenVersion || 0)) {
    throw new AuthenticationError("Sesión expirada. Inicia sesión de nuevo.");
  }
  return user;
}

/** Exige token válido. Deja el usuario (ligero) en req.user. */
const authenticate = async (req, res, next) => {
  try {
    const token = bearer(req);
    if (!token) throw new AuthenticationError("Authorization header missing");
    req.user = await resolveUser(token);
    next();
  } catch (err) {
    next(err);
  }
};

/** Si hay token válido llena req.user; si no, sigue como anónimo. */
const optionalAuth = async (req, res, next) => {
  const token = bearer(req);
  if (!token) return next();
  try {
    req.user = await resolveUser(token);
  } catch (_) {
    req.user = undefined;
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user) return next(new AuthenticationError());
  if (req.user.role !== "admin") return next(new ForbiddenError("Solo administradores"));
  next();
};

/** 403 si :param no es el usuario del token (los admin pasan si allowAdmin). */
const requireSelf =
  (param = "id", { allowAdmin = false } = {}) =>
  (req, res, next) => {
    if (!req.user) return next(new AuthenticationError());
    if (req.params[param] === req.user.id) return next();
    if (allowAdmin && req.user.role === "admin") return next();
    next(new ForbiddenError("No puedes acceder a datos de otro usuario"));
  };

// ── Auth global con lista explícita de rutas públicas ────────────────────
const PUBLIC_CATALOG = [
  "/houses",
  "/activities",
  "/xecretos",
  "/xelfies",
  "/xperiencias",
  "/events",
  "/achievements",
];

function isPublic(req) {
  const path = req.path.replace(/\/+$/, "") || "/";
  if (req.method === "OPTIONS") return true;
  if (req.method === "POST" && (path === "/login" || path === "/users")) return true;
  if (req.method === "GET" || req.method === "HEAD") {
    if (path === "/health" || path === "/leaderboard") return true;
    if (PUBLIC_CATALOG.some((p) => path === p || path.startsWith(`${p}/`))) return true;
    if (req.app.get("docsEnabled") && (path === "/docs" || path.startsWith("/docs/"))) {
      return true;
    }
  }
  return false;
}

const globalAuth = (req, res, next) => {
  if (isPublic(req)) {
    // En rutas públicas igual leemos el token si viene (p. ej. esYo del leaderboard).
    return optionalAuth(req, res, next);
  }
  return authenticate(req, res, next);
};

module.exports = {
  authenticate,
  optionalAuth,
  requireAdmin,
  requireSelf,
  globalAuth,
  isPublic,
};
