const bcrypt = require("bcrypt");
const { app, request, createUser, createAdmin, auth } = require("./helpers");
const { User } = require("../models");

describe("Autenticación global", () => {
  it.each([
    ["get", "/user"],
    ["put", "/user"],
    ["get", "/users/00000000-0000-4000-8000-000000000000"],
    ["get", "/user-activities"],
    ["post", "/user-activities"],
    ["post", "/user-preferences"],
    ["post", "/user-xelfies"],
    ["get", "/user-achievements"],
    ["post", "/family-trees"],
    ["post", "/family-trees/join"],
    ["post", "/family-trees/leave"],
    ["post", "/houses"],
    ["delete", "/houses/00000000-0000-4000-8000-000000000000"],
    ["post", "/xecretos/00000000-0000-4000-8000-000000000000/check"],
    ["get", "/ruta-inexistente"],
  ])("%s %s sin token → 401", async (method, path) => {
    const res = await request(app)[method](path).send({});
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it("token inválido → 401", async () => {
    const res = await request(app).get("/user").set(auth("no-es-un-jwt"));
    expect(res.status).toBe(401);
  });

  it.each(["/health", "/activities", "/houses", "/xecretos", "/xelfies", "/xperiencias", "/events", "/achievements", "/leaderboard"])(
    "GET %s es público",
    async (path) => {
      const res = await request(app).get(path);
      expect(res.status).toBe(200);
    }
  );

  it("ruta inexistente con token → 404 JSON", async () => {
    const { token } = await createUser();
    const res = await request(app).get("/nope").set(auth(token));
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not found" });
  });

  it("JSON malformado → 400 sin stack", async () => {
    const res = await request(app).post("/login").set("Content-Type", "application/json").send("{mal");
    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).not.toMatch(/at .*\.js/);
  });
});

describe("Registro y login", () => {
  it("registra con email en minúsculas, sin password en la respuesta", async () => {
    const { user, token } = await createUser({ email: "MiXto@Test.COM" });
    expect(token).toBeDefined();
    expect(user.email).toBe("mixto@test.com");
    expect(user.password).toBeUndefined();
    expect(user.tokenVersion).toBeUndefined();
    expect(user.role).toBe("user");
    const stored = await User.scope("withPassword").findByPk(user.id);
    expect(stored.password).toMatch(/^\$2[aby]\$/);
  });

  it("ignora role del body", async () => {
    const { user } = await createUser({ role: "admin" });
    expect(user.role).toBe("user");
  });

  it("email duplicado (otra capitalización) → 409", async () => {
    await createUser({ email: "dup@test.com" });
    const res = await request(app).post("/users").send({
      name: "X", email: "DUP@test.com", password: "password123", birthdate: "1990-01-01",
    });
    expect(res.status).toBe(409);
  });

  it("password < 8 → 400", async () => {
    const res = await request(app).post("/users").send({
      name: "X", email: "short@test.com", password: "1234567", birthdate: "1990-01-01",
    });
    expect(res.status).toBe(400);
  });

  it("fecha inválida (31 feb) → 400", async () => {
    const res = await request(app).post("/users").send({
      name: "X", email: "feb@test.com", password: "password123", birthdate: "2010-02-31",
    });
    expect(res.status).toBe(400);
  });

  it("POST /login {} → 400", async () => {
    const res = await request(app).post("/login").send({});
    expect(res.status).toBe(400);
  });

  it("login sin distinguir mayúsculas", async () => {
    await createUser({ email: "case@test.com", password: "password123" });
    const res = await request(app).post("/login").send({ email: "CASE@Test.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("case@test.com");
  });

  it("login con password incorrecta → 401", async () => {
    const { email } = await createUser();
    const res = await request(app).post("/login").send({ email, password: "otra-cosa" });
    expect(res.status).toBe(401);
  });
});

describe("Perfil y contraseña", () => {
  it("PUT /user solo cambia campos de perfil", async () => {
    const { user, token } = await createUser({ casa: "Casa Sol" });
    const res = await request(app)
      .put("/user")
      .set(auth(token))
      .send({ ...user, name: "Nuevo", email: "hack@test.com", password: "hackhack1", casa: "Casa Luna", role: "admin", avatar: { bodyOptions: 3 } });
    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("Nuevo");
    expect(res.body.user.avatar).toEqual({ bodyOptions: 3 });
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.user.casa).toBe("Casa Sol");
    expect(res.body.user.role).toBe("user");
    const login = await request(app).post("/login").send({ email: user.email, password: "password123" });
    expect(login.status).toBe(200);
  });

  it("PUT /user/password hashea, invalida tokens viejos y devuelve uno nuevo", async () => {
    const { user, token, password } = await createUser();
    const bad = await request(app).put("/user/password").set(auth(token)).send({ currentPassword: "mala-mala", newPassword: "nuevapass1" });
    expect(bad.status).toBe(401);

    const short = await request(app).put("/user/password").set(auth(token)).send({ currentPassword: password, newPassword: "corta" });
    expect(short.status).toBe(400);

    const res = await request(app).put("/user/password").set(auth(token)).send({ currentPassword: password, newPassword: "nuevapass1" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();

    const stored = await User.scope("withPassword").findByPk(user.id);
    expect(stored.password).toMatch(/^\$2[aby]\$/);
    expect(await bcrypt.compare("nuevapass1", stored.password)).toBe(true);

    expect((await request(app).get("/user").set(auth(token))).status).toBe(401);
    expect((await request(app).get("/user").set(auth(res.body.token))).status).toBe(200);
    expect((await request(app).post("/login").send({ email: user.email, password: "nuevapass1" })).status).toBe(200);
  });

  it("el hook hashea la contraseña en cualquier update del modelo", async () => {
    const { user } = await createUser();
    await User.update({ password: "directa123" }, { where: { id: user.id } });
    const stored = await User.scope("withPassword").findByPk(user.id);
    expect(stored.password).toMatch(/^\$2[aby]\$/);
    expect(await stored.checkPassword("directa123")).toBe(true);
  });
});

describe("Dueño y admin", () => {
  it("GET /users/:id propio → 200; de otro → 403; admin → 200", async () => {
    const a = await createUser();
    const b = await createUser();
    const admin = await createAdmin();
    expect((await request(app).get(`/users/${a.user.id}`).set(auth(a.token))).status).toBe(200);
    const other = await request(app).get(`/users/${b.user.id}`).set(auth(a.token));
    expect(other.status).toBe(403);
    expect(other.body.email).toBeUndefined();
    expect((await request(app).get(`/users/${b.user.id}`).set(auth(admin.token))).status).toBe(200);
  });

  it("PUT/DELETE /users/:id de otro → 403", async () => {
    const a = await createUser();
    const b = await createUser();
    expect((await request(app).put(`/users/${b.user.id}`).set(auth(a.token)).send({ name: "X" })).status).toBe(403);
    expect((await request(app).delete(`/users/${b.user.id}`).set(auth(a.token))).status).toBe(403);
  });

  it("id no-UUID → 400", async () => {
    const a = await createUser();
    expect((await request(app).get("/users/1234").set(auth(a.token))).status).toBe(400);
    expect((await request(app).get("/houses/1234")).status).toBe(400);
  });

  it("DELETE /user borra la cuenta y su token deja de valer", async () => {
    const a = await createUser();
    expect((await request(app).delete("/user").set(auth(a.token))).status).toBe(200);
    expect((await request(app).get("/user").set(auth(a.token))).status).toBe(401);
  });
});
