"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const activities = [
      {
        name: "Xelfie cascada Caletas",
        location: "cascada Caletas",
      },
      {
        name: "Puente 1",
        location: "Puente 1",
      },
      {
        name: "Puente 2",
        location: "Puente 2",
      },
      {
        name: "Puente 3",
        location: "Puente 3",
      },
      {
        name: "Islote cascada",
        location: "Islote cascada",
      },
      {
        name: "Diamante Xerro",
        location: "Diamante Xerro",
      },
      {
        name: "Super zoom",
        location: "Super zoom",
      },
      {
        name: "Alberca diamante 2",
        location: "Alberca diamante 2",
      },
    ].map((a) => ({
      ...a,
      id: uuidv4(),
      type: "Xelfie",
    }));

    await queryInterface.bulkInsert("activities", activities);

    await queryInterface.bulkInsert(
      "xelfies",
      activities.map((a) => ({
        id: uuidv4(),
        activityId: a.id,
      }))
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("xelfies", null, {});
  },
};
