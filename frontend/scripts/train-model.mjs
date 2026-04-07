/**
 * train-model.mjs
 *
 * Trains a glyph classifier using TensorFlow.js (WASM/CPU backend in Node).
 *
 * Strategy: Tiny CNN (48x48 input, very few params) for fast training in pure JS.
 * Estimated time: ~5-10 min for 30 epochs on CPU.
 *
 * Usage:  node --max-old-space-size=4096 scripts/train-model.mjs
 * Output: public/models/glyph-classifier/model.json + weights.bin + labels.json
 */

import * as tf from "@tensorflow/tfjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createCanvas, loadImage } from "canvas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Configuration ──────────────────────────────────────────────────────────
const IMG_SIZE         = 48;   // << 48px: 4x fewer ops than 96px
const BATCH_SIZE       = 64;   // << larger batch for WASM efficiency
const EPOCHS           = 30;
const LEARNING_RATE    = 0.001;
const VALIDATION_SPLIT = 0.2;

const DATASET_DIR  = path.resolve(__dirname, "dataset");
const MODEL_OUTPUT = path.resolve(__dirname, "../public/models/glyph-classifier");

// ─── Custom file save handler ────────────────────────────────────────────────
function nodeSaveHandler(dirPath) {
  return {
    save: async (modelArtifacts) => {
      fs.mkdirSync(dirPath, { recursive: true });

      const modelJSON = {
        modelTopology: modelArtifacts.modelTopology,
        weightsManifest: [{ paths: ["weights.bin"], weights: modelArtifacts.weightSpecs }],
        format: modelArtifacts.format,
        generatedBy: modelArtifacts.generatedBy,
        convertedBy: modelArtifacts.convertedBy,
      };

      fs.writeFileSync(path.join(dirPath, "model.json"), JSON.stringify(modelJSON));

      const weightData = modelArtifacts.weightData;
      let buffer;
      if (weightData instanceof ArrayBuffer) {
        buffer = Buffer.from(weightData);
      } else if (Array.isArray(weightData)) {
        const total = weightData.reduce((s, ab) => s + ab.byteLength, 0);
        buffer = Buffer.alloc(total);
        let off = 0;
        for (const ab of weightData) { Buffer.from(ab).copy(buffer, off); off += ab.byteLength; }
      } else {
        buffer = Buffer.from(weightData.buffer || weightData);
      }

      fs.writeFileSync(path.join(dirPath, "weights.bin"), buffer);
      console.log(`💾 Model saved → ${dirPath}`);
      return { modelArtifactsInfo: { dateSaved: new Date(), modelTopologyType: "JSON" } };
    },
  };
}

// ─── Efficient dataset loader ────────────────────────────────────────────────
async function loadDataset() {
  const classes = fs.readdirSync(DATASET_DIR)
    .filter(d => fs.statSync(path.join(DATASET_DIR, d)).isDirectory())
    .sort();

  console.log(`📂 Classes: ${classes.join(", ")}`);

  let totalCount = 0;
  const classMeta = [];
  for (let ci = 0; ci < classes.length; ci++) {
    const classDir = path.join(DATASET_DIR, classes[ci]);
    const files = fs.readdirSync(classDir).filter(f => f.endsWith(".png"));
    classMeta.push({ name: classes[ci], dir: classDir, files, idx: ci });
    totalCount += files.length;
    console.log(`  ${classes[ci]}: ${files.length} images`);
  }

  console.log(`\n📊 Total: ${totalCount} images, ${classes.length} classes`);

  const stride       = IMG_SIZE * IMG_SIZE * 3;
  const pixelsBuffer = new Float32Array(totalCount * stride);
  const labelsArr    = new Int32Array(totalCount);
  let gi             = 0;

  for (const { name, dir, files, idx: ci } of classMeta) {
    process.stdout.write(`  Loading ${name}...`);
    for (const file of files) {
      const img    = await loadImage(path.join(dir, file));
      const canvas = createCanvas(IMG_SIZE, IMG_SIZE);
      const ctx    = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, IMG_SIZE, IMG_SIZE);
      const raw    = ctx.getImageData(0, 0, IMG_SIZE, IMG_SIZE).data;
      const off    = gi * stride;
      for (let p = 0; p < IMG_SIZE * IMG_SIZE; p++) {
        pixelsBuffer[off + p * 3]     = raw[p * 4]     / 127.5 - 1;
        pixelsBuffer[off + p * 3 + 1] = raw[p * 4 + 1] / 127.5 - 1;
        pixelsBuffer[off + p * 3 + 2] = raw[p * 4 + 2] / 127.5 - 1;
      }
      labelsArr[gi] = ci;
      gi++;
    }
    console.log(` ✓ ${files.length}`);
  }

  // Shuffle
  const indices = Array.from({ length: totalCount }, (_, i) => i);
  for (let i = totalCount - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const splitIdx  = (totalCount * (1 - VALIDATION_SPLIT)) | 0;
  const trainIdxs = indices.slice(0, splitIdx);
  const valIdxs   = indices.slice(splitIdx);

  function buildTensors(idxArr) {
    const n  = idxArr.length;
    const xs = new Float32Array(n * stride);
    const ys = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      xs.set(pixelsBuffer.subarray(idxArr[i] * stride, (idxArr[i] + 1) * stride), i * stride);
      ys[i] = labelsArr[idxArr[i]];
    }
    return {
      xTensor: tf.tensor4d(xs, [n, IMG_SIZE, IMG_SIZE, 3]),
      yTensor: tf.oneHot(tf.tensor1d(ys, "int32"), classes.length),
    };
  }

  console.log("\n🔧 Building tensors...");
  const train = buildTensors(trainIdxs);
  const val   = buildTensors(valIdxs);
  console.log(`✅ Done: ${trainIdxs.length} train, ${valIdxs.length} val\n`);

  fs.mkdirSync(MODEL_OUTPUT, { recursive: true });
  fs.writeFileSync(path.join(MODEL_OUTPUT, "labels.json"), JSON.stringify(classes, null, 2));

  return { train, val, numClasses: classes.length, classes };
}

// ─── Tiny CNN ────────────────────────────────────────────────────────────────
// ~45K params — designed for fast training in pure JS WASM backend
function buildModel(numClasses) {
  console.log("🧠 Building tiny CNN...\n");

  const model = tf.sequential();

  // Block 1: 48 → 24
  model.add(tf.layers.conv2d({
    inputShape: [IMG_SIZE, IMG_SIZE, 3],
    filters: 16, kernelSize: 3, activation: "relu", padding: "same",
  }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

  // Block 2: 24 → 12
  model.add(tf.layers.conv2d({ filters: 32, kernelSize: 3, activation: "relu", padding: "same" }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

  // Block 3: 12 → 6
  model.add(tf.layers.conv2d({ filters: 32, kernelSize: 3, activation: "relu", padding: "same" }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

  // Head — 6×6×32 = 1152 → flatten → dense
  model.add(tf.layers.flatten());
  model.add(tf.layers.dropout({ rate: 0.3 }));
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));
  model.add(tf.layers.dense({ units: numClasses, activation: "softmax" }));

  model.compile({
    optimizer: tf.train.adam(LEARNING_RATE),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  model.summary();
  return model;
}

// ─── Train ───────────────────────────────────────────────────────────────────
async function train() {
  const { train: trainSet, val: valSet, numClasses, classes } = await loadDataset();
  const model = buildModel(numClasses);

  console.log(`🏋️  ${EPOCHS} epochs, batch=${BATCH_SIZE}, img=${IMG_SIZE}px\n`);
  const t0 = Date.now();
  let bestValAcc = 0;

  await model.fit(trainSet.xTensor, trainSet.yTensor, {
    batchSize: BATCH_SIZE,
    epochs: EPOCHS,
    validationData: [valSet.xTensor, valSet.yTensor],
    shuffle: true,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
        const acc    = (logs.acc ?? logs.accuracy ?? 0);
        const valAcc = (logs.val_acc ?? logs.val_accuracy ?? 0);
        const mark   = valAcc > bestValAcc ? " ⭐" : "";
        if (valAcc > bestValAcc) bestValAcc = valAcc;
        console.log(
          `  [${elapsed}s] Epoch ${String(epoch + 1).padStart(2)}/${EPOCHS}` +
          ` — loss: ${logs.loss.toFixed(4)}, acc: ${(acc * 100).toFixed(1)}%` +
          ` | val_loss: ${logs.val_loss.toFixed(4)}, val_acc: ${(valAcc * 100).toFixed(1)}%${mark}`
        );
      },
    },
  });

  trainSet.xTensor.dispose();
  trainSet.yTensor.dispose();
  valSet.xTensor.dispose();
  valSet.yTensor.dispose();

  await model.save(nodeSaveHandler(MODEL_OUTPUT));

  const total = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n✅ Done in ${total}s  |  Best val_acc: ${(bestValAcc * 100).toFixed(1)}%`);
  console.log(`   Classes (${classes.length}): ${classes.join(", ")}`);
  console.log(`   → ${MODEL_OUTPUT}/model.json`);
  console.log(`   → ${MODEL_OUTPUT}/labels.json`);
}

train().catch(console.error);
