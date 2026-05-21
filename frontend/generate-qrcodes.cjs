const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

const BASE_URL = "https://www.xafari.xcaret.com/xecreto/";

const GUARDIANS = {
  xecreto1:  "Mono",
  xecreto2:  "Rana",
  xecreto3:  "Jaguar",
  xecreto4:  "Guacamaya",
  xecreto5:  "Serpiente",
  xecreto6:  "Venado",
  xecreto7:  "Buho",
  xecreto8:  "Mariposa",
  xecreto9:  "Flamenco",
  xecreto10: "Coati",
};

const outDir = path.join(__dirname, "public", "qrcodes");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const OPTIONS = {
  errorCorrectionLevel: "H",   // Alta corrección — aguanta impresión deteriorada
  type: "png",
  width: 600,
  margin: 3,
  color: {
    dark: "#3D1A00",            // Café oscuro — coherente con la paleta Xafari
    light: "#F2E8DA",           // Crema — fondo de las cards
  },
};

(async () => {
  for (const [key, name] of Object.entries(GUARDIANS)) {
    const url  = `${BASE_URL}${key}`;
    const file = path.join(outDir, `${key}_${name}.png`);
    await QRCode.toFile(file, url, OPTIONS);
    console.log(`✅  ${key} — ${name}: ${file}`);
  }
  console.log("\n🎉  10 QR codes generados en frontend/public/qrcodes/");
})();
