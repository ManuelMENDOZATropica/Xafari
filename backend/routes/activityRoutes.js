const express = require("express");
const { Activity } = require("../models");
const { toActivityDTO } = require("../dto/activity.dto");
const { uuidParam } = require("../validation/common.validation");
const { validateRequest, asyncHandler } = require("../middleware/validateRequest");
const { ResourceNotFoundError } = require("../utils/errors");

const router = express.Router();

// Solo lectura: las actividades se crean desde su tipo (/xelfies, /xperiencias, /xecretos, /events).
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const rows = await Activity.findAll({ order: [["createdAt", "ASC"]] });
    res.status(200).json(rows.map(toActivityDTO));
  })
);

router.get(
  "/:id",
  uuidParam("id"),
  validateRequest,
  asyncHandler(async (req, res) => {
    const row = await Activity.findByPk(req.params.id);
    if (!row) throw new ResourceNotFoundError("Activity not found");
    const dto = toActivityDTO(row);
    res.status(200).json({ activity: dto, ...dto });
  })
);

module.exports = router;
