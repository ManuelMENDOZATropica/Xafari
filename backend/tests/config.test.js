const { app, request } = require("./helpers");

function loadEnv(vars) {
  const saved = { ...process.env };
  Object.assign(process.env, vars);
  for (const [k, v] of Object.entries(vars)) if (v === undefined) delete process.env[k];
  let env;
  jest.isolateModules(() => {
    env = require("../config/env");
  });
  process.env = saved;
  return env;
}

describe("Configuración", () => {
  it("en producción exige JWT_SECRET, QR_SECRET y DATABASE_URL", () => {
    const env = loadEnv({ NODE_ENV: "production", JWT_SECRET: undefined, QR_SECRET: undefined, DATABASE_URL: undefined });
    expect(env.JWT_SECRET).toBeNull();
    const saved = { ...process.env };
    process.env.NODE_ENV = "production";
    delete process.env.JWT_SECRET;
    expect(() => env.assertProductionSecrets()).toThrow(/JWT_SECRET/);
    process.env = saved;
  });

  it("en producción Swagger está apagado y CORS solo permite la lista", () => {
    const env = loadEnv({ NODE_ENV: "production", CORS_ORIGINS: "https://a.com, https://b.com" });
    expect(env.ENABLE_DOCS).toBe(false);
    expect(env.CORS_ORIGINS).toEqual(["https://a.com", "https://b.com"]);
  });

  it("en desarrollo hay secretos por defecto", () => {
    const env = loadEnv({ NODE_ENV: "development", JWT_SECRET: undefined, QR_SECRET: undefined });
    expect(env.JWT_SECRET).toBeTruthy();
    expect(env.QR_SECRET).toBeTruthy();
  });
});

describe("CORS", () => {
  it("origen permitido recibe Access-Control-Allow-Origin; otro no", async () => {
    const ok = await request(app).get("/health").set("Origin", "http://localhost:5173");
    expect(ok.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
    const bad = await request(app).get("/health").set("Origin", "https://malo.com");
    expect(bad.headers["access-control-allow-origin"]).toBeUndefined();
    const pre = await request(app).options("/user").set("Origin", "http://localhost:5173");
    expect(pre.status).toBe(204);
  });
});
