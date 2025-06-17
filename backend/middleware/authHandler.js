const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"] ?? "";

  if (authHeader != "miaumiau") return res.sendStatus(401);

  next();
};

module.exports = authMiddleware;
