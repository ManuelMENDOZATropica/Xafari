#!/usr/bin/env node
/**
 * Lista las rutas de assets ("/carpeta/archivo.ext") referenciadas en src/ e
 * index.html que no existen en public/. Las rutas con ${...} se tratan como
 * comodín: basta con que exista al menos un archivo que coincida.
 *
 * Uso: node scripts/check-asset-refs.mjs   (sale con código 1 si falta algo)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const EXT = "png|jpe?g|webp|svg|gif|mp3|m4a|ogg|wav|woff2?|otf|ttf|json|mp4|webm|ico";
const REF = new RegExp(`["'\`(](/[^"'\`()\\n]*?\\.(?:${EXT}))(?=["'\`)?#])`, "g");

function walk(dir, filter) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p, filter);
    return filter(p) ? [p] : [];
  });
}

const publicFiles = new Set(
  walk(PUBLIC, () => true).map((p) => "/" + path.relative(PUBLIC, p).split(path.sep).join("/").normalize("NFC"))
);

const sources = [
  ...walk(path.join(ROOT, "src"), (p) => /\.(jsx?|css|json)$/.test(p)),
  path.join(ROOT, "index.html"),
];

let missing = 0;
for (const file of sources) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(REF)) {
    const ref = decodeURI(m[1]).normalize("NFC");
    let ok;
    if (ref.includes("${")) {
      const rx = new RegExp(
        "^" + ref.split(/\$\{[^}]*\}/).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".+") + "$"
      );
      ok = [...publicFiles].some((f) => rx.test(f));
    } else {
      ok = publicFiles.has(ref);
    }
    if (!ok) {
      missing++;
      const line = text.slice(0, m.index).split("\n").length;
      console.log(`${path.relative(ROOT, file)}:${line}  ${ref}`);
    }
  }
}
console.log(missing ? `\n${missing} referencias rotas` : "Sin referencias rotas");
process.exit(missing ? 1 : 0);
