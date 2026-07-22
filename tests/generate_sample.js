#!/usr/bin/env node
/* Generate tests/sample.dxf — the factory sheet DXF for the default example
   project — so validate_dxf.py can check it with ezdxf. Run from anywhere:
     node tests/generate_sample.js */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
// load order matters: same as index.html (each file extends the BFT global)
for (const f of ['util', 'catalog', 'catalog_extra', 'scene', 'views', 'dxf', 'model', 'export', 'pdf']) {
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

// customer PDF with the project embedded, for validate_pdf.py round-trip
const pdf = BFT.pdf.pdfFromScene(BFT.views.buildCustomerSheet(project), BFT.layers, {
  title: 'Sample customer drawing', project,
});
if (!/^[\x00-\x7F]*$/.test(pdf)) throw new Error('PDF output is not pure ASCII');
const roundTrip = BFT.pdf.projectFromPDF(pdf);
if (JSON.stringify(roundTrip) !== JSON.stringify(project)) {
  throw new Error('embedded project did not round-trip');
}
const outPdf = path.join(__dirname, 'sample.pdf');
fs.writeFileSync(outPdf, pdf);
console.log('wrote', outPdf, '(' + pdf.length + ' bytes, project round-trip OK)');
