const request = require("supertest");
const app = require("../../../app");

const Activity = require("../../../models/activity");

describe("Event route", () => {
  describe("GET event", () => {
    it("Should return error if event does not exists", async () => {
      const response = await request(app).get("/event/1234");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Event not found",
      });
    });

    it("Should return event", async () => {
      const event = {
        name: `event ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: true,
        startDate: "2025-03-22T22:52:46.816Z",
        endDate: "2025-04-22T22:52:46.816Z",
      };

      const responsePost = await request(app).post("/event").send(event);

      const responseGet = await request(app).get(
        `/event/${responsePost.body.event.id}`
      );

      expect(responseGet.status).toBe(200);
      expect(responseGet.body.event).toMatchObject({
        startDate: event.startDate,
        endDate: event.endDate,
      });

      expect(responseGet.body.event.activity).toMatchObject({
        minAge: null,
        maxAge: null,
        location: event.location,
      });
    });
  });
  describe("DELETE Xperiencia", () => {
    it("Should return error if  event does not exists", async () => {
      const response = await request(app).delete("/event/1234");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Event not found",
      });
    });

    it("Should return event after delete, activity should also be deleted", async () => {
      const event = {
        name: `event ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: true,
        startDate: "2025-03-22T22:52:46.816Z",
        endDate: "2025-04-22T22:52:46.816Z",
      };

      const responsePost = await request(app).post("/event").send(event);

      const response = await request(app).delete(
        `/event/${responsePost.body.event.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.event).toMatchObject({
        startDate: event.startDate,
        endDate: event.endDate,
      });

      expect(response.body.event.activity).toMatchObject({
        id: responsePost.body.event.activity.id,
      });

      const activity = await Activity.findByPk(
        responsePost.body.event.activity.id
      );

      expect(activity).toBe(null);
    });
  });
  describe("POST event create", () => {
    it("Should create a new event", async () => {
      const event = {
        name: `event ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: true,
        startDate: "2025-03-22T22:52:46.816Z",
        endDate: "2025-04-22T22:52:46.816Z",
      };

      const response = await request(app).post("/event").send(event);

      expect(response.status).toBe(200);
      expect(response.body.event).toMatchObject({
        startDate: event.startDate,
        endDate: event.endDate,
      });

      expect(response.body.event.activity).toMatchObject({
        location: event.location,
      });
    });

    it("should return error if age limits are not coherent", async () => {
      const event = {
        name: `event ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: true,
        startDate: "2025-03-22T22:52:46.816Z",
        endDate: "2025-04-22T22:52:46.816Z",
        minAge: 4,
        maxAge: 1,
      };

      const response = await request(app).post("/event").send(event);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Age limits are not valid",
      });
    });
    it("should return error if dates are not valid", async () => {
      const event = {
        name: `event ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: true,
        startDate: "2025-05-22T22:52:46.816Z",
        endDate: "2025-01-22T22:52:46.816Z",
      };

      const response = await request(app).post("/event").send(event);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        error: "Date values are invalid",
      });
    });
  });
  describe("POST event update", () => {
    it("Should return error if event does not exists", async () => {
      const event = {
        name: `event 666`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: false,
      };

      const response = await request(app).post("/event/666").send(event);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Event not found",
      });
    });

    it("Should modify an event", async () => {
      const event = {
        name: `event update ${Math.random()}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: false,
        startDate: "2025-03-22T22:52:46.816Z",
        endDate: "2025-04-22T22:52:46.816Z",
      };

      const responsePost = await request(app).post("/event").send(event);
      const newName = Math.random().toString(16).substring(2);
      const newDescription = Math.random().toString(16).substring(2);

      const response = await request(app)
        .post(`/event/${responsePost.body.event.id}`)
        .send({
          name: newName,
          description: newDescription,
        });

      expect(response.status).toBe(200);
      expect(response.body.event.activity.name).toBe(newName);
      expect(response.body.event.activity.description).toBe(newDescription);

      const responseGet = await request(app).post(
        `/event/${responsePost.body.event.id}`
      );
    });

    // it("Should return same object when no new values sent", async () => {
    //   const event = {
    //     name: `activity ${Math.floor(Math.random() * 20)}`,
    //     description: `description ${Math.floor(Math.random() * 20)}`,
    //     location: `location ${Math.floor(Math.random() * 20)}`,
    //     isValidable: false,
    //     startDate: "2025-05-22T22:52:46.816Z",
    //     endDate: "2025-01-22T22:52:46.816Z",
    //   };

    //   const responsePost = await request(app).post("/event").send(event);

    //   const response = await request(app)
    //     .post(`/event/${responsePost.body.event.id}`)
    //     .send(event);

    //   expect(response.status).toBe(200);
    //   expect(response.body).toMatchObject(responsePost.body);
    // });
  });
});
