const express = require("express");
const router = express.Router();

const xperienciaController = require("../controllers/xperienciaController");

router.get("/xperiencia/:id", xperienciaController.getXperiencia)
router.get("/xperiencias", xperienciaController.getAllXperiencias)

router.delete("/xperiencia/:id", xperienciaController.deleteXperiencia)

router.post("/xperiencia", xperienciaController.addXperiencia)

module.exports = router;
