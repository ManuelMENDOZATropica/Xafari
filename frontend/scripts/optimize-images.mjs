#!/usr/bin/env node
/**
 * Optimiza las imágenes de public/ (PNG/JPG → WebP) y recorta las capas del
 * árbol que vienen a lienzo completo.
 *
 * Uso:
 *   node scripts/optimize-images.mjs            # convierte y borra los originales
 *   node scripts/optimize-images.mjs --keep     # convierte sin borrar originales
 *   node scripts/optimize-images.mjs --dry      # solo muestra qué haría
 *
 * Es idempotente: solo procesa los PNG/JPG que sigan en public/. Si quieres
 * regenerar desde los originales, restáuralos con git (están en el historial)
 * y vuelve a correrlo.
 *
 * Reglas:
 *  - Nombres de salida en ASCII (sin acentos, espacios ni paréntesis) para
 *    evitar líos de normalización Unicode (NFC/NFD) entre macOS y Vercel.
 *  - Las capas del árbol a lienzo completo (2475×4200: checklist y flores) se
 *    recortan a su bounding box. Sus posiciones (en % del canvas del árbol,
 *    2450×4200 con object-contain, igual que antes) se escriben en
 *    src/data/arbolCapas.json.
 *  - Cada carpeta tiene un tamaño máximo según cómo se muestra en la app.
 *
 * Sonidos y fuentes (no los hace este script):
 *   ffmpeg -i x.ogg -codec:a libmp3lame -b:a 128k x.mp3
 *   fonttools ttLib.woff2 compress "Apercu Pro Bold.otf" -o apercu-pro-bold.woff2
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const LAYERS_JSON = path.join(ROOT, "src", "data", "arbolCapas.json");

const KEEP = process.argv.includes("--keep");
const DRY = process.argv.includes("--dry");

// Canvas del árbol en TreeCanvasIndividual / TreeCanvasFamilia
const TREE_CANVAS = { width: 2450, height: 4200 };

// Carpetas que no se tocan
const SKIP_DIRS = new Set([
  "qrcodes", // los genera el backend
  "models",
  "iconos", // íconos pequeños (< 100 KB), se quedan en PNG/SVG
  "fonts",
  "sounds",
  "xecretos",
]);

const GUARDIANES = {
  "Mono Casa Vida": "mono",
  "Rana Casa Agua": "rana",
  "Jaguar Casa Sol": "jaguar",
  "Guacamaya Casa Fuego": "guacamaya",
  "Serpiente Casa Espiral": "serpiente",
  "Venado Casa Tierra": "venado",
  "Búho Casa Eclipse": "buho",
  "Mariposa Casa Viento": "mariposa",
  "Flamenco Casa Sol": "flamenco",
  "Coatí Casa Luna.png": "coati", // el original se llama "...Luna.png.png"
  "Coatí Casa Luna": "coati",
  Coati: "coati",
};

// Insignias Xtop del árbol → nombre de la actividad (activity.name en BD)
const XTOP = {
  "Insignia Xiquit inn": "camion",
  "Insignia Muluk spa": "caracola",
  "Insignia Lunateca": "conejo",
  "Insignia Pava Jarla": "drink",
  "Insignias Dixtrito 1317": "estrella",
  "Insignia Kayak": "kayak",
  "Insignia Paxanguería": "mascarajaguar",
  "Insignia Patín": "patin",
  "Insignia Rooftop Fuego": "piscina",
  "Insignia pool poh": "poolpo",
  "Insignia infinity pool": "salvavidas",
  "Insignia Teatro del Río": "teatro",
  "Insignia Tobogan Arboloco": "tobogan",
  "Insignia Bar las maquinitas": "tv",
  "Insignia Vinil": "vinil",
  "Insignias Xoberte": "xorbeteria",
  "Insignia Xpiral": "xpiral",
};

/** Regla por carpeta (ruta relativa a public/, con "/"). La primera que coincida gana. */
const RULES = [
  { match: /^arbol\/checklist\//, layer: "checklist" },
  { match: /^arbol\/flores[^/]*\//, layer: "flores", outDir: "arbol/flores" },
  { match: /^arbol\/guardianes\//, max: [600, 600], rename: GUARDIANES },
  { match: /^arbol\/xtop\//, max: [600, 720], rename: XTOP },
  { match: /^arbol\/Arbol de la vida 1\./, max: [1400, 4000], name: "arbol" },
  { match: /^arbol\//, max: [1400, 2400] },
  { match: /^guardianes\//, max: [700, 1000], rename: GUARDIANES },
  // Capas del avatar: misma reducción para todas (las caras se alinean al cuerpo por %)
  { match: /^avatares\//, max: [750, 900] },
  { match: /^img\//, max: [1400, 2400] },
  { match: /^intro\//, max: [1320, 2868] },
  { match: /^maya\//, max: [900, 900] },
  { match: /^mapa\//, max: [1800, 1800] },
  { match: /./, max: [1400, 2400] },
];

const WEBP_ALPHA = { quality: 88, alphaQuality: 95, effort: 6, smartSubsample: true };
const WEBP_OPAQUE = { quality: 85, effort: 6, smartSubsample: true };

function slug(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\.png$/i, "")
    .replace(/[\s()]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function walk(dir, rel = "") {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!rel && SKIP_DIRS.has(entry.name)) continue;
      out.push(...walk(path.join(dir, entry.name), r));
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      out.push(r.normalize("NFC"));
    }
  }
  return out;
}

// Encuentra la ruta real en disco aunque el nombre esté en NFD
function realPath(relNFC) {
  const parts = relNFC.split("/");
  let cur = PUBLIC;
  for (const p of parts) {
    const hit = fs.readdirSync(cur).find((n) => n.normalize("NFC") === p);
    cur = path.join(cur, hit ?? p);
  }
  return cur;
}

const pct = (v, total) => Number(((v / total) * 100).toFixed(4));

async function processLayer(src, rule, rel, layers) {
  const img = sharp(src);
  const meta = await img.metadata();
  // trim() recorta el borde transparente → info.trimOffsetLeft/Top (negativos)
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });
  const x = -(info.trimOffsetLeft ?? 0);
  const y = -(info.trimOffsetTop ?? 0);
  const w = info.width;
  const h = info.height;

  // Mapeo object-contain del lienzo original al canvas del árbol
  const s = Math.min(TREE_CANVAS.width / meta.width, TREE_CANVAS.height / meta.height);
  const offX = (TREE_CANVAS.width - meta.width * s) / 2;
  const offY = (TREE_CANVAS.height - meta.height * s) / 2;

  const base = slug(path.basename(rel).replace(/\.[^.]+$/, "")).toLowerCase();
  const outRel = `${rule.outDir ?? path.dirname(rel)}/${base}.webp`;
  layers[rule.layer] ??= {};
  layers[rule.layer][base] = {
    src: `/${outRel}`,
    left: pct(offX + x * s, TREE_CANVAS.width),
    top: pct(offY + y * s, TREE_CANVAS.height),
    width: pct(w * s, TREE_CANVAS.width),
    height: pct(h * s, TREE_CANVAS.height),
  };
  if (!DRY) {
    fs.mkdirSync(path.join(PUBLIC, path.dirname(outRel)), { recursive: true });
    await sharp(data).webp(WEBP_ALPHA).toFile(path.join(PUBLIC, outRel));
  }
  return { outRel, dims: `${meta.width}×${meta.height} → ${w}×${h} @(${x},${y})` };
}

const produced = new Set();

async function processImage(src, rule, rel) {
  const meta = await sharp(src).metadata();
  const stem = path.basename(rel).replace(/\.[^.]+$/, "");
  let name = rule.name ?? rule.rename?.[stem.normalize("NFC")] ?? slug(stem);
  // Dos originales con el mismo nombre y distinta extensión (p. ej. .jpg y .png)
  if (produced.has(`${path.dirname(rel)}/${name}`)) name += `-${path.extname(rel).slice(1).toLowerCase()}`;
  produced.add(`${path.dirname(rel)}/${name}`);
  const outRel = `${path.dirname(rel)}/${name}.webp`;
  let pipeline = sharp(src);
  const [mw, mh] = rule.max;
  if (meta.width > mw || meta.height > mh) {
    pipeline = pipeline.resize({ width: mw, height: mh, fit: "inside", withoutEnlargement: true, kernel: "lanczos3" });
  }
  pipeline = pipeline.webp(meta.hasAlpha ? WEBP_ALPHA : WEBP_OPAQUE);
  let dims = `${meta.width}×${meta.height}`;
  if (!DRY) {
    const info = await pipeline.toFile(path.join(PUBLIC, outRel));
    dims += ` → ${info.width}×${info.height}`;
  }
  return { outRel, dims };
}

async function main() {
  const files = walk(PUBLIC);
  let layers = {};
  if (fs.existsSync(LAYERS_JSON)) {
    const prev = JSON.parse(fs.readFileSync(LAYERS_JSON, "utf8"));
    layers = { checklist: prev.checklist, flores: prev.flores };
  }
  let before = 0;
  let after = 0;
  for (const rel of files) {
    const rule = RULES.find((r) => r.match.test(rel));
    const src = realPath(rel);
    const size = fs.statSync(src).size;
    const res = rule.layer
      ? await processLayer(src, rule, rel, layers)
      : await processImage(src, rule, rel);
    const outSize = DRY ? 0 : fs.statSync(path.join(PUBLIC, res.outRel)).size;
    before += size;
    after += outSize;
    console.log(`${rel} (${(size / 1024).toFixed(0)} KB) → ${res.outRel} (${(outSize / 1024).toFixed(0)} KB) ${res.dims}`);
    if (!DRY && !KEEP && path.join(PUBLIC, res.outRel) !== src) fs.unlinkSync(src);
  }
  if (!DRY) {
    fs.mkdirSync(path.dirname(LAYERS_JSON), { recursive: true });
    fs.writeFileSync(
      LAYERS_JSON,
      JSON.stringify(
        {
          _nota: "Generado por scripts/optimize-images.mjs. Posiciones en % del canvas del árbol (2450×4200).",
          checklist: layers.checklist ?? {},
          flores: layers.flores ?? {},
        },
        null,
        2
      ) + "\n"
    );
  }
  console.log(`\n${files.length} archivos: ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
