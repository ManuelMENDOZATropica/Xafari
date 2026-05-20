"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Get seeded houses to map their IDs
    const houses = await queryInterface.sequelize.query(
      "SELECT id, element FROM houses;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const houseMap = {};
    houses.forEach((h) => {
      houseMap[h.element.toLowerCase()] = h.id;
    });

    // Fallback house ID in case some element mapping isn't found
    const defaultHouseId = houses[0] ? houses[0].id : null;

    // 2. Define Xperiencias activities
    const xperienciasList = [
      { name: "kayak", element: "viento", location: "Caletas" },
      { name: "vinil", element: "cielo", location: "Salón Flamingo" },
      { name: "caracola", element: "agua", location: "Muluk Family Spa" },
      { name: "tv", element: "vida", location: "Bar Las Maquinitas" },
      { name: "teatro", element: "espiral", location: "Teatro del Río" },
      { name: "salvavidas", element: "tierra", location: "Alberca infinita" },
      { name: "conejo", element: "luna", location: "Lunateca" },
      { name: "camion", element: "eclipse", location: "Xiquit Inn" },
      { name: "estrella", element: "sol", location: "Infinity Room" },
      { name: "mascarajaguar", element: "sol", location: "Paxanguería" },
      { name: "piscina", element: "fuego", location: "Rooftop Fuego" },
      { name: "patin", element: "tierra", location: "Patín" },
      { name: "tobogan", element: "vida", location: "Kamikaze" },
      { name: "xpiral", element: "espiral", location: "Xpiral" },
      { name: "poolpo", element: "viento", location: "Pool'po" },
      { name: "drink", element: "cielo", location: "Xupes y Pava Jarla" },
      { name: "xorbeteria", element: "cielo", location: "La Xorbeteria" },
    ];

    // 3. Define Xecretos activities
    const xecretosList = [
      { name: "xecreto1", element: "vida", location: "Plaque 1" },
      { name: "xecreto2", element: "agua", location: "Plaque 2" },
      { name: "xecreto3", element: "sol", location: "Plaque 3" },
      { name: "xecreto4", element: "fuego", location: "Plaque 4" },
      { name: "xecreto5", element: "espiral", location: "Plaque 5" },
      { name: "xecreto6", element: "tierra", location: "Plaque 6" },
      { name: "xecreto7", element: "eclipse", location: "Plaque 7" },
      { name: "xecreto8", element: "viento", location: "Plaque 8" },
      { name: "xecreto9", element: "cielo", location: "Plaque 9" },
      { name: "xecreto10", element: "luna", location: "Plaque 10" },
    ];

    // 4. Define Gastro Checklist activities (Type: Event)
    const gastroList = [
      { name: "quesadillas", element: "tierra", location: "Gastro" },
      { name: "ceviche", element: "agua", location: "Gastro" },
      { name: "acai", element: "vida", location: "Gastro" },
      { name: "ravioli", element: "espiral", location: "Gastro" },
      { name: "espada", element: "fuego", location: "Gastro" },
      { name: "mezcal", element: "viento", location: "Gastro" },
      { name: "paleta", element: "luna", location: "Gastro" },
      { name: "tostada", element: "tierra", location: "Gastro" },
      { name: "ramen", element: "agua", location: "Gastro" },
      { name: "quesos", element: "vida", location: "Gastro" },
      { name: "torta", element: "espiral", location: "Gastro" },
      { name: "palomitas", element: "fuego", location: "Gastro" },
      { name: "nogada", element: "viento", location: "Gastro" },
      { name: "panucho", element: "tierra", location: "Gastro" },
      { name: "corunda", element: "luna", location: "Gastro" },
      { name: "coctel", element: "cielo", location: "Gastro" },
      { name: "carne", element: "fuego", location: "Gastro" },
      { name: "ostion", element: "agua", location: "Gastro" },
      { name: "mimosa", element: "cielo", location: "Gastro" },
      { name: "sushi", element: "agua", location: "Gastro" },
    ];

    const activitiesToInsert = [];
    const xperienciasToInsert = [];
    const xecretosToInsert = [];

    // Map Xperiencias
    xperienciasList.forEach((item) => {
      const actId = uuidv4();
      activitiesToInsert.push({
        id: actId,
        name: item.name,
        description: `Xperiencia amuleto ${item.name}`,
        location: item.location,
        type: "Xperiencia",
        isActive: true,
        houseId: houseMap[item.element] || defaultHouseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      xperienciasToInsert.push({
        id: uuidv4(),
        qrCode: `qr-${item.name}`,
        isValidable: true,
        activityId: actId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Map Xecretos
    xecretosList.forEach((item) => {
      const actId = uuidv4();
      activitiesToInsert.push({
        id: actId,
        name: item.name,
        description: `Xecreto Placa Secreta ${item.name}`,
        location: item.location,
        type: "Xecreto",
        isActive: true,
        houseId: houseMap[item.element] || defaultHouseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      xecretosToInsert.push({
        id: uuidv4(),
        activityId: actId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Map Gastro Checklist
    gastroList.forEach((item) => {
      const actId = uuidv4();
      activitiesToInsert.push({
        id: actId,
        name: item.name,
        description: `Checklist Gastro ${item.name}`,
        location: item.location,
        type: "Event",
        isActive: true,
        houseId: houseMap[item.element] || defaultHouseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Insert all
    await queryInterface.bulkInsert("activities", activitiesToInsert);
    await queryInterface.bulkInsert("xperiencia", xperienciasToInsert);
    await queryInterface.bulkInsert("xecretos", xecretosToInsert);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("xecretos", null, {});
    await queryInterface.bulkDelete("xperiencia", null, {});
    await queryInterface.bulkDelete("activities", {
      type: ["Xperiencia", "Xecreto", "Event"],
    }, {});
  },
};
