# Regenerating the README screenshots

```bash
pip install playwright && playwright install chromium
npm run build && npm run example:antd
python3 -m http.server 8765 &          # from the repo root
mkdir -p docs/screenshots/raw
python3 scripts/screenshots/demo_shots.py
python3 scripts/screenshots/antd_shots.py
python3 scripts/screenshots/components_shots.py   # also composes docs/screenshots/components.png
```

The raw captures land in `docs/screenshots/raw/` (git-ignored). The composite strips in `docs/screenshots/` were assembled from them at 1100 px height with 40 px gaps and rounded corners.
