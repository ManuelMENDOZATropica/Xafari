const request = require("supertest");

const app = require("../../../app");

describe("UserAchievement route", () => {
  // describe("GET UserAchievement", () => {
  //   it("Should return UserAchievement", async () => {
  //     const user = {
  //       name: Math.random().toString(16).substring(2),
  //       email: `${Math.random().toString(16).substring(2)}@gmail.com`,
  //       password: "1234",
  //       birthdate: "2025-03-22T22:52:46.816Z",
  //       reservationNumber: "1234",
  //     };

  //     const responseUser = await request(app).post("/user").send(user);

  //     const xelfie = {
  //       name: `activity ${Math.floor(Math.random() * 20)}`,
  //       description: `description ${Math.floor(Math.random() * 20)}`,
  //       location: `location ${Math.floor(Math.random() * 20)}`,
  //     };

  //     const responseXelfie = await request(app).post("/xelfie").send(xelfie);

  //     const responseUserActivity = await request(app)
  //       .post(`/user/${responseUser.body.user.id}/activity`)
  //       .send({
  //         activityId: responseXelfie.body.xelfie.activity.id,
  //       });

  //     const responseGet = await request(app).get(
  //       `/user/${responseUser.body.user.id}`
  //     );

  //     expect(responseGet.body.user.activities[0]).toMatchObject(
  //       responseXelfie.body.xelfie.activity
  //     );

  //     expect(responseGet.body.user.activities[0].userActivity).toMatchObject(
  //       responseUserActivity.body.userActivity
  //     );

  //     const user2 = {
  //       name: Math.random().toString(16).substring(2),
  //       email: `${Math.random().toString(16).substring(2)}@gmail.com`,
  //       password: "1234",
  //       birthdate: "2025-03-22T22:52:46.816Z",
  //       reservationNumber: "123456",
  //     };

  //     const responseUser2 = await request(app).post("/user").send(user2);

  //     expect(responseUser2.body.user.activities).toBe(undefined);
  //   });
  // });

  describe("POST userAchievement create", () => {
    it("Should add a new userAchievement", async () => {
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

      const responseAchievement = await request(app)
        .post(`/achievement/`)
        .send(achievement);

      const response = await request(app)
        .post(`/user/${responseUser.body.user.id}/achievement`)
        .send({
          achievementId: responseAchievement.body.achievement.id,
        });

      const responseGet = await request(app).get(
        `/user/${responseUser.body.user.id}`
      );
      console.debug("RESPONSE GET", responseGet.body.user);

      expect(
        responseGet.body.user.achievements[0].userAchievement
      ).toMatchObject(response.body.userAchievement);
    });
  });
  describe("DELETE userAchievement ", () => {
    it("Should return error if no user or achievement found", async () => {
      const response = await request(app).delete(`/user/1234/achievement/1234`);

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
        `/user/${responseUser.body.user.id}/achievement/1234`
      );

      expect(response2.body).toMatchObject({
        error: "Achievement not found",
      });
    });
    it("Should delete an UserAchievement", async () => {
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

      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const responseHouse = await request(app).post("/house").send(house);

      const achievement = {
        name: `achievement ${Math.random()}`,
        description: `text`,
        type: "Follaje",
        imageUrl: "http://asdf.com",
        activityId: responseXelfie.body.xelfie.activity.id,
        houseId: responseHouse.body.house.id,
      };

      const responseAchievement = await request(app)
        .post(`/achievement/`)
        .send(achievement);

      const responseCreateUserAchievement = await request(app)
        .post(`/user/${responseUser.body.user.id}/achievement`)
        .send({
          achievementId: responseAchievement.body.achievement.id,
          amount: 2,
        });

      const responseDeleteUserAchievement = await request(app).delete(
        `/user/${responseUser.body.user.id}/achievement/${responseAchievement.body.achievement.id}`
      );

      const response = await request(app).get(
        `/user/${responseUser.body.user.id}`
      );

      expect(response.body.user.achievements.length).toBe(0);
    });

    it("Should delete UserAchievement when achievement is deleted", async () => {
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

      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const responseHouse = await request(app).post("/house").send(house);

      const achievement = {
        name: `achievement ${Math.random()}`,
        description: `text`,
        type: "Follaje",
        imageUrl: "http://asdf.com",
        activityId: responseXelfie.body.xelfie.activity.id,
        houseId: responseHouse.body.house.id,
      };

      const responseAchievement = await request(app)
        .post(`/achievement/`)
        .send(achievement);

      const responseCreateUserAchievement = await request(app)
        .post(`/user/${responseUser.body.user.id}/achievement`)
        .send({
          achievementId: responseAchievement.body.achievement.id,
          amount: 2,
        });

      await request(app).delete(
        `/achievement/${responseAchievement.body.achievement.id}`
      );

      const responseGet = await request(app).get(
        `/user/${responseUser.body.user.id}`
      );

      expect(responseGet.body.user.achievements.length).toBe(0);
    });
  });
  describe("POST UserArchive update", () => {
    it("Should modify an UserArchive", async () => {
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

      const house = {
        name: `House ${Math.floor(Math.random() * 200)}`,
        animal: `Animal ${Math.floor(Math.random() * 200)}`,
        element: `Element ${Math.floor(Math.random() * 200)}`,
      };

      const responseHouse = await request(app).post("/house").send(house);

      const achievement = {
        name: `achievement ${Math.random()}`,
        description: `text`,
        type: "Follaje",
        imageUrl: "http://asdf.com",
        activityId: responseXelfie.body.xelfie.activity.id,
        houseId: responseHouse.body.house.id,
      };

      const responseAchievement = await request(app)
        .post(`/achievement/`)
        .send(achievement);

      const responseCreateUserAchievement = await request(app)
        .post(`/user/${responseUser.body.user.id}/achievement`)
        .send({
          achievementId: responseAchievement.body.achievement.id,
          amount: 2,
        });

      await request(app)
        .post(
          `/user/${responseUser.body.user.id}/achievement/${responseAchievement.body.achievement.id}`
        )
        .send({
          amount: 6,
        });

      const response = await request(app).get(
        `/user/${responseUser.body.user.id}`
      );

      expect(response.body.user.achievements[0].userAchievement.amount).toBe(6);
    });
  });
});
