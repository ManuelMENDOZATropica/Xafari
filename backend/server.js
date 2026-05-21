const app = require("./app");
const logger = require("./utils/logger");
const database = require("./config/database");
const { seed } = require("./scripts/seed");

const PORT = process.env.PORT || 3000;

const startServer = () => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

database
  .authenticate()
  .then(() => {
    logger.info("Database connection established successfully.");
    return database.sync({ alter: true });
  })
  .then(() => {
    logger.info("Database synced.");
    return seed(); // idempotente — solo inserta si las tablas están vacías
  })
  .then(() => {
    logger.info("Seed completed.");
    startServer();
  })
  .catch((err) => {
    logger.error("Unable to connect/sync/seed the database:", err);
    process.exit(1);
  });
