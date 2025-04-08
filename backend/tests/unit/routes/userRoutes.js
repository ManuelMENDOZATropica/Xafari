const request = require("supertest");

const app = require("../../../app");

describe("User route", () => {
  describe("GET user", () => {
    it("Should return error if user does not exists", async () => {
      const response = await request(app).get("/user/1234");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "User not found",
      });
    });

    it("Should return user", async () => {
      const user = {
        name: "John foe1",
        email: "mail2@gmail.com",
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "12342",
      };

      const responsePost = await request(app).post("/user").send(user);

      const responseGet = await request(app).get(
        `/user/${responsePost.body.user.id}`
      );

      expect(responseGet.status).toBe(200);
      expect(responseGet.body.user).toMatchObject(
        Object.fromEntries(
          Object.entries(user).filter(([k, v]) => k != "password")
        )
      );
      expect(responseGet.body.user.achievements.length).toBe(0);
      expect(responseGet.body.user.activities.length).toBe(0);
      expect(responseGet.body.user.familyTreeId).toBe(null);
    });
  });
  describe("DELETE user", () => {
    it("Should return error if user does not exists", async () => {
      const response = await request(app).delete("/user/1234");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "User not found",
      });
    });

    it("Should return id if user exists", async () => {
      const user = {
        name: Math.random().toString(16).substring(2),
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responsePost = await request(app).post("/user").send(user);
      const response = await request(app).delete(
        `/user/${responsePost.body.user.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject(responsePost.body.user);

      const responseFail = await request(app).get(
        `/user/${responsePost.body.user.id}`
      );

      expect(responseFail.status).toBe(404);
      expect(responseFail.body).toMatchObject({
        error: "User not found",
      });
    });
  });
  describe("POST user create", () => {
    it("Should create a new user", async () => {
      const user = {
        name: `Name ${Math.floor(Math.random() * 200)}`,
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const response = await request(app).post("/user").send(user);

      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject(
        Object.fromEntries(
          Object.entries(user).filter(([k, v]) => k != "password")
        )
      );
    });

    it("should return error when name is empty", async () => {
      const user = {
        name: "        ",
        email: "mail@gmail.com",
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const response = await request(app).post("/user").send(user);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Name cannot be empty",
      });
    });

    it("should return error when email is not valid", async () => {
      const user = {
        name: "John Doe",
        email: "mail",
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const response = await request(app).post("/user").send(user);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Email is not valid",
      });
    });

    it("should return error when password is empty", async () => {
      const user = {
        name: "John doe",
        email: "mail@gmail.com",
        password: "",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const response = await request(app).post("/user").send(user);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Password cannot be empty",
      });
    });

    it("should return error when birthdate is not a date", async () => {
      const user = {
        name: "John doe",
        email: "mail@gmail.com",
        password: "1234",
        birthdate: "twenty",
        reservationNumber: "1234",
      };

      const response = await request(app).post("/user").send(user);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Birthdate must be a valid ISO 8601 date",
      });
    });

    it("should return error when reservation number is empty", async () => {
      const user = {
        name: "John doe",
        email: "mail@gmail.com",
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "   ",
      };

      const response = await request(app).post("/user").send(user);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Reservation number cannot be empty",
      });
    });

    it("should return error when user already exists", async () => {
      const user1 = {
        name: "John doe",
        email: "mail@gmail.com",
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const response1 = await request(app).post("/user").send(user1);
      const response2 = await request(app).post("/user").send(user1);

      expect(response2.status).toBe(400);
      expect(response2.body).toMatchObject({
        error: "User already exists",
      });
    });
  });
  describe("POST user update", () => {
    it("Should return error if user does not exists", async () => {
      const user = {
        name: "John foe",
      };

      const response = await request(app).post("/user/1234").send(user);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "User not found",
      });
    });

    it("Should modify an user", async () => {
      const user = {
        name: Math.random().toString(16).substring(2),
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responsePost = await request(app).post("/user").send(user);
      const newName = Math.random().toString(16).substring(2);
      const newMail = `${Math.random().toString(16).substring(2)}@gmail.com`;

      const response = await request(app)
        .post(`/user/${responsePost.body.user.id}`)
        .send({
          name: newName,
          email: newMail,
        });

      expect(response.status).toBe(200);
      expect(response.body.user.name).toBe(newName);
      expect(response.body.user.email).toBe(newMail);
    });
  });

});
