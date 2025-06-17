const app = require("./app");
const logger = require("./utils/logger");
const database = require("./config/database");

const PORT = process.env.PORT || 3000;

database.sync().then(() => {
  logger.info("Database connected...");

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});
