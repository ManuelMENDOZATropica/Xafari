"""
convert_to_tfjs.py

Converts the saved Keras H5 model to TensorFlow.js LayersModel format
without relying on the broken tensorflowjs CLI.

Generates:
  public/models/glyph-classifier/model.json
  public/models/glyph-classifier/weights.bin
"""
import os
import json
import struct
import numpy as np
from pathlib import Path

H5_PATH = Path(__file__).parent / "saved_model" / "glyph_model.h5"
OUT_DIR = Path(__file__).parent.parent / "public" / "models" / "glyph-classifier"

def convert():
    import tensorflow as tf

    print(f"Loading {H5_PATH}...")
    model = tf.keras.models.load_model(str(H5_PATH))
    model.summary()

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # ── Collect weights ────────────────────────────────────────────────────────
    weight_specs = []
    weight_arrays = []

    for layer in model.layers:
        for weight in layer.weights:
            arr = weight.numpy()
            weight_specs.append({
                "name": weight.name,
                "shape": list(arr.shape),
                "dtype": str(arr.dtype).replace("float32", "float32"),
            })
            weight_arrays.append(arr.astype(np.float32))

    # ── Write weights.bin ──────────────────────────────────────────────────────
    bin_path = OUT_DIR / "weights.bin"
    with open(bin_path, "wb") as f:
        for arr in weight_arrays:
            f.write(arr.tobytes())
    print(f"Wrote {bin_path} ({bin_path.stat().st_size / 1024:.1f} KB)")

    # ── Build model topology JSON ──────────────────────────────────────────────
    # Get Keras model config
    model_config = json.loads(model.to_json())

    # ── Fix Keras→tfjs naming differences ────────────────────────────────────
    # tfjs loadLayersModel expects "batch_input_shape", Keras exports "batch_shape"
    def fix_topology(obj):
        if isinstance(obj, dict):
            fixed = {}
            for k, v in obj.items():
                new_k = "batch_input_shape" if k == "batch_shape" else k
                fixed[new_k] = fix_topology(v)
            return fixed
        elif isinstance(obj, list):
            return [fix_topology(i) for i in obj]
        return obj

    model_config_fixed = fix_topology(model_config)

    model_json = {
        "modelTopology": {
            "keras_version": tf.__version__,
            "backend": "tensorflow",
            "model_config": model_config_fixed,
        },
        "weightsManifest": [{
            "paths": ["weights.bin"],
            "weights": weight_specs,
        }],
        "format": "layers-model",
        "generatedBy": f"keras {tf.__version__}",
        "convertedBy": "custom converter",
    }

    json_path = OUT_DIR / "model.json"
    json_path.write_text(json.dumps(model_json))
    print(f"Wrote {json_path}")
    print(f"\nDone! Files in {OUT_DIR}")

if __name__ == "__main__":
    import os
    os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
    convert()
