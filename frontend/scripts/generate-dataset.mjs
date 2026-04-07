/**
 * generate-dataset.mjs
 *
 * Generates an augmented PNG dataset from the glyph SVGs for TensorFlow.js training.
 *
 * KEY IMPROVEMENTS over v1:
 *  - "none" class now uses photographic-looking backgrounds (walls, floors, foliage, skin)
 *    to match what real camera footage looks like — eliminates false positives
 *  - Glyph samples use the same photographic backgrounds for consistency
 *  - More samples per class (250) for better generalization
 *  - Added partial/edge crops of glyphs to train robustness to framing
 *
 * Usage:  node scripts/generate-dataset.mjs
 * Output: scripts/dataset/<class_name>/*.png  (48x48 each)
 */

import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Configuration ──────────────────────────────────────────────────────────
const IMG_SIZE        = 48;   // must match train-model.mjs and useGlyphRecognizer.js
const SAMPLES_PER_GLYPH = 250;
const NONE_SAMPLES    = 600;  // more "none" samples — the hardest class to learn

const GLYPHS = [
  { file: "Recurso 2.svg",  label: "venado" },
  { file: "Recurso 3.svg",  label: "serpiente" },
  { file: "Recurso 4.svg",  label: "mariposa" },
  { file: "Recurso 5.svg",  label: "rana" },
  { file: "Recurso 6.svg",  label: "jaguar" },
  { file: "Recurso 7.svg",  label: "coati" },
  { file: "Recurso 8.svg",  label: "buho" },
  { file: "Recurso 9.svg",  label: "mono" },
  { file: "Recurso 10.svg", label: "flamenco" },
];

const GLIFOS_DIR = path.resolve(__dirname, "../public/xecretos/glifos");
const OUTPUT_DIR = path.resolve(__dirname, "dataset");

// ─── Utility ────────────────────────────────────────────────────────────────
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function randChoice(arr) { return arr[randInt(0, arr.length - 1)]; }

function addNoise(ctx, intensity = 0.15) {
  const imageData = ctx.getImageData(0, 0, IMG_SIZE, IMG_SIZE);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < intensity) {
      const noise = randInt(-40, 40);
      data[i]     = Math.min(255, Math.max(0, data[i]     + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// ─── REALISTIC background generator ─────────────────────────────────────────
// Simulates: walls, floors, jungle foliage, skin, concrete, wood
function drawRealisticBackground(ctx) {
  const kind = randInt(0, 9);

  if (kind === 0) {
    // Plain painted wall — off-white, beige, cream
    const h = randInt(20, 50);
    const s = randInt(5, 30);
    const l = randInt(75, 95);
    ctx.fillStyle = `hsl(${h},${s}%,${l}%)`;
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
    // subtle texture
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(0,0,0,${rand(0, 0.04)})`;
      ctx.fillRect(randInt(0, IMG_SIZE), randInt(0, IMG_SIZE), 1, 1);
    }

  } else if (kind === 1) {
    // Concrete / stone — gray gradient
    const g = ctx.createLinearGradient(0, 0, IMG_SIZE, IMG_SIZE);
    const base = randInt(110, 180);
    g.addColorStop(0, `rgb(${base},${base},${base - 5})`);
    g.addColorStop(1, `rgb(${base - 20},${base - 20},${base - 15})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
    addNoise(ctx, 0.4);

  } else if (kind === 2) {
    // Wood plank — warm brown horizontal stripes
    const baseH = randInt(20, 40);
    ctx.fillStyle = `hsl(${baseH},${randInt(40,65)}%,${randInt(25,45)}%)`;
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
    const numPlanks = randInt(3, 8);
    for (let p = 0; p < numPlanks; p++) {
      const y = (IMG_SIZE / numPlanks) * p + rand(-2, 2);
      ctx.strokeStyle = `hsla(${baseH},30%,15%,${rand(0.3, 0.7)})`;
      ctx.lineWidth = rand(0.5, 1.5);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(IMG_SIZE, y + rand(-2, 2));
      ctx.stroke();
    }
    addNoise(ctx, 0.15);

  } else if (kind === 3) {
    // Green jungle foliage — various greens
    const g = ctx.createRadialGradient(
      rand(0, IMG_SIZE), rand(0, IMG_SIZE), 0,
      IMG_SIZE / 2, IMG_SIZE / 2, IMG_SIZE
    );
    g.addColorStop(0, `hsl(${randInt(90, 145)},${randInt(40, 80)}%,${randInt(20, 50)}%)`);
    g.addColorStop(1, `hsl(${randInt(100, 160)},${randInt(30, 70)}%,${randInt(10, 35)}%)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
    // leaf-like blobs
    for (let i = 0; i < randInt(3, 8); i++) {
      ctx.beginPath();
      ctx.ellipse(
        rand(0, IMG_SIZE), rand(0, IMG_SIZE),
        rand(5, 20), rand(2, 8),
        rand(0, Math.PI), 0, Math.PI * 2
      );
      ctx.fillStyle = `hsla(${randInt(80, 160)},${randInt(30, 70)}%,${randInt(15, 45)}%,${rand(0.3,0.8)})`;
      ctx.fill();
    }

  } else if (kind === 4) {
    // Skin / human body close-up
    const skinH = randInt(10, 35);
    const skinS = randInt(20, 55);
    const skinL = randInt(40, 80);
    const g = ctx.createLinearGradient(0, 0, IMG_SIZE, IMG_SIZE);
    g.addColorStop(0, `hsl(${skinH},${skinS}%,${skinL}%)`);
    g.addColorStop(1, `hsl(${skinH},${skinS - 5}%,${skinL - 10}%)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
    addNoise(ctx, 0.08);

  } else if (kind === 5) {
    // Dark shadow / dimly lit area
    ctx.fillStyle = `hsl(${randInt(200, 280)},${randInt(5,20)}%,${randInt(5,20)}%)`;
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
    addNoise(ctx, 0.3);

  } else if (kind === 6) {
    // Tile / floor — grid pattern
    const tileH = randInt(0, 360);
    const tileSize = randInt(8, 16);
    for (let y = 0; y < IMG_SIZE; y += tileSize) {
      for (let x = 0; x < IMG_SIZE; x += tileSize) {
        const alt = ((x + y) / tileSize) % 2 < 1;
        ctx.fillStyle = `hsl(${tileH},${randInt(5,25)}%,${alt ? randInt(60,80) : randInt(70,90)}%)`;
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
    // grout lines
    ctx.strokeStyle = `hsl(${tileH},5%,50%)`;
    ctx.lineWidth = 0.5;
    for (let y = 0; y < IMG_SIZE; y += tileSize) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(IMG_SIZE,y); ctx.stroke(); }
    for (let x = 0; x < IMG_SIZE; x += tileSize) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,IMG_SIZE); ctx.stroke(); }

  } else if (kind === 7) {
    // Clothing fabric texture — solid color with slight grain
    const h = randInt(0, 360);
    ctx.fillStyle = `hsl(${h},${randInt(30,80)}%,${randInt(20,65)}%)`;
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
    // fabric weave lines
    for (let y = 0; y < IMG_SIZE; y += randInt(2, 4)) {
      ctx.strokeStyle = `hsla(${h},50%,30%,${rand(0.05, 0.15)})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(IMG_SIZE, y); ctx.stroke();
    }
    addNoise(ctx, 0.1);

  } else if (kind === 8) {
    // Blurry out-of-focus background (gradient blobs)
    ctx.fillStyle = `hsl(${randInt(0,360)},${randInt(10,50)}%,${randInt(40,80)}%)`;
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
    for (let i = 0; i < randInt(3, 7); i++) {
      const x = rand(0, IMG_SIZE);
      const y = rand(0, IMG_SIZE);
      const r = rand(10, 35);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `hsla(${randInt(0,360)},${randInt(20,70)}%,${randInt(30,80)}%,${rand(0.4,0.9)})`);
      g.addColorStop(1, `hsla(${randInt(0,360)},10%,50%,0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
    }

  } else {
    // Paper / cardboard — warm off-white
    const g = ctx.createLinearGradient(0, 0, IMG_SIZE, IMG_SIZE);
    g.addColorStop(0, `hsl(${randInt(35,50)},${randInt(15,30)}%,${randInt(82,95)}%)`);
    g.addColorStop(1, `hsl(${randInt(35,50)},${randInt(10,25)}%,${randInt(75,88)}%)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
    addNoise(ctx, 0.12);
  }
}

// ─── Glyph sample generator ──────────────────────────────────────────────────
async function drawGlyphSample(ctx, svgImage) {
  drawRealisticBackground(ctx);

  // Sometimes draw a circular medallion base (like the real plaques)
  const hasMedallion = Math.random() < 0.55;
  if (hasMedallion) {
    const cx = IMG_SIZE / 2 + rand(-3, 3);
    const cy = IMG_SIZE / 2 + rand(-3, 3);
    const radius = rand(18, 23);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${randInt(25, 45)},${randInt(5, 20)}%,${randInt(75, 92)}%)`;
    ctx.fill();
    if (Math.random() < 0.4) {
      ctx.strokeStyle = `hsl(${randInt(20,40)},20%,50%)`;
      ctx.lineWidth = rand(0.5, 1.5);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.save();
  ctx.translate(IMG_SIZE / 2, IMG_SIZE / 2);
  ctx.rotate(rand(-20, 20) * (Math.PI / 180));

  const scale = hasMedallion ? rand(0.5, 0.75) : rand(0.45, 0.85);
  const glyphW = svgImage.width;
  const glyphH = svgImage.height;
  const aspectRatio = glyphW / glyphH;

  let drawW, drawH;
  if (aspectRatio > 1) {
    drawW = IMG_SIZE * scale;
    drawH = drawW / aspectRatio;
  } else {
    drawH = IMG_SIZE * scale;
    drawW = drawH * aspectRatio;
  }

  const tx = rand(-6, 6);
  const ty = rand(-6, 6);

  if (Math.random() < 0.2) {
    ctx.transform(1, rand(-0.08, 0.08), rand(-0.08, 0.08), 1, 0, 0);
  }

  ctx.globalAlpha = rand(0.75, 1.0);
  ctx.drawImage(svgImage, -drawW / 2 + tx, -drawH / 2 + ty, drawW, drawH);
  ctx.restore();
  ctx.globalAlpha = 1;

  // Light effect
  if (Math.random() < 0.3) {
    const lx = rand(0, IMG_SIZE);
    const ly = rand(0, IMG_SIZE);
    const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, rand(10, 30));
    lg.addColorStop(0, `rgba(255,255,200,${rand(0.05, 0.25)})`);
    lg.addColorStop(1, "rgba(255,255,200,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
  }

  addNoise(ctx, rand(0.05, 0.18));
}

// ─── None sample generator ───────────────────────────────────────────────────
function drawNoneSample(ctx) {
  drawRealisticBackground(ctx);

  // Occasionally add a non-glyph shape (hand, object) that might confuse the model
  if (Math.random() < 0.3) {
    ctx.save();
    ctx.globalAlpha = rand(0.2, 0.6);
    if (Math.random() < 0.5) {
      // Blob
      ctx.beginPath();
      ctx.ellipse(
        rand(5, IMG_SIZE - 5), rand(5, IMG_SIZE - 5),
        rand(5, 18), rand(5, 18),
        rand(0, Math.PI), 0, Math.PI * 2
      );
      ctx.fillStyle = `hsl(${randInt(0,360)},${randInt(10,60)}%,${randInt(20,80)}%)`;
      ctx.fill();
    } else {
      // A circular shape that's NOT a medallion (wrong color/size/proportion)
      const x = rand(0, IMG_SIZE);
      const y = rand(0, IMG_SIZE);
      const r = rand(3, 12);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${randInt(0,360)},${randInt(10,50)}%,${randInt(30,90)}%)`;
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  addNoise(ctx, rand(0.05, 0.2));
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function generateDataset() {
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("Generating realistic augmented glyph dataset...\n");
  console.log(`  Image size: ${IMG_SIZE}x${IMG_SIZE}px`);
  console.log(`  Glyph samples: ${SAMPLES_PER_GLYPH} per class`);
  console.log(`  None samples:  ${NONE_SAMPLES} (larger to reduce false positives)\n`);

  // ── Glyph classes ─────────────────────────────────────────────────────────
  for (const glyph of GLYPHS) {
    const classDir = path.join(OUTPUT_DIR, glyph.label);
    fs.mkdirSync(classDir, { recursive: true });

    const svgPath = path.join(GLIFOS_DIR, glyph.file);
    if (!fs.existsSync(svgPath)) {
      console.warn(`  WARNING: SVG not found: ${svgPath}`);
      continue;
    }

    let svgContent = fs.readFileSync(svgPath, "utf-8");
    const vbMatch = svgContent.match(/viewBox="([^"]+)"/);
    if (vbMatch) {
      const parts = vbMatch[1].split(/\s+/);
      const vbW = Math.ceil(parseFloat(parts[2]));
      const vbH = Math.ceil(parseFloat(parts[3]));
      if (!svgContent.includes('width="')) {
        svgContent = svgContent.replace("<svg ", `<svg width="${vbW}" height="${vbH}" `);
      }
    }
    const svgImage = await loadImage(Buffer.from(svgContent));
    process.stdout.write(`  ${glyph.label}...`);

    for (let i = 0; i < SAMPLES_PER_GLYPH; i++) {
      const canvas = createCanvas(IMG_SIZE, IMG_SIZE);
      const ctx = canvas.getContext("2d");
      await drawGlyphSample(ctx, svgImage);
      const outPath = path.join(classDir, `${glyph.label}_${String(i).padStart(4, "0")}.png`);
      fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
    }
    console.log(` ${SAMPLES_PER_GLYPH} done`);
  }

  // ── None class ────────────────────────────────────────────────────────────
  const noneDir = path.join(OUTPUT_DIR, "none");
  fs.mkdirSync(noneDir, { recursive: true });
  process.stdout.write(`  none (realistic backgrounds)...`);

  for (let i = 0; i < NONE_SAMPLES; i++) {
    const canvas = createCanvas(IMG_SIZE, IMG_SIZE);
    const ctx = canvas.getContext("2d");
    drawNoneSample(ctx);
    fs.writeFileSync(
      path.join(noneDir, `none_${String(i).padStart(4, "0")}.png`),
      canvas.toBuffer("image/png")
    );
  }
  console.log(` ${NONE_SAMPLES} done`);

  const totalGlyphImgs = GLYPHS.length * SAMPLES_PER_GLYPH;
  const totalImgs = totalGlyphImgs + NONE_SAMPLES;
  console.log(`\nDataset complete!`);
  console.log(`  ${totalImgs} images across ${GLYPHS.length + 1} classes`);
  console.log(`  Glyph classes (${SAMPLES_PER_GLYPH} each): ${GLYPHS.map(g=>g.label).join(", ")}`);
  console.log(`  None class: ${NONE_SAMPLES} (${((NONE_SAMPLES/totalImgs)*100).toFixed(0)}% of dataset)`);
  console.log(`  Output: ${OUTPUT_DIR}`);
}

generateDataset().catch(console.error);
