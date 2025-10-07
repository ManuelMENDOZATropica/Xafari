const request = require("supertest");

const app = require("../../../app");

describe("House route", () => {
  describe("GET house", () => {
    it("Should return error if house does not exists", async () => {
      const response = await request(app).get("/house/1234");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "House not found",
      });
    });

    it("Should return house", async () => {
      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const responsePost = await request(app).post("/house").send(house);

      const responseGet = await request(app).get(
        `/house/${responsePost.body.house.id}`
      );

      expect(responseGet.status).toBe(200);
      expect(responseGet.body.house).toMatchObject(house);
      //   expect(responseGet.body.house.achievements.length).toBe(0);
      //   expect(responseGet.body.house.activities.length).toBe(0);
      //   expect(responseGet.body.house.familyTreeId).toBe(null);
    });
  });

  describe("DELETE house", () => {
    it("Should return error if house does not exists", async () => {
      const response = await request(app).delete("/house/1234");

      expect(response.body).toMatchObject({
        error: "House not found",
      });
    });

    it("Should return id if user exists", async () => {
      const house = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const responsePost = await request(app).post("/house").send(house);
      const response = await request(app).delete(
        `/house/${responsePost.body.house.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.house).toMatchObject(responsePost.body.house);

      const responseFail = await request(app).get(
        `/house/${responsePost.body.house.id}`
      );

      expect(responseFail.status).toBe(404);
      expect(responseFail.body).toMatchObject({
        error: "House not found",
      });
    });
  });
  describe("POST house create", () => {
    it("Should create a new house", async () => {
      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const response = await request(app).post("/house").send(house);

      expect(response.status).toBe(200);
      expect(response.body.house).toMatchObject(house);
    });

    it("should return error when name is empty", async () => {
      const house = {
        name: `   `,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const response = await request(app).post("/house").send(house);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Name cannot be empty",
      });
    });

    it("should return error when element is empty", async () => {
      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `   `,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const response = await request(app).post("/house").send(house);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Animal cannot be empty",
      });
    });

    it("should return error when element is empty", async () => {
      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `  `,
      };

      const response = await request(app).post("/house").send(house);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Element cannot be empty",
      });
    });

    it("should return error when house already exists", async () => {
      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const response1 = await request(app).post("/house").send(house);
      const response2 = await request(app).post("/house").send(house);

      expect(response2.status).toBe(400);
      expect(response2.body).toMatchObject({
        error: "House already exists",
      });
    });
  });
  describe("POST house update", () => {
    it("Should return error if house does not exists", async () => {
      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const response = await request(app).post("/house/1234").send(house);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "House not found",
      });
    });

    it("Should modify a house", async () => {
      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const responsePost = await request(app).post("/house").send(house);

      const newName = Math.random().toString(16).substring(2);
      const newAnimal = Math.random().toString(16).substring(2);

      const response = await request(app)
        .post(`/house/${responsePost.body.house.id}`)
        .send({
          name: newName,
          animal: newAnimal,
        });

      expect(response.status).toBe(200);
      expect(response.body.house.name).toBe(newName);
      expect(response.body.house.animal).toBe(newAnimal);
    });
  });
});
