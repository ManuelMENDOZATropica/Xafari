const catalogRouter = require("./catalogRouter");
const makeController = require("../controllers/catalogController");
const service = require("../services/xelfieService");
const { toXelfieDTO } = require("../dto/xelfie.dto");
const a = require("../validation/activity.validation");

const controller = makeController({ service, toDTO: toXelfieDTO, key: "xelfie", label: "Xelfie", fields: ["name", "description", "location", "isActive", "minAge", "maxAge", "houseId"] });

module.exports = catalogRouter(controller, {
  createValidation: a.createActivityValidation,
  updateValidation: a.updateActivityValidation,
});
