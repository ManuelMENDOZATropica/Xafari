/**
 * Genera los PNG de QR de las actividades con código (por defecto, las placas
 * de Xecretos). Cada QR codifica `${PUBLIC_APP_URL}/q/<activityId>?k=<code>`,
 * con code = HMAC(QR_SECRET, activityId). Usa las actividades de la base a la
 * que apunte el entorno (DATABASE_URL o SQLite de desarrollo).
 *
 *   QR_SECRET=... PUBLIC_APP_URL=https://... DATABASE_URL=... npm run generate-qrs -- [--out <dir>] [--types Xecreto,Xperiencia]
 *
 * IMPORTANTE: genera con el QR_SECRET de PRODUCCIÓN para imprimir, y no
 * publiques los PNG en `frontend/public/` (quien los descargue tendría los
 * códigos). Por defecto salen en backend/qrcodes/ (ignorado por git).
 */
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const env = require("../config/env");
const database = require("../config/database");
const { Activity } = require("../models");
const { activityQrUrl } = require("../utils/tokens");

// Nombre de archivo de las placas: igual que los PNG anteriores.
const GUARDIANES = {
  xecreto1: "Mono", xecreto2: "Rana", xecreto3: "Jaguar", xecreto4: "Guacamaya", xecreto5: "Serpiente",
  xecreto6: "Venado", xecreto7: "Buho", xecreto8: "Mariposa", xecreto9: "Flamenco", xecreto10: "Coati",
};

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

async function main() {
  const out = path.resolve(arg("out", path.join(__dirname, "..", "qrcodes")));
  const types = arg("types", "Xecreto").split(",").map((s) => s.trim());
  if (!env.isProduction && !process.env.QR_SECRET) {
    console.warn("⚠  Usando QR_SECRET de desarrollo: estos QR NO sirven en producción.");
  }
  fs.mkdirSync(out, { recursive: true });

  const activities = await Activity.findAll({ where: { type: types }, order: [["name", "ASC"]] });
  const manifest = [];
  for (const a of activities) {
    const url = activityQrUrl(a.id);
    const file = `${a.name}${GUARDIANES[a.name] ? `_${GUARDIANES[a.name]}` : ""}.png`.replace(/[^\w.-]+/g, "_");
    // eslint-disable-next-line no-await-in-loop
    await QRCode.toFile(path.join(out, file), url, { width: 1024, margin: 2, errorCorrectionLevel: "M" });
    manifest.push({ name: a.name, type: a.type, activityId: a.id, file });
  }
  // El manifest no incluye la URL con el código, solo el nombre del archivo.
  fs.writeFileSync(path.join(out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`${manifest.length} QR generados en ${out} (base ${env.PUBLIC_APP_URL})`);
  await database.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
