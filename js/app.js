/* Bondi Trailer CAD — application/UI. */
(function (root) {
  'use strict';
  const BFT = root.BFT;
  const U = BFT.util;

  const store = new BFT.Store();
  let cam = { z: 0.12, ox: 120, oy: 520 };
  let mode = 'plan';            // 'plan' | 'sheet'
  let tool = 'select';          // 'select' | 'dim' | 'note'
  let selection = null;         // {type:'item', id} | {type:'feature', id}
  let scene = null;             // cached scene for current mode
  let dimPick = [];             // dimension tool: picked points (interior mm)
  let mouseMM = { x: 0, y: 0 };
  let cv, ctx, statusEl;
  let showDims = false; // design-view dimension detail toggle

  const $ = (id) => document.getElementById(id);

  // ------------------------------------------------------------------
  // scene building
  // ------------------------------------------------------------------
  function rebuild() {
    const p = store.project;
    // design canvas: headline dims by default, everything via the Dims
    // toggle, nothing at all mid-drag (the green guides carry the numbers);
    // the factory drawing and exports always carry the full set
    const dragging = drag && drag.kind === 'item';
    scene = mode === 'sheet' ? BFT.views.buildSheet(p)
      : mode === 'sales' ? BFT.views.buildCustomerSheet(p)
      : mode === 'heights' ? BFT.views.buildHeightsView(p)
      : BFT.views.buildPlan(p, {
          selection, en: true,
          dims: dragging ? false : (showDims ? 'full' : 'overview'),
        });
    refreshWarnings();
    draw();
  }

  // scene for exports: what the current mode shows (plan exports without
  // selection markers)
  function exportScene() {
    const p = store.project;
    return mode === 'sheet' ? BFT.views.buildSheet(p)
      : mode === 'sales' ? BFT.views.buildCustomerSheet(p)
      : BFT.views.buildPlan(p, {});
  }

  let LIGHTLAYERS = null;
  function draw() {
    if (!ctx || !scene) return;
    if (!LIGHTLAYERS) LIGHTLAYERS = BFT.exporters.lightLayers(BFT.layers);
    const w = cv.width, h = cv.height;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    if (mode === 'plan') {
      BFT.render.drawGrid(ctx, cam, w, h, 100, 'rgba(40,70,100,0.06)');
      BFT.render.drawGrid(ctx, cam, w, h, 1000, 'rgba(40,70,100,0.13)');
    }
    BFT.render.drawScene(ctx, scene, LIGHTLAYERS, cam);
    if (mode === 'plan') { drawGuides(); drawWarningHighlights(); drawBalanceMarkers(); }

    // empty-trailer guidance
    if (mode === 'plan' && !store.project.items.length && !drag) {
      const t = store.project.trailer;
      const cxs = cam.ox + (t.boxLength / 2) * cam.z;
      const cys = cam.oy - (t.boxWidth / 2) * cam.z;
      ctx.fillStyle = 'rgba(40,55,70,0.55)';
      ctx.font = '15px Arial, "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Your trailer is ready — click equipment on the left to add it', cxs, cys);
    }

    // dimension tool feedback
    if (tool === 'dim' && dimPick.length) {
      const t = store.project.trailer;
      ctx.fillStyle = '#b8860b';
      for (const p of dimPick) {
        const sx = cam.ox + (p.x + t.wall) * cam.z, sy = cam.oy - (p.y + t.wall) * cam.z;
        ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fill();
      }
    }
    // snap marker
    if (tool === 'dim' && snapMark) {
      const t = store.project.trailer;
      const sx = cam.ox + (snapMark.x + t.wall) * cam.z, sy = cam.oy - (snapMark.y + t.wall) * cam.z;
      ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 1.5;
      ctx.strokeRect(sx - 6, sy - 6, 12, 12);
    }
  }

  // ------------------------------------------------------------------
  // layout sanity warnings: overlaps, walkway clearance, blocked door,
  // items outside the interior. Benches are the base layer (equipment
  // sits on them); overhead hoods and connection markers are exempt.
  // ------------------------------------------------------------------
  let warnings = [];

  function layoutWarnings() {
    const p = store.project;
    const { iL, iW } = store.interior();
    const t = p.trailer;
    const warns = [];
    const rects = p.items
      .filter((i) => !i.overhead && !i.svc)
      .map((it) => {
        const [fw, fd] = U.footprint(it);
        return { it, x: it.x, y: it.y, w: fw, d: fd };
      });

    // overhangs (past a bench edge or wall line) are deliberate all the
    // time in real builds - only true clashes get flagged
    const isBench = (r) => r.it.catId === 'bench';
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i], b = rects[j];
        if (isBench(a) || isBench(b)) continue;
        const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        const oy = Math.min(a.y + a.d, b.y + b.d) - Math.max(a.y, b.y);
        if (ox > 5 && oy > 5) warns.push({ msg: a.it.en + ' overlaps ' + b.it.en, ids: [a.it.id, b.it.id] });
      }
    }

    // anything parked in front of a door opening
    for (const f of (p.features || []).filter((f) => f.type === 'door')) {
      const depth = 600; // clear zone inside the door
      let zone = null;
      if (f.wall === 'right') zone = { x: iL - depth, y: f.offset - t.wall, w: depth, d: f.width };
      if (f.wall === 'left') zone = { x: 0, y: f.offset - t.wall, w: depth, d: f.width };
      if (f.wall === 'bottom') zone = { x: f.offset - t.wall, y: 0, w: f.width, d: depth };
      if (f.wall === 'top') zone = { x: f.offset - t.wall, y: iW - depth, w: f.width, d: depth };
      if (!zone) continue;
      for (const r of rects) {
        const ox = Math.min(r.x + r.w, zone.x + zone.w) - Math.max(r.x, zone.x);
        const oy = Math.min(r.y + r.d, zone.y + zone.d) - Math.max(r.y, zone.y);
        if (ox > 30 && oy > 30) warns.push({ msg: r.it.en + ' blocks the door', ids: [r.it.id] });
      }
    }
    return warns;
  }

  function refreshWarnings() {
    warnings = mode === 'plan' ? layoutWarnings() : [];
    const el = $('warnings');
    if (!warnings.length) { el.classList.add('hidden'); el.innerHTML = ''; return; }
    el.classList.remove('hidden');
    el.innerHTML = warnings.slice(0, 5).map((w) => '<div>⚠ ' + w.msg + '</div>').join('') +
      (warnings.length > 5 ? '<div>… and ' + (warnings.length - 5) + ' more</div>' : '');
  }

  function drawWarningHighlights() {
    if (!warnings.length) return;
    const t = store.project.trailer;
    const flagged = new Set(warnings.flatMap((w) => w.ids));
    ctx.save();
    ctx.strokeStyle = '#d92626';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 5]);
    for (const it of store.project.items) {
      if (!flagged.has(it.id)) continue;
      const [fw, fd] = U.footprint(it);
      const x = cam.ox + (it.x + t.wall) * cam.z, y = cam.oy - (it.y + t.wall + fd) * cam.z;
      ctx.strokeRect(x - 4, y - 4, fw * cam.z + 8, fd * cam.z + 8);
    }
    ctx.restore();
  }

  // Balance markers: axle line and the load's balance point on the plan.
  function drawBalanceMarkers() {
    const t = store.project.trailer;
    const b = BFT.balance(store.project);
    const ax = cam.ox + (t.axlePos || t.boxLength * 0.55) * cam.z;
    const gx = cam.ox + b.cogX * cam.z;
    const yTop = cam.oy - t.boxWidth * cam.z, yBot = cam.oy;
    ctx.save();
    // axle line
    ctx.strokeStyle = 'rgba(90,110,130,0.55)';
    ctx.setLineDash([10, 6]);
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(ax, yTop - 14); ctx.lineTo(ax, yBot + 14); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(90,110,130,0.8)';
    ctx.font = 'bold 10px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AXLES', ax, yBot + 26);
    // balance point ⊕
    const gy = cam.oy - (t.boxWidth / 2) * cam.z;
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(gx, gy, 9, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(gx - 13, gy); ctx.lineTo(gx + 13, gy);
    ctx.moveTo(gx, gy - 13); ctx.lineTo(gx, gy + 13);
    ctx.stroke();
    ctx.fillStyle = '#b45309';
    ctx.fillText('BALANCE', gx, gy - 18);
    ctx.restore();
  }

  // Guides for a selected window/door: highlight the opening and show the
  // distance from each end of its wall.
  function drawFeatureGuides(f) {
    const t = store.project.trailer;
    const horiz = f.wall === 'bottom' || f.wall === 'top';
    const wallLen = featureWallLength(f);
    const X = (x) => cam.ox + x * cam.z;
    const Y = (y) => cam.oy - y * cam.z;
    ctx.save();
    ctx.strokeStyle = '#0b8f3a';
    ctx.fillStyle = '#0b8f3a';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.textAlign = 'center';
    const label = (x, y, s) => {
      const wpx = ctx.measureText(s).width + 10;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - wpx / 2, y - 10, wpx, 15);
      ctx.fillStyle = '#0b8f3a';
      ctx.fillText(s, x, y + 2);
    };
    // highlight the opening
    ctx.lineWidth = 3;
    if (horiz) {
      const y = f.wall === 'bottom' ? Y(t.wall / 2) : Y(t.boxWidth - t.wall / 2);
      ctx.beginPath(); ctx.moveTo(X(f.offset), y); ctx.lineTo(X(f.offset + f.width), y); ctx.stroke();
      ctx.lineWidth = 1.3;
      ctx.setLineDash([6, 4]);
      const gy = f.wall === 'bottom' ? Y(-260) : Y(t.boxWidth + 260);
      if (f.offset > 1) {
        ctx.beginPath(); ctx.moveTo(X(0), gy); ctx.lineTo(X(f.offset), gy); ctx.stroke();
        ctx.setLineDash([]);
        label((X(0) + X(f.offset)) / 2, gy - 9, U.fmt(f.offset) + ' mm');
        ctx.setLineDash([6, 4]);
      }
      const rem = wallLen - f.offset - f.width;
      if (rem > 1) {
        ctx.beginPath(); ctx.moveTo(X(f.offset + f.width), gy); ctx.lineTo(X(wallLen), gy); ctx.stroke();
        ctx.setLineDash([]);
        label((X(f.offset + f.width) + X(wallLen)) / 2, gy - 9, U.fmt(rem) + ' mm');
      }
    } else {
      const x = f.wall === 'left' ? X(t.wall / 2) : X(t.boxLength - t.wall / 2);
      ctx.beginPath(); ctx.moveTo(x, Y(f.offset)); ctx.lineTo(x, Y(f.offset + f.width)); ctx.stroke();
      ctx.lineWidth = 1.3;
      ctx.setLineDash([6, 4]);
      const gx = f.wall === 'left' ? X(-260) : X(t.boxLength + 260);
      if (f.offset > 1) {
        ctx.beginPath(); ctx.moveTo(gx, Y(0)); ctx.lineTo(gx, Y(f.offset)); ctx.stroke();
        ctx.setLineDash([]);
        label(gx, (Y(0) + Y(f.offset)) / 2, U.fmt(f.offset) + ' mm');
        ctx.setLineDash([6, 4]);
      }
      const rem = wallLen - f.offset - f.width;
      if (rem > 1) {
        ctx.beginPath(); ctx.moveTo(gx, Y(f.offset + f.width)); ctx.lineTo(gx, Y(wallLen)); ctx.stroke();
        ctx.setLineDash([]);
        label(gx, (Y(f.offset + f.width) + Y(wallLen)) / 2, U.fmt(rem) + ' mm');
      }
    }
    ctx.restore();
  }

  // Live guides while designing: how far the selected item sits from the
  // drawbar end and from the serving side, in plain millimetres.
  function drawGuides() {
    const sf = selectedFeature();
    if (sf) return drawFeatureGuides(sf);
    const it = selectedItem();
    if (!it) return;
    const t = store.project.trailer;
    const [fw, fd] = U.footprint(it);
    const X = (x) => cam.ox + (x + t.wall) * cam.z;
    const Y = (y) => cam.oy - (y + t.wall) * cam.z;
    ctx.save();
    ctx.strokeStyle = '#0b8f3a';
    ctx.fillStyle = '#0b8f3a';
    ctx.lineWidth = 1.3;
    ctx.setLineDash([6, 4]);
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.textAlign = 'center';
    const label = (x, y, s) => {
      const wpx = ctx.measureText(s).width + 10;
      ctx.setLineDash([]);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - wpx / 2, y - 10, wpx, 15);
      ctx.fillStyle = '#0b8f3a';
      ctx.fillText(s, x, y + 2);
      ctx.setLineDash([6, 4]);
    };
    if (it.x > 1) {
      const gy = Y(it.y + fd / 2);
      ctx.beginPath(); ctx.moveTo(X(0), gy); ctx.lineTo(X(it.x), gy); ctx.stroke();
      label((X(0) + X(it.x)) / 2, gy - 9, U.fmt(it.x) + ' mm');
    }
    if (it.y > 1) {
      const gx = X(it.x + fw / 2);
      ctx.beginPath(); ctx.moveTo(gx, Y(0)); ctx.lineTo(gx, Y(it.y)); ctx.stroke();
      label(gx, (Y(0) + Y(it.y)) / 2, U.fmt(it.y) + ' mm');
    }
    ctx.restore();
  }

  // ------------------------------------------------------------------
  // camera helpers
  // ------------------------------------------------------------------
  function fit() {
    const b = scene.bounds();
    const pad = 60;
    const zx = (cv.width - 2 * pad) / b.w;
    const zy = (cv.height - 2 * pad) / b.h;
    cam.z = Math.min(zx, zy);
    cam.ox = (cv.width - b.w * cam.z) / 2 - b.minX * cam.z;
    cam.oy = cv.height - ((cv.height - b.h * cam.z) / 2) + b.minY * cam.z;
    draw();
  }

  function screenToWorld(sx, sy) {
    return { x: (sx - cam.ox) / cam.z, y: (cam.oy - sy) / cam.z };
  }

  // world (plan coords) -> interior coords
  function worldToInterior(wpt) {
    const t = store.project.trailer;
    return { x: wpt.x - t.wall, y: wpt.y - t.wall };
  }

  // ------------------------------------------------------------------
  // hit testing & snapping (interior mm)
  // ------------------------------------------------------------------
  function hitItem(ipt) {
    const items = store.project.items;
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      const [fw, fd] = U.footprint(it);
      if (U.pointInRect(ipt.x, ipt.y, it.x, it.y, fw, fd)) return it;
    }
    return null;
  }

  // windows/doors live on the walls: a click band along each wall selects them
  function hitFeature(wpt) {
    const t = store.project.trailer;
    const L = t.boxLength, W = t.boxWidth;
    const band = Math.max(180, 14 / cam.z);
    for (const f of store.project.features || []) {
      const a = f.offset - 60, b = f.offset + f.width + 60;
      if (f.wall === 'bottom' && wpt.y > -band && wpt.y < t.wall + band && wpt.x >= a && wpt.x <= b) return f;
      if (f.wall === 'top' && wpt.y > W - t.wall - band && wpt.y < W + band && wpt.x >= a && wpt.x <= b) return f;
      if (f.wall === 'left' && wpt.x > -band && wpt.x < t.wall + band && wpt.y >= a && wpt.y <= b) return f;
      if (f.wall === 'right' && wpt.x > L - t.wall - band && wpt.x < L + band && wpt.y >= a && wpt.y <= b) return f;
    }
    return null;
  }

  function selectedFeature() {
    if (!selection || selection.type !== 'feature') return null;
    return (store.project.features || []).find((f) => f.id === selection.id) || null;
  }

  function featureWallLength(f) {
    const t = store.project.trailer;
    return f.wall === 'left' || f.wall === 'right' ? t.boxWidth : t.boxLength;
  }

  function snapPositions(dragged) {
    const { iL, iW } = store.interior();
    const xs = [0, iL], ys = [0, iW];
    for (const it of store.project.items) {
      if (it.id === dragged.id) continue;
      const [fw, fd] = U.footprint(it);
      xs.push(it.x, it.x + fw);
      ys.push(it.y, it.y + fd);
    }
    return { xs, ys };
  }

  function applySnap(item, nx, ny, disable) {
    const grid = 10;
    const [fw, fd] = U.footprint(item);
    if (disable) return { x: nx, y: ny };
    let x = U.snap(nx, grid), y = U.snap(ny, grid);
    const tol = Math.max(8, 12 / cam.z);
    const { xs, ys } = snapPositions(item);
    for (const e of xs) {
      if (Math.abs(nx - e) < tol) x = e;
      if (Math.abs(nx + fw - e) < tol) x = e - fw;
    }
    for (const e of ys) {
      if (Math.abs(ny - e) < tol) y = e;
      if (Math.abs(ny + fd - e) < tol) y = e - fd;
    }
    return { x, y };
  }

  let snapMark = null;
  function snapPoint(ipt) {
    // for the dimension tool: wall corners + item corners + item mid-edges
    const { iL, iW } = store.interior();
    const pts = [
      { x: 0, y: 0 }, { x: iL, y: 0 }, { x: 0, y: iW }, { x: iL, y: iW },
    ];
    for (const it of store.project.items) {
      const [fw, fd] = U.footprint(it);
      pts.push(
        { x: it.x, y: it.y }, { x: it.x + fw, y: it.y },
        { x: it.x, y: it.y + fd }, { x: it.x + fw, y: it.y + fd },
        { x: it.x + fw / 2, y: it.y }, { x: it.x + fw / 2, y: it.y + fd },
        { x: it.x, y: it.y + fd / 2 }, { x: it.x + fw, y: it.y + fd / 2 }
      );
    }
    for (const f of store.project.features) {
      const t = store.project.trailer;
      if (f.wall === 'bottom') { pts.push({ x: f.offset - t.wall, y: -t.wall }, { x: f.offset + f.width - t.wall, y: -t.wall }); }
      if (f.wall === 'top') { pts.push({ x: f.offset - t.wall, y: iW + t.wall }, { x: f.offset + f.width - t.wall, y: iW + t.wall }); }
    }
    let best = null, bd = Math.max(60, 14 / cam.z);
    for (const p of pts) {
      const d = U.dist(ipt.x, ipt.y, p.x, p.y);
      if (d < bd) { bd = d; best = p; }
    }
    return best || { x: Math.round(ipt.x), y: Math.round(ipt.y) };
  }

  // ------------------------------------------------------------------
  // pointer interaction
  // ------------------------------------------------------------------
  let drag = null; // {kind:'pan'|'item', ...}
  let spaceDown = false;
  const touches = new Map(); // active pointers for pinch zoom
  let pinch = null;

  function onPointerDown(e) {
    cv.setPointerCapture(e.pointerId);
    touches.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
    if (touches.size === 2) {
      // two fingers: switch from dragging to pinch-zoom
      drag = null;
      const [a, b] = [...touches.values()];
      pinch = { d0: Math.hypot(b.x - a.x, b.y - a.y), z0: cam.z };
      return;
    }
    const sx = e.offsetX, sy = e.offsetY;
    if (e.button === 1 || spaceDown || mode === 'sheet') {
      drag = { kind: 'pan', sx, sy, ox: cam.ox, oy: cam.oy };
      return;
    }
    const wpt = screenToWorld(sx, sy);
    const ipt = worldToInterior(wpt);

    if (tool === 'dim') {
      const p = snapPoint(ipt);
      dimPick.push(p);
      if (dimPick.length === 2) {
        const [a, b] = dimPick;
        store.checkpoint();
        const dx = Math.abs(b.x - a.x), dy = Math.abs(b.y - a.y);
        if (dx >= dy) {
          store.project.dims.push({ dir: 'h', x1: Math.min(a.x, b.x), x2: Math.max(a.x, b.x), yRef: (a.y + b.y) / 2, yDim: (a.y + b.y) / 2 + 300 });
        } else {
          store.project.dims.push({ dir: 'v', y1: Math.min(a.y, b.y), y2: Math.max(a.y, b.y), xRef: (a.x + b.x) / 2, xDim: (a.x + b.x) / 2 + 300 });
        }
        dimPick = [];
        commit();
      }
      rebuild();
      return;
    }

    if (tool === 'note') {
      const text = prompt('Note text 备注:');
      if (text) {
        store.checkpoint();
        store.project.notes.push({ x: Math.round(ipt.x), y: Math.round(ipt.y), text, h: 70 });
        commit();
      }
      setTool('select');
      return;
    }

    // select tool: equipment first, then wall openings, then pan
    const hit = hitItem(ipt);
    if (hit) {
      selection = { type: 'item', id: hit.id };
      store.checkpoint();
      drag = { kind: 'item', id: hit.id, offX: ipt.x - hit.x, offY: ipt.y - hit.y, moved: false };
    } else {
      const f = hitFeature(wpt);
      if (f) {
        selection = { type: 'feature', id: f.id };
        store.checkpoint();
        const axisPos = f.wall === 'left' || f.wall === 'right' ? wpt.y : wpt.x;
        drag = { kind: 'feature', id: f.id, grab: axisPos - f.offset, moved: false };
      } else {
        selection = null;
        drag = { kind: 'pan', sx, sy, ox: cam.ox, oy: cam.oy };
      }
    }
    refreshProps();
    rebuild();
  }

  function onPointerMove(e) {
    if (touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
    if (pinch && touches.size === 2) {
      const [a, b] = [...touches.values()];
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      if (pinch.d0 > 10) {
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const w = screenToWorld(mid.x, mid.y);
        cam.z = U.clamp(pinch.z0 * (d / pinch.d0), 0.01, 6);
        cam.ox = mid.x - w.x * cam.z;
        cam.oy = mid.y + w.y * cam.z;
        draw();
      }
      return;
    }
    const sx = e.offsetX, sy = e.offsetY;
    const wpt = screenToWorld(sx, sy);
    const ipt = worldToInterior(wpt);
    mouseMM = ipt;
    status();

    if (tool === 'dim') { snapMark = snapPoint(ipt); draw(); }

    if (!drag) return;
    if (drag.kind === 'pan') {
      cam.ox = drag.ox + (sx - drag.sx);
      cam.oy = drag.oy + (sy - drag.sy);
      draw();
      return;
    }
    if (drag.kind === 'item') {
      const it = store.project.items.find((i) => i.id === drag.id);
      if (!it) return;
      const pos = applySnap(it, ipt.x - drag.offX, ipt.y - drag.offY, e.shiftKey);
      if (pos.x !== it.x || pos.y !== it.y) {
        it.x = Math.round(pos.x * 10) / 10;
        it.y = Math.round(pos.y * 10) / 10;
        drag.moved = true;
        refreshProps();
        rebuild();
      }
      return;
    }
    if (drag.kind === 'feature') {
      const f = (store.project.features || []).find((x) => x.id === drag.id);
      if (!f) return;
      const axisPos = f.wall === 'left' || f.wall === 'right' ? wpt.y : wpt.x;
      const max = featureWallLength(f) - f.width;
      const off = U.clamp(e.shiftKey ? Math.round(axisPos - drag.grab) : U.snap(axisPos - drag.grab, 10), 0, Math.max(0, max));
      if (off !== f.offset) {
        f.offset = off;
        drag.moved = true;
        rebuild();
      }
    }
  }

  function onPointerUp(e) {
    touches.delete(e.pointerId);
    if (touches.size < 2) pinch = null;
    if (drag && (drag.kind === 'item' || drag.kind === 'feature')) {
      if (!drag.moved) store.undoStack.pop(); // no-op click, drop checkpoint
      else {
        commit(true);
        if (drag.kind === 'feature') refreshFeaturesPanel();
      }
    }
    drag = null;
  }

  function onWheel(e) {
    e.preventDefault();
    const f = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    const sx = e.offsetX, sy = e.offsetY;
    const w = screenToWorld(sx, sy);
    cam.z = U.clamp(cam.z * f, 0.01, 6);
    cam.ox = sx - w.x * cam.z;
    cam.oy = sy + w.y * cam.z;
    draw();
  }

  // ------------------------------------------------------------------
  // commands
  // ------------------------------------------------------------------
  function commit(noCheckpoint) {
    store.save();
    rebuild();
    refreshProps();
    refreshBalancePanel();
  }

  function addItem(catId) {
    store.checkpoint();
    const { iL, iW } = store.interior();
    const it = BFT.itemFromCatalog(catId);
    it.x = Math.round((iL - it.w) / 2 / 10) * 10;
    it.y = Math.round((iW - it.d) / 2 / 10) * 10;
    store.project.items.push(it);
    selection = { type: 'item', id: it.id };
    setMode('plan');
    commit();
  }

  function selectedItem() {
    if (!selection || selection.type !== 'item') return null;
    return store.project.items.find((i) => i.id === selection.id) || null;
  }

  function rotateSelected() {
    const it = selectedItem();
    if (!it) return;
    store.checkpoint();
    it.rot = ((it.rot || 0) + 90) % 360;
    commit();
  }

  function deleteSelected() {
    if (!selection) return;
    store.checkpoint();
    if (selection.type === 'item') {
      store.project.items = store.project.items.filter((i) => i.id !== selection.id);
    } else if (selection.type === 'feature') {
      store.project.features = store.project.features.filter((f) => f.id !== selection.id);
      refreshFeaturesPanel();
    }
    selection = null;
    commit();
  }

  function duplicateSelected() {
    const it = selectedItem();
    if (!it) return;
    store.checkpoint();
    const c = U.deepCopy(it);
    c.id = U.uid();
    c.x += 100; c.y -= 100;
    store.project.items.push(c);
    selection = { type: 'item', id: c.id };
    commit();
  }

  function clearAnnotations() {
    store.checkpoint();
    store.project.dims = [];
    store.project.notes = [];
    commit();
  }

  // ------------------------------------------------------------------
  // UI: mode & tools
  // ------------------------------------------------------------------
  function setMode(m) {
    mode = m;
    $('btn-mode-plan').classList.toggle('active', m === 'plan');
    $('btn-mode-sheet').classList.toggle('active', m === 'sheet');
    $('btn-mode-sales').classList.toggle('active', m === 'sales');
    $('btn-mode-heights').classList.toggle('active', m === 'heights');
    $('tools-group').classList.toggle('disabled', m !== 'plan'); // tools only apply while designing
    if (m !== 'plan') setTool('select');
    rebuild();
    fit();
  }

  function setTool(t) {
    tool = t;
    dimPick = [];
    snapMark = null;
    for (const id of ['select', 'dim', 'note']) {
      $('btn-tool-' + id).classList.toggle('active', t === id);
    }
    cv.style.cursor = t === 'select' ? 'default' : 'crosshair';
    draw();
  }

  function status() {
    const it = selectedItem();
    let s = `${U.fmt(Math.round(mouseMM.x))}, ${U.fmt(Math.round(mouseMM.y))} mm`;
    if (it) s += `   ·   ${it.en}: ${U.fmt(it.w)} × ${U.fmt(it.d)} mm, ${U.fmt(it.x)} from drawbar end, ${U.fmt(it.y)} from serving side`;
    else s += '   ·   click an item to see and type its exact position';
    statusEl.textContent = s;
  }

  // ------------------------------------------------------------------
  // UI: panels
  // ------------------------------------------------------------------
  function buildCatalogPanel() {
    const el = $('catalog');
    el.innerHTML = '';
    const cats = [...new Set(BFT.catalog.map((c) => c.cat))];
    for (const cat of cats) {
      const h = document.createElement('div');
      h.className = 'cat-head';
      h.textContent = cat;
      el.appendChild(h);
      for (const c of BFT.catalog.filter((x) => x.cat === cat)) {
        const b = document.createElement('button');
        b.className = 'cat-item';
        b.title = c.desc || '';
        b.dataset.search = (c.en + ' ' + (c.zh || '') + ' ' + cat).toLowerCase();
        b.innerHTML = `<span>${c.en}</span>` + (c.zh ? `<span class="zh">${c.zh}</span>` : '') + `<span class="sz">${c.w}×${c.d}</span>`;
        b.onclick = () => addItem(c.id);
        el.appendChild(b);
      }
    }
    filterCatalog();
  }

  function filterCatalog() {
    const q = ($('catalog-search').value || '').trim().toLowerCase();
    const el = $('catalog');
    let head = null, headVisible = false;
    for (const node of el.children) {
      if (node.classList.contains('cat-head')) {
        if (head) head.style.display = headVisible ? '' : 'none';
        head = node; headVisible = false;
      } else {
        const show = !q || node.dataset.search.includes(q);
        node.style.display = show ? '' : 'none';
        if (show) headVisible = true;
      }
    }
    if (head) head.style.display = headVisible ? '' : 'none';
  }

  function numInput(parent, label, value, onchange, step) {
    const row = document.createElement('label');
    row.className = 'field';
    row.innerHTML = `<span>${label}</span>`;
    const inp = document.createElement('input');
    inp.type = 'number';
    inp.step = step || 1;
    inp.value = value;
    inp.onchange = () => onchange(U.num(inp.value, value));
    row.appendChild(inp);
    parent.appendChild(row);
    return inp;
  }

  function textInput(parent, label, value, onchange) {
    const row = document.createElement('label');
    row.className = 'field';
    row.innerHTML = `<span>${label}</span>`;
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.value = value || '';
    inp.onchange = () => onchange(inp.value);
    row.appendChild(inp);
    parent.appendChild(row);
    return inp;
  }

  function refreshProps() {
    const el = $('props');
    el.innerHTML = '';
    const sf = selectedFeature();
    if (sf) {
      const upd = (fn) => (v) => { store.checkpoint(); fn(v); commit(); refreshFeaturesPanel(); };
      const h = document.createElement('div');
      h.className = 'props-title';
      h.textContent = (sf.type === 'door' ? 'Door' : 'Servery window') + ' — drag it along the wall';
      el.appendChild(h);
      numInput(el, 'Position along wall (mm)', sf.offset, upd((v) => (sf.offset = U.clamp(v, 0, featureWallLength(sf) - sf.width))));
      numInput(el, 'Width (mm)', sf.width, upd((v) => (sf.width = Math.max(100, v))));
      numInput(el, 'Height off floor (mm)', sf.sill != null ? sf.sill : 0, upd((v) => (sf.sill = v)));
      numInput(el, 'Height (mm)', sf.height != null ? sf.height : 900, upd((v) => (sf.height = v)));
      const btns = document.createElement('div');
      btns.className = 'btn-row';
      const del = document.createElement('button');
      del.textContent = 'Delete (Del)';
      del.onclick = deleteSelected;
      btns.appendChild(del);
      el.appendChild(btns);
      return;
    }
    const it = selectedItem();
    if (!it) {
      el.innerHTML = '<div class="hint">Click an item on the plan to move it precisely or change its size. Drag items to arrange them — they snap to the walls and to each other.</div>';
      return;
    }
    const upd = (fn) => (v) => { store.checkpoint(); fn(v); commit(); };
    const h = document.createElement('div');
    h.className = 'props-title';
    h.textContent = it.en + (it.zh ? ' · ' + it.zh : '');
    el.appendChild(h);
    textInput(el, 'Name', it.en, upd((v) => (it.en = v)));
    textInput(el, 'Chinese name (for factory)', it.zh, upd((v) => (it.zh = v)));
    numInput(el, 'From drawbar end (mm)', it.x, upd((v) => (it.x = v)));
    numInput(el, 'From serving side (mm)', it.y, upd((v) => (it.y = v)));
    numInput(el, 'Width (mm)', it.w, upd((v) => (it.w = Math.max(10, v))));
    numInput(el, 'Depth (mm)', it.d, upd((v) => (it.d = Math.max(10, v))));
    numInput(el, 'Height (mm)', it.h, upd((v) => (it.h = Math.max(10, v))));
    numInput(el, 'Weight (kg)', it.kg || 0, upd((v) => (it.kg = Math.max(0, v))));
    // where it sits, for the Heights view: auto guesses small units onto the bench
    const mountRow = document.createElement('label');
    mountRow.className = 'field';
    mountRow.innerHTML = '<span>Sits on</span>';
    const mountSel = document.createElement('select');
    mountSel.style.width = '110px';
    mountSel.innerHTML = ['auto|Auto', 'bench|Bench top', 'floor|Floor']
      .map((o) => { const [v, n] = o.split('|'); return `<option value="${v}"${(it.mount || 'auto') === v ? ' selected' : ''}>${n}</option>`; }).join('');
    mountSel.onchange = () => { store.checkpoint(); it.mount = mountSel.value === 'auto' ? undefined : mountSel.value; commit(); };
    mountRow.appendChild(mountSel);
    el.appendChild(mountRow);

    const btns = document.createElement('div');
    btns.className = 'btn-row';
    btns.innerHTML = '';
    const mk = (label, fn) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.onclick = fn;
      btns.appendChild(b);
    };
    mk('Rotate 90° (R)', rotateSelected);
    mk('Duplicate (Ctrl/⌘+D)', duplicateSelected);
    mk('Delete (Del)', deleteSelected);
    el.appendChild(btns);
  }

  // Standard benches track the inside length: when the shell length changes,
  // any bench that spanned the full interior is stretched to the new one.
  function resizeFullLengthBenches(oldIL, newIL) {
    if (oldIL === newIL) return;
    for (const it of store.project.items) {
      // any bench running to the rear wall keeps meeting it (covers both
      // full-length and U-shape side benches; the 600 end bench is untouched)
      if (it.catId === 'bench' && it.w > oldIL * 0.5 && Math.abs(it.x + it.w - oldIL) < 1) {
        it.w = newIL - it.x;
        it.kg = Math.max(15, Math.round(it.w * 0.022));
      }
    }
  }

  // When the shell length changes, long-wall openings keep their relative
  // position (a centred servery stays centred) and always stay on the wall.
  function repositionFeatures(oldL, newL) {
    if (oldL === newL) return;
    for (const f of store.project.features || []) {
      if (f.wall !== 'bottom' && f.wall !== 'top') continue;
      const centreFrac = (f.offset + f.width / 2) / oldL;
      f.offset = U.clamp(Math.round((centreFrac * newL - f.width / 2) / 10) * 10, 0, Math.max(0, newL - f.width));
    }
    refreshFeaturesPanel();
  }

  let trailerAdvancedOpen = false;
  function refreshTrailerPanel() {
    const el = $('trailer-form');
    el.innerHTML = '';
    const t = store.project.trailer;
    const upd = (fn) => (v) => { store.checkpoint(); fn(v); commit(); refreshTrailerPanel(); };

    const sel = document.createElement('select');
    sel.innerHTML = '<option value="">— size presets —</option>' +
      BFT.trailerPresets.map((p) => `<option value="${p.id}">${p.name}</option>`).join('');
    sel.onchange = () => {
      const p = BFT.trailerPresets.find((x) => x.id === sel.value);
      if (!p) return;
      store.checkpoint();
      const oldT = store.project.trailer;
      const oldIL = oldT.boxLength - 2 * oldT.wall;
      const oldL = oldT.boxLength;
      store.project.trailer = U.deepCopy(p.trailer);
      resizeFullLengthBenches(oldIL, p.trailer.boxLength - 2 * p.trailer.wall);
      repositionFeatures(oldL, p.trailer.boxLength);
      commit();
      refreshTrailerPanel();
    };
    el.appendChild(sel);

    // everyday fields — the BFT standards live under Advanced
    numInput(el, 'Shell length (mm)', t.boxLength, upd((v) => {
      const oldIL = t.boxLength - 2 * t.wall;
      const oldL = t.boxLength;
      t.boxLength = v;
      resizeFullLengthBenches(oldIL, v - 2 * t.wall);
      t.axlePos = Math.round(v * 0.55 / 10) * 10;
      repositionFeatures(oldL, v);
    }));
    numInput(el, 'Bench height (mm)', t.worktopHeight, upd((v) => (t.worktopHeight = v)));
    numInput(el, 'Axles (1 or 2)', t.axles, upd((v) => (t.axles = U.clamp(Math.round(v), 1, 2))));

    const advBtn = document.createElement('button');
    advBtn.textContent = trailerAdvancedOpen ? 'Hide advanced ▴' : 'Advanced (standard sizes) ▾';
    advBtn.style.width = '100%';
    advBtn.style.marginTop = '4px';
    advBtn.onclick = () => { trailerAdvancedOpen = !trailerAdvancedOpen; refreshTrailerPanel(); };
    el.appendChild(advBtn);
    if (trailerAdvancedOpen) {
      const adv = document.createElement('div');
      adv.className = 'adv-box';
      el.appendChild(adv);
      numInput(adv, 'Shell width (std 2100)', t.boxWidth, upd((v) => (t.boxWidth = v)));
      numInput(adv, 'Shell height (std 2450)', t.boxHeight, upd((v) => (t.boxHeight = v)));
      numInput(adv, 'Drawbar length (std 1500)', t.hitchLength, upd((v) => (t.hitchLength = v)));
      numInput(adv, 'Shell tare weight (kg)', t.tareKg != null ? t.tareKg : Math.round(t.boxLength * 0.22), upd((v) => (t.tareKg = Math.max(0, v))));
      numInput(adv, 'Wall thickness (mm)', t.wall, upd((v) => (t.wall = v)));
      numInput(adv, 'Interior height (mm)', t.interiorHeight, upd((v) => (t.interiorHeight = v)));
      numInput(adv, 'Floor height (mm)', t.chassisHeight, upd((v) => (t.chassisHeight = v)));
      numInput(adv, 'Wheel diameter (mm)', t.wheelDia, upd((v) => (t.wheelDia = v)));
      numInput(adv, 'Axle position (mm)', t.axlePos, upd((v) => (t.axlePos = v)));
    }
  }

  function refreshFeaturesPanel() {
    const el = $('features');
    el.innerHTML = '';
    const feats = store.project.features;
    feats.forEach((f, idx) => {
      const box = document.createElement('div');
      box.className = 'feat';
      const head = document.createElement('div');
      head.className = 'feat-head';
      head.textContent = (f.type === 'door' ? 'Door ' : 'Servery window ') + (idx + 1);
      const del = document.createElement('button');
      del.textContent = '✕';
      del.onclick = () => { store.checkpoint(); feats.splice(idx, 1); commit(); refreshFeaturesPanel(); };
      head.appendChild(del);
      box.appendChild(head);

      const upd = (fn) => (v) => { store.checkpoint(); fn(v); commit(); };
      const wallSel = document.createElement('select');
      wallSel.innerHTML = ['bottom|Serving side', 'top|Road side', 'left|Drawbar end', 'right|Rear end']
        .map((o) => { const [v, n] = o.split('|'); return `<option value="${v}"${f.wall === v ? ' selected' : ''}>${n}</option>`; }).join('');
      wallSel.onchange = () => { store.checkpoint(); f.wall = wallSel.value; commit(); };
      box.appendChild(wallSel);
      numInput(box, 'Position along wall (mm)', f.offset, upd((v) => (f.offset = v)));
      numInput(box, 'Width (mm)', f.width, upd((v) => (f.width = v)));
      numInput(box, 'Height off floor (mm)', f.sill != null ? f.sill : 0, upd((v) => (f.sill = v)));
      numInput(box, 'Height (mm)', f.height != null ? f.height : 900, upd((v) => (f.height = v)));
      el.appendChild(box);
    });
    const row = document.createElement('div');
    row.className = 'btn-row';
    const addBtn = (label, type, width, sill, height) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.onclick = () => {
        store.checkpoint();
        feats.push({ id: U.uid(), wall: 'bottom', type, offset: 500, width, sill, height });
        commit();
        refreshFeaturesPanel();
      };
      row.appendChild(b);
    };
    addBtn('+ Servery window', 'window', 1800, 900, 900);
    addBtn('+ Door', 'door', 740, 0, 2000);
    el.appendChild(row);
  }

  function refreshBalancePanel() {
    const el = $('balance');
    const b = BFT.balance(store.project);
    const ok = b.ballPct >= 5 && b.ballPct <= 15;
    const t = store.project.trailer;
    el.innerHTML =
      `<div class="bal-row"><span>Total (est.)</span><b>${b.total} kg</b></div>` +
      `<div class="bal-row"><span>Shell / equipment</span><b>${b.tare} / ${b.equipment} kg</b></div>` +
      `<div class="bal-row"><span>Ball load</span><b style="color:${ok ? '#1f7a35' : '#b45309'}">${b.ball} kg (${b.ballPct}%)</b></div>` +
      `<div class="bal-row"><span>On axles</span><b>${b.axleLoad} kg</b></div>` +
      `<div class="bal-row"><span>Balance point</span><b>${b.cogX} mm from drawbar end (axles at ${U.fmt(t.axlePos)})</b></div>` +
      `<div class="bal-row"><span>Side split</span><b>${b.servingKg} kg serving / ${b.roadKg} kg cook</b></div>` +
      `<div class="hint">Aim for a ball load of 5–15% of the total. Edit each item's weight in its panel; shell tare is under Advanced.</div>`;
  }

  function refreshMetaPanel() {
    const el = $('meta-form');
    el.innerHTML = '';
    const m = store.project.meta;
    const upd = (fn) => (v) => { store.checkpoint(); fn(v); commit(); };
    textInput(el, 'Company', m.company, upd((v) => (m.company = v)));
    textInput(el, 'Contact', m.contact, upd((v) => (m.contact = v)));
    textInput(el, 'Project', m.project, upd((v) => (m.project = v)));
    textInput(el, 'Customer', m.client, upd((v) => (m.client = v)));
    textInput(el, 'Drawing No', m.drawingNo, upd((v) => (m.drawingNo = v)));
    textInput(el, 'Revision', m.revision, upd((v) => (m.revision = v)));
    textInput(el, 'Date', m.date, upd((v) => (m.date = v)));
    const sel = document.createElement('select');
    sel.innerHTML = ['both|Factory labels: EN + 中文', 'en|Factory labels: English', 'zh|Factory labels: 中文']
      .map((o) => { const [v, n] = o.split('|'); return `<option value="${v}"${m.lang === v ? ' selected' : ''}>${n}</option>`; }).join('');
    sel.onchange = () => { store.checkpoint(); m.lang = sel.value; commit(); };
    el.appendChild(sel);
  }

  // ------------------------------------------------------------------
  // exports
  // ------------------------------------------------------------------
  function fileBase() {
    const m = store.project.meta;
    return ((m.drawingNo || 'BFT') + '-' + (m.project || 'trailer')).replace(/[^\w一-鿿.-]+/g, '_');
  }

  function exportDXF(sheetMode) {
    const p = store.project;
    const sc = sheetMode ? BFT.views.buildSheet(p) : BFT.views.buildPlan(p, {});
    const dxf = BFT.dxf.dxfFromScene(sc, BFT.layers);
    BFT.exporters.download(fileBase() + (sheetMode ? '-sheet' : '-plan') + '.dxf', dxf, 'application/dxf');
  }

  function exportSVG() {
    const suffix = mode === 'sales' ? '-sales' : mode === 'sheet' ? '-sheet' : '-plan';
    BFT.exporters.download(fileBase() + suffix + '.svg',
      BFT.exporters.svgFromScene(exportScene(), BFT.layers, { dark: false }), 'image/svg+xml');
  }

  function exportPNG() {
    const suffix = mode === 'sales' ? '-sales' : mode === 'sheet' ? '-sheet' : '-plan';
    BFT.exporters.pngFromScene(exportScene(), BFT.layers, 3200, (blob) => {
      BFT.exporters.download(fileBase() + suffix + '.png', blob, 'image/png');
    }, { light: true });
  }

  function exportJSON() {
    BFT.exporters.download(fileBase() + '.bft.json', JSON.stringify(store.project, null, 2), 'application/json');
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const p = JSON.parse(reader.result);
        if (!p.trailer || !p.items) throw new Error('not a BFT project');
        store.checkpoint();
        store.project = p;
        selection = null;
        commit();
        refreshAllPanels();
        fit();
      } catch (err) {
        alert('Could not load file: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function printSheet() {
    // prints whatever mode is active (sales mode -> the customer drawing)
    const sc = mode === 'plan' ? BFT.views.buildSheet(store.project) : exportScene();
    BFT.exporters.printScene(sc, BFT.layers, fileBase());
  }

  function customerPDF() {
    setMode('sales'); // show what's being sent
    BFT.exporters.printScene(BFT.views.buildCustomerSheet(store.project), BFT.layers, fileBase() + '-customer');
  }

  // ------------------------------------------------------------------
  // My Trailers library: saved customer builds in localStorage
  // ------------------------------------------------------------------
  function libGet() {
    try { return JSON.parse(localStorage.getItem('bft-library') || '[]'); } catch (e) { return []; }
  }
  function libSet(list) {
    try { localStorage.setItem('bft-library', JSON.stringify(list)); }
    catch (e) { alert('Could not save — browser storage is full. Export projects with More > Save instead.'); }
  }

  // Sequential drawing numbers (BFT-001, BFT-002, …). The counter lives in
  // localStorage; the saved library is also scanned so an imported backup
  // can never make us hand out a number that is already on a drawing.
  function nextDrawingNo() {
    let n = 0;
    try { n = parseInt(localStorage.getItem('bft-dwg-seq'), 10) || 0; } catch (e) {}
    for (const t of libGet()) {
      const m = /^BFT-0*(\d+)$/.exec((t.project && t.project.meta && t.project.meta.drawingNo) || '');
      if (m) n = Math.max(n, parseInt(m[1], 10));
    }
    return 'BFT-' + String(n + 1).padStart(3, '0');
  }
  function claimDrawingNo(no) {
    const m = /^BFT-0*(\d+)$/.exec(no || '');
    if (!m) return;
    try {
      const cur = parseInt(localStorage.getItem('bft-dwg-seq'), 10) || 0;
      localStorage.setItem('bft-dwg-seq', String(Math.max(cur, parseInt(m[1], 10))));
    } catch (e) {}
  }

  function libSaveCurrent() {
    const m = store.project.meta;
    const suggested = [m.project, m.client].filter(Boolean).join(' — ') || 'Untitled trailer';
    const name = prompt('Name this trailer:', suggested);
    if (!name) return;
    const list = libGet();
    list.unshift({ id: U.uid(), name, savedAt: U.todayISO(), project: U.deepCopy(store.project) });
    libSet(list);
    refreshLibraryPanel();
  }

  // Backup file: the whole library + the design on screen. Survives app
  // updates, browser resets and moves between computers.
  function libExport() {
    const payload = {
      kind: 'bft-library-backup',
      version: 1,
      exportedAt: U.todayISO(),
      library: libGet(),
      current: U.deepCopy(store.project),
    };
    BFT.exporters.download('bondi-trailers-backup-' + U.todayISO() + '.json', JSON.stringify(payload, null, 1), 'application/json');
  }

  function libImport(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const list = libGet();
        const have = new Set(list.map((e) => e.id));
        let added = 0;
        if (data && data.kind === 'bft-library-backup' && Array.isArray(data.library)) {
          for (const entry of data.library) {
            if (!entry || !entry.project || !entry.project.trailer) continue;
            if (have.has(entry.id)) continue;
            list.push(entry);
            have.add(entry.id);
            added++;
          }
          if (data.current && data.current.trailer) {
            list.unshift({ id: U.uid(), name: 'Backup of current design (' + (data.exportedAt || '') + ')', savedAt: U.todayISO(), project: data.current });
            added++;
          }
        } else if (data && data.trailer && data.items) {
          // a single .bft.json project file
          const name = [data.meta && data.meta.project, data.meta && data.meta.client].filter(Boolean).join(' — ') || file.name;
          list.unshift({ id: U.uid(), name, savedAt: U.todayISO(), project: data });
          added = 1;
        } else {
          throw new Error('not a Bondi backup or project file');
        }
        libSet(list);
        refreshLibraryPanel();
        alert(added ? 'Imported ' + added + ' trailer' + (added === 1 ? '' : 's') + '.' : 'Nothing new to import — all builds were already here.');
      } catch (err) {
        alert('Could not import: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function refreshLibraryPanel() {
    const el = $('library-list');
    const list = libGet();
    el.innerHTML = list.length ? '' : '<div class="hint">Nothing saved yet. "Save current" keeps a copy of the design on screen — one entry per customer build.</div>';
    for (const entry of list) {
      const row = document.createElement('div');
      row.className = 'lib-row';
      const info = document.createElement('div');
      info.className = 'lib-info';
      const shell = entry.project && entry.project.trailer ? (entry.project.trailer.boxLength / 1000).toFixed(1) + 'm · ' : '';
      info.innerHTML = `<b>${entry.name.replace(/</g, '&lt;')}</b><span>${shell}${entry.savedAt}</span>`;
      row.appendChild(info);
      const btns = document.createElement('div');
      btns.className = 'lib-btns';
      const mk = (label, fn, title) => {
        const b = document.createElement('button');
        b.textContent = label;
        b.title = title || '';
        b.onclick = fn;
        btns.appendChild(b);
      };
      mk('Open', () => {
        store.checkpoint();
        store.project = U.deepCopy(entry.project);
        store.migrate();
        selection = null;
        $('library').classList.add('hidden');
        setMode('plan');
        commit();
        refreshAllPanels();
        fit();
      });
      mk('Duplicate', () => {
        const list2 = libGet();
        const copy = { id: U.uid(), name: entry.name + ' (copy)', savedAt: U.todayISO(), project: U.deepCopy(entry.project) };
        const idx = list2.findIndex((x) => x.id === entry.id);
        list2.splice(idx + 1, 0, copy);
        libSet(list2);
        refreshLibraryPanel();
      }, 'Copy this build as a starting point for a new customer');
      mk('✕', () => {
        if (!confirm('Delete "' + entry.name + '" from My Trailers?')) return;
        libSet(libGet().filter((x) => x.id !== entry.id));
        refreshLibraryPanel();
      }, 'Delete');
      row.appendChild(btns);
      el.appendChild(row);
    }
  }

  // ------------------------------------------------------------------
  // new-trailer wizard: asks trailer dimensions step by step, then builds
  // an empty shell ready for equipment
  // ------------------------------------------------------------------
  let wizStep = 1;
  const gv = (id, fb) => U.num($(id).value, fb);

  function wizShow(n) {
    wizStep = n;
    for (let i = 1; i <= 3; i++) $('wiz-step-' + i).classList.toggle('active', i === n);
    document.querySelectorAll('.wiz-dots .dot').forEach((d, i) => d.classList.toggle('active', i + 1 <= n));
    $('wiz-back').style.visibility = n === 1 ? 'hidden' : 'visible';
    $('wiz-next').textContent = n === 3 ? 'Create trailer 创建 ✓' : 'Next ›';
    wizSummary();
  }

  function wizSummary() {
    const L = gv('wiz-len', 0), W = BFT.STANDARD.boxWidth, wall = BFT.STANDARD.wall;
    if (L > 0) {
      $('wiz-summary').textContent =
        'Interior 内部: ' + U.fmt(L - 2 * wall) + ' × ' + U.fmt(W - 2 * wall) + ' mm' +
        '   ·   Overall with drawbar 总长: ' + U.fmt(L + BFT.STANDARD.drawbar) + ' mm';
    } else {
      $('wiz-summary').textContent = 'Enter the shell length in millimetres.';
    }
    // keep the servery at ~75% of the shell length until it's changed by hand
    if (L > 0 && !serveryTouched) $('wiz-servery-w').value = stdServeryWidth(L);
  }
  let serveryTouched = false;

  function stdServeryWidth(L) {
    const table = BFT.STANDARD.windowBySize[L];
    const w = table != null ? table : Math.round(L * BFT.STANDARD.serveryFrac / 10) * 10;
    return U.clamp(w, 300, L - 600);
  }

  function wizFillPreset(id) {
    const p = BFT.trailerPresets.find((x) => x.id === id);
    if (!p) return;
    $('wiz-len').value = p.trailer.boxLength;
    $('wiz-bench').value = p.trailer.worktopHeight;
    $('wiz-axles').value = p.trailer.axles;
    document.querySelectorAll('.chip-row button[data-preset]').forEach((b) => b.classList.toggle('active', b.dataset.preset === id));
    wizSummary();
  }

  function openWizard() {
    serveryTouched = false;
    $('wiz-win2').checked = true;      // two serving windows is the standard
    $('wiz-dbwindow').checked = true;  // drawbar window is standard too
    $('wiz-dbwindow').disabled = false;
    $('wiz-dbwindow-w').disabled = false;
    $('wiz-cashdrawer').checked = true;
    $('wiz-endbench').checked = false;
    $('wiz-bigsink').checked = false;
    wizFillPreset('bft45');
    wizMenu = 'none';
    document.querySelectorAll('#wiz-menu-row button').forEach((x) => x.classList.toggle('active', x.dataset.menu === 'none'));
    $('wiz-project').value = '';
    $('wiz-client').value = '';
    $('wiz-dwg').value = nextDrawingNo();
    wizShow(1);
    $('wizard').classList.remove('hidden');
  }

  // Menu-type templates: the typical equipment for a menu, added on top of
  // the standard shell the wizard already builds. 'back' runs along the cook
  // bench (road side, under the hood, stopping clear of the sink); 'front'
  // runs along the serving bench, stopping clear of the cash drawer.
  let wizMenu = 'none';
  const MENU_TEMPLATES = {
    burger: {
      back: ['griddle', 'chargrill', 'fryer2', 'fridgeub'],
      front: ['qt_salad_cooler_1200'],
    },
    coffee: {
      back: ['qt_ice_maker_60', 'fridgeub'],
      front: ['qt_coffee_machine_semi', 'qt_coffee_grinder', 'qt_drinks_fridge'],
    },
    kebab: {
      back: ['qt_kebab_gas_4', 'griddle', 'fryer2', 'bainmarie'],
      front: ['qt_salad_cooler_1200'],
    },
    dessert: {
      back: ['qt_waffle_double', 'qt_crepe_double', 'fridgeub'],
      front: ['qt_slush_machine_2', 'qt_food_warmer_660'],
    },
  };

  function wizPlaceMenu(p, c) {
    const t = MENU_TEMPLATES[wizMenu];
    if (!t) return;
    const gap = 50;
    let x = c.benchX;
    for (const id of t.back) {
      const it = BFT.itemFromCatalog(id, 0, 0, 0);
      if (x + it.w > c.iL - c.sinkW - gap) continue; // won't fit before the sink
      it.x = x;
      it.y = c.iW - it.d; // against the road-side wall on the cook bench
      p.items.push(it);
      x += it.w + gap;
    }
    let fx = c.benchX;
    const fMax = (c.cdX != null ? c.cdX : c.iL) - gap;
    for (const id of t.front) {
      const it = BFT.itemFromCatalog(id, 0, 0, 0);
      if (fx + it.w > fMax) continue;
      it.x = fx;
      it.y = 0; // against the serving-side wall on the serving bench
      p.items.push(it);
      fx += it.w + gap;
    }
  }

  function wizValidate() {
    if (wizStep !== 1) return true;
    const L = gv('wiz-len', 0);
    if (L < 1500 || L > 15000) { alert('Shell length should be between 1500 and 15000 mm.'); return false; }
    return true;
  }

  function wizCreate() {
    const S = BFT.STANDARD;
    const L = gv('wiz-len', 5450), W = S.boxWidth, wall = S.wall;
    const iL = L - 2 * wall, iW = W - 2 * wall;
    store.checkpoint();
    const p = BFT.defaultProject();
    p.items = [];
    p.dims = [];
    p.notes = [];
    Object.assign(p.trailer, {
      boxLength: L, boxWidth: W, boxHeight: S.boxHeight,
      wall, hitchLength: S.drawbar,
      worktopHeight: gv('wiz-bench', 850),
      axles: U.clamp(Math.round(gv('wiz-axles', 2)), 1, 2),
      axlePos: Math.round(L * 0.55 / 10) * 10,
    });
    p.features = [
      // BFT standard: entry door on the rear end, opposite the drawbar
      { id: U.uid(), wall: 'right', type: 'door', offset: Math.round((W - S.doorWidth) / 2), width: S.doorWidth, sill: 0, height: 2000 },
    ];
    const endBench = $('wiz-endbench').checked;
    // serving side: standard is TWO serving windows splitting the standard
    // opening, with a 200mm post between them; option for one full-width
    const total = U.clamp(gv('wiz-servery-w', stdServeryWidth(L)), 300, L - 600);
    const groupStart = Math.round((L - total) / 2 / 10) * 10;
    if ($('wiz-win2').checked && total >= 1200) {
      const post = 200;
      const each = Math.round((total - post) / 2 / 10) * 10;
      p.features.push({ id: U.uid(), wall: 'bottom', type: 'window', offset: groupStart, width: each, sill: 900, height: 900 });
      p.features.push({ id: U.uid(), wall: 'bottom', type: 'window', offset: groupStart + each + post, width: each, sill: 900, height: 900 });
    } else {
      p.features.push({ id: U.uid(), wall: 'bottom', type: 'window', offset: groupStart, width: total, sill: 900, height: 900 });
    }
    if ($('wiz-dbwindow').checked) {
      // standard drawbar-end window — sits above the end bench on U-shape
      // builds, so it stays either way
      const w = U.clamp(gv('wiz-dbwindow-w', 1200), 300, W - 400);
      p.features.push({ id: U.uid(), wall: 'left', type: 'window', offset: Math.round((W - w) / 2 / 10) * 10, width: w, sill: 900, height: 900 });
    }
    // BFT standard: two benches the full inside length, 600mm wide, one
    // along each side (starting after the end bench in U-shape builds)
    const benchX = endBench ? S.endBenchDepth : 0;
    for (const y of [0, iW - S.benchDepth]) {
      const bench = BFT.itemFromCatalog('bench', benchX, y, 0);
      bench.w = iL - benchX;
      bench.d = S.benchDepth;
      bench.h = gv('wiz-bench', 850);
      bench.kg = Math.max(15, Math.round(bench.w * 0.022));
      p.items.push(bench);
    }
    if (endBench) {
      // U-shape: bench across the drawbar end joining both side benches
      const eb = BFT.itemFromCatalog('bench', 0, 0, 0);
      eb.w = S.endBenchDepth;
      eb.d = iW;
      eb.h = gv('wiz-bench', 850);
      eb.kg = Math.max(15, Math.round(iW * 0.022));
      p.items.push(eb);
    }
    // BFT standard: 2m range hood over the non-serving (road) side, centred
    const hood = BFT.itemFromCatalog('hood', Math.round((iL - S.hoodWidth) / 2 / 10) * 10, iW - S.hoodDepth, 0);
    hood.w = S.hoodWidth;
    hood.d = S.hoodDepth;
    p.items.push(hood);
    // BFT standard: sink at the rear end of the cook bench (960 or 1200)
    const sinkW = $('wiz-bigsink').checked ? S.sinkWidthBig : S.sinkWidth;
    const sink = BFT.itemFromCatalog('sink3', iL - sinkW, iW - S.benchDepth, 0);
    sink.w = sinkW;
    sink.d = S.benchDepth;
    p.items.push(sink);
    // BFT standard: cash drawer on the serving bench by the servery
    let cdX = null;
    if ($('wiz-cashdrawer').checked) {
      const cd = BFT.itemFromCatalog('cashdrawer', 0, 0, 0);
      cd.x = U.clamp(groupStart + total - S.cashDrawerWidth - 2 * wall, benchX, iL - S.cashDrawerWidth);
      cd.y = 0;
      p.items.push(cd);
      cdX = cd.x;
    }
    wizPlaceMenu(p, { iL, iW, benchX, sinkW, cdX });
    p.meta.project = $('wiz-project').value || (U.fmt(L / 1000) + 'm Food Trailer');
    p.meta.client = $('wiz-client').value;
    p.meta.drawingNo = $('wiz-dwg').value || nextDrawingNo();
    claimDrawingNo(p.meta.drawingNo);
    p.meta.revision = $('wiz-rev').value || 'A';
    store.project = p;
    selection = null;
    $('wizard').classList.add('hidden');
    setMode('plan');
    setTool('select');
    commit();
    refreshAllPanels();
    fit();
  }

  function wireWizard() {
    document.querySelectorAll('.chip-row button[data-preset]').forEach((b) => (b.onclick = () => wizFillPreset(b.dataset.preset)));
    document.querySelectorAll('#wiz-menu-row button').forEach((b) => (b.onclick = () => {
      wizMenu = b.dataset.menu;
      document.querySelectorAll('#wiz-menu-row button').forEach((x) => x.classList.toggle('active', x === b));
    }));
    $('wiz-len').addEventListener('input', wizSummary);
    $('wiz-servery-w').addEventListener('input', () => { serveryTouched = true; });
    $('wiz-back').onclick = () => wizShow(Math.max(1, wizStep - 1));
    $('wiz-next').onclick = () => {
      if (!wizValidate()) return;
      if (wizStep < 3) wizShow(wizStep + 1);
      else wizCreate();
    };
    $('wiz-cancel').onclick = () => $('wizard').classList.add('hidden');
    $('wiz-cancel').textContent = 'Keep last design';
  }

  // ------------------------------------------------------------------
  // wiring
  // ------------------------------------------------------------------
  function refreshAllPanels() {
    buildCatalogPanel();
    refreshProps();
    refreshTrailerPanel();
    refreshBalancePanel();
    refreshFeaturesPanel();
    refreshMetaPanel();
  }

  function resize() {
    const wrap = $('canvas-wrap');
    cv.width = wrap.clientWidth;
    cv.height = wrap.clientHeight;
    draw();
  }

  function init() {
    cv = $('cv');
    ctx = cv.getContext('2d');
    statusEl = $('status');

    $('app-version').textContent = BFT.VERSION;
    $('menu-version').textContent = 'Bondi Trailer CAD ' + BFT.VERSION;

    store.load();
    store.onChange(() => { rebuild(); refreshAllPanels(); });

    $('btn-mode-plan').onclick = () => setMode('plan');
    $('btn-mode-sheet').onclick = () => setMode('sheet');
    $('btn-mode-sales').onclick = () => setMode('sales');
    $('btn-mode-heights').onclick = () => setMode('heights');
    $('btn-tool-select').onclick = () => setTool('select');
    $('btn-tool-dim').onclick = () => setTool('dim');
    $('btn-tool-note').onclick = () => setTool('note');
    try { showDims = localStorage.getItem('bft-showdims') === 'yes'; } catch (e) {}
    $('btn-dims').classList.toggle('active', showDims);
    $('btn-dims').onclick = () => {
      showDims = !showDims;
      $('btn-dims').classList.toggle('active', showDims);
      try { localStorage.setItem('bft-showdims', showDims ? 'yes' : 'no'); } catch (e) {}
      rebuild();
    };
    $('btn-fit').onclick = fit;
    $('btn-undo').onclick = () => store.undo();
    $('btn-redo').onclick = () => store.redo();
    $('btn-clear-ann').onclick = clearAnnotations;
    $('btn-new').onclick = openWizard; // step-by-step: dimensions first, then details
    $('catalog-search').addEventListener('input', filterCatalog);

    // My Trailers library
    $('btn-library').onclick = () => { refreshLibraryPanel(); $('library').classList.remove('hidden'); };
    $('btn-lib-save').onclick = libSaveCurrent;
    $('btn-lib-close').onclick = () => $('library').classList.add('hidden');
    $('btn-lib-export').onclick = libExport;
    $('btn-lib-import').onclick = () => $('lib-import-file').click();
    $('lib-import-file').onchange = (e) => { if (e.target.files[0]) libImport(e.target.files[0]); e.target.value = ''; };

    // slide-in panels on small screens
    const closeDrawers = () => { $('leftpanel').classList.remove('open'); $('rightpanel').classList.remove('open'); };
    $('btn-drawer-left').onclick = (e) => { e.stopPropagation(); $('rightpanel').classList.remove('open'); $('leftpanel').classList.toggle('open'); };
    $('btn-drawer-right').onclick = (e) => { e.stopPropagation(); $('leftpanel').classList.remove('open'); $('rightpanel').classList.toggle('open'); };
    cv.addEventListener('pointerdown', closeDrawers);

    $('btn-dxf-sheet').onclick = () => exportDXF(true);
    $('btn-pdf-customer').onclick = customerPDF;
    $('btn-dxf-plan').onclick = () => exportDXF(false);
    $('btn-svg').onclick = exportSVG;
    $('btn-png').onclick = exportPNG;
    $('btn-print').onclick = printSheet;
    $('btn-save').onclick = exportJSON;
    $('btn-open').onclick = () => $('file-open').click();
    $('file-open').onchange = (e) => { if (e.target.files[0]) importJSON(e.target.files[0]); e.target.value = ''; };

    // "More" dropdown
    const moreMenu = $('more-menu');
    $('btn-more').onclick = (e) => { e.stopPropagation(); moreMenu.classList.toggle('hidden'); };
    moreMenu.addEventListener('click', () => moreMenu.classList.add('hidden'));
    document.addEventListener('click', (e) => {
      if (!moreMenu.classList.contains('hidden') && !moreMenu.contains(e.target) && e.target.id !== 'btn-more') {
        moreMenu.classList.add('hidden');
      }
    });

    // welcome / quick guide (via Help); the wizard itself opens on startup
    const welcome = $('welcome');
    const showWelcome = () => welcome.classList.remove('hidden');
    const hideWelcome = () => {
      welcome.classList.add('hidden');
      try { if ($('welcome-hide').checked) localStorage.setItem('bft-welcome', 'no'); } catch (e) {}
    };
    $('btn-help').onclick = showWelcome;
    $('btn-welcome-example').onclick = hideWelcome;
    $('btn-welcome-new').onclick = () => { hideWelcome(); openWizard(); };
    wireWizard();
    // every session starts with the new-trailer prompt; "Keep last design"
    // (Cancel) drops you back into whatever you were working on
    let firstRun = true;
    try { firstRun = localStorage.getItem('bft-welcome') !== 'no'; } catch (e) {}
    if (firstRun) { showWelcome(); try { localStorage.setItem('bft-welcome', 'no'); } catch (e) {} }
    else openWizard();

    cv.addEventListener('pointerdown', onPointerDown);
    cv.addEventListener('pointermove', onPointerMove);
    cv.addEventListener('pointerup', onPointerUp);
    cv.addEventListener('wheel', onWheel, { passive: false });
    cv.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { spaceDown = true; e.preventDefault(); }
      if (e.key === 'r' || e.key === 'R') rotateSelected();
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected();
      if (e.key === 'Escape') { dimPick = []; setTool('select'); selection = null; rebuild(); refreshProps(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); store.undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); store.redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); duplicateSelected(); }
      const it = selectedItem();
      if (it && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 10;
        store.checkpoint();
        if (e.key === 'ArrowLeft') it.x -= step;
        if (e.key === 'ArrowRight') it.x += step;
        if (e.key === 'ArrowUp') it.y += step;
        if (e.key === 'ArrowDown') it.y -= step;
        commit();
      }
    });
    window.addEventListener('keyup', (e) => { if (e.code === 'Space') spaceDown = false; });
    window.addEventListener('resize', resize);

    refreshAllPanels();
    resize();
    rebuild();
    fit();
    status();
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', init);
  }

  BFT.app = {
    store,
    // world-mm (plan coords) -> canvas pixel, handy for tests and debugging
    screenOf(x, y) { return { x: cam.ox + x * cam.z, y: cam.oy - y * cam.z }; },
  };
})(typeof window !== 'undefined' ? window : globalThis);

