const express = require("express");
const router = express.Router();
const { Activity } = require("../models");

router.get("/", async (req, res, next) => {
  try {
    const activities = await Activity.findAll();
    res.status(200).json(activities);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
