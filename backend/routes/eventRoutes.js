const catalogRouter = require("./catalogRouter");
const makeController = require("../controllers/catalogController");
const service = require("../services/eventService");
const { toEventDTO } = require("../dto/event.dto");
const a = require("../validation/activity.validation");
const v = require("../validation/event.validation");

const controller = makeController({
  service,
  toDTO: toEventDTO,
  key: "event",
  label: "Event",
  fields: [...["name", "description", "location", "isActive", "minAge", "maxAge", "houseId"], "startDate", "endDate"],
});

// GET /events?activos=true → solo los vigentes ahora
const list = controller.list;
controller.list = async (req, res) => {
  if (req.query.activos === "true" || req.query.active === "true") {
    const rows = await service.listActive();
    return res.status(200).json(rows.map(toEventDTO));
  }
  return list(req, res);
};

module.exports = catalogRouter(controller, {
  createValidation: [...a.createActivityValidation, ...v.createEventValidation],
  updateValidation: [...a.updateActivityValidation, ...v.updateEventValidation],
});
