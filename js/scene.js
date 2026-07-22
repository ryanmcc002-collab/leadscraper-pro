/* Bondi Trailer CAD — scene display list.
   A "scene" is a flat list of drawing primitives in real-world millimetres,
   y-up (CAD convention). The same scene is consumed by the canvas renderer,
   the SVG exporter and the DXF exporter, so what you see on screen is exactly
   what the supplier receives.

   Primitive kinds:
     {k:'line',   la, x1,y1,x2,y2}
     {k:'pline',  la, pts:[[x,y],...], closed}
     {k:'circle', la, cx,cy,r}
     {k:'arc',    la, cx,cy,r,a1,a2}          angles in degrees CCW from +X
     {k:'text',   la, x,y,h,s, rot, align, valign}
     {k:'solid',  la, pts:[[x,y],[x,y],[x,y]]} filled triangle (dim arrows)
*/
(function (root) {
  'use strict';
  const BFT = (root.BFT = root.BFT || {});

  // Layer table shared by all renderers. dxf = AutoCAD color index.
  BFT.layers = {
    OUTLINE:  { color: '#e8e8e8', dxf: 7, lw: 1.6 },
    EQUIP:    { color: '#ff5cf4', dxf: 6, lw: 1.2 },
    FIXTURE:  { color: '#4dd7ff', dxf: 4, lw: 1.2 },
    HIDDEN:   { color: '#9a9a9a', dxf: 8, lw: 1.0, dash: [60, 40] },
    CENTER:   { color: '#ff6b6b', dxf: 1, lw: 1.0, dash: [140, 40, 20, 40] },
    DIMS:     { color: '#39d353', dxf: 3, lw: 1.0 },
    TEXT:     { color: '#ff5cf4', dxf: 6, lw: 1.0 },
    NOTES:    { color: '#ffd23f', dxf: 2, lw: 1.0 },
    TITLE:    { color: '#e8e8e8', dxf: 7, lw: 1.2 },
  };

  class Scene {
    constructor() { this.items = []; }
    line(la, x1, y1, x2, y2) { this.items.push({ k: 'line', la, x1, y1, x2, y2 }); }
    pline(la, pts, closed) { this.items.push({ k: 'pline', la, pts, closed: !!closed }); }
    rect(la, x, y, w, h) { this.pline(la, BFT.util.rectCorners(x, y, w, h), true); }
    circle(la, cx, cy, r) { this.items.push({ k: 'circle', la, cx, cy, r }); }
    arc(la, cx, cy, r, a1, a2) { this.items.push({ k: 'arc', la, cx, cy, r, a1, a2 }); }
    solid(la, pts) { this.items.push({ k: 'solid', la, pts }); }
    text(la, x, y, h, s, opts) {
      opts = opts || {};
      this.items.push({
        k: 'text', la, x, y, h, s: String(s),
        rot: opts.rot || 0,
        align: opts.align || 'left',
        valign: opts.valign || 'base',
      });
    }

    // ---- dimensioning -------------------------------------------------
    // Arrow: filled triangle pointing from `tip` back along direction (dx,dy).
    _arrow(la, tipX, tipY, dx, dy, size) {
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;          // points away from the tip
      const px = -uy, py = ux;                     // perpendicular
      const s = size, wHalf = size * 0.33;
      this.solid(la, [
        [tipX, tipY],
        [tipX + ux * s + px * wHalf, tipY + uy * s + py * wHalf],
        [tipX + ux * s - px * wHalf, tipY + uy * s - py * wHalf],
      ]);
    }

    // Horizontal dimension between x1..x2, measured points at yRef,
    // dimension line drawn at yDim. Text above the line.
    dimH(x1, x2, yRef, yDim, opts) {
      opts = opts || {};
      const la = 'DIMS';
      const th = opts.textH || 60, ar = opts.arrow || 55, ext = 30;
      if (x2 < x1) { const t = x1; x1 = x2; x2 = t; }
      const dir = yDim >= yRef ? 1 : -1;
      this.line(la, x1, yRef + dir * 15, x1, yDim + dir * ext);
      this.line(la, x2, yRef + dir * 15, x2, yDim + dir * ext);
      this.line(la, x1, yDim, x2, yDim);
      const label = opts.label != null ? opts.label : BFT.util.fmt(x2 - x1);
      const inside = (x2 - x1) > ar * 3;
      if (inside) {
        this._arrow(la, x1, yDim, 1, 0, ar);
        this._arrow(la, x2, yDim, -1, 0, ar);
      } else {
        this._arrow(la, x1, yDim, -1, 0, ar);
        this._arrow(la, x2, yDim, 1, 0, ar);
      }
      this.text(la, (x1 + x2) / 2, yDim + th * 0.35, th, label, { align: 'center' });
      return this;
    }

    // Vertical dimension between y1..y2, measured points at xRef,
    // dimension line drawn at xDim. Text rotated 90deg beside the line.
    dimV(y1, y2, xRef, xDim, opts) {
      opts = opts || {};
      const la = 'DIMS';
      const th = opts.textH || 60, ar = opts.arrow || 55, ext = 30;
      if (y2 < y1) { const t = y1; y1 = y2; y2 = t; }
      const dir = xDim >= xRef ? 1 : -1;
      this.line(la, xRef + dir * 15, y1, xDim + dir * ext, y1);
      this.line(la, xRef + dir * 15, y2, xDim + dir * ext, y2);
      this.line(la, xDim, y1, xDim, y2);
      const label = opts.label != null ? opts.label : BFT.util.fmt(y2 - y1);
      const inside = (y2 - y1) > ar * 3;
      if (inside) {
        this._arrow(la, xDim, y1, 0, 1, ar);
        this._arrow(la, xDim, y2, 0, -1, ar);
      } else {
        this._arrow(la, xDim, y1, 0, -1, ar);
        this._arrow(la, xDim, y2, 0, 1, ar);
      }
      this.text(la, xDim - th * 0.35, (y1 + y2) / 2, th, label, { align: 'center', rot: 90 });
      return this;
    }

    // Chain of horizontal dimensions along shared yRef/yDim.
    dimChainH(xs, yRef, yDim, opts) {
      for (let i = 0; i < xs.length - 1; i++) {
        if (xs[i + 1] - xs[i] > 1) this.dimH(xs[i], xs[i + 1], yRef, yDim, opts);
      }
    }

    dimChainV(ys, xRef, xDim, opts) {
      for (let i = 0; i < ys.length - 1; i++) {
        if (ys[i + 1] - ys[i] > 1) this.dimV(ys[i], ys[i + 1], xRef, xDim, opts);
      }
    }

    // Leader: text with a pointing line (like 炸炉 → item in the reference dwg).
    leader(la, fromX, fromY, toX, toY, textH, s) {
      this.line(la, fromX, fromY, toX, toY);
      this._arrow(la, toX, toY, fromX - toX, fromY - toY, 45);
      const align = fromX <= toX ? 'right' : 'left';
      const pad = fromX <= toX ? -20 : 20;
      this.text(la, fromX + pad, fromY - textH * 0.3, textH, s, { align });
    }

    // Append another scene translated by (dx,dy).
    add(other, dx, dy) {
      for (const it of other.items) this.items.push(translate(it, dx, dy));
      return this;
    }

    bounds() {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const acc = (x, y) => {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      };
      for (const it of this.items) {
        switch (it.k) {
          case 'line': acc(it.x1, it.y1); acc(it.x2, it.y2); break;
          case 'pline': case 'solid': for (const p of it.pts) acc(p[0], p[1]); break;
          case 'circle': case 'arc': acc(it.cx - it.r, it.cy - it.r); acc(it.cx + it.r, it.cy + it.r); break;
          case 'text': {
            // rough text extents so bounds account for labels
            const w = it.s.length * it.h * 0.62;
            const x0 = it.align === 'center' ? it.x - w / 2 : it.align === 'right' ? it.x - w : it.x;
            if (it.rot) { acc(it.x - it.h, it.y - w / 2); acc(it.x + it.h, it.y + w / 2); }
            else { acc(x0, it.y - it.h * 0.2); acc(x0 + w, it.y + it.h); }
            break;
          }
        }
      }
      if (!isFinite(minX)) { minX = minY = 0; maxX = maxY = 1; }
      return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
    }
  }

  function translate(it, dx, dy) {
    const c = Object.assign({}, it);
    switch (it.k) {
      case 'line': c.x1 += dx; c.y1 += dy; c.x2 += dx; c.y2 += dy; break;
      case 'pline': case 'solid': c.pts = it.pts.map((p) => [p[0] + dx, p[1] + dy]); break;
      case 'circle': case 'arc': c.cx += dx; c.cy += dy; break;
      case 'text': c.x += dx; c.y += dy; break;
    }
    return c;
  }

  BFT.Scene = Scene;
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined') module.exports = globalThis.BFT;

