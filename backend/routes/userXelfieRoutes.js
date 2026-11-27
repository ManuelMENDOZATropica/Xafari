const express = require("express");
const service = require("../services/userXelfieService");
const { toUserXelfieDTO } = require("../dto/xelfie.dto");
const v = require("../validation/userXelfie.validation");
const { uuidParam } = require("../validation/common.validation");
const { validateRequest, asyncHandler } = require("../middleware/validateRequest");

const router = express.Router();
const send = (res, status, row) => res.status(status).json({ userXelfie: toUserXelfieDTO(row) });

router.get("/", asyncHandler(async (req, res) => {
  res.status(200).json((await service.listForUser(req.user.id)).map(toUserXelfieDTO));
}));
router.post("/", v.createUserXelfieValidation, validateRequest, asyncHandler(async (req, res) => {
  send(res, 201, await service.add(req.user.id, req.body.xelfieId, req.body.xelfieUrl));
}));
router.put("/:xelfieId", uuidParam("xelfieId"), v.updateUserXelfieValidation, validateRequest, asyncHandler(async (req, res) => {
  send(res, 200, await service.update(req.user.id, req.params.xelfieId, req.body.xelfieUrl));
}));
router.delete("/:xelfieId", uuidParam("xelfieId"), validateRequest, asyncHandler(async (req, res) => {
  send(res, 200, await service.remove(req.user.id, req.params.xelfieId));
}));

module.exports = router;
