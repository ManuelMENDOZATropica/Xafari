const { app, request, createUser, createAdmin, auth } = require("./helpers");

const activity = (extra = {}) => ({
  name: `Act ${Math.random().toString(36).slice(2)}`,
  description: `Desc ${Math.random().toString(36).slice(2)}`,
  location: "Lugar",
  ...extra,
});

const RESOURCES = [
  { path: "/houses", key: "house", body: () => ({ name: `Casa ${Math.random()}`, animal: `A${Math.random()}`, element: `E${Math.random()}` }), update: { name: "Casa Renombrada" } },
  { path: "/xelfies", key: "xelfie", body: () => activity(), update: { location: "Otro lugar" } },
  { path: "/xperiencias", key: "xperiencia", body: () => activity({ isValidable: true, correctAnswer: "b" }), update: { location: "Otro lugar" } },
  { path: "/events", key: "event", body: () => activity({ startDate: "2026-01-01T00:00:00.000Z", endDate: "2026-12-31T00:00:00.000Z" }), update: { location: "Otro lugar" } },
  { path: "/xecretos", key: "xecreto", body: () => activity({ clues: [{ text: "¿Color?", correctAnswer: "Azul" }] }), update: { location: "Otro lugar" } },
];

describe.each(RESOURCES)("Catálogo $path", ({ path, key, body, update }) => {
  it("usuario normal no puede crear/editar/borrar (403)", async () => {
    const admin = await createAdmin();
    const user = await createUser();
    const created = await request(app).post(path).set(auth(admin.token)).send(body());
    const id = created.body[key].id;
    expect((await request(app).post(path).set(auth(user.token)).send(body())).status).toBe(403);
    expect((await request(app).put(`${path}/${id}`).set(auth(user.token)).send(update)).status).toBe(403);
    expect((await request(app).delete(`${path}/${id}`).set(auth(user.token))).status).toBe(403);
  });

  it("admin: CRUD completo y GET público", async () => {
    const admin = await createAdmin();
    const created = await request(app).post(path).set(auth(admin.token)).send(body());
    expect(created.status).toBe(201);
    const id = created.body[key].id;

    const got = await request(app).get(`${path}/${id}`);
    expect(got.status).toBe(200);
    expect(got.body[key].id).toBe(id);

    const list = await request(app).get(path);
    expect(list.body.map((x) => x.id)).toContain(id);

    const upd = await request(app).put(`${path}/${id}`).set(auth(admin.token)).send(update);
    expect(upd.status).toBe(200);
    expect(upd.body[key]).toMatchObject(update);

    expect((await request(app).delete(`${path}/${id}`).set(auth(admin.token))).status).toBe(200);
    expect((await request(app).get(`${path}/${id}`)).status).toBe(404);
  });

  it("404 si no existe, 400 si el id no es UUID o el body es inválido", async () => {
    const admin = await createAdmin();
    expect((await request(app).get(`${path}/00000000-0000-4000-8000-000000000000`)).status).toBe(404);
    expect((await request(app).get(`${path}/xyz`)).status).toBe(400);
    expect((await request(app).post(path).set(auth(admin.token)).send({})).status).toBe(400);
  });

  it("nombre duplicado → 409", async () => {
    const admin = await createAdmin();
    const b = body();
    await request(app).post(path).set(auth(admin.token)).send(b);
    const again = { ...body(), name: b.name };
    const res = await request(app).post(path).set(auth(admin.token)).send(again);
    expect(res.status).toBe(409);
  });
});

describe("Xecretos y Xperiencias sin respuestas", () => {
  it("GET /xecretos no expone correctAnswer; /check valida", async () => {
    const admin = await createAdmin();
    const user = await createUser();
    const created = await request(app).post("/xecretos").set(auth(admin.token)).send(activity({ clues: [{ text: "¿Color?", correctAnswer: "Azúl" }] }));
    const x = created.body.xecreto;
    expect(JSON.stringify(created.body)).not.toMatch(/correctAnswer|Azúl/);
    const list = await request(app).get("/xecretos");
    expect(JSON.stringify(list.body)).not.toMatch(/correctAnswer/);

    const clueId = x.clues[0].id;
    expect((await request(app).post(`/xecretos/${x.id}/check`).send({ clueId, answer: "azul" })).status).toBe(401);
    const ok = await request(app).post(`/xecretos/${x.id}/check`).set(auth(user.token)).send({ clueId, answer: " azul " });
    expect(ok.body).toEqual({ correct: true });
    const bad = await request(app).post(`/xecretos/${x.id}/check`).set(auth(user.token)).send({ clueId, answer: "rojo" });
    expect(bad.body).toEqual({ correct: false });
  });

  it("GET /xperiencias no expone correctAnswer", async () => {
    const admin = await createAdmin();
    await request(app).post("/xperiencias").set(auth(admin.token)).send(activity({ correctAnswer: "c" }));
    const list = await request(app).get("/xperiencias");
    expect(JSON.stringify(list.body)).not.toMatch(/correctAnswer/);
    expect(list.body[0].hasAnswer).toBe(true);
  });
});

describe("Eventos", () => {
  it("GET /events?activos=true solo devuelve los vigentes", async () => {
    const admin = await createAdmin();
    const now = Date.now();
    const vigente = activity({ startDate: new Date(now - 86400000).toISOString(), endDate: new Date(now + 86400000).toISOString() });
    const pasado = activity({ startDate: "2020-01-01T00:00:00.000Z", endDate: "2020-01-02T00:00:00.000Z" });
    await request(app).post("/events").set(auth(admin.token)).send(vigente);
    await request(app).post("/events").set(auth(admin.token)).send(pasado);
    const all = await request(app).get("/events");
    expect(all.body).toHaveLength(2);
    const act = await request(app).get("/events?activos=true");
    expect(act.body.map((e) => e.name)).toEqual([vigente.name]);
  });

  it("endDate antes de startDate → 400", async () => {
    const admin = await createAdmin();
    const res = await request(app).post("/events").set(auth(admin.token)).send(activity({ startDate: "2026-02-01T00:00:00.000Z", endDate: "2026-01-01T00:00:00.000Z" }));
    expect(res.status).toBe(400);
  });
});

describe("Logros (catálogo)", () => {
  it("admin crea logro ligado a actividad y casa; usuario → 403", async () => {
    const admin = await createAdmin();
    const user = await createUser();
    const house = (await request(app).post("/houses").set(auth(admin.token)).send({ name: "C", animal: "A", element: "E" })).body.house;
    const xelfie = (await request(app).post("/xelfies").set(auth(admin.token)).send(activity())).body.xelfie;
    const body = { name: "Logro", description: "D", type: "Amuleto", imageUrl: "https://x.com/a.png", activityId: xelfie.activityId, houseId: house.id };
    expect((await request(app).post("/achievements").set(auth(user.token)).send(body)).status).toBe(403);
    const res = await request(app).post("/achievements").set(auth(admin.token)).send(body);
    expect(res.status).toBe(201);
    expect(res.body.achievement).toMatchObject({ name: "Logro", houseId: house.id, activityId: xelfie.activityId });
    const bad = await request(app).post("/achievements").set(auth(admin.token)).send({ ...body, houseId: "00000000-0000-4000-8000-000000000000" });
    expect(bad.status).toBe(404);
    expect((await request(app).get("/achievements")).body).toHaveLength(1);
  });
});
