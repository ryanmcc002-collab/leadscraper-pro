/* Bondi Trailer CAD — parametric view generators.
   Everything is generated in real millimetres from the project model, so the
   plan on screen, the multi-view drawing sheet and every export share the
   exact same geometry. */
(function (root) {
  'use strict';
  const BFT = (root.BFT = root.BFT || {});
  const U = () => BFT.util;

  // ---------------------------------------------------------------------
  // Equipment symbols, drawn in item-local coordinates (0..w, 0..d, y-up)
  // and mapped through the item's rotation.
  // ---------------------------------------------------------------------
  function drawItemPlan(sc, item, selected) {
    const u = U();
    const la = item.overhead ? 'HIDDEN' : (item.fixture ? 'FIXTURE' : 'EQUIP');
    const [fw, fd] = u.footprint(item);
    const X = (lx, ly) => u.localToWorld(item, lx, ly);

    const lpline = (pts, closed) => sc.pline(la, pts.map((p) => X(p[0], p[1])), closed);
    const lrect = (x, y, w, h) => lpline([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true);
    const lcircle = (cx, cy, r) => { const c = X(cx, cy); sc.circle(la, c[0], c[1], r); };

    if (item.shape === 'circle') {
      const r = Math.min(item.w, item.d) / 2;
      lcircle(item.w / 2, item.d / 2, r);
      lcircle(item.w / 2, item.d / 2, r * 0.55);
    } else {
      lrect(0, 0, item.w, item.d);
    }

    const w = item.w, d = item.d, m = Math.min(w, d);
    switch (item.sym) {
      case 'burners': {
        const n = item.burners || 4, cols = Math.ceil(n / 2), rows = n > 1 ? 2 : 1;
        const r = Math.min((w / cols), (d / rows)) * 0.30;
        for (let i = 0; i < n; i++) {
          const cx = ((i % cols) + 0.5) * (w / cols);
          const cy = (Math.floor(i / cols) + 0.5) * (d / rows);
          lcircle(cx, cy, r); lcircle(cx, cy, r * 0.45);
        }
        break;
      }
      case 'pans': {
        const n = item.pans || 2, g = m * 0.09;
        const pw = (w - g * (n + 1)) / n;
        for (let i = 0; i < n; i++) lrect(g + i * (pw + g), g, pw, d - 2 * g);
        break;
      }
      case 'sink': {
        const n = item.bowls || 1, g = m * 0.10;
        const pw = (w - g * (n + 1)) / n;
        for (let i = 0; i < n; i++) {
          lrect(g + i * (pw + g), g, pw, d - 2 * g);
          lcircle(g + i * (pw + g) + pw / 2, d - g * 1.8, g * 0.5); // tap
        }
        break;
      }
      case 'grill': {
        const g = w * 0.12;
        for (let i = 1; i <= 5; i++) {
          const y = (d / 6) * i;
          lpline([[g, y], [w - g, y]], false);
        }
        break;
      }
      case 'oven': {
        const r = m * 0.22;
        lcircle(w * 0.28, d / 2, r);
        lcircle(w * 0.72, d / 2, r);
        break;
      }
      case 'fridge': {
        lpline([[0, 0], [w, d]], false);
        lpline([[0, d], [w, 0]], false);
        break;
      }
      case 'cross': {
        lpline([[0, 0], [w, d]], false);
        break;
      }
      case 'hood': {
        lpline([[0, 0], [w, d]], false);
        lpline([[0, d], [w, 0]], false);
        break;
      }
      case 'svc': {
        // connection point: letter in the box (P power, G gas, W water, D drain)
        const c = X(w / 2, d / 2);
        sc.text(la, c[0], c[1] - Math.min(w, d) * 0.28, Math.min(w, d) * 0.75, item.letter || 'S', { align: 'center' });
        break;
      }
    }

    if (selected) {
      // selection ticks on footprint corners (canvas-only layer semantics
      // are fine: exports never pass selected=true)
      const cs = 40;
      const corners = [[0, 0], [fw, 0], [fw, fd], [0, fd]];
      for (const c of corners) {
        sc.line('NOTES', item.x + c[0] - cs, item.y + c[1], item.x + c[0] + cs, item.y + c[1]);
        sc.line('NOTES', item.x + c[0], item.y + c[1] - cs, item.x + c[0], item.y + c[1] + cs);
      }
    }
  }

  // ---------------------------------------------------------------------
  // Collision-aware labelling. Labels that genuinely fit inside their item
  // (and don't clash with a label already placed) render in place; anything
  // else becomes a numbered balloon with an equipment list beside the plan
  // — so nothing ever overlaps, no matter how dense the cook line gets.
  // ---------------------------------------------------------------------
  function labelPass(sc, project, ox, oy, lang, nameOnly) {
    const u = U();
    const placed = [];   // world-mm AABBs of labels already on the plan
    const callouts = [];
    const collide = (b) => placed.some((p) =>
      b.x1 < p.x2 + 30 && b.x2 > p.x1 - 30 && b.y1 < p.y2 + 30 && b.y2 > p.y1 - 30);
    const displayName = (item) =>
      lang === 'en' ? item.en : lang === 'zh' ? (item.zh || item.en) : (item.zh ? item.zh + ' ' + item.en : item.en);

    const items = [...project.items].sort((a, b) => a.x - b.x || a.y - b.y);
    for (const item of items) {
      const [fw, fd] = u.footprint(item);
      const X = ox + item.x, Y = oy + item.y;
      const cx = X + fw / 2, cy = Y + fd / 2;
      const name = displayName(item);
      const size = u.fmt(item.w) + 'x' + u.fmt(item.d) + 'x' + u.fmt(item.h) + 'H';

      if (item.catId === 'bench') {
        const box = benchLabel(sc, project, item, ox, oy, lang, nameOnly);
        if (box) placed.push(box);
        continue;
      }

      if (item.svc && item.sym === 'svc') {
        // connection markers: name beside the lettered square, if room
        const th = 46, wpx = (name.length + 1) * th * 0.62;
        const box = { x1: X + fw + 40, y1: cy - 70, x2: X + fw + 40 + wpx, y2: cy + 40 };
        if (!collide(box)) { sc.text('TEXT', X + fw + 60, cy - 20, th, name); placed.push(box); continue; }
        callouts.push({ item, name, size: null });
        continue;
      }

      if (item.overhead) {
        const s = name + (nameOnly ? '' : ' ' + size);
        const th = 44, wpx = (s.length + 1) * th * 0.62;
        const box = { x1: cx - wpx / 2, y1: cy - 70, x2: cx + wpx / 2, y2: cy + 50 };
        if (wpx < fw - 40 && !collide(box)) {
          sc.text('TEXT', cx, cy - 16, th, s, { align: 'center' });
          placed.push(box);
          continue;
        }
        callouts.push({ item, name, size });
        continue;
      }

      const vertical = fd > fw * 1.35 && fw < 700;
      if (!vertical) {
        const th = Math.max(36, Math.min(60, fw / ((name.length + 1) * 0.66)));
        const nameW = name.length * th * 0.62;
        const sizeW = nameOnly ? 0 : size.length * 42 * 0.62;
        const wpx = Math.max(nameW, sizeW);
        const hpx = nameOnly ? th + 30 : th + 130;
        const box = { x1: cx - wpx / 2, y1: cy - 100, x2: cx + wpx / 2, y2: cy - 100 + hpx };
        if (nameW <= fw - 40 && hpx <= fd - 20 && !collide(box)) {
          sc.text('TEXT', cx, cy + 10, th, name, { align: 'center' });
          if (!nameOnly) sc.text('TEXT', cx, cy - 70, 42, size, { align: 'center' });
          placed.push(box);
          continue;
        }
      } else {
        const th = Math.max(36, Math.min(58, fd / ((name.length + 1) * 0.66)));
        const nameW = name.length * th * 0.62;
        const wpx = nameOnly ? th + 30 : th + 130;
        const box = { x1: cx - 90, y1: cy - nameW / 2, x2: cx - 90 + wpx, y2: cy + nameW / 2 };
        if (nameW <= fd - 40 && wpx <= fw - 20 && !collide(box)) {
          sc.text('TEXT', cx + th * 0.55, cy, th, name, { align: 'center', rot: 90 });
          if (!nameOnly) sc.text('TEXT', cx - th * 1.0, cy, 40, size, { align: 'center', rot: 90 });
          placed.push(box);
          continue;
        }
      }
      callouts.push({ item, name, size });
    }

    // leader labels: every remaining item still gets its name, written in
    // the walkway with a pointer line to the item (supplier drawing style)
    const iW = project.trailer.boxWidth - 2 * project.trailer.wall;
    for (const c of callouts) {
      const [fw, fd] = u.footprint(c.item);
      const X = ox + c.item.x, Y = oy + c.item.y;
      const cx = X + fw / 2;
      const topRow = c.item.y + fd / 2 >= iW / 2;
      const s = nameOnly || !c.size ? c.name : c.name + ' ' + c.size;
      const th = 44, wpx = (s.length + 1) * th * 0.62;
      let spot = null;
      outer:
      for (const tier of [260, 440, 620]) {
        for (const dx of [0, 250, -250, 500, -500, 800, -800]) {
          const ty = topRow ? Y - tier : Y + fd + tier;
          const box = { x1: cx + dx - wpx / 2, y1: ty - 60, x2: cx + dx + wpx / 2, y2: ty + 70 };
          if (!collide(box)) { spot = { tx: cx + dx, ty, box }; break outer; }
        }
      }
      if (!spot) { // extremely dense: take the outermost tier anyway
        const ty = topRow ? Y - 620 : Y + fd + 620;
        spot = { tx: cx, ty, box: { x1: cx - wpx / 2, y1: ty - 60, x2: cx + wpx / 2, y2: ty + 70 } };
      }
      sc.text('TEXT', spot.tx, spot.ty - 16, th, s, { align: 'center' });
      sc.line('TEXT', spot.tx, topRow ? spot.ty + 60 : spot.ty - 70, cx, topRow ? Y : Y + fd);
      placed.push(spot.box);
    }
  }

  // Bench labels move to the largest uncovered stretch of the bench so
  // appliances placed on top stay readable; a fully-covered bench gets none.
  function benchLabel(sc, project, bench, ox, oy, lang, nameOnly) {
    const u = U();
    const [bw, bd] = u.footprint(bench);
    const horizontal = bw >= bd;
    const lo = horizontal ? bench.x : bench.y;
    const hi = lo + (horizontal ? bw : bd);
    const spans = [];
    for (const o of project.items) {
      if (o.id === bench.id || o.overhead) continue;
      const [ow, od] = u.footprint(o);
      const crosses = horizontal
        ? o.y < bench.y + bd - 10 && o.y + od > bench.y + 10
        : o.x < bench.x + bw - 10 && o.x + ow > bench.x + 10;
      if (!crosses) continue;
      const a = horizontal ? o.x : o.y, b = a + (horizontal ? ow : od);
      if (b > lo && a < hi) spans.push([Math.max(lo, a), Math.min(hi, b)]);
    }
    spans.sort((a, b) => a[0] - b[0]);
    let cur = lo, best = [lo, hi], bestLen = -1;
    for (const [a, b] of spans) {
      if (a - cur > bestLen) { bestLen = a - cur; best = [cur, a]; }
      cur = Math.max(cur, b);
    }
    if (hi - cur > bestLen) { bestLen = hi - cur; best = [cur, hi]; }
    if (bestLen < 0) bestLen = hi - lo;
    if (bestLen < 450) return null; // bench fully in use: appliances tell the story
    const mid = (best[0] + best[1]) / 2;
    const name = lang === 'en' ? bench.en : lang === 'zh' ? (bench.zh || bench.en) : (bench.zh ? bench.zh + ' ' + bench.en : bench.en);
    const s = nameOnly ? name : name + ' ' + u.fmt(bench.w) + 'x' + u.fmt(bench.d) + 'x' + u.fmt(bench.h) + 'H';
    const th = Math.max(34, Math.min(58, bestLen / ((s.length + 1) * 0.62)));
    const wpx = s.length * th * 0.62;
    if (horizontal) {
      const cx = ox + mid, cy = oy + bench.y + bd / 2;
      sc.text('TEXT', cx, cy - th * 0.35, th, s, { align: 'center' });
      return { x1: cx - wpx / 2, y1: cy - 80, x2: cx + wpx / 2, y2: cy + 60 };
    }
    const cx = ox + bench.x + bw / 2, cy = oy + mid;
    sc.text('TEXT', cx + th * 0.35, cy, th, s, { align: 'center', rot: 90 });
    return { x1: cx - 60, y1: cy - wpx / 2, x2: cx + 80, y2: cy + wpx / 2 };
  }

  // ---------------------------------------------------------------------
  // PLAN VIEW (top-down). Origin (0,0) = OUTSIDE bottom-left corner of box.
  // Interior origin is at (wall, wall). Items live in interior coordinates.
  // ---------------------------------------------------------------------
  function buildPlan(project, opts) {
    opts = opts || {};
    const sc = new BFT.Scene();
    const t = project.trailer;
    const wall = t.wall;
    const L = t.boxLength, W = t.boxWidth;
    const iL = L - 2 * wall, iW = W - 2 * wall;
    const ox = wall, oy = wall; // interior origin in plan coords

    // walls: double line with feature openings
    drawWalls(sc, t, project.features, opts.en);

    // hitch / drawbar centreline at left
    if (opts.hitch !== false && t.hitchLength > 0) {
      const cy = W / 2;
      sc.pline('OUTLINE', [[-t.hitchLength, cy], [-180, cy - 160], [-180, cy + 160], [-t.hitchLength, cy]], true);
      sc.line('OUTLINE', -t.hitchLength, cy, -t.hitchLength - 120, cy);
      sc.circle('OUTLINE', -t.hitchLength - 60, cy, 55);
      sc.line('CENTER', -t.hitchLength - 200, cy, L + 200, cy);
    }

    // items
    const sel = opts.selection || null;
    for (const item of project.items) {
      const world = Object.assign({}, item, { x: ox + item.x, y: oy + item.y });
      drawItemPlan(sc, world, sel && sel.type === 'item' && sel.id === item.id);
    }
    if (opts.labels !== false) {
      labelPass(sc, project, ox, oy, opts.en ? 'en' : (project.meta.lang || 'both'), opts.nameOnly);
    }

    // automatic dimensions
    if (opts.dims !== false) autoDims(sc, project, ox, oy, iL, iW, opts.dims === 'overview');

    // user dims + notes (stored in interior coordinates)
    for (const dm of project.dims || []) {
      if (dm.dir === 'h') sc.dimH(ox + dm.x1, ox + dm.x2, oy + dm.yRef, oy + dm.yDim);
      else sc.dimV(oy + dm.y1, oy + dm.y2, ox + dm.xRef, ox + dm.xDim);
    }
    for (const n of project.notes || []) {
      sc.text('NOTES', ox + n.x, oy + n.y, n.h || 70, n.text);
    }
    return sc;
  }

  function drawWalls(sc, t, features, enOnly) {
    const featName = (f) => (f.type === 'door' ? (enOnly ? 'DOOR ' : 'DOOR 门 ') : (enOnly ? 'SERVERY ' : 'SERVERY 售卖窗 '));
    const L = t.boxLength, W = t.boxWidth, wall = t.wall;
    // Each wall drawn as outer + inner segment lines broken at openings.
    const walls = [
      { name: 'bottom', horiz: true, out: [[0, 0], [L, 0]], inn: [[wall, wall], [L - wall, wall]] },
      { name: 'top',    horiz: true, out: [[0, W], [L, W]], inn: [[wall, W - wall], [L - wall, W - wall]] },
      { name: 'left',   len: W, horiz: false, out: [[0, 0], [0, W]], inn: [[wall, wall], [wall, W - wall]] },
      { name: 'right',  len: W, horiz: false, out: [[L, 0], [L, W]], inn: [[L - wall, wall], [L - wall, W - wall]] },
    ];
    for (const wd of walls) {
      const feats = (features || []).filter((f) => f.wall === wd.name)
        .map((f) => [f.offset, f.offset + f.width, f])
        .sort((a, b) => a[0] - b[0]);
      drawWallLine(sc, wd.out[0], wd.out[1], feats, wd.horiz, false);
      drawWallLine(sc, wd.inn[0], wd.inn[1], feats, wd.horiz, true, wall);
      // opening symbols
      for (const [a, b, f] of feats) {
        const mid = (a + b) / 2;
        if (wd.horiz) {
          const y = wd.out[0][1], yi = wd.inn[0][1];
          sc.line('FIXTURE', a, Math.min(y, yi), a, Math.max(y, yi));
          sc.line('FIXTURE', b, Math.min(y, yi), b, Math.max(y, yi));
          if (f.type === 'door') {
            const dir = y === 0 ? -1 : 1; // swing outwards
            sc.line('FIXTURE', a, y, a, y + dir * f.width);
            sc.arc('FIXTURE', a, y, f.width, dir === -1 ? 270 : 0, dir === -1 ? 360 : 90);
          } else {
            sc.line('FIXTURE', a, (y + yi) / 2, b, (y + yi) / 2);
          }
          const ty = y === 0 ? y - 260 : y + 140;
          sc.text('FIXTURE', mid, ty, 55, featName(f) + BFT.util.fmt(f.width), { align: 'center' });
        } else {
          const x = wd.out[0][0], xi = wd.inn[0][0];
          sc.line('FIXTURE', Math.min(x, xi), a, Math.max(x, xi), a);
          sc.line('FIXTURE', Math.min(x, xi), b, Math.max(x, xi), b);
          if (f.type === 'door') {
            const dir = x === 0 ? -1 : 1;
            sc.line('FIXTURE', x, a, x + dir * f.width, a);
            sc.arc('FIXTURE', x, a, f.width, dir === -1 ? 90 : 0, dir === -1 ? 180 : 90);
          } else {
            sc.line('FIXTURE', (x + xi) / 2, a, (x + xi) / 2, b);
          }
          const tx = x === 0 ? x - 140 : x + 140;
          sc.text('FIXTURE', tx, mid, 55, featName(f) + BFT.util.fmt(f.width), { align: 'center', rot: 90 });
        }
      }
    }
  }

  function drawWallLine(sc, p1, p2, feats, horiz, isInner, wallThk) {
    // walk along the wall, skipping openings
    const fixed = horiz ? p1[1] : p1[0];
    const from = horiz ? p1[0] : p1[1];
    const to = horiz ? p2[0] : p2[1];
    let pos = from;
    const segs = [];
    for (const [a, b] of feats) {
      const A = Math.max(from, a), B = Math.min(to, b);
      if (B > A) { segs.push([pos, A]); pos = B; }
    }
    segs.push([pos, to]);
    for (const [a, b] of segs) {
      if (b - a < 1) continue;
      if (horiz) sc.line('OUTLINE', a, fixed, b, fixed);
      else sc.line('OUTLINE', fixed, a, fixed, b);
    }
  }

  // Automatic dimension chains, in the style of the supplier reference dwg:
  // chains along top & bottom equipment rows, interior length/width, features.
  function autoDims(sc, project, ox, oy, iL, iW, simple) {
    const t = project.trailer;
    const items = project.items.filter((i) => !i.overhead);
    const u = U();

    if (simple) {
      // sales drawing: overall sizes + openings only
      const W = t.boxWidth, L = t.boxLength;
      sc.dimH(ox, ox + iL, oy + iW + t.wall, W + 320, { label: 'INTERNAL LENGTH ' + u.fmt(iL) + 'mm' });
      if (t.hitchLength > 0) sc.dimH(-t.hitchLength, L, W, W + 680, { label: 'OVERALL LENGTH ' + u.fmt(L + t.hitchLength) + 'mm' });
      sc.dimV(oy, oy + iW, ox, -320, { label: 'INTERNAL WIDTH ' + u.fmt(iW) + 'mm' });
      for (const f of project.features || []) {
        if (f.wall === 'bottom') sc.dimH(f.offset, f.offset + f.width, 0, -350);
        if (f.wall === 'top') sc.dimH(f.offset, f.offset + f.width, W, W + 320);
        if (f.wall === 'left') sc.dimV(f.offset, f.offset + f.width, 0, -700);
        if (f.wall === 'right') sc.dimV(f.offset, f.offset + f.width, L, L + 350);
      }
      return;
    }

    // split items into top-row / bottom-row by centre line
    const tops = [], bots = [];
    for (const it of items) {
      const [fw, fd] = u.footprint(it);
      (it.y + fd / 2 >= iW / 2 ? tops : bots).push(it);
    }
    const edges = (arr) => {
      const xs = new Set([0, iL]);
      for (const it of arr) {
        const [fw] = u.footprint(it);
        xs.add(Math.round(it.x * 10) / 10);
        xs.add(Math.round((it.x + fw) * 10) / 10);
      }
      return Array.from(xs).sort((a, b) => a - b);
    };

    // equipment chains along each bench row (depths are on the item labels)
    if (tops.length) {
      const yDim = oy + Math.min(...tops.map((i) => i.y)) - 170;
      sc.dimChainH(edges(tops).map((x) => ox + x), oy + iW, yDim, {});
    }
    if (bots.length) {
      const yDim = oy + Math.max(...bots.map((i) => i.y + u.footprint(i)[1])) + 170;
      sc.dimChainH(edges(bots).map((x) => ox + x), oy, yDim, {});
    }

    const W = t.boxWidth, L = t.boxLength;
    const feats = project.features || [];

    // one clean chain per wall through ALL its openings (no overlapping
    // dims when a wall carries two serving windows)
    const wallChain = (wall) => {
      const es = new Set();
      for (const f of feats.filter((f) => f.wall === wall)) {
        es.add(f.offset);
        es.add(f.offset + f.width);
      }
      return es.size ? [0, ...Array.from(es).sort((a, b) => a - b), wall === 'left' || wall === 'right' ? W : L] : null;
    };
    const botChain = wallChain('bottom');
    if (botChain) sc.dimChainH(botChain, 0, -350);
    const topChain = wallChain('top');
    if (topChain) sc.dimChainH(topChain, W, W + 320);
    const leftChain = wallChain('left');
    if (leftChain) sc.dimChainV(leftChain, 0, -t.hitchLength - 350);
    const rightChain = wallChain('right');
    if (rightChain) sc.dimChainV(rightChain, L, L + 950);

    // only the sizes that matter: shell length, overall with drawbar,
    // internal width (equipment chains already total the internal length)
    let topStack = W + (topChain ? 620 : 320);
    sc.dimH(0, L, W, topStack, { label: 'SHELL 外长 ' + u.fmt(L) });
    if (t.hitchLength > 0) sc.dimH(-t.hitchLength, L, W, topStack + 300, { label: 'OVERALL 总长 ' + u.fmt(L + t.hitchLength) });
    sc.dimV(oy, oy + iW, ox, -320, { label: 'INT 内宽 ' + u.fmt(iW) });

    // overhead units (range hoods): width dim just below the unit (the
    // projection is on the item label, no dimension line needed)
    for (const it of project.items.filter((i) => i.overhead)) {
      const [fw] = u.footprint(it);
      sc.dimH(ox + it.x, ox + it.x + fw, oy + it.y, oy + it.y - 140);
    }
  }

  // ---------------------------------------------------------------------
  // ELEVATIONS
  // ---------------------------------------------------------------------
  // Side elevation seen from `side` ('bottom' = serving side, 'top' = road
  // side). x axis = trailer length (hitch at left for 'bottom', mirrored for
  // 'top' so the two views are consistent), y axis = height from ground.
  function buildSideElevation(project, side, enOnly) {
    const sc = new BFT.Scene();
    const t = project.trailer;
    const L = t.boxLength, floorH = t.chassisHeight, roofH = floorH + t.boxHeight;
    const u = U();
    const mirror = side === 'top';
    const mx = (x) => (mirror ? L - x : x);

    // ground line
    sc.line('CENTER', -t.hitchLength - 300, 0, L + 300, 0);
    // box
    sc.rect('OUTLINE', 0, floorH, L, t.boxHeight);
    // roof cap
    sc.line('OUTLINE', -60, roofH, L + 60, roofH);
    sc.line('OUTLINE', -60, roofH + 60, L + 60, roofH + 60);
    // chassis rail
    sc.line('OUTLINE', 0, floorH - 80, L, floorH - 80);

    // bench level: everything inside finishes flush at this height
    const benchLevel = floorH + t.worktopHeight;
    sc.line('HIDDEN', 0, benchLevel, L, benchLevel);
    sc.text('NOTES', 80, benchLevel + 40, 60,
      (enOnly ? 'BENCH LEVEL ' : 'BENCH LEVEL 台面高 ') + u.fmt(t.worktopHeight));

    // hitch
    const hx1 = mirror ? L : 0, hx2 = mirror ? L + t.hitchLength : -t.hitchLength;
    if (t.hitchLength > 0) {
      sc.line('OUTLINE', hx1, floorH - 80, hx2, floorH - 200);
      sc.line('OUTLINE', hx1, floorH - 20, hx2, floorH - 140);
      sc.pline('OUTLINE', [[hx2, floorH - 200], [hx2 - (mirror ? -1 : 1) * 40, floorH - 320], [hx2, floorH - 320]], false);
      // jockey wheel
      sc.circle('OUTLINE', hx2 + (mirror ? -1 : 1) * 250, 100, 100);
      sc.line('OUTLINE', hx2 + (mirror ? -1 : 1) * 250, 200, hx2 + (mirror ? -1 : 1) * 250, floorH - 150);
    }

    // wheels
    const wr = t.wheelDia / 2;
    const axX = t.axlePos != null ? t.axlePos : L * 0.55;
    const axles = t.axles === 1 ? [axX] : [axX - t.wheelDia * 0.62, axX + t.wheelDia * 0.62];
    for (const ax of axles) {
      sc.circle('OUTLINE', mx(ax), wr, wr);
      sc.circle('OUTLINE', mx(ax), wr, wr * 0.55);
    }
    // mudguard
    const gLo = Math.min(...axles) - wr - 90, gHi = Math.max(...axles) + wr + 90;
    sc.pline('OUTLINE', [[mx(gLo), floorH], [mx(gLo), wr + 190], [mx(gHi), wr + 190], [mx(gHi), floorH]], false);

    // wall features on this side
    for (const f of (project.features || []).filter((f) => f.wall === side)) {
      const sill = f.sill != null ? f.sill : (f.type === 'door' ? 0 : 900);
      const fh = f.height != null ? f.height : (f.type === 'door' ? t.boxHeight - 150 : 900);
      const x1 = mirror ? L - f.offset - f.width : f.offset;
      sc.rect('FIXTURE', x1, floorH + sill, f.width, fh);
      if (f.type === 'window') {
        // flip-up awning shown dashed
        sc.pline('HIDDEN', [[x1, floorH + sill + fh], [x1 + f.width * 0.06, floorH + sill + fh + f.width * 0.28]], false);
        sc.text('FIXTURE', x1 + f.width / 2, floorH + sill + fh / 2 - 27, 55, enOnly ? 'SERVERY' : 'SERVERY 售卖窗', { align: 'center' });
      } else {
        sc.line('FIXTURE', x1 + (mirror ? f.width - 120 : 60), floorH + sill + fh * 0.5, x1 + (mirror ? f.width - 60 : 120), floorH + sill + fh * 0.5);
        sc.text('FIXTURE', x1 + f.width / 2, floorH + sill + fh * 0.72, 55, enOnly ? 'DOOR' : 'DOOR 门', { align: 'center' });
      }
    }

    // dims: overall length, heights
    sc.dimH(0, L, 0, -350, { label: u.fmt(L) });
    if (t.hitchLength > 0) sc.dimH(Math.min(hx2, 0), Math.max(hx2, L), 0, -650, { label: (enOnly ? 'OVERALL ' : 'OVERALL 总长 ') + u.fmt(L + t.hitchLength) });
    sc.dimV(0, roofH, L, L + 350, { label: 'H=' + u.fmt(roofH) });
    sc.dimV(floorH, roofH, 0, -350, { label: u.fmt(t.boxHeight) });
    return sc;
  }

  // ---------------------------------------------------------------------
  // INTERIOR ELEVATION: stand in the walkway and look at one side wall.
  // Shows benches and every appliance at true height so levels line up.
  // side 'top' = cook side, 'bottom' = serving side. x = along trailer.
  // ---------------------------------------------------------------------
  function buildInteriorElevation(project, side, enOnly) {
    const sc = new BFT.Scene();
    const u = U();
    const t = project.trailer;
    const iL = t.boxLength - 2 * t.wall;
    const iW = t.boxWidth - 2 * t.wall;
    const iH = t.interiorHeight;
    const benchH = t.worktopHeight;

    // interior box: floor, walls, ceiling
    sc.rect('OUTLINE', 0, 0, iL, iH);

    const onSide = (it) => {
      const [, fd] = u.footprint(it);
      if (it.catId === 'bench' && fd > iW * 0.8) return true; // U-shape end bench shows in both
      const cy = it.y + fd / 2;
      return side === 'top' ? cy >= iW / 2 : cy < iW / 2;
    };
    const items = project.items.filter(onSide);

    // benches first (the datum everything lines up to)
    let sideBenchH = benchH;
    for (const b of items.filter((i) => i.catId === 'bench')) {
      const [fw] = u.footprint(b);
      sc.rect('EQUIP', b.x, 0, fw, b.h);
      sideBenchH = b.h;
    }
    // bench level line right across, labelled
    sc.line('HIDDEN', 0, sideBenchH, iL, sideBenchH);
    sc.text('NOTES', 60, sideBenchH + 40, 55, (enOnly ? 'BENCH LEVEL ' : 'BENCH LEVEL 台面 ') + u.fmt(sideBenchH));

    // wall openings on this side (servery windows) for reference
    const wallName = side === 'top' ? 'top' : 'bottom';
    for (const f of (project.features || []).filter((f) => f.wall === wallName)) {
      const sill = f.sill != null ? f.sill : 900;
      const fh = f.height != null ? f.height : 900;
      sc.rect('FIXTURE', f.offset - t.wall, sill, f.width, fh);
      sc.text('FIXTURE', f.offset - t.wall + f.width / 2, sill + fh - 90, 50,
        (f.type === 'door' ? 'DOOR' : 'SERVERY') + ' ' + u.fmt(f.width), { align: 'center' });
    }

    // appliances at true height; base worked out from mount setting
    const placed = [];
    const others = items.filter((i) => i.catId !== 'bench' && !(i.svc && i.sym === 'svc'));
    others.sort((a, b) => a.x - b.x);
    others.forEach((it, idx) => {
      const [fw] = u.footprint(it);
      let base;
      if (it.mount === 'floor') base = 0;
      else if (it.mount === 'bench') base = sideBenchH;
      else if (it.overhead) base = iH - it.h;
      else base = it.h <= 650 ? sideBenchH : 0; // small units sit on the bench
      const la = it.overhead ? 'HIDDEN' : 'EQUIP';
      sc.rect(la, it.x, base, fw, it.h);
      const top = base + it.h;
      const name = enOnly || !it.zh ? it.en : it.zh + ' ' + it.en;
      const s = name + ' ' + u.fmt(it.h) + 'H' + (top !== sideBenchH && !it.overhead ? ' (top ' + u.fmt(top) + ')' : '');
      const th = 48, wpx = (s.length + 1) * th * 0.62;
      // stack labels above the unit, dodging ones already placed
      let ty = (it.overhead ? base : top) + 90;
      for (let tries = 0; tries < 4; tries++) {
        const box = { x1: it.x + fw / 2 - wpx / 2, y1: ty - 40, x2: it.x + fw / 2 + wpx / 2, y2: ty + 70 };
        if (!placed.some((p) => box.x1 < p.x2 + 30 && box.x2 > p.x1 - 30 && box.y1 < p.y2 + 20 && box.y2 > p.y1 - 20)) {
          placed.push(box);
          break;
        }
        ty += 150;
      }
      sc.text('TEXT', it.x + fw / 2, ty, th, s, { align: 'center' });
      if (ty > top + 120) sc.line('TEXT', it.x + fw / 2, ty - 50, it.x + fw / 2, top + 10);
    });

    // height dims
    sc.dimV(0, iH, iL, iL + 320, { label: (enOnly ? 'INT HEIGHT ' : 'INT 净高 ') + u.fmt(iH) });
    sc.dimV(0, sideBenchH, 0, -320, {});
    return sc;
  }

  // End view seen from `end` ('left' = hitch end, 'right' = rear).
  function buildEndView(project, end) {
    const sc = new BFT.Scene();
    const t = project.trailer;
    const W = t.boxWidth, floorH = t.chassisHeight, roofH = floorH + t.boxHeight;
    const u = U();
    sc.line('CENTER', -300, 0, W + 300, 0);
    sc.rect('OUTLINE', 0, floorH, W, t.boxHeight);
    sc.line('OUTLINE', -60, roofH, W + 60, roofH);
    sc.line('OUTLINE', -60, roofH + 60, W + 60, roofH + 60);
    // axle + wheels behind box (dashed)
    const wr = t.wheelDia / 2;
    const trackInset = 120;
    for (const wx of [trackInset, W - trackInset]) {
      sc.pline('HIDDEN', [[wx - 110, 0], [wx - 110, wr * 2 * 0.62], [wx + 110, wr * 2 * 0.62], [wx + 110, 0]], false);
    }
    sc.line('HIDDEN', trackInset, wr, W - trackInset, wr);
    // features on this end wall
    for (const f of (project.features || []).filter((f) => f.wall === end)) {
      const sill = f.sill != null ? f.sill : (f.type === 'door' ? 0 : 900);
      const fh = f.height != null ? f.height : (f.type === 'door' ? t.boxHeight - 150 : 900);
      const x1 = end === 'right' ? f.offset : W - f.offset - f.width; // keep orientation consistent when walking around the trailer
      sc.rect('FIXTURE', x1, floorH + sill, f.width, fh);
    }
    sc.dimH(0, W, 0, -350, { label: u.fmt(W) });
    sc.dimV(0, roofH, W, W + 350, { label: u.fmt(roofH) });
    return sc;
  }

  // ---------------------------------------------------------------------
  // DRAWING SHEET: 5 views + notes + title block, like the supplier's dwg.
  // ---------------------------------------------------------------------
  function buildSheet(project) {
    const sc = new BFT.Scene();
    const t = project.trailer;
    const u = U();
    const gap = 1400;

    const plan = buildPlan(project, { labels: true, dims: true });
    const sideFront = buildSideElevation(project, 'bottom');
    const sideBack = buildSideElevation(project, 'top');
    const endL = buildEndView(project, 'left');
    const endR = buildEndView(project, 'right');

    const bPlan = plan.bounds(), bSF = sideFront.bounds(), bSB = sideBack.bounds();
    const bEL = endL.bounds(), bER = endR.bounds();

    // middle row: endL | plan | endR, centred vertically on the plan
    const rowY = 0;
    const planX = 0;
    sc.add(plan, planX - bPlan.minX, rowY - bPlan.minY);
    const planW = bPlan.w, planH = bPlan.h;
    sc.add(endL, planX - bEL.w - gap - bEL.minX, rowY + (planH - bEL.h) / 2 - bEL.minY);
    sc.add(endR, planX + planW + gap - bER.minX, rowY + (planH - bER.h) / 2 - bER.minY);

    // top row: serving-side elevation centred over the plan
    const topY = rowY + planH + gap;
    sc.add(sideFront, planX + (planW - bSF.w) / 2 - bSF.minX, topY - bSF.minY);
    // bottom row: road-side elevation
    const botY = rowY - gap - bSB.h;
    sc.add(sideBack, planX + (planW - bSB.w) / 2 - bSB.minX, botY - bSB.minY);

    // interior elevations: appliance heights against the bench line
    const intCook = buildInteriorElevation(project, 'top');
    const intServe = buildInteriorElevation(project, 'bottom');
    const bIC = intCook.bounds(), bIS = intServe.bounds();
    const icY = botY - gap - bIC.h;
    sc.add(intCook, planX + (planW - bIC.w) / 2 - bIC.minX, icY - bIC.minY);
    const isY = icY - gap - bIS.h;
    sc.add(intServe, planX + (planW - bIS.w) / 2 - bIS.minX, isY - bIS.minY);

    // view titles
    const tt = 110;
    sc.text('TITLE', planX + planW / 2, topY + bSF.h + 250, tt, 'SERVING SIDE ELEVATION 售卖侧立面', { align: 'center' });
    sc.text('TITLE', planX + planW / 2, rowY + planH + 350, tt, 'PLAN VIEW 平面图', { align: 'center' });
    sc.text('TITLE', planX - gap - bEL.w / 2, rowY + (planH + bEL.h) / 2 + 300, tt, 'FRONT 前视', { align: 'center' });
    sc.text('TITLE', planX + planW + gap + bER.w / 2, rowY + (planH + bER.h) / 2 + 300, tt, 'REAR 后视', { align: 'center' });
    sc.text('TITLE', planX + planW / 2, botY - 350, tt, 'ROAD SIDE ELEVATION 道路侧立面', { align: 'center' });
    sc.text('TITLE', planX + planW / 2, icY - 350, tt, 'COOK SIDE INTERIOR 烹饪侧内立面', { align: 'center' });
    sc.text('TITLE', planX + planW / 2, isY - 350, tt, 'SERVING SIDE INTERIOR 售卖侧内立面', { align: 'center' });

    // drawing frame with notes + title block band + equipment schedule
    const bal = BFT.balance(project);
    const schedule = project.items.map((it) => {
      const nm = (it.zh ? it.zh + ' ' : '') + it.en;
      return nm + '  ' + u.fmt(it.w) + 'x' + u.fmt(it.d) + 'x' + u.fmt(it.h) + '  ' + (it.kg || 0) + 'kg';
    });
    sheetFrame(sc, project, false, [
      'ALL DIMENSIONS IN MILLIMETRES 所有尺寸单位为毫米',
      'DO NOT SCALE - USE FIGURED DIMENSIONS 以标注尺寸为准',
      'ALL BENCH TOPS LEVEL AT 台面同高 ' + u.fmt(t.worktopHeight) + 'mm; INTERNAL HEIGHT 净高 ' + u.fmt(t.interiorHeight) + 'mm',
      'WALL THICKNESS 墙体厚度: ' + u.fmt(t.wall) + 'mm',
      'EST. WEIGHT 估重 ' + bal.total + 'kg (SHELL ' + bal.tare + ' + EQUIP ' + bal.equipment + '), BALL LOAD 球载 ~' + bal.ball + 'kg (' + bal.ballPct + '%)',
    ], schedule);
    return sc;
  }

  // ---------------------------------------------------------------------
  // CUSTOMER / SALES SHEET: simplified concept drawing for clients —
  // English-only, equipment names, headline dimensions, no factory detail.
  // ---------------------------------------------------------------------
  function buildCustomerSheet(project) {
    const sc = new BFT.Scene();
    const t = project.trailer;
    const u = U();
    const gap = 1600;

    const plan = buildPlan(project, { en: true, nameOnly: true, dims: 'overview' });
    const side = buildSideElevation(project, 'bottom', true);
    const bPlan = plan.bounds(), bSide = side.bounds();

    sc.add(plan, -bPlan.minX, -bPlan.minY);
    sc.add(side, (bPlan.w - bSide.w) / 2 - bSide.minX, bPlan.h + gap - bSide.minY);

    const tt = 120;
    sc.text('TITLE', bPlan.w / 2, bPlan.h + gap + bSide.h + 300, tt, 'SIDE VIEW', { align: 'center' });
    sc.text('TITLE', bPlan.w / 2, -450 - 0, tt, 'FLOOR PLAN', { align: 'center' });

    sheetFrame(sc, project, true, [
      'ALL SIZES IN MILLIMETRES',
      'INTERNAL HEIGHT: ' + u.fmt(t.interiorHeight) + 'mm',
      'BENCH HEIGHT: ' + u.fmt(t.worktopHeight) + 'mm',
      'EXTERNAL BOX: ' + u.fmt(t.boxLength) + ' x ' + u.fmt(t.boxWidth) + 'mm',
      'CONCEPT LAYOUT FOR APPROVAL - NOT A MANUFACTURING DRAWING',
    ]);
    return sc;
  }

  // Drawing frame (double border), general-notes area and a standard
  // three-column title block along the bottom band — the layout a
  // manufacturer expects on an incoming drawing.
  function sheetFrame(sc, project, sales, notes, schedule) {
    const m = project.meta;
    const b = sc.bounds();
    const M = 500;            // content margin inside the frame
    const TB_H = 1750;        // title band height
    const x1 = b.minX - M, x2 = b.maxX + M;
    const bandTop = b.minY - M;
    const y1 = bandTop - TB_H, y2 = b.maxY + M;

    // double border
    sc.rect('TITLE', x1, y1, x2 - x1, y2 - y1);
    sc.rect('TITLE', x1 - 90, y1 - 90, x2 - x1 + 180, y2 - y1 + 180);
    sc.line('TITLE', x1, bandTop, x2, bandTop);

    // ---- title block: right side of the band
    const TB_W = Math.min(6200, (x2 - x1) * 0.5);
    const bx = x2 - TB_W;
    sc.line('TITLE', bx, y1, bx, bandTop);
    const rowY = y1 + TB_H * 0.52;
    sc.line('TITLE', bx, rowY, x2, rowY);

    // company band
    sc.text('TITLE', bx + 170, rowY + (TB_H * 0.48) * 0.42, 185, m.company || 'BONDI FOOD TRAILERS');
    if (m.contact) sc.text('TITLE', bx + 170, rowY + 110, 78, m.contact);

    // three columns of label/value pairs
    const cols = [bx, bx + TB_W * 0.42, bx + TB_W * 0.72, x2];
    sc.line('TITLE', cols[1], y1, cols[1], rowY);
    sc.line('TITLE', cols[2], y1, cols[2], rowY);
    const pair = (cx, topY, label, value) => {
      sc.text('TITLE', cx + 140, topY - 200, 62, label);
      sc.text('TITLE', cx + 140, topY - 420, 96, value || '-');
    };
    const half = rowY - y1;
    const t1 = rowY, t2 = rowY - half / 2;
    if (sales) {
      pair(cols[0], t1, 'PROJECT', m.project);
      pair(cols[0], t2, 'PREPARED FOR', m.client);
      pair(cols[1], t1, 'DRAWING', 'CONCEPT LAYOUT');
      pair(cols[1], t2, 'DATE', m.date);
      pair(cols[2], t1, 'STATUS', 'FOR APPROVAL');
      pair(cols[2], t2, 'REV', m.revision || 'A');
    } else {
      pair(cols[0], t1, 'PROJECT 项目', m.project);
      pair(cols[0], t2, 'CLIENT 客户', m.client);
      pair(cols[1], t1, 'DWG NO 图号', m.drawingNo);
      pair(cols[1], t2, 'DATE 日期', m.date);
      pair(cols[2], t1, 'UNITS 单位', 'mm (1:1 model)');
      pair(cols[2], t2, 'REV 版本', m.revision || 'A');
    }

    // ---- general notes: left side of the band
    if (notes && notes.length) {
      sc.text('TITLE', x1 + 170, bandTop - 260, 84, sales ? 'NOTES' : 'GENERAL NOTES 说明');
      notes.forEach((s, i) => sc.text('NOTES', x1 + 170, bandTop - 500 - i * 210, 84, (i + 1) + '. ' + s));
    }

    // ---- equipment schedule (heights & weights) between notes and titleblock
    if (schedule && schedule.length) {
      const sx = x1 + 7600;
      const room = bx - sx - 200;
      if (room > 2600) {
        sc.text('TITLE', sx, bandTop - 260, 84, 'EQUIPMENT SCHEDULE 设备明细 (WxDxH, kg)');
        const perCol = 6;
        const colW = Math.max(2600, room / Math.min(2, Math.ceil(schedule.length / perCol)));
        schedule.slice(0, perCol * 2).forEach((s, i) => {
          const col = Math.floor(i / perCol), row = i % perCol;
          if (sx + col * colW + colW <= bx) {
            sc.text('NOTES', sx + col * colW, bandTop - 500 - row * 195, 62, s);
          }
        });
        if (schedule.length > perCol * 2) {
          sc.text('NOTES', sx, bandTop - 500 - perCol * 195, 62, '+ ' + (schedule.length - perCol * 2) + ' more 另有 - see plan 见平面图');
        }
      }
    }
  }

  // Heights view: both interior elevations stacked, live in the app.
  function buildHeightsView(project) {
    const sc = new BFT.Scene();
    const cook = buildInteriorElevation(project, 'top', true);
    const serve = buildInteriorElevation(project, 'bottom', true);
    const bC = cook.bounds(), bS = serve.bounds();
    const gap = 1200;
    sc.add(cook, -bC.minX, gap + bS.h - bC.minY);
    sc.add(serve, -bS.minX, -bS.minY);
    sc.text('TITLE', bC.w / 2, gap + bS.h + bC.h + 250, 110, 'COOK SIDE — LOOKING AT THE WALL', { align: 'center' });
    sc.text('TITLE', bS.w / 2, -420, 110, 'SERVING SIDE — LOOKING AT THE WALL', { align: 'center' });
    return sc;
  }

  BFT.views = { buildPlan, buildSideElevation, buildEndView, buildInteriorElevation, buildHeightsView, buildSheet, buildCustomerSheet, drawItemPlan };
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined') module.exports = globalThis.BFT;

