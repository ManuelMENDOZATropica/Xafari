const express = require("express");
const router = express.Router();

const xelfieController = require("../controllers/xelfieController");

router.get("/xelfie/:id", xelfieController.getXelfie);
router.get("/xelfies", xelfieController.getAllXelfies);

router.delete("/xelfie/:id", xelfieController.deleteXelfie);

router.post("/xelfie", xelfieController.addXelfie);

module.exports = router;
