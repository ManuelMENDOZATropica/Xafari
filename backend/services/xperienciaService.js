const { Xperiencia } = require("../models");
const make = require("./activitySubtypeService");

module.exports = make({
  Model: Xperiencia,
  type: "Xperiencia",
  label: "Xperiencia",
  subFields: ["isValidable", "correctAnswer"],
});
