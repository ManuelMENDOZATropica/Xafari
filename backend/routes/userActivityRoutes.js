// Progreso del usuario del token. El userId del body se ignora.
const express = require("express");
const service = require("../services/userActivityService");
const { toUserActivityDTO } = require("../dto/activity.dto");
const { completeActivityValidation } = require("../validation/userActivity.validation");
const { uuidParam } = require("../validation/common.validation");
const { validateRequest, asyncHandler } = require("../middleware/validateRequest");
const { ResourceNotFoundError } = require("../utils/errors");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const rows = await service.listForUser(req.user.id);
    res.status(200).json(rows.map(toUserActivityDTO));
  })
);

router.get(
  "/:activityId",
  uuidParam("activityId"),
  validateRequest,
  asyncHandler(async (req, res) => {
    const ua = await service.getForUser(req.user.id, req.params.activityId);
    if (!ua) throw new ResourceNotFoundError("UserActivity not found");
    res.status(200).json({ userActivity: toUserActivityDTO(ua) });
  })
);

router.post(
  "/",
  completeActivityValidation,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { userActivity, created } = await service.complete(req.user.id, {
      activityId: req.body.activityId,
      code: req.body.code,
      answer: req.body.answer,
    });
    res.status(created ? 201 : 200).json({ userActivity: toUserActivityDTO(userActivity) });
  })
);

module.exports = router;
