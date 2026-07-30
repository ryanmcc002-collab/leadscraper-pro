/* Bondi Trailer CAD — utilities. All units are millimetres unless stated. */
(function (root) {
  'use strict';
  const BFT = (root.BFT = root.BFT || {});

  // Bump on every release — shown in the toolbar so a cached old build is
  // obvious at a glance.
  BFT.VERSION = 'v34';

  const U = {
    clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); },

    snap(v, grid) { return Math.round(v / grid) * grid; },

    // Format a millimetre value for dimension text (integers preferred).
    fmt(mm) {
      const r = Math.round(mm * 10) / 10;
      return Number.isInteger(r) ? String(r) : r.toFixed(1);
    },

    deg2rad(d) { return (d * Math.PI) / 180; },

    num(v, fallback) {
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : fallback;
    },

    uid() {
      return 'i' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
    },

    deepCopy(o) { return JSON.parse(JSON.stringify(o)); },

    // Footprint of an item after 90-degree-step rotation: [w, d] in world axes.
    footprint(item) {
      const r = ((item.rot || 0) % 180 + 180) % 180;
      return r === 0 ? [item.w, item.d] : [item.d, item.w];
    },

    // Map a point in item-local coordinates (0..w, 0..d, y-up) to world
    // coordinates given the item's position (footprint bottom-left) and rotation.
    localToWorld(item, lx, ly) {
      const rot = ((item.rot || 0) % 360 + 360) % 360;
      const w = item.w, d = item.d;
      let px, py;
      switch (rot) {
        case 90: px = d - ly; py = lx; break;
        case 180: px = w - lx; py = d - ly; break;
        case 270: px = ly; py = w - lx; break;
        default: px = lx; py = ly;
      }
      return [item.x + px, item.y + py];
    },

    rectCorners(x, y, w, h) {
      return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    },

    pointInRect(px, py, x, y, w, h) {
      return px >= x && px <= x + w && py >= y && py <= y + h;
    },

    dist(x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); },

    todayISO() {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    },
  };

  BFT.util = U;
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined') module.exports = globalThis.BFT;

