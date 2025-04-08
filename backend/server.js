const app = require("./app");
const logger = require("./utils/logger");
const database = require("./config/database");

const PORT = process.env.PORT || 3000;

database.sync().then(() => {
  logger.info("Database connected...");

  (async () => {
    const tables = await database.getQueryInterface().showAllTables();
    const structure = {};

    for (const table of tables) {
      const columns = await database.getQueryInterface().describeTable(table);
      console.debug("\n");
      console.debug(table);
      console.debug(columns);
    }
  })();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});
