#!/usr/bin/env node
'use strict';
/* Rippa Victoria build. Reads data/*.json and the templates in src/, writes a static site to dist/.
   No dependencies. Run: npm run build */
const fs = require('fs');
const path = require('path');
const { fmt, weekly, esc, attr } = require('./src/lib/format');
const M = require('./src/lib/machine');
const layout = require('./src/layout');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const read = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const site = read('data/site.config.json');
const allMachines = read('data/machines.json');
const machines = allMachines.filter(m => m.published === true);
const byCategory = cat => machines.filter(m => m.category === cat);
const bySlug = slug => machines.find(m => m.slug === slug);

/* ---------- images ---------- */
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const t = b.toString('ascii', 12, 16);
    if (t === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (t === 'VP8L') { const x = b.readUInt32LE(21); return { w: (x & 0x3fff) + 1, h: ((x >> 14) & 0x3fff) + 1 }; }
    if (t === 'VP8X') return { w: b.readUIntLE(24, 3) + 1, h: b.readUIntLE(27, 3) + 1 };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  if (b.toString('ascii', 1, 4) === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  return null;
}
const sizeCache = new Map();
const missingImages = [];
function dims(rel) {
  if (sizeCache.has(rel)) return sizeCache.get(rel);
  const file = path.join(ROOT, rel);
  let d = null;
  if (fs.existsSync(file)) d = imageSize(file); else missingImages.push(rel);
  sizeCache.set(rel, d);
  return d;
}
/* <img> with width/height from the file, lazy unless told otherwise.
   If tools/make-image-variants.js has written {name}-{w}.webp files next to the photo, they go into srcset.
   Candidates are capped at 800 px wide so phones never download the full-size original. */
const VARIANT_WIDTHS = [160, 480, 800];
const MAX_CANDIDATE = 800;
function candidates(rel) {
  const base = rel.replace(/\.[^.]+$/, '');
  const list = [];
  for (const w of VARIANT_WIDTHS) {
    const v = `${base}-${w}.webp`;
    if (fs.existsSync(path.join(ROOT, v))) { list.push({ src: v, w }); dims(v); }
  }
  const d = dims(rel);
  if (d && (!list.length || d.w <= MAX_CANDIDATE)) list.push({ src: rel, w: d.w });
  return list.sort((a, b) => a.w - b.w);
}
function img(rel, { alt = '', w, h, eager = false, cls, sizes = '100vw' } = {}) {
  const d = dims(rel) || { w: 800, h: 800 };
  const width = w || d.w, height = h || d.h;
  const c = candidates(rel);
  const src = c.length ? c[c.length - 1].src : rel;
  const srcset = c.length > 1 ? ` srcset="${c.map(x => `/${x.src} ${x.w}w`).join(', ')}" sizes="${attr(sizes)}"` : '';
  return `<img src="/${src}"${srcset} alt="${attr(alt)}" width="${width}" height="${height}"` +
    (cls ? ` class="${attr(cls)}"` : '') +
    (eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"') + '>';
}

/* ---------- shared helpers passed to templates ---------- */
const fin = site.finance;
const weeklyFor = (price, dep = fin.default_deposit_pct, months = fin.default_term_months) => weekly(price, dep, months, fin.rate_pct);
const weeklyText = price => `or about ${fmt.price(weeklyFor(price))} a week`;
/* Source and srcset for swapping an image in from script (product gallery). */
function imgSource(rel) {
  const c = candidates(rel);
  return { src: '/' + (c.length ? c[c.length - 1].src : rel), srcset: c.length > 1 ? c.map(x => `/${x.src} ${x.w}w`).join(', ') : '' };
}
const ctx = { site, machines, byCategory, bySlug, img, imgSource, weeklyFor, weeklyText, fmt, esc, attr, M };

/* ---------- pages ---------- */
const pages = [
  ...require('./src/pages/home')(ctx),
  ...require('./src/pages/machine')(ctx),
  ...require('./src/pages/category')(ctx),
  ...require('./src/pages/simple')(ctx),
];

/* ---------- write ---------- */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
let count = 0;
for (const p of pages) {
  const html = layout({ site, ...p });
  if (/\bundefined\b|\bnull\b|NaN/.test(html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, ''))) {
    const m = html.match(/.{0,60}(undefined|null|NaN).{0,60}/);
    throw new Error(`Blank value leaked into ${p.path}: ${m && m[0]}`);
  }
  const out = path.join(DIST, p.path.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  count++;
}
fs.copyFileSync(path.join(ROOT, 'src/assets/styles.css'), path.join(DIST, 'assets/styles.css'));
fs.copyFileSync(path.join(ROOT, 'src/assets/app.js'), path.join(DIST, 'assets/app.js'));
fs.cpSync(path.join(ROOT, 'src/assets/fonts'), path.join(DIST, 'assets/fonts'), { recursive: true });

/* Only the photo folders that published machines use go out. Unpublished machines stay out of dist entirely. */
const usedDirs = new Set();
for (const m of machines) for (const rel of [m.images.primary, ...(m.images.gallery || [])]) usedDirs.add(path.dirname(rel));
for (const rel of sizeCache.keys()) usedDirs.add(path.dirname(rel));
for (const d of usedDirs) {
  const src = path.join(ROOT, d);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(DIST, d), { recursive: true });
}
if (missingImages.length) throw new Error('Missing images: ' + missingImages.join(', '));
console.log(`Built ${count} pages and ${usedDirs.size} image folders into dist/ (${machines.length} published machines, demo=${site.demo})`);
