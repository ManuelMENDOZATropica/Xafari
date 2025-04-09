"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("houses", [
      {
        id: uuidv4(),
        name: "Casa Viento",
        animal: "Mariposa",
        element: "Viento",
      },
      {
        id: uuidv4(),
        name: "Casa Tierra",
        animal: "Venado",
        element: "Tierra",
      },
      {
        id: uuidv4(),
        name: "Casa Espiral",
        animal: "Serpiente",
        element: "Espiral",
      },
      {
        id: uuidv4(),
        name: "Casa Agua",
        animal: "Rana",
        element: "Agua",
      },
      {
        id: uuidv4(),
        name: "Casa Fuego",
        animal: "Guacamaya Roja",
        element: "Fuego",
      },
      {
        id: uuidv4(),
        name: "Casa Cielo",
        animal: "Flamenco",
        element: "Cielo",
      },
      {
        id: uuidv4(),
        name: "Casa Eclipse",
        animal: "Búho",
        element: "Eclipse",
      },
      {
        id: uuidv4(),
        name: "Casa Luna",
        animal: "Coatí",
        element: "Luna",
      },
      {
        id: uuidv4(),
        name: "Casa Sol",
        animal: "Jaguar",
        element: "Sol",
      },
      {
        id: uuidv4(),
        name: "Casa Vida",
        animal: "Mono Araña",
        element: "Vida",
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("houses", null, {});
  },
};
