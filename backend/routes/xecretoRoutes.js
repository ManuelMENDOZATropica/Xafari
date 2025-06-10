const express = require("express");
const router = express.Router();

const xecretoController = require("../controllers/xecretoController");

const { validateRequest } = require("../middleware/validateRequest");
const {
  xecretoIdParam,
  createXecretoValidation,
  updateXecretoValidation,
} = require("../validation/xecreto.validation");

router.get("/", xecretoController.getAllXecretos);
router.get(
  "/:id",
  xecretoIdParam,
  validateRequest,
  xecretoController.getXecreto
);
router.post(
  "/",
  xecretoIdParam,
  createXecretoValidation,
  validateRequest,
  xecretoController.createXecreto
);
router.put(
  "/:id",
  xecretoIdParam,
  updateXecretoValidation,
  validateRequest,
  xecretoController.updateXecreto
);
router.delete(
  "/:id",
  xecretoIdParam,
  validateRequest,
  xecretoController.deleteXecreto
);

module.exports = router;
