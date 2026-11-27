// Runner de migraciones (Umzug 3). Guarda el historial en "SequelizeMeta",
// compatible con sequelize-cli. Uso: `npm run migrate` o al arrancar en producción.
const path = require("path");
const { Umzug, SequelizeStorage } = require("umzug");
const database = require("../config/database");
const logger = require("../utils/logger");

function makeUmzug(sequelize = database) {
  return new Umzug({
    migrations: {
      glob: ["2*.js", { cwd: __dirname }],
      resolve: ({ name, path: p, context }) => {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const m = require(p);
        return { name, up: () => m.up({ context }), down: () => m.down({ context }) };
      },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: { info: (e) => logger.info(`[migraciones] ${JSON.stringify(e)}`), warn: logger.warn.bind(logger), error: logger.error.bind(logger), debug: () => {} },
  });
}

async function runMigrations(sequelize = database) {
  if (sequelize.getDialect() !== "postgres") {
    throw new Error("Las migraciones son solo para Postgres (en SQLite se usa sync()).");
  }
  return makeUmzug(sequelize).up();
}

module.exports = { makeUmzug, runMigrations, migrationsDir: path.resolve(__dirname) };

if (require.main === module) {
  runMigrations()
    .then((done) => {
      logger.info(`Migraciones aplicadas: ${done.map((m) => m.name).join(", ") || "ninguna pendiente"}`);
      return database.close();
    })
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
}
