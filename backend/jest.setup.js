const database = require("./config/database");

beforeEach(async () => {
  await database.sync({ force: true });
});

afterAll(async () => {
  await database.close();
});
