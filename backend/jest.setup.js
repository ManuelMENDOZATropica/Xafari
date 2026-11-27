process.env.NODE_ENV = "test";
const database = require("./config/database");
require("./models");

beforeEach(async () => {
  await database.sync({ force: true });
});

afterAll(async () => {
  await database.close();
});
