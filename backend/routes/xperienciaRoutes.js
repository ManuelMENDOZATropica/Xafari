const express = require("express");
const {
  xperienciaIdParam,
  createXperienciaValidation,
  updateXperienciaValidation,
} = require("../validation/xperiencia.validation");
const {
  createActivityValidation,
  updateActivityValidation,
} = require("../validation/activity.validation");
const { validateRequest } = require("../middleware/validateRequest");
const router = express.Router();

const xperienciaController = require("../controllers/xperienciaController");

router.get("/", xperienciaController.getAllXperiencias);

router.get(
  "/:id",
  xperienciaIdParam,
  validateRequest,
  xperienciaController.getXperiencia
);

router.post(
  "/",
  createXperienciaValidation,
  createActivityValidation,
  validateRequest,
  xperienciaController.createXperiencia
);

router.put(
  "/:id",
  xperienciaIdParam,
  updateActivityValidation,
  updateXperienciaValidation,
  validateRequest,
  xperienciaController.updateXperiencia
);

router.delete(
  "/:id",
  xperienciaIdParam,
  validateRequest,
  xperienciaController.deleteXperiencia
);

module.exports = router;
