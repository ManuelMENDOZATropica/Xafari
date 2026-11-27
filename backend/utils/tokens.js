const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const INVITE_TYPE = "family-invite";
const INVITE_TTL_SECONDS = 24 * 60 * 60;

function jwtSecret() {
  if (!env.JWT_SECRET) throw new Error("JWT_SECRET no definido");
  return env.JWT_SECRET;
}

// ── Sesión ────────────────────────────────────────────────────────────────
exports.signSession = (user) =>
  jwt.sign(
    { id: user.id, role: user.role || "user", tv: user.tokenVersion || 0 },
    jwtSecret(),
    { expiresIn: env.JWT_EXPIRES_IN, algorithm: "HS256" }
  );

exports.verifySession = (token) => {
  const payload = jwt.verify(token, jwtSecret(), { algorithms: ["HS256"] });
  if (!payload || typeof payload.id !== "string" || payload.typ) {
    throw new jwt.JsonWebTokenError("invalid session token");
  }
  return payload;
};

// ── Invitación a familia ──────────────────────────────────────────────────
exports.signFamilyInvite = (familyTreeId) => {
  const expiresAt = new Date(Date.now() + INVITE_TTL_SECONDS * 1000);
  const inviteToken = jwt.sign({ typ: INVITE_TYPE, fid: familyTreeId }, jwtSecret(), {
    expiresIn: INVITE_TTL_SECONDS,
    algorithm: "HS256",
  });
  return { inviteToken, expiresAt: expiresAt.toISOString() };
};

exports.verifyFamilyInvite = (token) => {
  const payload = jwt.verify(token, jwtSecret(), { algorithms: ["HS256"] });
  if (!payload || payload.typ !== INVITE_TYPE || typeof payload.fid !== "string") {
    throw new jwt.JsonWebTokenError("invalid invite token");
  }
  return payload.fid;
};

// ── Códigos de QR de actividades ─────────────────────────────────────────
// code = base64url(HMAC_SHA256(QR_SECRET, activityId)).slice(0, 16)
exports.activityCode = (activityId) => {
  if (!env.QR_SECRET) throw new Error("QR_SECRET no definido");
  return crypto
    .createHmac("sha256", env.QR_SECRET)
    .update(String(activityId))
    .digest("base64url")
    .slice(0, 16);
};

exports.isValidActivityCode = (activityId, code) => {
  if (typeof code !== "string" || code.length !== 16) return false;
  const expected = Buffer.from(exports.activityCode(activityId));
  const given = Buffer.from(code);
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
};

exports.activityQrUrl = (activityId) =>
  `${env.PUBLIC_APP_URL}/q/${activityId}?k=${exports.activityCode(activityId)}`;
