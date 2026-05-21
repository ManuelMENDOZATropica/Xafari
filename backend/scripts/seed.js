/**
 * seed.js — Script de seed idempotente.
 * Solo inserta datos si las tablas están vacías.
 * Seguro para correr en cada deploy.
 */

require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const database = require("../config/database");
const logger = require("../utils/logger");

// ── Datos de casas ─────────────────────────────────────────────────────────
const HOUSES = [
  { name: "Casa Viento",   animal: "Mariposa",      element: "Viento"  },
  { name: "Casa Tierra",   animal: "Venado",         element: "Tierra"  },
  { name: "Casa Espiral",  animal: "Serpiente",      element: "Espiral" },
  { name: "Casa Agua",     animal: "Rana",           element: "Agua"    },
  { name: "Casa Fuego",    animal: "Guacamaya Roja", element: "Fuego"   },
  { name: "Casa Cielo",    animal: "Flamenco",       element: "Cielo"   },
  { name: "Casa Eclipse",  animal: "Búho",           element: "Eclipse" },
  { name: "Casa Luna",     animal: "Coatí",          element: "Luna"    },
  { name: "Casa Sol",      animal: "Jaguar",         element: "Sol"     },
  { name: "Casa Vida",     animal: "Mono Araña",     element: "Vida"    },
];

// ── Actividades: Xperiencias ───────────────────────────────────────────────
const XPERIENCIAS = [
  { name: "kayak",          element: "viento",  location: "Caletas"            },
  { name: "vinil",          element: "cielo",   location: "Salón Flamingo"     },
  { name: "caracola",       element: "agua",    location: "Muluk Family Spa"   },
  { name: "tv",             element: "vida",    location: "Bar Las Maquinitas" },
  { name: "teatro",         element: "espiral", location: "Teatro del Río"     },
  { name: "salvavidas",     element: "tierra",  location: "Alberca infinita"   },
  { name: "conejo",         element: "luna",    location: "Lunateca"           },
  { name: "camion",         element: "eclipse", location: "Xiquit Inn"         },
  { name: "estrella",       element: "sol",     location: "Infinity Room"      },
  { name: "mascarajaguar",  element: "sol",     location: "Paxanguería"        },
  { name: "piscina",        element: "fuego",   location: "Rooftop Fuego"      },
  { name: "patin",          element: "tierra",  location: "Patín"              },
  { name: "tobogan",        element: "vida",    location: "Kamikaze"           },
  { name: "xpiral",         element: "espiral", location: "Xpiral"             },
  { name: "poolpo",         element: "viento",  location: "Pool'po"            },
  { name: "drink",          element: "cielo",   location: "Xupes y Pava Jarla" },
  { name: "xorbeteria",     element: "cielo",   location: "La Xorbeteria"      },
];

// ── Actividades: Xecretos ──────────────────────────────────────────────────
const XECRETOS = [
  { name: "xecreto1",  element: "vida",    location: "Plaque 1"  },
  { name: "xecreto2",  element: "agua",    location: "Plaque 2"  },
  { name: "xecreto3",  element: "sol",     location: "Plaque 3"  },
  { name: "xecreto4",  element: "fuego",   location: "Plaque 4"  },
  { name: "xecreto5",  element: "espiral", location: "Plaque 5"  },
  { name: "xecreto6",  element: "tierra",  location: "Plaque 6"  },
  { name: "xecreto7",  element: "eclipse", location: "Plaque 7"  },
  { name: "xecreto8",  element: "viento",  location: "Plaque 8"  },
  { name: "xecreto9",  element: "cielo",   location: "Plaque 9"  },
  { name: "xecreto10", element: "luna",    location: "Plaque 10" },
];

// ── Actividades: Gastro Checklist (Events) ─────────────────────────────────
const GASTRO = [
  "quesadillas", "ceviche",  "acai",      "ravioli", "espada",
  "mezcal",      "paleta",   "tostada",   "ramen",   "quesos",
  "torta",       "palomitas","nogada",    "panucho", "corunda",
  "coctel",      "carne",    "ostion",    "mimosa",  "sushi",
].map((name) => ({ name, element: "tierra", location: "Gastro" }));

// ── Xelfies ────────────────────────────────────────────────────────────────
const XELFIE_SPOTS = [
  { name: "Xelfie cascada Caletas", location: "cascada Caletas"  },
  { name: "Puente 1",               location: "Puente 1"         },
  { name: "Puente 2",               location: "Puente 2"         },
  { name: "Puente 3",               location: "Puente 3"         },
  { name: "Islote cascada",         location: "Islote cascada"   },
  { name: "Diamante Xerro",         location: "Diamante Xerro"   },
  { name: "Super zoom",             location: "Super zoom"       },
  { name: "Alberca diamante 2",     location: "Alberca diamante 2" },
];

async function seed() {
  const qi = database.getQueryInterface();
  const now = new Date();

  // ── 1. Casas ───────────────────────────────────────────────────────────
  const existingHouses = await database.query(
    "SELECT COUNT(*) as count FROM houses",
    { type: database.QueryTypes.SELECT }
  );
  const houseCount = Number(existingHouses[0]?.count ?? existingHouses[0]?.["COUNT(*)"] ?? 0);

  if (houseCount === 0) {
    logger.info("Seeding houses...");
    const houseRows = HOUSES.map((h) => ({
      id: uuidv4(), ...h, createdAt: now, updatedAt: now,
    }));
    await qi.bulkInsert("houses", houseRows);
    logger.info(`  ✅ ${houseRows.length} casas insertadas.`);
  } else {
    logger.info(`  ⏭  Houses ya tienen ${houseCount} registros — se omite.`);
  }

  // ── 2. Actividades ─────────────────────────────────────────────────────
  const existingActs = await database.query(
    "SELECT COUNT(*) as count FROM activities",
    { type: database.QueryTypes.SELECT }
  );
  const actCount = Number(existingActs[0]?.count ?? existingActs[0]?.["COUNT(*)"] ?? 0);

  if (actCount === 0) {
    logger.info("Seeding activities...");

    // Leer mapa de casas
    const houses = await database.query(
      "SELECT id, element FROM houses",
      { type: database.QueryTypes.SELECT }
    );
    const houseMap = {};
    houses.forEach((h) => { houseMap[h.element.toLowerCase()] = h.id; });
    const defaultId = houses[0]?.id ?? null;

    const activities = [];
    const xperiencias = [];
    const xecretos = [];
    const xelfieActivities = [];
    const xelfieRecords = [];

    XPERIENCIAS.forEach((item) => {
      const actId = uuidv4();
      activities.push({ id: actId, name: item.name, description: `Xperiencia amuleto ${item.name}`, location: item.location, type: "Xperiencia", isActive: true, houseId: houseMap[item.element] || defaultId, createdAt: now, updatedAt: now });
      xperiencias.push({ id: uuidv4(), qrCode: `qr-${item.name}`, isValidable: true, activityId: actId, createdAt: now, updatedAt: now });
    });

    XECRETOS.forEach((item) => {
      const actId = uuidv4();
      activities.push({ id: actId, name: item.name, description: `Xecreto Placa Secreta ${item.name}`, location: item.location, type: "Xecreto", isActive: true, houseId: houseMap[item.element] || defaultId, createdAt: now, updatedAt: now });
      xecretos.push({ id: uuidv4(), activityId: actId, createdAt: now, updatedAt: now });
    });

    GASTRO.forEach((item) => {
      const actId = uuidv4();
      activities.push({ id: actId, name: item.name, description: `Checklist Gastro ${item.name}`, location: item.location, type: "Event", isActive: true, houseId: houseMap[item.element] || defaultId, createdAt: now, updatedAt: now });
    });

    XELFIE_SPOTS.forEach((item) => {
      const actId = uuidv4();
      xelfieActivities.push({ id: actId, name: item.name, description: item.name, location: item.location, type: "Xelfie", isActive: true, houseId: defaultId, createdAt: now, updatedAt: now });
      xelfieRecords.push({ id: uuidv4(), activityId: actId, createdAt: now, updatedAt: now });
    });

    await qi.bulkInsert("activities", [...activities, ...xelfieActivities]);
    await qi.bulkInsert("xperiencia", xperiencias);
    await qi.bulkInsert("xecretos", xecretos);
    await qi.bulkInsert("xelfies", xelfieRecords);

    logger.info(`  ✅ ${activities.length + xelfieActivities.length} actividades insertadas.`);
  } else {
    logger.info(`  ⏭  Activities ya tienen ${actCount} registros — se omite.`);
  }
}

module.exports = { seed };
