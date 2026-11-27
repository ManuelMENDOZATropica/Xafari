const catalogRouter = require("./catalogRouter");
const makeController = require("../controllers/catalogController");
const service = require("../services/xperienciaService");
const { toXperienciaDTO } = require("../dto/xperiencia.dto");
const a = require("../validation/activity.validation");
const v = require("../validation/xperiencia.validation");

const controller = makeController({
  service,
  toDTO: toXperienciaDTO,
  key: "xperiencia",
  label: "Xperiencia",
  fields: [...["name", "description", "location", "isActive", "minAge", "maxAge", "houseId"], "isValidable", "correctAnswer"],
});

module.exports = catalogRouter(controller, {
  createValidation: [...a.createActivityValidation, ...v.createXperienciaValidation],
  updateValidation: [...a.updateActivityValidation, ...v.updateXperienciaValidation],
});
