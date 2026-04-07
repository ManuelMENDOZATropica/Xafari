import json
from pathlib import Path
p = Path("public/models/glyph-classifier/model.json")
d = json.loads(p.read_text())
specs = d["weightsManifest"][0]["weights"]
print("Weight names in manifest:")
for s in specs:
    print(f"  {s['name']}  shape={s['shape']}")
