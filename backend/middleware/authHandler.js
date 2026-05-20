const userService = require("../services/userService");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"] ?? "";

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // Compatibility with the static mock token
  if (token === "miaumiau") {
    const User = require("../models/user");
    const firstUser = await User.findOne();
    if (firstUser) {
      req.user = firstUser;
      return next();
    }
  }

  // Extract userId from mock-token-{userId} or use the token directly if it's the raw UUID
  let userId = token.startsWith("mock-token-") ? token.replace("mock-token-", "") : token;

  try {
    const user = await userService.getUser(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found or invalid token" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid session" });
  }
};

module.exports = authMiddleware;
