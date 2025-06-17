const request = require("supertest");
const app = require("../../../app");

const Activity = require("../../../models/activity");
const { Clue } = require("../../../models");

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

    it("Should return xecreto after delete, activity should also be deleted", async () => {
      const xecreto = {
        name: `xecreto ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
      };

      const responsePost = await request(app).post("/xecreto").send(xecreto);

      const response = await request(app).delete(
        `/xecreto/${responsePost.body.xecreto.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.xecreto).toMatchObject({
        clues: [],
      });

      expect(response.body.xecreto.activity).toMatchObject({
        id: responsePost.body.xecreto.activity.id,
      });

      const activity = await Activity.findByPk(
        responsePost.body.xecreto.activity.id
      );

      expect(activity).toBe(null);
    });
    it("Should return xecreto after delete, clues should also be deleted", async () => {
      const xecreto = {
        name: `xecreto ${Math.floor(Math.random() * 20)}`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        clues: [
          {
            text: "Clue 1 (delete)",
            correctAnswer: "answer 1",
          },
          {
            text: "Clue 2 (delete)",
            correctAnswer: "answer 2",
          },
        ],
      };

      const responsePost = await request(app).post("/xecreto").send(xecreto);

      const response = await request(app).delete(
        `/xecreto/${responsePost.body.xecreto.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.xecreto).toMatchObject({
        clues: [
          {
            text: "Clue 1 (delete)",
            correctAnswer: "answer 1",
          },
          {
            text: "Clue 2 (delete)",
            correctAnswer: "answer 2",
          },
        ],
      });

      expect(response.body.xecreto.activity).toMatchObject({
        id: responsePost.body.xecreto.activity.id,
      });

      const clue1 = await Clue.findByPk(responsePost.body.xecreto.clues[0].id);

      expect(clue1).toBe(null);

      const clue2 = await Clue.findByPk(responsePost.body.xecreto.clues[0].id);

      expect(clue2).toBe(null);
    });
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
        minAge: 0,
        maxAge: 5,
      };

      const response = await request(app).post("/xecreto/666").send(xecreto);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: "Xecreto not found",
      });
    });

    it("Should modify a xecreto activity", async () => {
      const xecreto = {
        name: `activity 666`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: false,
        minAge: 0,
        maxAge: 5,
      };

      const responsePost = await request(app).post("/xecreto").send(xecreto);

      const newName = Math.random().toString(16).substring(2);
      const newDescription = Math.random().toString(16).substring(2);

      const response = await request(app)
        .post(`/xecreto/${responsePost.body.xecreto.id}`)
        .send({
          name: newName,
          description: newDescription,
        });

      expect(response.status).toBe(200);
      expect(response.body.xecreto.activity.name).toBe(newName);
      expect(response.body.xecreto.activity.description).toBe(newDescription);
    });

    it("Should modify a xecreto clues", async () => {
      const xecreto = {
        name: `activity 666`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: false,
        minAge: 0,
        maxAge: 5,
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

      const response = await request(app)
        .post(`/xecreto/${responsePost.body.xecreto.id}`)
        .send({
          clues: [
            {
              text: "clue A",
              correctAnswer: "answer A",
            },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body.xecreto.clues[0].text).toBe("clue A");
      expect(response.body.xecreto.clues[0].correctAnswer).toBe("answer A");

      const clue1 = await Clue.findByPk(responsePost.body.xecreto.clues[0].id);
      const clue2 = await Clue.findByPk(responsePost.body.xecreto.clues[1].id);
      expect(clue1).toBe(null);
      expect(clue2).toBe(null);
    });

    it("Should not fail if no changes when updatign", async () => {
      const xecreto = {
        name: `activity 666`,
        description: `description ${Math.floor(Math.random() * 20)}`,
        location: `location ${Math.floor(Math.random() * 20)}`,
        isValidable: false,
        minAge: 0,
        maxAge: 5,
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

      const response = await request(app)
        .post(`/xecreto/${responsePost.body.xecreto.id}`)
        .send(xecreto);

      expect(responsePost.body.xecreto.clues).toMatchObject(
        response.body.xecreto.clues
      );
    });
  });
});
