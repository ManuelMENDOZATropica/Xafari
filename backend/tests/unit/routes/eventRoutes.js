const request = require("supertest");
const app = require("../../../app");

const Activity = require("../../../models/activity");

describe("Event route", () => {
  // describe("GET event", () => {
  //   it("Should return error if xperiencia does not exists", async () => {
  //     const response = await request(app).get("/xperiencia/1234");

  //     expect(response.status).toBe(404);
  //     expect(response.body).toMatchObject({
  //       error: "Xperiencia not found",
  //     });
  //   });

  //   it("Should return xperiencia", async () => {
  //     const xperiencia = {
  //       name: `activity ${Math.floor(Math.random() * 200)}`,
  //       description: `description ${Math.floor(Math.random() * 200)}`,
  //       location: `location ${Math.floor(Math.random() * 20)}`,
  //       isValidable: true,
  //       qrCode: `qrCode ${Math.floor(Math.random() * 20)}`,
  //     };

  //     const responsePost = await request(app)
  //       .post("/xperiencia")
  //       .send(xperiencia);

  //     const responseGet = await request(app).get(
  //       `/xperiencia/${responsePost.body.xperiencia.id}`
  //     );

  //     expect(responseGet.status).toBe(200);
  //     expect(responseGet.body.xperiencia).toMatchObject({
  //       qrCode: xperiencia.qrCode,
  //       isValidable: xperiencia.isValidable,
  //     });

  //     expect(responseGet.body.xperiencia.activity).toMatchObject({
  //       minAge: null,
  //       maxAge: null,
  //       location: xperiencia.location,
  //     });
  //   });
  // });
  // describe("DELETE Xperiencia", () => {
  //   it("Should return error if  xperiencia does not exists", async () => {
  //     const response = await request(app).delete("/xperiencia/1234");

  //     expect(response.status).toBe(404);
  //     expect(response.body).toMatchObject({
  //       error: "Xperiencia not found",
  //     });
  //   });

  //   it("Should return xperience after delete, activity should also be deleted", async () => {
  //     const xperiencia = {
  //       name: `activity ${Math.floor(Math.random() * 20)}`,
  //       description: `description ${Math.floor(Math.random() * 20)}`,
  //       location: `location ${Math.floor(Math.random() * 20)}`,
  //       isValidable: true,
  //       qrCode: `qrCode ${Math.floor(Math.random() * 20)}`,
  //     };

  //     const responsePost = await request(app)
  //       .post("/xperiencia")
  //       .send(xperiencia);

  //     const response = await request(app).delete(
  //       `/xperiencia/${responsePost.body.xperiencia.id}`
  //     );

  //     expect(response.status).toBe(200);
  //     expect(response.body.xperiencia).toMatchObject({
  //       qrCode: xperiencia.qrCode,
  //       isValidable: xperiencia.isValidable,
  //     });

  //     expect(response.body.xperiencia.activity).toMatchObject({
  //       id: responsePost.body.xperiencia.activity.id,
  //     });

  //     const activity = await Activity.findByPk(
  //       responsePost.body.xperiencia.activity.id
  //     );

  //     expect(activity).toBe(null);
  //   });
  // });
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

      console.debug("RESPONSE POST", response.body);
      expect(response.status).toBe(200);
      expect(response.body.event).toMatchObject({
        startDate: event.startDate,
        endDate: event.endDate,
      });

      expect(response.body.event.activity).toMatchObject({
        location: event.location,
      });
    });

    // it("should return error if age limits are not coherent", async () => {
    //   const xperiencia = {
    //     name: `activity ${Math.floor(Math.random() * 20)}`,
    //     description: `description ${Math.floor(Math.random() * 20)}`,
    //     location: `location ${Math.floor(Math.random() * 20)}`,
    //     isValidable: false,
    //     minAge: -1,
    //     maxAge: -1,
    //   };

    //   const response = await request(app).post("/xperiencia").send(xperiencia);

    //   expect(response.status).toBe(400);
    //   expect(response.body).toMatchObject({
    //     error: "Age limits are not valid",
    //   });

    //   const xperiencia2 = {
    //     name: `activity ${Math.floor(Math.random() * 20)}`,
    //     description: `description ${Math.floor(Math.random() * 20)}`,
    //     location: `location ${Math.floor(Math.random() * 20)}`,
    //     isValidable: false,
    //     minAge: 5,
    //     maxAge: 0,
    //   };

    //   const response2 = await request(app)
    //     .post("/xperiencia")
    //     .send(xperiencia2);

    //   expect(response2.status).toBe(400);
    //   expect(response2.body).toMatchObject({
    //     error: "Age limits are not valid",
    //   });

    //   const xperiencia3 = {
    //     name: `activity ${Math.floor(Math.random() * 20)}`,
    //     description: `description ${Math.floor(Math.random() * 20)}`,
    //     location: `location ${Math.floor(Math.random() * 20)}`,
    //     isValidable: false,
    //     minAge: "three",
    //   };

    //   const response3 = await request(app)
    //     .post("/xperiencia")
    //     .send(xperiencia3);

    //   expect(response3.status).toBe(400);
    //   expect(response3.body).toMatchObject({
    //     error: "Age limits are not valid",
    //   });
    // });
  });
  // describe("POST xperiencia update", () => {
  //   it("Should return error if xperiencia does not exists", async () => {
  //     const xperiencia = {
  //       name: `activity 666`,
  //       description: `description ${Math.floor(Math.random() * 20)}`,
  //       location: `location ${Math.floor(Math.random() * 20)}`,
  //       isValidable: false,
  //       minAge: 5,
  //       maxAge: 0,
  //     };

  //     const response = await request(app)
  //       .post("/xperiencia/666")
  //       .send(xperiencia);

  //     expect(response.status).toBe(404);
  //     expect(response.body).toMatchObject({
  //       error: "Xperiencia not found",
  //     });
  //   });

  //   it("Should modify a xperiencia", async () => {
  //     const xperiencia = {
  //       name: `activity ${Math.floor(Math.random() * 20)}`,
  //       description: `description ${Math.floor(Math.random() * 20)}`,
  //       location: `location ${Math.floor(Math.random() * 20)}`,
  //       isValidable: false,
  //     };

  //     const responsePost = await request(app)
  //       .post("/xperiencia")
  //       .send(xperiencia);
  //     const newName = Math.random().toString(16).substring(2);
  //     const newDescription = Math.random().toString(16).substring(2);

  //     const response = await request(app)
  //       .post(`/xperiencia/${responsePost.body.xperiencia.id}`)
  //       .send({
  //         name: newName,
  //         description: newDescription,
  //       });

  //     expect(response.status).toBe(200);
  //     expect(response.body.xperiencia.activity.name).toBe(newName);
  //     expect(response.body.xperiencia.activity.description).toBe(
  //       newDescription
  //     );

  //     const responseGet = await request(app).post(
  //       `/xperiencia/${responsePost.body.xperiencia.id}`
  //     );
  //     console.debug(responseGet.body, "GET");
  //     expect(response.body).toMatchObject(responseGet.body);
  //   });

  //   it("Should return same object when no new values sent", async () => {
  //     const xperiencia = {
  //       name: `activity ${Math.floor(Math.random() * 20)}`,
  //       description: `description ${Math.floor(Math.random() * 20)}`,
  //       location: `location ${Math.floor(Math.random() * 20)}`,
  //       isValidable: false,
  //     };

  //     const responsePost = await request(app)
  //       .post("/xperiencia")
  //       .send(xperiencia);

  //     const response = await request(app)
  //       .post(`/xperiencia/${responsePost.body.xperiencia.id}`)
  //       .send(xperiencia);

  //     expect(response.status).toBe(200);
  //     expect(response.body).toMatchObject(responsePost.body);
  //   });
  // });
});
