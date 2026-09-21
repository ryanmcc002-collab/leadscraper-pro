#!/usr/bin/env node
'use strict';
/* Writes resized WebP variants next to each product photo: images/{dir}/{NN}-{width}.webp
   build.js picks these up automatically for srcset. Run it once after adding or replacing photos.
   Needs Playwright's Chromium (it uses the browser canvas to resize; the build itself has no dependencies).
   Usage: node tools/make-image-variants.js            (skips variants that already exist)
          node tools/make-image-variants.js --force    (regenerates everything) */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SIZES = [160, 480, 800];          // thumbnails and fit rows / cards and tiles / hero and gallery
const QUALITY = { 160: 0.75, 480: 0.8, 800: 0.78 };
const force = process.argv.includes('--force');

let chromium;
try { chromium = require('playwright').chromium; }
catch { try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; } catch { console.error('Playwright not found. Install it (npm i -D playwright) or run this where it exists.'); process.exit(1); } }

const machines = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/machines.json'), 'utf8')).filter(m => m.published === true);
const dirs = new Set(machines.map(m => path.dirname(m.images.primary)));
const originals = [];
for (const d of dirs) for (const f of fs.readdirSync(path.join(ROOT, d))) {
  if (/-\d+\.webp$/.test(f) || !/\.(webp|jpe?g|png)$/i.test(f)) continue;
  originals.push(path.join(d, f));
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let made = 0, skipped = 0;
  for (const rel of originals) {
    const abs = path.join(ROOT, rel);
    const base = rel.replace(/\.[^.]+$/, '');
    const b64 = fs.readFileSync(abs).toString('base64');
    const mime = /\.webp$/i.test(rel) ? 'image/webp' : /\.png$/i.test(rel) ? 'image/png' : 'image/jpeg';
    const natural = await page.evaluate(async ({ b64, mime }) => { const i = new Image(); i.src = `data:${mime};base64,${b64}`; await i.decode(); return i.naturalWidth; }, { b64, mime });
    for (const w of SIZES) {
      const out = path.join(ROOT, `${base}-${w}.webp`);
      if (w >= natural) continue;                         // never upscale
      if (!force && fs.existsSync(out)) { skipped++; continue; }
      const data = await page.evaluate(async ({ b64, mime, w, q }) => {
        const img = new Image(); img.src = `data:${mime};base64,${b64}`; await img.decode();
        const s = w / img.naturalWidth;
        const c = document.createElement('canvas'); c.width = w; c.height = Math.round(img.naturalHeight * s);
        const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, c.width, c.height);
        return c.toDataURL('image/webp', q).split(',')[1];
      }, { b64, mime, w, q: QUALITY[w] });
      fs.writeFileSync(out, Buffer.from(data, 'base64'));
      made++;
    }
  }
  await browser.close();
  console.log(`${originals.length} photos: ${made} variants written, ${skipped} already there`);
})();
