const express = require("express");
const { getLeaderboard } = require("../controllers/leaderboardController");
const { asyncHandler } = require("../middleware/validateRequest");

const router = express.Router();

// Público. Si viene token válido, marca la fila propia con esYo.
router.get("/", asyncHandler(getLeaderboard));

module.exports = router;
