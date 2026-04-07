"""
train_glyph_model.py

Trains a tiny CNN glyph classifier using Keras/TensorFlow.
Saves the model in SavedModel format for tensorflowjs_converter.

Usage:
    py -3.12 scripts/train_glyph_model.py

Output:
    scripts/saved_model/        ← TF SavedModel format
    (then convert with: tensorflowjs_converter --input_format tf_saved_model scripts/saved_model public/models/glyph-classifier)
"""

import os
import sys
import random
import numpy as np
from pathlib import Path
from PIL import Image

# ─── Config ──────────────────────────────────────────────────────────────────
IMG_SIZE         = 48
BATCH_SIZE       = 32
EPOCHS           = 40
LEARNING_RATE    = 0.001
VALIDATION_SPLIT = 0.2
SEED             = 42

SCRIPT_DIR   = Path(__file__).parent
DATASET_DIR  = SCRIPT_DIR / "dataset"
SAVED_MODEL  = SCRIPT_DIR / "saved_model"
MODEL_OUT    = SCRIPT_DIR.parent / "public" / "models" / "glyph-classifier"

# ─── Load dataset ─────────────────────────────────────────────────────────────
def load_dataset():
    classes = sorted(d.name for d in DATASET_DIR.iterdir() if d.is_dir())
    print(f"📂 Classes ({len(classes)}): {', '.join(classes)}")

    images, labels = [], []
    for ci, cls in enumerate(classes):
        cls_dir = DATASET_DIR / cls
        files = list(cls_dir.glob("*.png"))
        print(f"  {cls}: {len(files)} images")
        for f in files:
            img = Image.open(f).convert("RGB").resize((IMG_SIZE, IMG_SIZE))
            arr = np.array(img, dtype=np.float32) / 127.5 - 1.0
            images.append(arr)
            labels.append(ci)

    X = np.stack(images)
    y = np.array(labels, dtype=np.int32)

    # Shuffle
    idx = np.random.permutation(len(X))
    X, y = X[idx], y[idx]

    split = int(len(X) * (1 - VALIDATION_SPLIT))
    X_train, X_val = X[:split], X[split:]
    y_train, y_val = y[:split], y[split:]

    print(f"\n✅ Loaded: {len(X_train)} train, {len(X_val)} val")
    return X_train, y_train, X_val, y_val, classes

# ─── Build model ──────────────────────────────────────────────────────────────
def build_model(num_classes):
    import tensorflow as tf
    model = tf.keras.Sequential([
        # Block 1: 48 → 24
        tf.keras.layers.Conv2D(16, 3, activation="relu", padding="same",
                               input_shape=(IMG_SIZE, IMG_SIZE, 3)),
        tf.keras.layers.MaxPooling2D(2),

        # Block 2: 24 → 12
        tf.keras.layers.Conv2D(32, 3, activation="relu", padding="same"),
        tf.keras.layers.MaxPooling2D(2),

        # Block 3: 12 → 6
        tf.keras.layers.Conv2D(64, 3, activation="relu", padding="same"),
        tf.keras.layers.MaxPooling2D(2),

        # Head
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dropout(0.4),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(num_classes, activation="softmax"),
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(LEARNING_RATE),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()
    return model

# ─── Train ────────────────────────────────────────────────────────────────────
def train():
    import tensorflow as tf
    import json

    random.seed(SEED)
    np.random.seed(SEED)
    tf.random.set_seed(SEED)

    print(f"🔧 TensorFlow {tf.__version__}\n")

    X_train, y_train, X_val, y_val, classes = load_dataset()
    model = build_model(len(classes))

    callbacks = [
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_accuracy", factor=0.5, patience=5, verbose=1
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor="val_accuracy", patience=10, restore_best_weights=True, verbose=1
        ),
    ]

    print(f"\nTraining {EPOCHS} epochs, batch={BATCH_SIZE}, img={IMG_SIZE}px\n")

    # Class weights: compensate for none having more samples
    from sklearn.utils.class_weight import compute_class_weight
    try:
        cw = compute_class_weight("balanced", classes=np.unique(y_train), y=y_train)
        class_weights = {i: w for i, w in enumerate(cw)}
        print(f"Class weights: {class_weights}\n")
    except ImportError:
        class_weights = None
        print("sklearn not found, training without class weights\n")

    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        batch_size=BATCH_SIZE,
        epochs=EPOCHS,
        callbacks=callbacks,
        class_weight=class_weights,
    )

    best_val_acc = max(history.history["val_accuracy"])
    print(f"\nBest val_accuracy: {best_val_acc:.1%}")

    # Save as H5 (universally compatible with tensorflowjs_converter)
    SAVED_MODEL.mkdir(parents=True, exist_ok=True)
    h5_path = SAVED_MODEL / "glyph_model.h5"
    model.save(str(h5_path))
    print(f"Model saved -> {h5_path}")

    # Also save labels
    MODEL_OUT.mkdir(parents=True, exist_ok=True)
    labels_path = MODEL_OUT / "labels.json"
    import json
    labels_path.write_text(json.dumps(classes, indent=2))
    print(f"Labels -> {labels_path}")

    print("\nNext step - convert to tfjs format:")
    print(f"  tensorflowjs_converter --input_format keras {h5_path} {MODEL_OUT}")


if __name__ == "__main__":
    train()
