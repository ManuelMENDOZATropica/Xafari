const express = require("express");
const router = express.Router();

const casaController = require("../controllers/casaController");

router.get("/casa/:id", casaController.getCasa);
router.get("/casas", casaController.getAllCasas);
router.get("/casa/:id/xecretos", casaController.getAllXecretos);
router.get("/casa/:id/xelfies", casaController.getAllXelfies);
router.get("/casa/:id/xperiencias", casaController.getAllXperiencias);

router.delete("/casa/:id", casaController.deleteCasa);

router.post("/casa", casaController.addCasa);
router.post("/casa/:id/xecretos", casaController.addXecreto);
router.post("/casa/:id/xelfies", casaController.addXelfie);
router.post("/casa/:id/xperiencias", casaController.addXperiencia);

module.exports = router;
