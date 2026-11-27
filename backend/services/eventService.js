const { Op } = require("sequelize");
const { Event, Activity } = require("../models");
const make = require("./activitySubtypeService");

const service = make({
  Model: Event,
  type: "Event",
  label: "Event",
  subFields: ["startDate", "endDate"],
});

/** Eventos vigentes ahora (fechas guardadas como instantes UTC). */
service.listActive = (now = new Date()) =>
  Event.findAll({
    where: { startDate: { [Op.lte]: now }, endDate: { [Op.gte]: now } },
    include: [{ model: Activity, where: { isActive: true } }],
    order: [["startDate", "ASC"]],
  });

module.exports = service;
