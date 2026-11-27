const env = require("./config/env");
const logger = require("./utils/logger");

process.on("unhandledRejection", (reason) => {
  logger.error(`unhandledRejection: ${reason && (reason.stack || reason)}`);
});
process.on("uncaughtException", (err) => {
  logger.error(`uncaughtException: ${err && (err.stack || err)}`);
  process.exit(1);
});

async function start() {
  env.assertProductionSecrets();

  const database = require("./config/database");
  require("./models");
  const { seed } = require("./scripts/seed");
  const app = require("./app");

  await database.authenticate();
  logger.info(`DB conectada (${database.getDialect()}).`);

  if (database.getDialect() === "postgres") {
    // Postgres (producción): el esquema lo manejan las migraciones, nunca sync({alter}).
    const { runMigrations } = require("./migrations/umzug");
    const done = await runMigrations(database);
    logger.info(`Migraciones aplicadas: ${done.map((m) => m.name).join(", ") || "ninguna pendiente"}`);
  } else {
    // SQLite de desarrollo: crea tablas que falten (sin alter). Si cambian los
    // modelos, borra database.sqlite.
    await database.sync();
  }

  await seed();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
  });

  const shutdown = (signal) => {
    logger.info(`${signal} recibido, cerrando…`);
    server.close(() => database.close().finally(() => process.exit(0)));
    setTimeout(() => process.exit(0), 10000).unref();
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start().catch((err) => {
  logger.error(`No se pudo arrancar: ${err && (err.stack || err)}`);
  process.exit(1);
});
