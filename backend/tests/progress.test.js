const { app, request, createUser, createAdmin, auth } = require("./helpers");
const { seed } = require("../scripts/seed");
const { Activity, UserActivity, User } = require("../models");
const { activityCode, activityQrUrl, isValidActivityCode } = require("../utils/tokens");

const byName = (name) => Activity.findOne({ where: { name } });

describe("Códigos de QR", () => {
  it("HMAC de 16 caracteres base64url, distinto por actividad", () => {
    const a = activityCode("11111111-1111-4111-8111-111111111111");
    const b = activityCode("22222222-2222-4222-8222-222222222222");
    expect(a).toMatch(/^[A-Za-z0-9_-]{16}$/);
    expect(a).not.toBe(b);
    expect(isValidActivityCode("11111111-1111-4111-8111-111111111111", a)).toBe(true);
    expect(isValidActivityCode("11111111-1111-4111-8111-111111111111", b)).toBe(false);
    expect(activityQrUrl("11111111-1111-4111-8111-111111111111")).toBe(
      `https://xafari-phi.vercel.app/q/11111111-1111-4111-8111-111111111111?k=${a}`
    );
  });
});

describe("POST /user-activities", () => {
  beforeEach(() => seed());

  it("checklist (Event) sin code: 201 y luego 200 idempotente; userId del body se ignora", async () => {
    const me = await createUser();
    const other = await createUser();
    const act = await byName("ceviche");
    const first = await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id, userId: other.user.id });
    expect(first.status).toBe(201);
    expect(first.body.userActivity.userId).toBe(me.user.id);
    expect(first.body.userActivity.completedAt).toBeTruthy();
    const again = await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id });
    expect(again.status).toBe(200);
    expect(again.body.userActivity.id).toBe(first.body.userActivity.id);
    expect(await UserActivity.count({ where: { userId: other.user.id } })).toBe(0);
  });

  it("completedAt lo pone el servidor", async () => {
    const me = await createUser();
    const act = await byName("ramen");
    const res = await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id, completedAt: "2000-01-01T00:00:00Z" });
    expect(new Date(res.body.userActivity.completedAt).getFullYear()).toBeGreaterThan(2020);
  });

  it("Xecreto: sin code o con code inválido → 403 invalid_code; con code válido → 201", async () => {
    const me = await createUser();
    const act = await byName("xecreto3");
    const none = await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id });
    expect(none.status).toBe(403);
    expect(none.body.error).toBe("invalid_code");
    const otherCode = activityCode((await byName("xecreto4")).id);
    const bad = await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id, code: otherCode });
    expect(bad.status).toBe(403);
    expect(bad.body.error).toBe("invalid_code");
    const ok = await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id, code: activityCode(act.id) });
    expect(ok.status).toBe(201);
  });

  it("Xperiencia: respuesta incorrecta → 400 wrong_answer y luego 429 cooldown; correcta tras el cooldown → 201", async () => {
    const me = await createUser();
    const act = await byName("vinil"); // respuesta "b"
    const noAnswer = await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id });
    expect(noAnswer.status).toBe(400);
    expect(noAnswer.body.error).toBe("answer_required");

    const wrong = await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id, answer: "a" });
    expect(wrong.status).toBe(400);
    expect(wrong.body).toMatchObject({ error: "wrong_answer", retryAfter: 180 });

    const blocked = await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id, answer: "b" });
    expect(blocked.status).toBe(429);
    expect(blocked.body.error).toBe("cooldown");
    expect(blocked.body.retryAfter).toBeGreaterThan(0);

    await UserActivity.update({ startedAt: new Date(Date.now() - 181000) }, { where: { userId: me.user.id, activityId: act.id } });
    const ok = await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id, answer: "B" });
    expect(ok.status).toBe(201);
  });

  it("actividad inexistente → 404; activityId no-UUID → 400", async () => {
    const me = await createUser();
    expect((await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: "00000000-0000-4000-8000-000000000000" })).status).toBe(404);
    expect((await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: "x" })).status).toBe(400);
  });

  it("GET /user-activities y /user-activities/:activityId del propio usuario", async () => {
    const me = await createUser();
    const act = await byName("sushi");
    await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id });
    const list = await request(app).get("/user-activities").set(auth(me.token));
    expect(list.body).toHaveLength(1);
    const one = await request(app).get(`/user-activities/${act.id}`).set(auth(me.token));
    expect(one.status).toBe(200);
    expect(one.body.userActivity.activityId).toBe(act.id);
    const other = await createUser();
    expect((await request(app).get(`/user-activities/${act.id}`).set(auth(other.token))).status).toBe(404);
  });

  it("GET /users/:id incluye las actividades completadas", async () => {
    const me = await createUser();
    const act = await byName("mezcal");
    await request(app).post("/user-activities").set(auth(me.token)).send({ activityId: act.id });
    const res = await request(app).get(`/users/${me.user.id}`).set(auth(me.token));
    const found = res.body.user.activities.find((a) => a.name === "mezcal");
    expect(found.userActivity.completedAt).toBeTruthy();
    expect(res.body.user.password).toBeUndefined();
  });
});

describe("Preferencias, xelfies y logros de usuario", () => {
  beforeEach(() => seed());

  it("POST /user-preferences hace upsert; PUT/DELETE solo las propias", async () => {
    const me = await createUser();
    const other = await createUser();
    const act = await byName("kayak");
    const c = await request(app).post("/user-preferences").set(auth(me.token)).send({ activityId: act.id, rating: 4, comment: "x", userId: other.user.id });
    expect(c.status).toBe(201);
    expect(c.body.userId).toBe(me.user.id);
    const u = await request(app).post("/user-preferences").set(auth(me.token)).send({ activityId: act.id, rating: 5 });
    expect(u.status).toBe(200);
    expect(u.body).toMatchObject({ id: c.body.id, rating: 5 });
    expect((await request(app).post("/user-preferences").set(auth(me.token)).send({ activityId: act.id, rating: 9 })).status).toBe(400);
    expect((await request(app).put(`/user-preferences/${c.body.id}`).set(auth(other.token)).send({ rating: 1 })).status).toBe(404);
    expect((await request(app).put(`/user-preferences/${c.body.id}`).set(auth(me.token)).send({ rating: 2 })).body.rating).toBe(2);
    expect((await request(app).delete(`/user-preferences/${c.body.id}`).set(auth(me.token))).status).toBe(200);
  });

  it("user-xelfies: crea, completa la actividad, edita y borra por xelfieId", async () => {
    const me = await createUser();
    const xelfies = (await request(app).get("/xelfies")).body;
    const x = xelfies[0];
    const c = await request(app).post("/user-xelfies").set(auth(me.token)).send({ xelfieId: x.id, xelfieUrl: "https://cdn.test/1.jpg" });
    expect(c.status).toBe(201);
    const ua = await UserActivity.findOne({ where: { userId: me.user.id, activityId: x.activityId } });
    expect(ua.completedAt).toBeTruthy();
    const dup = await request(app).post("/user-xelfies").set(auth(me.token)).send({ xelfieId: x.id, xelfieUrl: "https://cdn.test/2.jpg" });
    expect(dup.status).toBe(409);
    const u = await request(app).put(`/user-xelfies/${x.id}`).set(auth(me.token)).send({ xelfieUrl: "https://cdn.test/3.jpg" });
    expect(u.status).toBe(200);
    expect(u.body.userXelfie.xelfieUrl).toBe("https://cdn.test/3.jpg");
    expect((await request(app).delete(`/user-xelfies/${x.id}`).set(auth(me.token))).status).toBe(200);
    expect((await request(app).delete(`/user-xelfies/${x.id}`).set(auth(me.token))).status).toBe(404);
  });

  it("user-achievements: solo admin otorga; amount negativo 400; repetido 409", async () => {
    const admin = await createAdmin();
    const me = await createUser();
    const house = (await request(app).get("/houses")).body[0];
    const act = await byName("kayak");
    const ach = (await request(app).post("/achievements").set(auth(admin.token)).send({ name: "L", description: "D", type: "Follaje", imageUrl: "https://x.com/l.png", activityId: act.id, houseId: house.id })).body.achievement;

    expect((await request(app).post(`/user-achievements/${me.user.id}`).set(auth(me.token)).send({ achievementId: ach.id })).status).toBe(403);
    expect((await request(app).post(`/user-achievements/${me.user.id}`).set(auth(admin.token)).send({ achievementId: ach.id, amount: -3 })).status).toBe(400);
    const ok = await request(app).post(`/user-achievements/${me.user.id}`).set(auth(admin.token)).send({ achievementId: ach.id, amount: 2 });
    expect(ok.status).toBe(201);
    expect((await request(app).post(`/user-achievements/${me.user.id}`).set(auth(admin.token)).send({ achievementId: ach.id })).status).toBe(409);
    expect((await request(app).put(`/user-achievements/${me.user.id}/${ach.id}`).set(auth(admin.token)).send({ amount: 5 })).body.userAchievement.amount).toBe(5);
    const mine = await request(app).get("/user-achievements").set(auth(me.token));
    expect(mine.body).toHaveLength(1);
    expect((await request(app).delete(`/user-achievements/${me.user.id}/${ach.id}`).set(auth(admin.token))).status).toBe(200);
  });
});

describe("Leaderboard", () => {
  beforeEach(() => seed());

  async function complete(token, name) {
    const act = await byName(name);
    const body = { activityId: act.id };
    if (act.type === "Xecreto") body.code = activityCode(act.id);
    if (act.type === "Xperiencia") body.answer = { kayak: "a", vinil: "b", caracola: "c" }[name];
    const res = await request(app).post("/user-activities").set(auth(token)).send(body);
    expect([200, 201]).toContain(res.status);
  }

  it("sin ids, con puntos, ordenado y esYo solo con token", async () => {
    const a = await createUser({ name: "Ana", casa: "Casa Sol" });
    const b = await createUser({ name: "Beto", casa: "Casa Luna" });
    await complete(a.token, "kayak");
    await complete(a.token, "xecreto1");
    await complete(b.token, "vinil");
    await complete(b.token, "ceviche"); // checklist no suma

    const anon = await request(app).get("/leaderboard?periodo=total");
    expect(anon.status).toBe(200);
    expect(anon.body).toHaveLength(2);
    expect(anon.body[0]).toMatchObject({ nombre: "Ana", casa: "Casa Sol", puntos: 2, xperiencias: 1, xecretos: 1, xelfies: 0 });
    expect(anon.body[1]).toMatchObject({ nombre: "Beto", puntos: 1 });
    for (const row of anon.body) {
      expect(row.id).toBeUndefined();
      expect(row.email).toBeUndefined();
      expect(row.esYo).toBeUndefined();
    }
    expect(JSON.stringify(anon.body)).not.toContain(a.user.id);

    const mine = await request(app).get("/leaderboard?periodo=hoy").set(auth(b.token));
    expect(mine.body.find((r) => r.nombre === "Beto").esYo).toBe(true);
    expect(mine.body.find((r) => r.nombre === "Ana").esYo).toBeUndefined();

    expect((await request(app).get("/leaderboard?periodo=mes")).body).toHaveLength(2);
    expect((await request(app).get("/leaderboard?periodo=siempre")).body).toHaveLength(2);
    expect((await request(app).get("/leaderboard?periodo=semana")).status).toBe(400);
  });

  it("'hoy' usa la medianoche de Cancún", async () => {
    const a = await createUser({ name: "Caro" });
    await complete(a.token, "caracola");
    // Completada "ayer" en Cancún → no cuenta para hoy, sí para total.
    await UserActivity.update({ completedAt: new Date(Date.now() - 2 * 86400000) }, { where: { userId: a.user.id } });
    expect((await request(app).get("/leaderboard?periodo=hoy")).body).toHaveLength(0);
    expect((await request(app).get("/leaderboard?periodo=total")).body).toHaveLength(1);
  });
});

describe("Seed", () => {
  it("es idempotente y crea filas de events para el checklist", async () => {
    await seed();
    const count1 = await Activity.count();
    await seed();
    expect(await Activity.count()).toBe(count1);
    const events = (await request(app).get("/events?activos=true")).body;
    expect(events).toHaveLength(20);
    expect(count1).toBe(55);
    expect(await User.count()).toBe(0);
  });
});
