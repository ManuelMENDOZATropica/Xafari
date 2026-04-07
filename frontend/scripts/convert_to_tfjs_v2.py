"""
convert_to_tfjs_v2.py

Robust Keras H5 → TensorFlow.js LayersModel converter.
Handles:
  - batch_shape → batch_input_shape renaming
  - Proper weight name normalization for tfjs
  - Correct weightsManifest structure

Output:
  public/models/glyph-classifier/model.json
  public/models/glyph-classifier/weights.bin
"""
import json
import struct
import re
import numpy as np
from pathlib import Path

H5_PATH = Path(__file__).parent / "saved_model" / "glyph_model.h5"
OUT_DIR = Path(__file__).parent.parent / "public" / "models" / "glyph-classifier"


def fix_topology(obj):
    """Recursively rename Keras keys to tfjs equivalents."""
    if isinstance(obj, dict):
        return {
            ("batch_input_shape" if k == "batch_shape" else k): fix_topology(v)
            for k, v in obj.items()
        }
    if isinstance(obj, list):
        return [fix_topology(i) for i in obj]
    return obj


def convert():
    import os
    os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
    os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

    import tensorflow as tf

    print(f"Loading model from {H5_PATH}...")
    model = tf.keras.models.load_model(str(H5_PATH))

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # ── Collect and write weights ─────────────────────────────────────────────
    weight_specs = []
    all_weight_data = bytearray()

    for layer in model.layers:
        for weight_var in layer.weights:
            arr = weight_var.numpy().astype(np.float32)
            raw = arr.tobytes()
            all_weight_data.extend(raw)

            # tfjs weight name format: "layerName/variableName"
            # e.g., "conv2d/kernel:0" → "conv2d/kernel"
            name = weight_var.name
            if name.endswith(":0"):
                name = name[:-2]

            weight_specs.append({
                "name": name,
                "shape": list(arr.shape),
                "dtype": "float32",
            })

    weights_bin = OUT_DIR / "weights.bin"
    weights_bin.write_bytes(bytes(all_weight_data))
    print(f"Wrote weights.bin — {len(all_weight_data) / 1024:.1f} KB, {len(weight_specs)} tensors")

    # ── Build topology ─────────────────────────────────────────────────────────
    model_config = json.loads(model.to_json())
    model_config_fixed = fix_topology(model_config)

    model_json = {
        "format": "layers-model",
        "generatedBy": f"keras {tf.__version__}",
        "convertedBy": "convert_to_tfjs_v2.py",
        "modelTopology": {
            "keras_version": tf.__version__,
            "backend": "tensorflow",
            "model_config": model_config_fixed,
        },
        "weightsManifest": [{
            "paths": ["weights.bin"],
            "weights": weight_specs,
        }],
    }

    json_path = OUT_DIR / "model.json"
    json_path.write_text(json.dumps(model_json, indent=None), encoding="utf-8")
    print(f"Wrote model.json — {json_path.stat().st_size} bytes")

    # ── Quick sanity checks ────────────────────────────────────────────────────
    data = json.loads(json_path.read_text())
    assert data["format"] == "layers-model", "format mismatch"
    assert "batch_shape" not in json_path.read_text(), "batch_shape still present!"
    assert "batch_input_shape" in json_path.read_text(), "batch_input_shape missing!"
    print("Sanity checks passed.")
    print(f"\nModel ready in {OUT_DIR}")
    print(f"  model.json    : {(OUT_DIR/'model.json').stat().st_size} B")
    print(f"  weights.bin   : {(OUT_DIR/'weights.bin').stat().st_size} B")
    print(f"  labels.json   : {(OUT_DIR/'labels.json').stat().st_size} B")


if __name__ == "__main__":
    convert()
