"""Fix model.json: rename batch_shape -> batch_input_shape for tfjs compatibility"""
import json
from pathlib import Path

p = Path("public/models/glyph-classifier/model.json")
txt = p.read_text(encoding="utf-8")

before = txt.count('"batch_shape"')
fixed = txt.replace('"batch_shape"', '"batch_input_shape"')
after = fixed.count('"batch_input_shape"')

p.write_text(fixed, encoding="utf-8")
print(f"Fixed {before} occurrences of batch_shape -> batch_input_shape")

data = json.loads(fixed)
print(f"Format: {data.get('format')}")
print(f"model.json size: {p.stat().st_size} bytes")
