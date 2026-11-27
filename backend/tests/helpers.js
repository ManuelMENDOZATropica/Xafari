const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { signSession } = require("../utils/tokens");

let n = 0;

async function createUser(overrides = {}) {
  n += 1;
  const body = {
    name: `User${n}`,
    lastname: "Test",
    email: `user${n}_${Date.now()}@test.com`,
    password: "password123",
    birthdate: "1990-01-01T00:00:00.000Z",
    casa: "Casa Sol",
    avatar: { bodyOptions: 1 },
    ...overrides,
  };
  const res = await request(app).post("/users").send(body);
  if (res.status !== 201) throw new Error(`register failed ${res.status} ${JSON.stringify(res.body)}`);
  return { user: res.body.user, token: res.body.token, password: body.password, email: body.email };
}

async function createAdmin() {
  const { user } = await createUser();
  const admin = await User.findByPk(user.id);
  await admin.update({ role: "admin" });
  return { user, token: signSession(admin) };
}

const auth = (token) => ({ Authorization: `Bearer ${token}` });

module.exports = { app, request, createUser, createAdmin, auth };
