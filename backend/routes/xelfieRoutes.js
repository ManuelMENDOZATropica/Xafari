const express = require("express");
const router = express.Router();

const xelfieController = require("../controllers/xelfieController");
const { xelfieIdParam } = require("../validation/xelfie.validation");
const { validateRequest } = require("../middleware/validateRequest");
const {
  createActivityValidation,
  updateActivityValidation,
} = require("../validation/activity.validation");

router.get("/", xelfieController.getAllXelfies);
router.get("/:id", xelfieIdParam, xelfieController.getXelfie);
router.post(
  "/",
  createActivityValidation,
  validateRequest,
  xelfieController.createXelfie
);
router.put(
  "/:id",
  xelfieIdParam,
  updateActivityValidation,
  validateRequest,
  xelfieController.updateXelfie
);
router.delete(
  "/:id",
  xelfieIdParam,
  validateRequest,
  xelfieController.deleteXelfie
);

module.exports = router;
