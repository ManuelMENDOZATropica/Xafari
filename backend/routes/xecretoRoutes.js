const catalogRouter = require("./catalogRouter");
const makeController = require("../controllers/catalogController");
const service = require("../services/xecretoService");
const { toXecretoDTO } = require("../dto/xecreto.dto");
const a = require("../validation/activity.validation");
const v = require("../validation/xecreto.validation");
const { uuidParam } = require("../validation/common.validation");
const { validateRequest, asyncHandler } = require("../middleware/validateRequest");

const controller = makeController({
  service,
  toDTO: toXecretoDTO,
  key: "xecreto",
  label: "Xecreto",
  fields: [...["name", "description", "location", "isActive", "minAge", "maxAge", "houseId"], "clues"],
});

const router = catalogRouter(controller, {
  createValidation: [...a.createActivityValidation, ...v.createXecretoValidation],
  updateValidation: [...a.updateActivityValidation, ...v.updateXecretoValidation],
});

// POST /xecretos/:id/check {clueId, answer} → {correct} (requiere sesión)
router.post(
  "/:id/check",
  uuidParam("id"),
  v.checkAnswerValidation,
  validateRequest,
  asyncHandler(async (req, res) => {
    const correct = await service.checkAnswer(req.params.id, req.body.clueId, req.body.answer);
    res.status(200).json({ correct });
  })
);

module.exports = router;
