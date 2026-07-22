#!/usr/bin/env node
/* Generate tests/sample.dxf — the factory sheet DXF for the default example
   project — so validate_dxf.py can check it with ezdxf. Run from anywhere:
     node tests/generate_sample.js */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
// load order matters: same as index.html (each file extends the BFT global)
for (const f of ['util', 'catalog', 'catalog_extra', 'scene', 'views', 'dxf', 'model']) {
  require(path.join(root, 'js', f + '.js'));
}
const BFT = globalThis.BFT;

const project = BFT.defaultProject();
const scene = BFT.views.buildSheet(project);
const dxf = BFT.dxf.dxfFromScene(scene, BFT.layers);

const out = path.join(__dirname, 'sample.dxf');
fs.writeFileSync(out, dxf);
console.log('wrote', out, '(' + dxf.length + ' bytes,',
  scene.items.length + ' scene items)');
