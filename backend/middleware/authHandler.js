const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

const JWT_SECRET = process.env.JWT_SECRET || "xafari-dev-secret-change-in-prod";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"] ?? "";

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    // Verificar y decodificar el JWT
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await userService.getUser(payload.id);

    if (!user) {
      return res.status(401).json({ error: "User not found or invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Sesión expirada. Inicia sesión de nuevo." });
    }
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = authMiddleware;
