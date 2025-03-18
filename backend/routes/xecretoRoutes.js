const express = require("express");
const router = express.Router();

const xecretoController = require("../controllers/xecretoController");

router.get("/xecreto/:id", xecretoController.getXecreto);
router.get("/xecretos", xecretoController.getAllXecretos);

router.delete("/xecreto/:id", xecretoController.deleteXecreto);

router.post("/xecreto", xecretoController.addXecreto);

module.exports = router;
