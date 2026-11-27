const jwt = require("jsonwebtoken");
const { app, request, createUser, createAdmin, auth } = require("./helpers");
const { FamilyTree, User } = require("../models");
const env = require("../config/env");

async function makeFamily(name = "Fam") {
  const owner = await createUser();
  const res = await request(app).post("/family-trees").set(auth(owner.token)).send({ name, adminId: "ignorado" });
  expect(res.status).toBe(201);
  return { owner, tree: res.body.familyTree };
}

async function invite(member, treeId) {
  const res = await request(app).post(`/family-trees/${treeId}/invite`).set(auth(member.token));
  expect(res.status).toBe(200);
  return res.body.inviteToken;
}

describe("Familia", () => {
  it("crea con el usuario del token como admin; no puede crear otra (409)", async () => {
    const { owner, tree } = await makeFamily();
    expect(tree.adminId).toBe(owner.user.id);
    expect(tree.members).toEqual([owner.user.id]);
    const again = await request(app).post("/family-trees").set(auth(owner.token)).send({ name: "Otra" });
    expect(again.status).toBe(409);
  });

  it("invitación firmada: unirse con inviteToken; token inválido/expirado/de otro tipo → 403", async () => {
    const { owner, tree } = await makeFamily();
    const token = await invite(owner, tree.id);
    const res = await request(app).post(`/family-trees/${tree.id}/invite`).set(auth(owner.token));
    expect(new Date(res.body.expiresAt).getTime()).toBeGreaterThan(Date.now() + 23 * 3600 * 1000);

    const guest = await createUser();
    expect((await request(app).post("/family-trees/join").set(auth(guest.token)).send({ inviteToken: "basura" })).status).toBe(403);
    // Un token de sesión no sirve como invitación
    expect((await request(app).post("/family-trees/join").set(auth(guest.token)).send({ inviteToken: owner.token })).status).toBe(403);
    const expired = jwt.sign({ typ: "family-invite", fid: tree.id, exp: Math.floor(Date.now() / 1000) - 10 }, env.JWT_SECRET);
    expect((await request(app).post("/family-trees/join").set(auth(guest.token)).send({ inviteToken: expired })).status).toBe(403);
    // Y una invitación no sirve como sesión
    expect((await request(app).get("/user").set(auth(token))).status).toBe(401);

    const joined = await request(app).post("/family-trees/join").set(auth(guest.token)).send({ inviteToken: token });
    expect(joined.status).toBe(200);
    expect(joined.body.familyTree.members).toContain(guest.user.id);
  });

  it("el id solo ya no basta para unirse (ruta vieja eliminada)", async () => {
    const { tree } = await makeFamily();
    const guest = await createUser();
    const res = await request(app).post(`/family-trees/${tree.id}/join`).set(auth(guest.token)).send({ userId: guest.user.id });
    expect([404, 400]).toContain(res.status);
    expect(await User.count({ where: { familyTreeId: tree.id } })).toBe(1);
  });

  it("no miembro no puede invitar ni ver la familia (403); miembros no ven datos sensibles", async () => {
    const { owner, tree } = await makeFamily();
    const outsider = await createUser();
    expect((await request(app).get(`/family-trees/${tree.id}`).set(auth(outsider.token))).status).toBe(403);
    expect((await request(app).post(`/family-trees/${tree.id}/invite`).set(auth(outsider.token))).status).toBe(403);

    const member = await createUser();
    await request(app).post("/family-trees/join").set(auth(member.token)).send({ inviteToken: await invite(owner, tree.id) });
    const res = await request(app).get(`/family-trees/${tree.id}`).set(auth(member.token));
    expect(res.status).toBe(200);
    const json = JSON.stringify(res.body);
    for (const field of ["email", "birthdate", "reservationNumber", "password", "tokenVersion", "role"]) {
      expect(json).not.toContain(`"${field}"`);
    }
    expect(res.body.users[0]).toHaveProperty("name");
    expect(res.body.users[0]).toHaveProperty("avatar");
    expect(res.body.users[0]).toHaveProperty("activities");
    // admin de la app sí puede verla
    const admin = await createAdmin();
    expect((await request(app).get(`/family-trees/${tree.id}`).set(auth(admin.token))).status).toBe(200);
  });

  it("máximo 6 miembros (el 7º → 409)", async () => {
    const { owner, tree } = await makeFamily();
    const token = await invite(owner, tree.id);
    for (let i = 0; i < 5; i += 1) {
      const u = await createUser();
      expect((await request(app).post("/family-trees/join").set(auth(u.token)).send({ inviteToken: token })).status).toBe(200);
    }
    const seventh = await createUser();
    const res = await request(app).post("/family-trees/join").set(auth(seventh.token)).send({ inviteToken: token });
    expect(res.status).toBe(409);
    expect(await User.count({ where: { familyTreeId: tree.id } })).toBe(6);
  });

  it("si el admin sale, se reasigna al miembro más antiguo; si sale el último, se borra el árbol", async () => {
    const { owner, tree } = await makeFamily();
    const m1 = await createUser();
    const token = await invite(owner, tree.id);
    await request(app).post("/family-trees/join").set(auth(m1.token)).send({ inviteToken: token });

    expect((await request(app).post("/family-trees/leave").set(auth(owner.token))).status).toBe(200);
    expect((await FamilyTree.findByPk(tree.id)).admin).toBe(m1.user.id);
    // el ex admin puede crear otra familia (antes daba 500)
    expect((await request(app).post("/family-trees").set(auth(owner.token)).send({ name: "Nueva" })).status).toBe(201);

    expect((await request(app).post("/family-trees/leave").set(auth(m1.token))).status).toBe(200);
    expect(await FamilyTree.findByPk(tree.id)).toBeNull();
    expect((await request(app).post("/family-trees/leave").set(auth(m1.token))).status).toBe(400);
  });

  it("unirse a otra familia saca de la anterior", async () => {
    const a = await makeFamily("A");
    const b = await makeFamily("B");
    await request(app).post("/family-trees/join").set(auth(a.owner.token)).send({ inviteToken: await invite(b.owner, b.tree.id) });
    expect(await FamilyTree.findByPk(a.tree.id)).toBeNull();
    expect((await User.findByPk(a.owner.user.id)).familyTreeId).toBe(b.tree.id);
  });

  it("PUT solo el admin del árbol y solo {name}", async () => {
    const { owner, tree } = await makeFamily();
    const m = await createUser();
    await request(app).post("/family-trees/join").set(auth(m.token)).send({ inviteToken: await invite(owner, tree.id) });
    expect((await request(app).put(`/family-trees/${tree.id}`).set(auth(m.token)).send({ name: "X" })).status).toBe(403);
    const res = await request(app).put(`/family-trees/${tree.id}`).set(auth(owner.token)).send({ name: "Renombrada", admin: m.user.id, members: [] });
    expect(res.status).toBe(200);
    expect(res.body.familyTree.name).toBe("Renombrada");
    expect(res.body.familyTree.adminId).toBe(owner.user.id);
    expect(res.body.familyTree.members).toHaveLength(2);
  });

  it("DELETE solo el admin del árbol", async () => {
    const { owner, tree } = await makeFamily();
    const outsider = await createUser();
    expect((await request(app).delete(`/family-trees/${tree.id}`).set(auth(outsider.token))).status).toBe(403);
    expect((await request(app).delete(`/family-trees/${tree.id}`).set(auth(owner.token))).status).toBe(200);
    expect((await User.findByPk(owner.user.id)).familyTreeId).toBeNull();
  });

  it("borrar la cuenta del admin reasigna el árbol", async () => {
    const { owner, tree } = await makeFamily();
    const m = await createUser();
    await request(app).post("/family-trees/join").set(auth(m.token)).send({ inviteToken: await invite(owner, tree.id) });
    expect((await request(app).delete("/user").set(auth(owner.token))).status).toBe(200);
    expect((await FamilyTree.findByPk(tree.id)).admin).toBe(m.user.id);
  });
});
