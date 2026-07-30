/* Bondi Trailer CAD — SVG / PNG / JSON / print exporters.
   All exporters consume the same Scene the canvas draws, so exports match
   the screen exactly. SVG/PNG are for quick sharing (WhatsApp/WeChat/email);
   DXF (see dxf.js) is the manufacturing file. */
(function (root) {
  'use strict';
  const BFT = (root.BFT = root.BFT || {});

  const XML = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // px per mm in the SVG viewBox; geometry stays in mm via viewBox units.
  function svgFromScene(scene, layersDef, opts) {
    opts = opts || {};
    const margin = opts.margin != null ? opts.margin : 300;
    const dark = opts.dark !== false;
    const b = scene.bounds();
    const minX = b.minX - margin, w = b.w + 2 * margin;
    const minY = b.minY - margin, h = b.h + 2 * margin;
    const flipY = (y) => -(y); // SVG y-down; mirror the world
    const vb = `${r3(minX)} ${r3(-(b.maxY + margin))} ${r3(w)} ${r3(h)}`;
    const out = [];
    out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${Math.round(w / 5)}" height="${Math.round(h / 5)}" font-family="Arial, 'Microsoft YaHei', sans-serif">`);
    if (dark) out.push(`<rect x="${r3(minX)}" y="${r3(-(b.maxY + margin))}" width="${r3(w)}" height="${r3(h)}" fill="#111318"/>`);
    const lightDef = dark ? null : lightLayers(layersDef);
    for (const it of scene.items) {
      const def = (dark ? layersDef : lightDef)[it.la] || layersDef.OUTLINE;
      const col = def.color;
      const sw = (def.lw || 1.2) * 2.2; // mm stroke width
      const dash = def.dash ? ` stroke-dasharray="${def.dash.join(' ')}"` : '';
      switch (it.k) {
        case 'line':
          out.push(`<line x1="${r3(it.x1)}" y1="${r3(flipY(it.y1))}" x2="${r3(it.x2)}" y2="${r3(flipY(it.y2))}" stroke="${col}" stroke-width="${sw}"${dash}/>`);
          break;
        case 'pline': {
          const pts = it.pts.map((p) => `${r3(p[0])},${r3(flipY(p[1]))}`).join(' ');
          out.push(`<${it.closed ? 'polygon' : 'polyline'} points="${pts}" fill="none" stroke="${col}" stroke-width="${sw}"${dash}/>`);
          break;
        }
        case 'circle':
          out.push(`<circle cx="${r3(it.cx)}" cy="${r3(flipY(it.cy))}" r="${r3(it.r)}" fill="none" stroke="${col}" stroke-width="${sw}"${dash}/>`);
          break;
        case 'arc': {
          const a1 = BFT.util.deg2rad(it.a1), a2 = BFT.util.deg2rad(it.a2);
          let sweep = it.a2 - it.a1; while (sweep < 0) sweep += 360;
          const large = sweep > 180 ? 1 : 0;
          const x1 = it.cx + it.r * Math.cos(a1), y1 = it.cy + it.r * Math.sin(a1);
          const x2 = it.cx + it.r * Math.cos(a2), y2 = it.cy + it.r * Math.sin(a2);
          out.push(`<path d="M ${r3(x1)} ${r3(flipY(y1))} A ${r3(it.r)} ${r3(it.r)} 0 ${large} 0 ${r3(x2)} ${r3(flipY(y2))}" fill="none" stroke="${col}" stroke-width="${sw}"${dash}/>`);
          break;
        }
        case 'solid': {
          const pts = it.pts.map((p) => `${r3(p[0])},${r3(flipY(p[1]))}`).join(' ');
          out.push(`<polygon points="${pts}" fill="${col}" stroke="none"/>`);
          break;
        }
        case 'text': {
          const anchor = it.align === 'center' ? 'middle' : it.align === 'right' ? 'end' : 'start';
          const rot = it.rot ? ` transform="rotate(${-it.rot} ${r3(it.x)} ${r3(flipY(it.y))})"` : '';
          out.push(`<text x="${r3(it.x)}" y="${r3(flipY(it.y))}" font-size="${r3(it.h * 1.35)}" fill="${col}" text-anchor="${anchor}"${rot}>${XML(it.s)}</text>`);
          break;
        }
      }
    }
    out.push('</svg>');
    return out.join('\n');
  }

  function r3(v) { return Math.round(v * 1000) / 1000; }

  function darkOnWhite(c) {
    // keep saturated colors, swap near-white linework to black for print
    const map = { '#e8e8e8': '#111111', '#9a9a9a': '#777777' };
    return map[c] || c;
  }

  // Saving a file, most reliable path first:
  //  1. the browser's real "Save as…" dialog (Chrome/Edge desktop) — works
  //     even where downloads are blocked
  //  2. a programmatic download click
  //  3. a toast with a direct link, a Share button (tablets/phones: save to
  //     Files or send straight to WhatsApp) and a Copy button for text files
  let toastTimer = null;
  async function download(filename, content, mime) {
    const type = mime || 'application/octet-stream';
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    // Inside a claude.ai artifact the sandbox blocks every normal download
    // path; files must go through the viewer's download prompt instead.
    if (window.claude && window.claude.downloads) {
      const data = typeof content === 'string' ? content : blob;
      try {
        await window.claude.downloads.save({ filename, data });
        noteToast('✓ ' + filename);
        return;
      } catch (e) {
        const code = e && e.code;
        if (code === 'declined') return; // viewer said no — their call
        if (code === 'rejected_extension' || code === 'extension_not_enabled') {
          // .pdf/.dxf aren't on claude.ai's save allowlist; both are plain
          // text inside, so save with a .txt ending and tell the user to
          // rename — the contents are byte-identical.
          try {
            await window.claude.downloads.save({ filename: filename + '.txt', data });
            noteToast('✓ Saved as "' + filename + '.txt" — claude.ai only allows a .txt ending here. ' +
              'Rename the file to "' + filename + '" (just remove .txt) and it works as normal.');
            return;
          } catch (e2) {
            if (e2 && e2.code === 'declined') return;
          }
        }
        if (code === 'rate_limited') {
          noteToast('A download prompt is already open — answer it, then try again.');
          return;
        }
        // anything else: fall through and try the normal browser paths
      }
    }
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({ suggestedName: filename });
        const w = await handle.createWritable();
        await w.write(blob);
        await w.close();
        downloadToast(filename, blob, content, true);
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return; // user cancelled the dialog
        // blocked or unsupported here: fall through
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    try { a.click(); } catch (e) { /* the toast covers it */ }
    a.remove();
    setTimeout(() => { try { URL.revokeObjectURL(url); } catch (e) {} }, 60000);
    downloadToast(filename, blob, content, false);
  }

  // plain-text toast (no links) for messages from the artifact download path
  function noteToast(msg) {
    let t = document.getElementById('dl-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'dl-toast';
      document.body.appendChild(t);
    }
    t.innerHTML = '';
    const label = document.createElement('span');
    label.textContent = msg;
    t.appendChild(label);
    const close = document.createElement('button');
    close.textContent = '×';
    close.onclick = () => { t.style.display = 'none'; };
    t.appendChild(close);
    t.style.display = 'flex';
    clearTimeout(noteToast._t);
    noteToast._t = setTimeout(() => { t.style.display = 'none'; }, 12000);
  }

  function downloadToast(filename, blob, content, saved) {
    let t = document.getElementById('dl-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'dl-toast';
      document.body.appendChild(t);
    }
    t.innerHTML = '';
    const hide = () => { t.style.display = 'none'; };
    const label = document.createElement('span');
    label.textContent = (saved ? '✓ Saved ' : '📄 ') + filename;
    t.appendChild(label);

    if (!saved) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Save';
      t.appendChild(link);

      // share sheet: the reliable path on iPads/phones (Files, AirDrop,
      // WhatsApp/WeChat straight to the factory)
      try {
        const file = new File([blob], filename, { type: blob.type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          const share = document.createElement('a');
          share.href = '#';
          share.textContent = 'Share…';
          share.onclick = (e) => {
            e.preventDefault();
            navigator.share({ files: [file], title: filename }).catch(() => {});
          };
          t.appendChild(share);
        }
      } catch (e) { /* File constructor unsupported: skip share */ }

      if (typeof content === 'string' && navigator.clipboard) {
        const copy = document.createElement('a');
        copy.href = '#';
        copy.textContent = 'Copy';
        copy.title = 'Copy the file contents — paste into a text editor and save as ' + filename;
        copy.onclick = (e) => {
          e.preventDefault();
          navigator.clipboard.writeText(content).then(() => { copy.textContent = 'Copied ✓'; }).catch(() => {});
        };
        t.appendChild(copy);
      }

      // images can go straight to the clipboard: paste into WhatsApp/email
      if (blob.type === 'image/png' && navigator.clipboard && window.ClipboardItem) {
        const copyImg = document.createElement('a');
        copyImg.href = '#';
        copyImg.textContent = 'Copy image';
        copyImg.title = 'Copy the drawing to the clipboard — paste it into WhatsApp or an email';
        copyImg.onclick = (e) => {
          e.preventDefault();
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
            .then(() => { copyImg.textContent = 'Copied ✓ — paste it anywhere'; })
            .catch(() => { copyImg.textContent = 'Copy blocked here too'; });
        };
        t.appendChild(copyImg);
      }

      // embedded viewers (apps, artifact frames) can block ALL file saving;
      // say so instead of leaving the user guessing
      let embedded = false;
      try { embedded = window.top !== window.self; } catch (e) { embedded = true; }
      if (embedded) {
        const note = document.createElement('span');
        note.style.opacity = '0.85';
        note.textContent = '— if nothing saves, this viewer blocks downloads: use the desktop file version.';
        t.appendChild(note);
      }
    }

    const close = document.createElement('button');
    close.textContent = '✕';
    close.onclick = hide;
    t.appendChild(close);
    t.style.display = 'flex';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hide, saved ? 6000 : 60000);
  }

  // Layer table recolored for white-background (customer/print) output.
  function lightLayers(layersDef) {
    const out = {};
    for (const [name, def] of Object.entries(layersDef)) {
      out[name] = Object.assign({}, def, { color: darkOnWhite(def.color) });
    }
    // saturated screen colors read better slightly darker on white
    if (out.EQUIP) out.EQUIP.color = '#c8189f';
    if (out.TEXT) out.TEXT.color = '#c8189f';
    if (out.DIMS) out.DIMS.color = '#0b8f3a';
    if (out.FIXTURE) out.FIXTURE.color = '#0e7fa8';
    if (out.NOTES) out.NOTES.color = '#8a6d00';
    return out;
  }

  // Render the scene to a PNG using an offscreen canvas.
  function pngFromScene(scene, layersDef, pxWidth, done, opts) {
    opts = opts || {};
    const layers = opts.light ? lightLayers(layersDef) : layersDef;
    const b = scene.bounds();
    const margin = 300;
    const w = b.w + 2 * margin, h = b.h + 2 * margin;
    const scale = pxWidth / w;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = opts.light ? '#ffffff' : '#111318';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cam = {
      z: scale,
      ox: -(b.minX - margin) * scale,
      oy: (b.maxY + margin) * scale,
    };
    BFT.render.drawScene(ctx, scene, layers, cam);
    canvas.toBlob((blob) => done(blob), 'image/png');
  }

  // Print: open a window containing the sheet SVG (white background) and
  // trigger the browser's print dialog -> user saves as PDF at any size.
  function printScene(scene, layersDef, title) {
    const svg = svgFromScene(scene, layersDef, { dark: false });
    const win = window.open('', '_blank');
    if (!win) {
      // popups blocked (some browsers / embedded viewers): give the file anyway
      download((title || 'drawing') + '.svg', svg, 'image/svg+xml');
      alert('Popups are blocked here, so the drawing was saved as an SVG file instead.\nOpen it in any browser and print from there, or allow popups to print directly.');
      return;
    }
    win.document.write(
      '<!doctype html><html><head><title>' + XML(title || 'Drawing') + '</title>' +
      '<style>@page{size:A3 landscape;margin:8mm} html,body{margin:0} svg{width:100%;height:auto;display:block}</style>' +
      '</head><body>' + svg + '</body></html>'
    );
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }

  BFT.exporters = { svgFromScene, pngFromScene, printScene, download, lightLayers };
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined') module.exports = globalThis.BFT;

