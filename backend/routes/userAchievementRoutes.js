// GET /user-achievements → logros del usuario del token.
// Otorgar/editar/quitar logros es solo admin: /user-achievements/:userId[/:achievementId].
const express = require("express");
const service = require("../services/userAchievementService");
const { toUserAchievementDTO } = require("../dto/achievement.dto");
const v = require("../validation/userAchievement.validation");
const { requireAdmin } = require("../middleware/authHandler");
const { validateRequest, asyncHandler } = require("../middleware/validateRequest");

const router = express.Router();
const send = (res, status, row) => res.status(status).json({ userAchievement: toUserAchievementDTO(row) });

router.get("/", asyncHandler(async (req, res) => {
  res.status(200).json((await service.listForUser(req.user.id)).map(toUserAchievementDTO));
}));
router.post("/:userId", requireAdmin, v.grantValidation, validateRequest, asyncHandler(async (req, res) => {
  send(res, 201, await service.grant(req.params.userId, req.body.achievementId, req.body.amount || 1));
}));
router.put("/:userId/:achievementId", requireAdmin, v.updateValidation, validateRequest, asyncHandler(async (req, res) => {
  send(res, 200, await service.update(req.params.userId, req.params.achievementId, req.body.amount));
}));
router.delete("/:userId/:achievementId", requireAdmin, v.paramsValidation, validateRequest, asyncHandler(async (req, res) => {
  send(res, 200, await service.remove(req.params.userId, req.params.achievementId));
}));

module.exports = router;
