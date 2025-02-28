const request = require("supertest");

const app = require("../../../app");

describe("userRoutes", () => {
  describe("get /user", () => {
    it("should respond to /user path ", async () => {
      await request(app).get("/user/1234").expect(404);
    });
  });
});
