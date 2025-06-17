const express = require("express");
const router = express.Router();

const houseController = require("../controllers/houseController");
const {
  houseIdParam,
  updateHouseValidation,
  createHouseValidation,
} = require("../validation/house.validation");
const { validateRequest } = require("../middleware/validateRequest");

router.get("/", houseController.getAllHouses);
router.get("/:id", houseIdParam, validateRequest, houseController.getHouse);
router.post(
  "/",
  createHouseValidation,
  validateRequest,
  houseController.createHouse
);
router.put(
  "/:id",
  houseIdParam,
  updateHouseValidation,
  validateRequest,
  houseController.updateHouse
);
router.delete(
  "/:id",
  houseIdParam,
  validateRequest,
  houseController.deleteHouse
);

module.exports = router;
