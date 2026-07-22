/* Bondi Trailer CAD — PDF exporter (no dependencies).
   Draws a Scene as real vector PDF (A3 landscape, white background, same
   light colors as printing) and embeds the whole project JSON in a marker-
   delimited stream, so a customer PDF can be re-opened in the app and the
   layout edited. Output is pure ASCII (high bytes are octal-escaped), which
   keeps the file safe through every download/transfer path. */
(function (root) {
  'use strict';
  const BFT = (root.BFT = root.BFT || {});

  const MARK_A = '%BFT-PROJECT-v1%';
  const MARK_B = '%END-BFT-PROJECT%';

  // Helvetica AFM advance widths for chars 32..126 (units per 1000 em),
  // used to place center/right aligned text correctly.
  const HELV = [
    278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
    556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
    1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
    667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
    333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
    556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
  ];
  function textWidth(s, size) {
    let w = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      w += c >= 32 && c <= 126 ? HELV[c - 32] : 556;
    }
    return (w / 1000) * size;
  }

  // PDF literal string: escape specials; encode >127 as octal (WinAnsi is
  // latin-1 compatible for the symbols the drawings use, e.g. ° ± ø).
  function pstr(s) {
    let out = '';
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c === 40 || c === 41 || c === 92) out += '\\' + s[i];
      else if (c >= 32 && c <= 126) out += s[i];
      else if (c >= 128 && c <= 255) out += '\\' + c.toString(8).padStart(3, '0');
      else if (c === 10) out += '\\n';
      else out += '?'; // outside WinAnsi (e.g. CJK) — not drawable in Helvetica
    }
    return out;
  }

  function b64EncodeUtf8(s) {
    if (typeof btoa === 'function') return btoa(unescape(encodeURIComponent(s)));
    return Buffer.from(s, 'utf8').toString('base64');
  }
  function b64DecodeUtf8(b) {
    if (typeof atob === 'function') return decodeURIComponent(escape(atob(b)));
    return Buffer.from(b, 'base64').toString('utf8');
  }

  function hexRGB(hex) {
    const m = /^#([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return [0, 0, 0];
    const n = parseInt(m[1], 16);
    const f = (v) => Math.round((v / 255) * 1000) / 1000;
    return [f((n >> 16) & 255), f((n >> 8) & 255), f(n & 255)];
  }

  const MM = 72 / 25.4; // pt per mm
  const PAGE_W = 420 * MM, PAGE_H = 297 * MM; // A3 landscape
  const r2 = (v) => Math.round(v * 100) / 100;

  // Scene (world mm, y-up) -> single page content stream. PDF is y-up too,
  // so only scale + offset are needed.
  function contentFromScene(scene, layersDef) {
    const light = BFT.exporters.lightLayers(layersDef);
    const margin = 300; // mm of world space around the drawing, like SVG/print
    const pageMargin = 8 * MM;
    const b = scene.bounds();
    const w = b.w + 2 * margin, h = b.h + 2 * margin;
    const s = Math.min((PAGE_W - 2 * pageMargin) / (w * MM), (PAGE_H - 2 * pageMargin) / (h * MM)) * MM;
    const offX = (PAGE_W - w * s) / 2 - (b.minX - margin) * s;
    const offY = (PAGE_H - h * s) / 2 - (b.minY - margin) * s;
    const X = (x) => r2(offX + x * s);
    const Y = (y) => r2(offY + y * s);
    const L = ['q', '1 J 1 j'];
    for (const it of scene.items) {
      const def = light[it.la] || light.OUTLINE || layersDef.OUTLINE;
      const [r, g, bl] = hexRGB(def.color);
      const lw = r2(Math.max(0.35, (def.lw || 1.2) * 2.2 * s));
      const dash = def.dash ? '[' + def.dash.map((d) => r2(d * s)).join(' ') + '] 0 d' : '[] 0 d';
      const stroke = `${r} ${g} ${bl} RG ${lw} w ${dash}`;
      switch (it.k) {
        case 'line':
          L.push(stroke, `${X(it.x1)} ${Y(it.y1)} m ${X(it.x2)} ${Y(it.y2)} l S`);
          break;
        case 'pline': {
          const p = it.pts.map((q, i) => `${X(q[0])} ${Y(q[1])} ${i ? 'l' : 'm'}`).join(' ');
          L.push(stroke, p + (it.closed ? ' h S' : ' S'));
          break;
        }
        case 'circle':
          L.push(stroke, arcPath(it.cx, it.cy, it.r, 0, 360, X, Y, s) + ' S');
          break;
        case 'arc':
          L.push(stroke, arcPath(it.cx, it.cy, it.r, it.a1, it.a2, X, Y, s) + ' S');
          break;
        case 'solid': {
          const p = it.pts.map((q, i) => `${X(q[0])} ${Y(q[1])} ${i ? 'l' : 'm'}`).join(' ');
          L.push(`${r} ${g} ${bl} rg`, p + ' h f');
          break;
        }
        case 'text': {
          const size = r2(it.h * 1.35 * s);
          if (size < 1) break;
          const str = pstr(it.s);
          const shift = it.align === 'center' ? -textWidth(it.s, size) / 2
            : it.align === 'right' ? -textWidth(it.s, size) : 0;
          L.push(`${r} ${g} ${bl} rg`, 'BT', `/F1 ${size} Tf`);
          if (it.rot) {
            const a = BFT.util.deg2rad(it.rot);
            const c = r2(Math.cos(a)), sn = r2(Math.sin(a));
            L.push(`${c} ${sn} ${r2(-sn)} ${c} ${r2(X(it.x) + shift * Math.cos(a))} ${r2(Y(it.y) + shift * Math.sin(a))} Tm`);
          } else {
            L.push(`1 0 0 1 ${r2(X(it.x) + shift)} ${Y(it.y)} Tm`);
          }
          L.push(`(${str}) Tj`, 'ET');
          break;
        }
      }
    }
    L.push('Q');
    return L.join('\n');
  }

  // circle/arc as cubic beziers, <=90 degrees per segment (world CCW angles)
  function arcPath(cx, cy, rad, a1, a2, X, Y, s) {
    let sweep = a2 - a1;
    while (sweep <= 0) sweep += 360;
    const segs = Math.max(1, Math.ceil(sweep / 90));
    const d = BFT.util.deg2rad(sweep / segs);
    const k = (4 / 3) * Math.tan(d / 4);
    let a = BFT.util.deg2rad(a1);
    const P = (ang) => [cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)];
    let [px, py] = P(a);
    let out = `${X(px)} ${Y(py)} m`;
    for (let i = 0; i < segs; i++) {
      const b = a + d;
      const [x2, y2] = P(b);
      const c1x = px - rad * Math.sin(a) * k, c1y = py + rad * Math.cos(a) * k;
      const c2x = x2 + rad * Math.sin(b) * k, c2y = y2 - rad * Math.cos(b) * k;
      out += ` ${X(c1x)} ${Y(c1y)} ${X(c2x)} ${Y(c2y)} ${X(x2)} ${Y(y2)} c`;
      a = b; px = x2; py = y2;
    }
    return out;
  }

  /* Build the complete PDF file (ASCII string).
     opts: { title, project } — project (the live project object) is embedded
     as base64 JSON so the PDF can be re-imported. */
  function pdfFromScene(scene, layersDef, opts) {
    opts = opts || {};
    const content = contentFromScene(scene, layersDef);
    const embedded = opts.project
      ? MARK_A + b64EncodeUtf8(JSON.stringify(opts.project)) + MARK_B
      : '';
    const objs = [];
    objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
    objs[3] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${r2(PAGE_W)} ${r2(PAGE_H)}] ` +
      '/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>';
    objs[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
    objs[5] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
    objs[6] = `<< /Type /BFTProject /Length ${embedded.length} >>\nstream\n${embedded}\nendstream`;
    objs[7] = `<< /Title (${pstr(opts.title || 'Bondi Trailer CAD drawing')}) ` +
      `/Producer (Bondi Trailer CAD ${BFT.VERSION}) >>`;

    let out = '%PDF-1.4\n';
    const offsets = [];
    for (let i = 1; i < objs.length; i++) {
      offsets[i] = out.length;
      out += `${i} 0 obj\n${objs[i]}\nendobj\n`;
    }
    const xref = out.length;
    out += `xref\n0 ${objs.length}\n0000000000 65535 f \n`;
    for (let i = 1; i < objs.length; i++) {
      out += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    }
    out += `trailer\n<< /Size ${objs.length} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return out;
  }

  // Pull an embedded project back out of PDF bytes read as text.
  function projectFromPDF(text) {
    const i = text.indexOf(MARK_A);
    if (i < 0) return null;
    const j = text.indexOf(MARK_B, i);
    if (j < 0) return null;
    const b64 = text.slice(i + MARK_A.length, j).replace(/\s+/g, '');
    return JSON.parse(b64DecodeUtf8(b64));
  }

  BFT.pdf = { pdfFromScene, projectFromPDF, MARK_A, MARK_B };
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined') module.exports = globalThis.BFT;
