const catalogRouter = require("./catalogRouter");
const makeController = require("../controllers/catalogController");
const service = require("../services/houseService");
const { toHouseDTO } = require("../dto/house.dto");
const v = require("../validation/house.validation");

const controller = makeController({ service, toDTO: toHouseDTO, key: "house", label: "House", fields: ["name", "animal", "element"] });

module.exports = catalogRouter(controller, {
  createValidation: v.createHouseValidation,
  updateValidation: v.updateHouseValidation,
});
