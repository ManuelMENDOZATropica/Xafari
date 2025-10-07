const request = require("supertest");
const app = require("../../../app");
const { Achievement } = require("../../../models");

describe("Achievement route", () => {
  describe("GET achievement", () => {
    it("Should return error if no achievement found", async () => {
      const response = await request(app).get("/achievement/1234");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Achievement not found",
      });
    });
  });

  describe("POST achievement", () => {
    it("Should create an achievement", async () => {
      const xelfie = {
        name: `activity ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
      };

      const responseXelfie = await request(app).post("/xelfie").send(xelfie);

      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const responseHouse = await request(app).post("/house").send(house);

      const achievement = {
        name: "achievement 1",
        description: `text`,
        type: "Follaje",
        imageUrl: "http://asdf.com",
        activityId: responseXelfie.body.xelfie.activity.id,
        houseId: responseHouse.body.house.id,
      };

      const response = await request(app)
        .post("/achievement")
        .send(achievement);

      expect(response.body.achievement).toMatchObject(achievement);
    });

    it("Should return error if type is not valid", async () => {
      const achievement = {
        name: "achievement 1",
        description: `text`,
        type: "Oro",
        imageUrl: "http://asdf.com",
      };

      const response = await request(app)
        .post("/achievement")
        .send(achievement);

      expect(response.body).toMatchObject({
        error: `Type must be "Amuleto" or "Follaje"`,
      });
    });
  });

  describe("DELETE achievement", () => {
    it("Should return error if no achievement found", async () => {
      const response = await request(app).delete("/achievement/1234");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Achievement not found",
      });
    });

    it("Should delete an achievement", async () => {
      const xelfie = {
        name: `activity ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
      };

      const responseXelfie = await request(app).post("/xelfie").send(xelfie);

      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const responseHouse = await request(app).post("/house").send(house);

      const achievement = {
        name: "achievement 1",
        description: `text`,
        type: "Follaje",
        imageUrl: "http://asdf.com",
        activityId: responseXelfie.body.xelfie.activity.id,
        houseId: responseHouse.body.house.id,
      };

      const responseCreate = await request(app)
        .post("/achievement")
        .send(achievement);

      const response = await request(app).delete(
        `/achievement/${responseCreate.body.achievement.id}`
      );

      expect(response.body.achievement).toMatchObject(achievement);
    });
  });

  describe("POST update achievement", () => {
    it("Should return error if no achievement found", async () => {
      const response = await request(app).post("/achievement/1234").send({
        description: "asdf",
      });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Achievement not found",
      });
    });

    it("Should modify an achievement", async () => {
      const xelfie = {
        name: `activity ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
      };

      const responseXelfie = await request(app).post("/xelfie").send(xelfie);

      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const responseHouse = await request(app).post("/house").send(house);

      const achievement = {
        name: "achievement 1",
        description: `text`,
        type: "Follaje",
        imageUrl: "http://asdf.com",
        activityId: responseXelfie.body.xelfie.activity.id,
        houseId: responseHouse.body.house.id,
      };

      const responseCreate = await request(app)
        .post("/achievement")
        .send(achievement);

      const response = await request(app)
        .post(`/achievement/${responseCreate.body.achievement.id}`)
        .send({
          description: "asdf",
        });

      expect(response.status).toBe(200);
      expect(response.body.achievement.description).toBe("asdf");
    });
  });
});
