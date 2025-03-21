const request = require("supertest");
const app = require("../../../app");

const Activity = require("../../../models/activity");

describe("Xecreto route", () => {
  describe("GET xecreto", () => {
    it("Should return error if xecreto does not exists", async () => {
      const response = await request(app).get("/xecreto/1234");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Xecreto not found",
      });
    });

    it("Should return xecreto", async () => {
      const xecreto = {
        name: `xecreto ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        clues: [
          {
            text: "clue 1",
            correctAnswer: "answer 1",
          },
          {
            text: "clue 2",
            correctAnswer: "answer 2",
          },
        ],
      };

      const responsePost = await request(app).post("/xecreto").send(xecreto);

      const responseGet = await request(app).get(
        `/xecreto/${responsePost.body.xecreto.id}`
      );

      expect(responseGet.status).toBe(200);
      expect(responseGet.body.xecreto).toMatchObject({
        clues: xecreto.clues,
      });

      expect(responseGet.body.xecreto.activity).toMatchObject({
        minAge: null,
        maxAge: null,
        location: xecreto.location,
      });
    });
  });
  describe("DELETE Xecreto", () => {
    it("Should return error if  xecreto does not exists", async () => {
      const response = await request(app).delete("/xecreto/1234");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Xecreto not found",
      });
    });

    // it("Should return xperience after delete, activity should also be deleted", async () => {
    //   const xperiencia = {
    //     name: `activity ${Math.floor(Math.random() * 20)}`,
    //     description: `description ${Math.floor(Math.random() * 20)}`,
    //     location: `location ${Math.floor(Math.random() * 20)}`,
    //     isValidable: true,
    //     qrCode: `qrCode ${Math.floor(Math.random() * 20)}`,
    //   };

    //   const responsePost = await request(app)
    //     .post("/xperiencia")
    //     .send(xperiencia);

    //   const response = await request(app).delete(
    //     `/xperiencia/${responsePost.body.xperiencia.id}`
    //   );

    //   expect(response.status).toBe(200);
    //   expect(response.body.xperiencia).toMatchObject({
    //     qrCode: xperiencia.qrCode,
    //     isValidable: xperiencia.isValidable,
    //   });

    //   expect(response.body.xperiencia.activity).toMatchObject({
    //     id: responsePost.body.xperiencia.activity.id,
    //   });

    //   const activity = await Activity.findByPk(
    //     responsePost.body.xperiencia.activity.id
    //   );

    //   expect(activity).toBe(null);
    // });
  });
  describe("POST xecreto create", () => {
    it("Should create a new xecreto", async () => {
      const xecreto = {
        name: `xecreto ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: true,
        clues: [
          {
            text: "clue 1",
            correctAnswer: "answer 1",
          },
          {
            text: "clue 2",
            correctAnswer: "answer 2",
          },
        ],
      };

      const response = await request(app).post("/xecreto").send(xecreto);

      expect(response.status).toBe(200);
      expect(response.body.xecreto.clues).toMatchObject(xecreto.clues);

      expect(response.body.xecreto.activity).toMatchObject({
        location: xecreto.location,
      });
    });
    it("should not return error if clues are empty of not provided", async () => {
      const xecreto = {
        name: `xecreto ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: true,
      };

      const response = await request(app).post("/xecreto").send(xecreto);

      expect(response.status).toBe(200);
      expect(response.body.xecreto.clues).toMatchObject([]);
    });
  });
  describe("POST xecreto update", () => {
    it("Should return error if xecreto does not exists", async () => {
      const xecreto = {
        name: `activity 666`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: false,
        minAge: 5,
        maxAge: 0,
      };

      const response = await request(app)
        .post("/xecreto/666")
        .send(xecreto);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Xecreto not found",
      });
    });

    // it("Should modify a xecreto", async () => {
    //   const xperiencia = {
    //     name: `activity ${Math.floor(Math.random() * 20)}`,
    //     description: `description ${Math.floor(Math.random() * 20)}`,
    //     location: `location ${Math.floor(Math.random() * 20)}`,
    //     isValidable: false,
    //   };

    //   const responsePost = await request(app)
    //     .post("/xperiencia")
    //     .send(xperiencia);
    //   const newName = Math.random().toString(16).substring(2);
    //   const newDescription = Math.random().toString(16).substring(2);

    //   const response = await request(app)
    //     .post(`/xperiencia/${responsePost.body.xperiencia.id}`)
    //     .send({
    //       name: newName,
    //       description: newDescription,
    //     });

    //   expect(response.status).toBe(200);
    //   expect(response.body.xperiencia.activity.name).toBe(newName);
    //   expect(response.body.xperiencia.activity.description).toBe(
    //     newDescription
    //   );

    //   const responseGet = await request(app).post(
    //     `/xperiencia/${responsePost.body.xperiencia.id}`
    //   );
    //   console.debug(responseGet.body, "GET");
    //   expect(response.body).toMatchObject(responseGet.body);
    // });

    // it("Should return same object when no new values sent", async () => {
    //   const xperiencia = {
    //     name: `activity ${Math.floor(Math.random() * 20)}`,
    //     description: `description ${Math.floor(Math.random() * 20)}`,
    //     location: `location ${Math.floor(Math.random() * 20)}`,
    //     isValidable: false,
    //   };

    //   const responsePost = await request(app)
    //     .post("/xperiencia")
    //     .send(xperiencia);

    //   const response = await request(app)
    //     .post(`/xperiencia/${responsePost.body.xperiencia.id}`)
    //     .send(xperiencia);

    //   expect(response.status).toBe(200);
    //   expect(response.body).toMatchObject(responsePost.body);
    // });
  });
});
