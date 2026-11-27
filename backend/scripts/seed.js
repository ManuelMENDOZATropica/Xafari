/**
 * seed.js — Catálogo base (casas y actividades). Atómico e idempotente:
 * corre en una transacción y hace upsert por nombre, así que se puede correr
 * en cada arranque y completa lo que falte (p. ej. filas de `events` o la
 * respuesta de cada Xperiencia) sin duplicar ni tocar el progreso de usuarios.
 *
 * Uso: `npm run seed` (también lo llama server.js al arrancar).
 */
const database = require("../config/database");
const logger = require("../utils/logger");
const { House, Activity, Xperiencia, Xecreto, Xelfie, Event } = require("../models");

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
  { name: "kayak",          element: "viento",  location: "Caletas", answer: "a" },
  { name: "vinil",          element: "cielo",   location: "Salón Flamingo", answer: "b" },
  { name: "caracola",       element: "agua",    location: "Muluk Family Spa", answer: "c" },
  { name: "tv",             element: "vida",    location: "Bar Las Maquinitas", answer: "b" },
  { name: "teatro",         element: "espiral", location: "Teatro del Río", answer: "a" },
  { name: "salvavidas",     element: "tierra",  location: "Alberca infinita", answer: "c" },
  { name: "conejo",         element: "luna",    location: "Lunateca", answer: "a" },
  { name: "camion",         element: "eclipse", location: "Xiquit Inn", answer: "b" },
  { name: "estrella",       element: "sol",     location: "Infinity Room", answer: "a" },
  { name: "mascarajaguar",  element: "sol",     location: "Paxanguería", answer: "b" },
  { name: "piscina",        element: "fuego",   location: "Rooftop Fuego", answer: "b" },
  { name: "patin",          element: "tierra",  location: "Patín", answer: "a" },
  { name: "tobogan",        element: "vida",    location: "Kamikaze", answer: "a" },
  { name: "xpiral",         element: "espiral", location: "Xpiral", answer: "a" },
  { name: "poolpo",         element: "viento",  location: "Pool'po", answer: "a" },
  { name: "drink",          element: "cielo",   location: "Xupes y Pava Jarla", answer: "a" },
  { name: "xorbeteria",     element: "cielo",   location: "La Xorbeteria", answer: "a" },
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


// Ventana de los eventos del checklist gastronómico: siempre vigentes.
const EVENT_START = new Date("2025-01-01T05:00:00.000Z");
const EVENT_END = new Date("2099-12-31T05:00:00.000Z");

async function upsertActivity(spec, houseId, transaction) {
  const [activity, created] = await Activity.findOrCreate({
    where: { name: spec.name },
    defaults: {
      name: spec.name,
      description: spec.description,
      location: spec.location,
      type: spec.type,
      isActive: true,
      houseId,
    },
    transaction,
  });
  if (!created && !activity.houseId && houseId) {
    await activity.update({ houseId }, { transaction });
  }
  return activity;
}

async function ensureChild(Model, activityId, defaults, transaction, fix) {
  const [row, created] = await Model.findOrCreate({
    where: { activityId },
    defaults: { activityId, ...defaults },
    transaction,
  });
  if (!created && fix) await fix(row);
  return created;
}

async function seed() {
  const stats = { houses: 0, activities: 0, children: 0 };

  await database.transaction(async (transaction) => {
    for (const h of HOUSES) {
      const [, created] = await House.findOrCreate({ where: { name: h.name }, defaults: h, transaction });
      if (created) stats.houses++;
    }
    const houses = await House.findAll({ attributes: ["id", "element"], transaction });
    const houseMap = Object.fromEntries(houses.map((h) => [h.element.toLowerCase(), h.id]));
    const defaultHouse = houseMap.viento || (houses[0] && houses[0].id) || null;
    const houseFor = (el) => (el && houseMap[el]) || defaultHouse;

    const count = async (fn) => { if (await fn()) stats.children++; };

    for (const x of XPERIENCIAS) {
      const a = await upsertActivity({ name: x.name, description: `Xperiencia amuleto ${x.name}`, location: x.location, type: "Xperiencia" }, houseFor(x.element), transaction);
      await count(() => ensureChild(Xperiencia, a.id, { isValidable: true, correctAnswer: x.answer }, transaction, async (row) => {
        if (!row.correctAnswer) await row.update({ correctAnswer: x.answer }, { transaction });
      }));
    }
    for (const x of XECRETOS) {
      const a = await upsertActivity({ name: x.name, description: `Xecreto Placa Secreta ${x.name}`, location: x.location, type: "Xecreto" }, houseFor(x.element), transaction);
      await count(() => ensureChild(Xecreto, a.id, {}, transaction));
    }
    for (const g of GASTRO) {
      const a = await upsertActivity({ name: g.name, description: `Checklist Gastro ${g.name}`, location: g.location, type: "Event" }, houseFor(g.element), transaction);
      await count(() => ensureChild(Event, a.id, { startDate: EVENT_START, endDate: EVENT_END }, transaction));
    }
    for (const x of XELFIE_SPOTS) {
      const a = await upsertActivity({ name: x.name, description: x.name, location: x.location, type: "Xelfie" }, defaultHouse, transaction);
      await count(() => ensureChild(Xelfie, a.id, {}, transaction));
    }
    stats.activities = await Activity.count({ transaction });
  });

  logger.info(`Seed: ${stats.houses} casas nuevas, ${stats.children} filas de tipo nuevas, ${stats.activities} actividades en total.`);
  return stats;
}

module.exports = { seed, XPERIENCIAS, XECRETOS, GASTRO, XELFIE_SPOTS };

if (require.main === module) {
  // En SQLite crea las tablas si faltan; en Postgres corre antes `npm run migrate`.
  (database.getDialect() === "sqlite" ? database.sync() : Promise.resolve())
    .then(() => seed())
    .then(() => database.close())
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
}
