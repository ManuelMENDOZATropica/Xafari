const express = require("express");
const router = express.Router();
const { getLeaderboard } = require("../controllers/leaderboardController");

// GET /api/leaderboard?periodo=hoy|mes|siempre
router.get("/", getLeaderboard);

module.exports = router;
