const request = require("supertest");
const app = require("../../../app");

const Xelfie = require("../../../models/xelfie");
const Activity = require("../../../models/activity");

describe("Xelfie route", () => {
  it("Should return error if xelfie does not exists", async () => {
    const response = await request(app).delete("/xelfie/1234");

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: "Xelfie not found",
    });
  });

  it("Should return xelfie after delete, activity should also be deleted", async () => {
    const xelfie = {
      name: `activity ${Math.floor(Math.random() * 20)}`,
      description: `description ${Math.floor(Math.random() * 20)}`,
      location: `location ${Math.floor(Math.random() * 20)}`,
    };

    const responsePost = await request(app).post("/xelfie").send(xelfie);

    const response = await request(app).delete(
      `/xelfie/${responsePost.body.xelfie.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.xelfie.activity.description).toBe(xelfie.description);
    expect(response.body.xelfie.activity.location).toBe(xelfie.location);

    expect(response.body.xelfie.activity).toMatchObject({
      id: responsePost.body.xelfie.activity.id,
    });

    const activity = await Activity.findByPk(
      responsePost.body.xelfie.activity.id
    );

    expect(activity).toBe(null);
  });
});
describe("POST xelfie create", () => {
  it("Should create a new xelfie", async () => {
    const xelfie = {
      name: `activity ${Math.floor(Math.random() * 20)}`,
      description: `description ${Math.floor(Math.random() * 20)}`,
      location: `location ${Math.floor(Math.random() * 20)}`,
    };

    const response = await request(app).post("/xelfie").send(xelfie);

    expect(response.status).toBe(200);

    expect(response.body.xelfie.activity).toMatchObject({
      location: xelfie.location,
      description: xelfie.description,
    });
  });

  it("Should modify a xelfie", async () => {
    const xelfie = {
      name: `xelfie 666`,
      description: `description ${Math.floor(Math.random() * 20)}`,
      location: `location ${Math.floor(Math.random() * 20)}`,
      isValidable: false,
    };

    const responsePost = await request(app).post("/xelfie").send(xelfie);

    const newName = Math.random().toString(16).substring(2);
    const newDescription = Math.random().toString(16).substring(2);

    const response = await request(app)
      .post(`/xelfie/${responsePost.body.xelfie.id}`)
      .send({
        name: newName,
        description: newDescription,
      });

    expect(response.status).toBe(200);
    expect(response.body.xelfie.activity.name).toBe(newName);
    expect(response.body.xelfie.activity.description).toBe(newDescription);

    const responseGet = await request(app).post(
      `/xelfie/${responsePost.body.xelfie.id}`
    );
    expect(response.body).toMatchObject(responseGet.body);
  });
});
describe("POST xelfie update", () => {
  it("Should return error if xelfie does not exists", async () => {
    const xelfie = {
      name: `xelfie 666`,
      description: `description ${Math.floor(Math.random() * 20)}`,
      location: `location ${Math.floor(Math.random() * 20)}`,
      isValidable: false,
      minAge: 0,
      maxAge: 5,
    };

    const response = await request(app).post("/xelfie/666").send(xelfie);

    console.debug("XELFIE", response.body);
    expect(response.status).toBe(404);

    expect(response.body).toMatchObject({
      error: "Xelfie not found",
    });
  });
});
