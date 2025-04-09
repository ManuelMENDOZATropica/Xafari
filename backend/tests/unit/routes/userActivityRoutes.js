const request = require("supertest");

const app = require("../../../app");

describe("UserActivity route", () => {
  describe("GET UserActivity", () => {
    it("Should return UserActivity", async () => {
      const user = {
        name: Math.random().toString(16).substring(2),
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseUser = await request(app).post("/user").send(user);

      const xelfie = {
        name: `activity ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
      };

      const responseXelfie = await request(app).post("/xelfie").send(xelfie);

      const responseUserActivity = await request(app)
        .post(`/user/${responseUser.body.user.id}/activity`)
        .send({
          activityId: responseXelfie.body.xelfie.activity.id,
        });

      const responseGet = await request(app).get(
        `/user/${responseUser.body.user.id}`
      );

      expect(responseGet.body.user.activities[0]).toMatchObject(
        responseXelfie.body.xelfie.activity
      );

      expect(responseGet.body.user.activities[0].userActivity).toMatchObject(
        responseUserActivity.body.userActivity
      );

      const user2 = {
        name: Math.random().toString(16).substring(2),
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "123456",
      };

      const responseUser2 = await request(app).post("/user").send(user2);

      expect(responseUser2.body.user.activities).toBe(undefined);
    });
  });

  describe("POST UserActivity create", () => {
    it("Should add a new UserActivity", async () => {
      const user = {
        name: Math.random().toString(16).substring(2),
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseUser = await request(app).post("/user").send(user);

      const xelfie = {
        name: `activity ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
      };

      const responseXelfie = await request(app).post("/xelfie").send(xelfie);

      const response = await request(app)
        .post(`/user/${responseUser.body.user.id}/activity`)
        .send({
          activityId: responseXelfie.body.xelfie.activity.id,
        });

      expect(response.body).toMatchObject({
        userActivity: {
          userId: responseUser.body.user.id,
          activityId: responseXelfie.body.xelfie.activity.id,
        },
      });
    });
  });
  describe("DELETE UserActivity ", () => {
    it("Should return error if no user or activity found", async () => {
      const response = await request(app).delete(`/user/1234/activity/1234`);

      expect(response.body).toMatchObject({
        error: "User not found",
      });

      const user = {
        name: Math.random().toString(16).substring(2),
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseUser = await request(app).post("/user").send(user);

      const response2 = await request(app).delete(
        `/user/${responseUser.body.user.id}/activity/1234`
      );

      expect(response2.body).toMatchObject({
        error: "Activity not found",
      });
    });
    it("Should delete an UserActivity", async () => {
      const user = {
        name: Math.random().toString(16).substring(2),
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseUser = await request(app).post("/user").send(user);

      const xelfie = {
        name: `activity ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
      };

      const responseXelfie = await request(app).post("/xelfie").send(xelfie);

      const responseCreateUserActivity = await request(app)
        .post(`/user/${responseUser.body.user.id}/activity`)
        .send({
          activityId: responseXelfie.body.xelfie.activity.id,
        });

      const responseDeleteUserActivity = await request(app).delete(
        `/user/${responseUser.body.user.id}/activity/${responseXelfie.body.xelfie.activity.id}`
      );

      const response = await request(app).get(
        `/user/${responseUser.body.user.id}`
      );

      console.debug(response.body.user.activities, "OOO");
      expect(response.body.user.activities.length).toBe(0);
    });

    it("Should delete UserActivity when activity is deleted", async () => {
      const user = {
        name: Math.random().toString(16).substring(2),
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseUser = await request(app).post("/user").send(user);

      const xelfie = {
        name: `activity ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
      };

      const responseXelfie = await request(app).post("/xelfie").send(xelfie);

      await request(app)
        .post(`/user/${responseUser.body.user.id}/activity`)
        .send({
          activityId: responseXelfie.body.xelfie.activity.id,
        });

      await request(app).delete(`/xelfie/${responseXelfie.body.xelfie.id}`);

      const responseGet = await request(app).get(
        `/user/${responseUser.body.user.id}`
      );

      expect(responseGet.body.user.activities.length).toBe(0);
    });
  });
  describe("POST UserActivity update", () => {
    it("Should modify an UserActivity", async () => {
      const user = {
        name: Math.random().toString(16).substring(2),
        email: `${Math.random().toString(16).substring(2)}@gmail.com`,
        password: "1234",
        birthdate: "2025-03-22T22:52:46.816Z",
        reservationNumber: "1234",
      };

      const responseUser = await request(app).post("/user").send(user);

      const xelfie = {
        name: `activity ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
      };

      const responseXelfie = await request(app).post("/xelfie").send(xelfie);

      await request(app)
        .post(`/user/${responseUser.body.user.id}/activity`)
        .send({
          activityId: responseXelfie.body.xelfie.activity.id,
        });

      const completedAt = new Date();
      await request(app)
        .post(
          `/user/${responseUser.body.user.id}/activity/${responseXelfie.body.xelfie.activity.id}`
        )
        .send({
          completedAt: completedAt,
        });

      const responseGet = await request(app).get(
        `/user/${responseUser.body.user.id}`
      );

      expect(
        new Date(responseGet.body.user.activities[0].userActivity.completedAt)
      ).toMatchObject(completedAt);
    });
  });
});
