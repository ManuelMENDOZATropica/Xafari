"""
convert_to_tfjs_v3.py

Final robust Keras H5 → TensorFlow.js LayersModel converter.
Generates weight names in the exact format tfjs loadLayersModel expects:
  "{layer_name}/{variable_name}"
  e.g., "conv2d/kernel", "conv2d/bias", "dense/kernel", etc.
"""
import json
import numpy as np
from pathlib import Path

H5_PATH = Path(__file__).parent / "saved_model" / "glyph_model.h5"
OUT_DIR = Path(__file__).parent.parent / "public" / "models" / "glyph-classifier"


def fix_topology(obj):
    """Rename batch_shape → batch_input_shape for tfjs compatibility."""
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

    print(f"TF {tf.__version__}")
    print(f"Loading {H5_PATH}...")
    model = tf.keras.models.load_model(str(H5_PATH), compile=False)

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # ── Build weight specs with correct tfjs names ────────────────────────────
    weight_specs = []
    all_bytes = bytearray()

    for layer in model.layers:
        if not layer.weights:
            continue
        layer_name = layer.name  # e.g., "conv2d", "conv2d_1", "dense"
        for w in layer.weights:
            arr = w.numpy().astype(np.float32)
            all_bytes.extend(arr.tobytes())

            # Strip the layer name prefix from the variable name if present
            # w.name is like "conv2d/kernel:0" or just "kernel:0"
            raw = w.name if ":" not in w.name else w.name.split(":")[0]
            # Get just the variable part (after the last /)
            var_part = raw.split("/")[-1]  # "kernel" or "bias"

            # tfjs expects "{layer_name}/{var_part}"
            tfjs_name = f"{layer_name}/{var_part}"

            weight_specs.append({
                "name": tfjs_name,
                "shape": list(arr.shape),
                "dtype": "float32",
            })
            print(f"  {tfjs_name}  {arr.shape}")

    # Write weights.bin
    bin_path = OUT_DIR / "weights.bin"
    bin_path.write_bytes(bytes(all_bytes))
    print(f"\nwrote weights.bin  {len(all_bytes)//1024} KB  ({len(weight_specs)} tensors)")

    # ── Build model.json ──────────────────────────────────────────────────────
    model_cfg = fix_topology(json.loads(model.to_json()))

    model_json = {
        "format": "layers-model",
        "generatedBy": f"keras {tf.__version__}",
        "convertedBy": "convert_to_tfjs_v3.py",
        "modelTopology": {
            "keras_version": tf.__version__,
            "backend": "tensorflow",
            "model_config": model_cfg,
        },
        "weightsManifest": [{
            "paths": ["weights.bin"],
            "weights": weight_specs,
        }],
    }

    json_path = OUT_DIR / "model.json"
    json_path.write_text(json.dumps(model_json), encoding="utf-8")
    print(f"wrote model.json  {json_path.stat().st_size} B")

    # Assertions
    raw = json_path.read_text()
    assert "batch_shape" not in raw or "batch_input_shape" in raw, "batch_shape still present!"
    assert all("/" in w["name"] for w in weight_specs), "Some weight names missing layer prefix!"
    print("\nAll checks passed.")
    print(f"Output: {OUT_DIR}")


if __name__ == "__main__":
    convert()
