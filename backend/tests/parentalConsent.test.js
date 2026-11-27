const { app, request, createUser, auth } = require("./helpers");
const { User } = require("../models");
const { ageOn } = require("../utils/time");

const yearsAgo = (n, dayShift = 0) => {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() - n);
  d.setUTCDate(d.getUTCDate() + dayShift);
  return d.toISOString().slice(0, 10);
};

const body = (extra) => ({
  name: "Menor",
  email: `menor${Math.random().toString(36).slice(2)}@test.com`,
  password: "password123",
  ...extra,
});

describe("Consentimiento parental", () => {
  it("menor sin parentalConsent → 400 parental_consent_required", async () => {
    const res = await request(app).post("/users").send(body({ birthdate: yearsAgo(11) }));
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("parental_consent_required");
    const res2 = await request(app).post("/users").send(body({ birthdate: yearsAgo(11), parentalConsent: false }));
    expect(res2.body.error).toBe("parental_consent_required");
  });

  it("parentalConsent no booleano → 400", async () => {
    const res = await request(app).post("/users").send(body({ birthdate: yearsAgo(11), parentalConsent: "true" }));
    expect(res.status).toBe(400);
  });

  it("menor con parentalConsent: true → 201, guarda parentalConsentAt y no lo expone", async () => {
    const before = Date.now();
    const res = await request(app).post("/users").send(body({ birthdate: yearsAgo(17, 1), parentalConsent: true }));
    expect(res.status).toBe(201);
    expect(JSON.stringify(res.body)).not.toMatch(/parentalConsent/);
    const stored = await User.findByPk(res.body.user.id);
    expect(stored.parentalConsentAt.getTime()).toBeGreaterThanOrEqual(before - 1000);
    const me = await request(app).get("/user").set(auth(res.body.token));
    expect(JSON.stringify(me.body)).not.toMatch(/parentalConsent/);
  });

  it("mayor de edad: el campo se ignora (no se guarda fecha)", async () => {
    const { user } = await createUser({ birthdate: yearsAgo(30), parentalConsent: true });
    expect((await User.findByPk(user.id)).parentalConsentAt).toBeNull();
    const { user: u2 } = await createUser({ birthdate: yearsAgo(18, -1) });
    expect((await User.findByPk(u2.id)).parentalConsentAt).toBeNull();
  });

  it("no se puede fijar parentalConsentAt desde PUT /user", async () => {
    const { token, user } = await createUser();
    await request(app).put("/user").set(auth(token)).send({ parentalConsentAt: "2020-01-01T00:00:00Z" });
    expect((await User.findByPk(user.id)).parentalConsentAt).toBeNull();
  });
});

describe("ageOn (America/Cancun)", () => {
  const now = new Date("2026-11-28T03:00:00Z"); // 27 nov 22:00 en Cancún
  it("cumple 18 hoy en Cancún aunque en UTC ya sea mañana", () => {
    expect(ageOn("2008-11-27", "America/Cancun", now)).toBe(18);
    expect(ageOn("2008-11-28", "America/Cancun", now)).toBe(17);
  });
});
