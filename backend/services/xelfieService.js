const { Xelfie } = require("../models");
const make = require("./activitySubtypeService");

module.exports = make({ Model: Xelfie, type: "Xelfie", label: "Xelfie" });
