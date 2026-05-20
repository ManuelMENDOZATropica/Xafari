const app = require("./app");
const logger = require("./utils/logger");
const database = require("./config/database");

const PORT = process.env.PORT || 3000;

const startServer = () => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

if (process.env.NODE_ENV === "production") {
  database.authenticate()
    .then(() => {
      logger.info("Database connection has been established successfully in production.");
      startServer();
    })
    .catch((err) => {
      logger.error("Unable to connect to the database in production:", err);
      process.exit(1);
    });
} else {
  database.sync()
    .then(() => {
      logger.info("Database connected & synced...");
      startServer();
    })
    .catch((err) => {
      logger.error("Unable to sync database:", err);
      process.exit(1);
    });
}
