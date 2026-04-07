/**
 * generate-dataset.mjs
 * 
 * Generates an augmented PNG dataset from the glyph SVGs for TensorFlow.js training.
 * Each SVG is rendered to canvas multiple times with variations:
 *   - rotation, scale, translation, noise, background color, blur
 * 
 * Usage:  node scripts/generate-dataset.mjs
 * Output: scripts/dataset/<class_name>/*.png  (96x96 each)
 */

import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Configuration ──────────────────────────────────────────────────────────
const IMG_SIZE = 96; // Smaller for faster training, sufficient for distinctive silhouettes
const SAMPLES_PER_GLYPH = 150;

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
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

// Random natural background colors (greens, browns, tans — jungle environment)
function randomBackground() {
  const bgs = [
    () => `hsl(${randInt(30, 50)}, ${randInt(10, 30)}%, ${randInt(75, 95)}%)`,
    () => `hsl(${randInt(80, 150)}, ${randInt(20, 60)}%, ${randInt(25, 65)}%)`,
    () => `hsl(${randInt(15, 40)}, ${randInt(30, 60)}%, ${randInt(20, 50)}%)`,
    () => `hsl(0, 0%, ${randInt(40, 80)}%)`,
    () => `hsl(${randInt(40, 60)}, ${randInt(40, 70)}%, ${randInt(70, 95)}%)`,
    () => `hsl(${randInt(100, 200)}, ${randInt(5, 20)}%, ${randInt(10, 35)}%)`,
  ];
  return bgs[randInt(0, bgs.length - 1)]();
}

function addNoise(ctx, intensity = 0.15) {
  const imageData = ctx.getImageData(0, 0, IMG_SIZE, IMG_SIZE);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < intensity) {
      const noise = randInt(-40, 40);
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function addShadow(ctx) {
  if (Math.random() < 0.4) {
    const gradient = ctx.createLinearGradient(
      rand(0, IMG_SIZE), 0, rand(0, IMG_SIZE), IMG_SIZE
    );
    gradient.addColorStop(0, `rgba(0,0,0,${rand(0, 0.4)})`);
    gradient.addColorStop(0.5, `rgba(0,0,0,0)`);
    gradient.addColorStop(1, `rgba(0,0,0,${rand(0, 0.3)})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
  }
}

function addLightSpots(ctx) {
  if (Math.random() < 0.3) {
    const spots = randInt(1, 3);
    for (let i = 0; i < spots; i++) {
      const x = rand(0, IMG_SIZE);
      const y = rand(0, IMG_SIZE);
      const r = rand(10, 35);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, `rgba(255,255,200,${rand(0.1, 0.35)})`);
      gradient.addColorStop(1, "rgba(255,255,200,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
    }
  }
}

// ─── Main Generation ────────────────────────────────────────────────────────
async function generateDataset() {
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("🎨 Generating augmented glyph dataset...\n");

  for (const glyph of GLYPHS) {
    const classDir = path.join(OUTPUT_DIR, glyph.label);
    fs.mkdirSync(classDir, { recursive: true });

    const svgPath = path.join(GLIFOS_DIR, glyph.file);
    if (!fs.existsSync(svgPath)) {
      console.warn(`⚠️  SVG not found: ${svgPath}`);
      continue;
    }

    // Fix SVG: canvas requires explicit width/height attributes
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
    const svgBuffer = Buffer.from(svgContent);
    const svgImage = await loadImage(svgBuffer);
    console.log(`  📐 ${glyph.label} (${glyph.file}) — generating ${SAMPLES_PER_GLYPH} samples...`);

    for (let i = 0; i < SAMPLES_PER_GLYPH; i++) {
      const canvas = createCanvas(IMG_SIZE, IMG_SIZE);
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = randomBackground();
      ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);

      // Sometimes draw a circular "medallion" base
      if (Math.random() < 0.6) {
        const cx = IMG_SIZE / 2 + rand(-5, 5);
        const cy = IMG_SIZE / 2 + rand(-5, 5);
        const radius = rand(30, 45);
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${randInt(25, 45)}, ${randInt(5, 20)}%, ${randInt(78, 95)}%)`;
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.translate(IMG_SIZE / 2, IMG_SIZE / 2);
      const angle = rand(-25, 25) * (Math.PI / 180);
      ctx.rotate(angle);

      const scale = rand(0.4, 0.85);
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

      const tx = rand(-8, 8);
      const ty = rand(-8, 8);

      if (Math.random() < 0.3) {
        ctx.transform(1, rand(-0.1, 0.1), rand(-0.1, 0.1), 1, 0, 0);
      }

      ctx.globalAlpha = rand(0.7, 1.0);
      ctx.drawImage(svgImage, -drawW / 2 + tx, -drawH / 2 + ty, drawW, drawH);
      ctx.restore();

      addShadow(ctx);
      addLightSpots(ctx);
      addNoise(ctx, rand(0.05, 0.2));

      const outPath = path.join(classDir, `${glyph.label}_${String(i).padStart(4, "0")}.png`);
      fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
    }

    console.log(`    ✅ ${glyph.label}: ${SAMPLES_PER_GLYPH} images saved\n`);
  }

  // "none" class
  const noneDir = path.join(OUTPUT_DIR, "none");
  fs.mkdirSync(noneDir, { recursive: true });
  console.log(`  📐 none (negative class) — generating ${SAMPLES_PER_GLYPH} samples...`);

  for (let i = 0; i < SAMPLES_PER_GLYPH; i++) {
    const canvas = createCanvas(IMG_SIZE, IMG_SIZE);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = randomBackground();
    ctx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);

    const shapes = randInt(2, 8);
    for (let s = 0; s < shapes; s++) {
      ctx.fillStyle = randomBackground();
      ctx.globalAlpha = rand(0.2, 0.7);
      if (Math.random() < 0.5) {
        ctx.fillRect(rand(0, IMG_SIZE), rand(0, IMG_SIZE), rand(10, 50), rand(10, 50));
      } else {
        ctx.beginPath();
        ctx.arc(rand(0, IMG_SIZE), rand(0, IMG_SIZE), rand(5, 30), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    addShadow(ctx);
    addLightSpots(ctx);
    addNoise(ctx, rand(0.1, 0.25));

    fs.writeFileSync(
      path.join(noneDir, `none_${String(i).padStart(4, "0")}.png`),
      canvas.toBuffer("image/png")
    );
  }
  console.log(`    ✅ none: ${SAMPLES_PER_GLYPH} images saved\n`);

  const totalImages = (GLYPHS.length + 1) * SAMPLES_PER_GLYPH;
  console.log(`\n🎉 Dataset complete! ${totalImages} images across ${GLYPHS.length + 1} classes.`);
  console.log(`   Output: ${OUTPUT_DIR}`);
}

generateDataset().catch(console.error);
