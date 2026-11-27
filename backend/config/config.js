const fs = require("fs");
const logger = require("../utils/logger");

// Logs de SQL solo si se piden explícitamente (pueden incluir emails).
const sqlLogging =
  process.env.DB_LOGGING === "true" ? (msg) => logger.debug(msg) : false;

// SSL hacia Postgres:
// - DB_SSL=false        → sin SSL (Postgres local).
// - DB_SSL_CA=<ruta|PEM> → SSL verificando el certificado con esa CA.
// - por defecto          → SSL sin verificar el certificado (rejectUnauthorized:false).
//   Es el comportamiento histórico en Render: cifra el tráfico pero no protege
//   contra un MITM. Para verificarlo, define DB_SSL_CA con la CA del proveedor.
function sslOptions() {
  if (process.env.DB_SSL === "false") return {};
  const ca = process.env.DB_SSL_CA;
  if (ca) {
    const pem = ca.includes("BEGIN CERTIFICATE") ? ca : fs.readFileSync(ca, "utf8");
    return { ssl: { require: true, rejectUnauthorized: true, ca: pem } };
  }
  return { ssl: { require: true, rejectUnauthorized: false } };
}

const postgres = () => ({
  url: process.env.DATABASE_URL,
  dialect: "postgres",
  dialectOptions: sslOptions(),
  logging: sqlLogging,
  pool: {
    max: Number(process.env.DB_POOL_MAX || 10),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = {
  development: process.env.DATABASE_URL
    ? postgres()
    : {
        dialect: "sqlite",
        storage: process.env.SQLITE_STORAGE || "database.sqlite",
        logging: sqlLogging,
      },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
  production: postgres(),
};
