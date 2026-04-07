/**
 * useGlyphRecognizer.js
 *
 * Glyph recognition pipeline — dual-mode, offline-first.
 *
 * Mode 1 (PRIMARY): Custom CNN trained on glyph dataset.
 *   - Loads public/models/glyph-classifier/model.json
 *   - Fast, small, works fully offline
 *   - Input: 96×96 RGB, output: softmax over 10 classes
 *
 * Mode 2 (FALLBACK): MobileNet v2 feature extraction + cosine similarity.
 *   - Loads from Google CDN (requires internet on first load)
 *   - Used only if the custom model is not found
 *
 * Detection logic:
 *   - Runs classification every SCAN_INTERVAL_MS
 *   - Requires CONSECUTIVE_THRESHOLD consecutive detections above
 *     CONFIDENCE_THRESHOLD before triggering onDetection
 */

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const CUSTOM_MODEL_URL  = "/models/glyph-classifier/model.json";
const LABELS_URL        = "/models/glyph-classifier/labels.json";
const MOBILENET_URL     = "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v2_1.0_224/model.json";

const CNN_IMG_SIZE      = 48;
const MN_IMG_SIZE       = 224;

// ─── Detection thresholds ─────────────────────────────────────────────────────────────────
// The model uses SIGMOID output: each class gives an INDEPENDENT 0..1 probability.
// "jaguar = 0.90" means "90% sure this IS a jaguar" — not relative to other classes.
// A blank camera should give all values near 0.
const CONFIDENCE_THRESHOLD  = 0.70;  // sigmoid score must exceed this to trigger
const CONSECUTIVE_THRESHOLD = 5;     // frames in a row confirming same class
const SCAN_INTERVAL_MS      = 500;

// ─── Reference glyphs for MobileNet fallback ────────────────────────────────
const GLYPH_REFS = [
  { label: "venado",    src: "/xecretos/glifos/Recurso 2.svg" },
  { label: "serpiente", src: "/xecretos/glifos/Recurso 3.svg" },
  { label: "mariposa",  src: "/xecretos/glifos/Recurso 4.svg" },
  { label: "rana",      src: "/xecretos/glifos/Recurso 5.svg" },
  { label: "jaguar",    src: "/xecretos/glifos/Recurso 6.svg" },
  { label: "coati",     src: "/xecretos/glifos/Recurso 7.svg" },
  { label: "buho",      src: "/xecretos/glifos/Recurso 8.svg" },
  { label: "mono",      src: "/xecretos/glifos/Recurso 9.svg" },
  { label: "flamenco",  src: "/xecretos/glifos/Recurso 10.svg" },
];

// ─── Module-level singletons (shared across hook instances) ─────────────────
let _tf           = null;
let _mode         = null;      // "cnn" | "mobilenet" | null
let _cnnModel     = null;
let _cnnLabels    = null;
let _mnModel      = null;      // MobileNet feature extractor
let _mnEmbeddings = null;      // [{ label, embedding }]
let _loadPromise  = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadImageToCanvas(src, size) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      const scale = Math.min(size / img.width, size / img.height) * 0.8;
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}

/** Normalize pixel values to [-1, 1] */
function normalizeCanvas(canvas, size) {
  return _tf.tidy(() => {
    const t = _tf.browser.fromPixels(canvas);                  // [H,W,3] uint8
    const resized = _tf.image.resizeBilinear(t, [size, size]); // [size,size,3]
    return resized.div(127.5).sub(1).expandDims(0);            // [1,size,size,3]
  });
}

function cosineSim(a, b) {
  return _tf.tidy(() => {
    const dot  = a.mul(b).sum();
    const norm = a.norm().mul(b.norm());
    return dot.div(norm);
  });
}

// ─── Primary loader: custom CNN ──────────────────────────────────────────────
async function loadCNN() {
  try {
    console.log("🧠 [GlyphRecognizer] Trying custom CNN model...");
    const [model, labelsRes] = await Promise.all([
      _tf.loadLayersModel(CUSTOM_MODEL_URL),
      fetch(LABELS_URL),
    ]);
    const labels = await labelsRes.json();

    // Warm up
    const dummy = _tf.zeros([1, CNN_IMG_SIZE, CNN_IMG_SIZE, 3]);
    model.predict(dummy).dispose();
    dummy.dispose();

    _cnnModel  = model;
    _cnnLabels = labels;
    _mode      = "cnn";
    console.log(`✅ [GlyphRecognizer] Custom CNN loaded. Classes: ${labels.join(", ")}`);
    return true;
  } catch (err) {
    console.warn("⚠️ [GlyphRecognizer] Custom CNN not found:", err.message);
    return false;
  }
}

// ─── Fallback loader: MobileNet cosine similarity ────────────────────────────
async function loadMobileNet() {
  console.log("🔄 [GlyphRecognizer] Falling back to MobileNet embeddings...");
  const fullModel = await _tf.loadLayersModel(MOBILENET_URL);

  let featureLayer;
  try {
    featureLayer = fullModel.getLayer("out_relu");
  } catch {
    featureLayer = fullModel.layers[fullModel.layers.length - 2];
  }

  const featureModel = _tf.model({
    inputs: fullModel.inputs,
    outputs: featureLayer.output,
  });

  _mnModel = featureModel;

  console.log("📐 [GlyphRecognizer] Computing reference embeddings...");
  _mnEmbeddings = [];

  for (const ref of GLYPH_REFS) {
    try {
      const canvas    = await loadImageToCanvas(ref.src, MN_IMG_SIZE);
      const tensor    = normalizeCanvas(canvas, MN_IMG_SIZE);
      const features  = featureModel.predict(tensor);
      const shape     = features.shape;
      let pooled;
      if (shape.length === 4) {
        pooled = features.mean([1, 2]).squeeze();
      } else {
        pooled = features.squeeze();
      }
      const data = await pooled.data();
      _mnEmbeddings.push({ label: ref.label, embedding: _tf.tensor1d(data) });
      tensor.dispose();
      features.dispose();
      pooled.dispose();
    } catch (err) {
      console.warn(`⚠️ Embedding failed for ${ref.label}:`, err);
    }
  }

  // Warm up
  const dummy = _tf.zeros([1, MN_IMG_SIZE, MN_IMG_SIZE, 3]);
  featureModel.predict(dummy).dispose();
  dummy.dispose();

  _mode = "mobilenet";
  console.log(`✅ [GlyphRecognizer] MobileNet ready. ${_mnEmbeddings.length} embeddings.`);
}

// ─── Unified preload entry point ──────────────────────────────────────────────
export async function preloadGlyphModel() {
  if (_mode) return;               // already loaded
  if (_loadPromise) return _loadPromise;

  _loadPromise = (async () => {
    _tf = await import("@tensorflow/tfjs");

    const cnnOk = await loadCNN();
    if (!cnnOk) {
      await loadMobileNet();
    }
  })();

  return _loadPromise;
}

// ─── Classification functions ─────────────────────────────────────────────────

/**
 * Pre-filter: checks if the frame has enough edge complexity to plausibly contain a glyph.
 * Returns a score 0..1. Glyph SVGs have dense, high-contrast linework.
 * Faces, walls, and plain backgrounds score very low.
 */
function computeEdgeScore(ctx, size) {
  const data = ctx.getImageData(0, 0, size, size).data;
  let edgeSum = 0;
  const count = size * size;

  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const i = (y * size + x) * 4;
      const iL = (y * size + (x - 1)) * 4;
      const iR = (y * size + (x + 1)) * 4;
      const iU = ((y - 1) * size + x) * 4;
      const iD = ((y + 1) * size + x) * 4;

      // Grayscale of center and neighbors
      const c = (data[i]     * 0.299 + data[i + 1]  * 0.587 + data[i + 2]  * 0.114);
      const l = (data[iL]    * 0.299 + data[iL + 1] * 0.587 + data[iL + 2] * 0.114);
      const r = (data[iR]    * 0.299 + data[iR + 1] * 0.587 + data[iR + 2] * 0.114);
      const u = (data[iU]    * 0.299 + data[iU + 1] * 0.587 + data[iU + 2] * 0.114);
      const d = (data[iD]    * 0.299 + data[iD + 1] * 0.587 + data[iD + 2] * 0.114);

      // Sobel approximation
      const mag = Math.abs(r - l) + Math.abs(d - u);
      if (mag > 30) edgeSum++;  // count pixels with significant gradient
    }
  }

  return edgeSum / count;  // fraction of pixels that are "edges"
}

// Minimum fraction of edge pixels required to run CNN (tune if needed)
const EDGE_SCORE_THRESHOLD = 0.08;  // ~8% of pixels must be edges

async function classifyWithCNN(videoElement) {
  const canvas = document.createElement("canvas");
  canvas.width  = CNN_IMG_SIZE;
  canvas.height = CNN_IMG_SIZE;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoElement, 0, 0, CNN_IMG_SIZE, CNN_IMG_SIZE);

  // ── Pre-filter: reject frames without enough edge complexity ────────────────
  const edgeScore = computeEdgeScore(ctx, CNN_IMG_SIZE);
  if (edgeScore < EDGE_SCORE_THRESHOLD) {
    // Not enough visual complexity — definitely not a glyph medallion
    return null;  // caller will skip this frame
  }

  const input  = normalizeCanvas(canvas, CNN_IMG_SIZE);
  const output = _cnnModel.predict(input);
  const probs  = await output.data();
  input.dispose();
  output.dispose();

  return _cnnLabels.map((label, i) => ({ label, confidence: probs[i] }));
}

async function classifyWithMobileNet(videoElement) {
  const canvas = document.createElement("canvas");
  canvas.width  = MN_IMG_SIZE;
  canvas.height = MN_IMG_SIZE;
  canvas.getContext("2d").drawImage(videoElement, 0, 0, MN_IMG_SIZE, MN_IMG_SIZE);

  const input    = normalizeCanvas(canvas, MN_IMG_SIZE);
  const features = _mnModel.predict(input);
  const shape    = features.shape;
  let frameEmb;
  if (shape.length === 4) {
    frameEmb = features.mean([1, 2]).squeeze();
  } else {
    frameEmb = features.squeeze();
  }
  input.dispose();
  features.dispose();

  const results = [];
  for (const ref of _mnEmbeddings) {
    const sim   = cosineSim(frameEmb, ref.embedding);
    const score = (await sim.data())[0];
    sim.dispose();
    results.push({ label: ref.label, confidence: score });
  }
  frameEmb.dispose();
  return results;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export default function useGlyphRecognizer(videoRef, { active = true, onDetection } = {}) {
  const [isModelLoaded, setIsModelLoaded] = useState(!!_mode);
  const [isScanning, setIsScanning]       = useState(false);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [allPredictions, setAllPredictions] = useState([]);
  const [recognizerMode, setRecognizerMode] = useState(_mode);
  const [edgeScore, setEdgeScore]           = useState(0);  // pre-filter score 0..1

  const scanIntervalRef  = useRef(null);
  const consecutiveRef   = useRef({ label: null, count: 0 });

  // Load model on mount if not already loaded
  useEffect(() => {
    if (_mode) {
      setIsModelLoaded(true);
      setRecognizerMode(_mode);
      return;
    }
    preloadGlyphModel().then(() => {
      setIsModelLoaded(true);
      setRecognizerMode(_mode);
    });
  }, []);

  const classifyFrame = useCallback(async () => {
    if (!_mode || !videoRef.current) return;
    const video = videoRef.current;
    if (video.readyState < 2) return;

    try {
      let results;
      if (_mode === "cnn") {
        results = await classifyWithCNN(video);
      } else {
        results = await classifyWithMobileNet(video);
      }

      // null = pre-filter rejected this frame (not enough edges to be a glyph)
      if (results === null) {
        setEdgeScore(0);
        setAllPredictions([]);
        consecutiveRef.current = { label: null, count: 0 };
        return;
      }
      // ── Sort descending by sigmoid score ──────────────────────────────────
      // Each score is INDEPENDENT: "jaguar=0.85" = 85% sure it's a jaguar.
      // If no glyph is visible, all scores should be near 0.
      const sorted = [...results]
        .filter((r) => r.label !== "none")          // exclude none from candidates
        .sort((a, b) => b.confidence - a.confidence);
      setAllPredictions(sorted);

      const top = sorted[0];

      // Single gate: the top glyph class must independently exceed the threshold
      if (!top || top.confidence < CONFIDENCE_THRESHOLD) {
        consecutiveRef.current = { label: null, count: 0 };
        return;
      }

      if (consecutiveRef.current.label === top.label) {
        consecutiveRef.current.count++;
      } else {
        consecutiveRef.current = { label: top.label, count: 1 };
      }

      if (consecutiveRef.current.count >= CONSECUTIVE_THRESHOLD) {
        setLastPrediction(top);
        if (onDetection) onDetection(top.label, top.confidence);
        consecutiveRef.current = { label: null, count: 0 };
      }
    } catch (err) {
      console.warn("[GlyphRecognizer] Classification error:", err);
    }
  }, [videoRef, onDetection]);

  useEffect(() => {
    if (!active || !isModelLoaded) {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      setIsScanning(false);
      return;
    }

    setIsScanning(true);
    scanIntervalRef.current = setInterval(classifyFrame, SCAN_INTERVAL_MS);

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      setIsScanning(false);
    };
  }, [active, isModelLoaded, classifyFrame]);

  return {
    isModelLoaded,
    isScanning,
    lastPrediction,
    allPredictions,
    recognizerMode,
    edgeScore,       // 0..1, debug: how much edge complexity was in the last frame
  };
}
