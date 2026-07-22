# Bondi Trailer CAD

2D schematic designer for Bondi Food Trailers fit-outs. Plain HTML/JS, no build
dependencies, all measurements in exact millimetres.

- **Design view** — drag equipment onto the standard shell (2100 wide × 2450 high,
  40 mm walls, 1.5 m drawbar; only the length varies: 3.0 m single axle,
  3.5/4/4.5/5/5.5/6 m double axle).
- **Factory drawing** — 5-view manufacturing sheet, exported as AutoCAD 2000 DXF
  (millimetres, opens in ZWCAD).
- **Customer drawing** — clean concept PDF via print.
- Also exports PNG / SVG / JSON projects, with a My Trailers library
  (Export all / Import backup).

## Develop

Open `index.html` in a browser. Source modules live in `js/` and are loaded in
the order listed in `index.html`.

## Build

```sh
node build.js             # dist/bondi-trailer-cad.html (single-file app)
node build.js --artifact  # dist/artifact.html (Claude Artifact bundle, no doctype wrapper)
```

## Test

After any drawing/DXF change:

```sh
node tests/generate_sample.js   # writes tests/sample.dxf from the example project
pip install ezdxf
python3 tests/validate_dxf.py   # audits the DXF, checks AC1015 + mm units
```
