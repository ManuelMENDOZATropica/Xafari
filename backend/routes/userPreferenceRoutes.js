const express = require("express");
const service = require("../services/userPreferenceService");
const { toUserPreferenceDTO } = require("../dto/preference.dto");
const v = require("../validation/userPreference.validation");
const { uuidParam } = require("../validation/common.validation");
const { validateRequest, asyncHandler, pick } = require("../middleware/validateRequest");

const router = express.Router();
const FIELDS = ["rating", "comment", "isFavorite"];

router.get("/", asyncHandler(async (req, res) => {
  res.status(200).json((await service.listForUser(req.user.id)).map(toUserPreferenceDTO));
}));
// POST = upsert por (usuario, actividad)
router.post("/", v.createUserPreferenceValidation, validateRequest, asyncHandler(async (req, res) => {
  const { pref, created } = await service.upsert(req.user.id, req.body.activityId, pick(req.body, FIELDS));
  res.status(created ? 201 : 200).json(toUserPreferenceDTO(pref));
}));
router.put("/:id", uuidParam("id"), v.updateUserPreferenceValidation, validateRequest, asyncHandler(async (req, res) => {
  res.status(200).json(toUserPreferenceDTO(await service.update(req.user.id, req.params.id, pick(req.body, FIELDS))));
}));
router.delete("/:id", uuidParam("id"), validateRequest, asyncHandler(async (req, res) => {
  res.status(200).json(toUserPreferenceDTO(await service.remove(req.user.id, req.params.id)));
}));

module.exports = router;
