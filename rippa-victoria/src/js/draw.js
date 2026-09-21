/* Parametric side-profile drawings. Shared by build.js (Node) and the browser.
   Every function works in millimetres. The viewBox is in millimetres too, so
   one CSS custom property (--px-per-mm) scales everything drawn in the line-up
   by the same amount. GROUND is the y of the ground line in every drawing. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RippaDraw = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var GROUND = 2600; // mm. Tallest thing drawn is the R22 cab at 2450, plus headroom.

  function n(v) { return Math.round(v * 10) / 10; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function pt(x, y) { return n(x) + ',' + n(y); }

  /* Excavator: tracks, blade, house, canopy or cab, swing boom, stick, bucket
     resting on the ground. Everything is derived from the dims in machines.json
     so a longer machine really is longer and a taller one really is taller. */
  function excavator(m) {
    var L = m.length, H = m.height, TL = m.trackLength, G = GROUND;
    var th = clamp(H * 0.19, 330, 480);           // track height
    var tx0 = L * 0.06, tx1 = tx0 + TL;            // track extent
    var ty = G - th;
    var houseH = H * 0.24;
    var hx0 = tx0 - L * 0.03, hx1 = tx0 + TL * 0.96;
    var hy = ty - houseH;                          // house top
    var cx0 = hx0 + (hx1 - hx0) * 0.14, cx1 = hx0 + (hx1 - hx0) * 0.74;
    var top = G - H;                               // overall height
    var px = hx1 - TL * 0.02, py = hy + houseH * 0.45;  // boom pivot
    var bw = clamp(L * 0.16, 380, 620), bh = bw * 0.62; // bucket
    var bpx = L - bw * 0.62, bpy = G - bh * 1.02;       // bucket pivot
    var kx = px + (bpx - px) * 0.45, ky = top + H * 0.1; // boom/stick knuckle
    var s = [];

    s.push('<g class="ex">');
    // Tracks
    s.push('<rect class="ex-track" x="' + n(tx0) + '" y="' + n(ty) + '" width="' + n(TL) + '" height="' + n(th) + '" rx="' + n(th / 2) + '"/>');
    var rr = th * 0.16;
    s.push('<circle class="ex-roller" cx="' + n(tx0 + th / 2) + '" cy="' + n(G - th / 2) + '" r="' + n(th * 0.28) + '"/>');
    s.push('<circle class="ex-roller" cx="' + n(tx1 - th / 2) + '" cy="' + n(G - th / 2) + '" r="' + n(th * 0.28) + '"/>');
    var rollers = Math.max(2, Math.round((TL - th) / (th * 0.9)));
    for (var i = 1; i <= rollers; i++) {
      var rx = tx0 + th / 2 + (TL - th) * (i / (rollers + 1));
      s.push('<circle class="ex-roller" cx="' + n(rx) + '" cy="' + n(G - rr - th * 0.12) + '" r="' + n(rr) + '"/>');
    }
    // Blade in front of the tracks
    var bl0 = tx1 + L * 0.005, blw = L * 0.03;
    s.push('<path class="ex-panel" d="M' + pt(tx1 - th * 0.2, ty + th * 0.25) + ' L' + pt(bl0, ty + th * 0.2) + ' L' + pt(bl0 + blw, ty + th * 0.05) + ' L' + pt(bl0 + blw, G - 20) + ' L' + pt(bl0, G - 20) + '"/>');
    // House with rounded counterweight
    var r = houseH * 0.5;
    s.push('<path class="ex-panel" d="M' + pt(hx0 + r, hy) + ' L' + pt(hx1, hy) + ' L' + pt(hx1, ty) + ' L' + pt(hx0 + r, ty) + ' A' + n(r) + ',' + n(r) + ' 0 0 1 ' + pt(hx0, ty - r) + ' L' + pt(hx0, hy + r) + ' A' + n(r) + ',' + n(r) + ' 0 0 1 ' + pt(hx0 + r, hy) + ' Z"/>');
    // Engine cover line and the data plate
    s.push('<line class="ex-line" x1="' + n(hx0 + r * 0.3) + '" y1="' + n(hy + houseH * 0.55) + '" x2="' + n(cx0 - 30) + '" y2="' + n(hy + houseH * 0.55) + '"/>');
    s.push('<rect class="ex-plate" x="' + n(hx0 + houseH * 0.55) + '" y="' + n(hy + houseH * 0.2) + '" width="' + n(houseH * 0.55) + '" height="' + n(houseH * 0.22) + '"/>');
    // Seat
    var seatY = hy - H * 0.01;
    s.push('<path class="ex-line" d="M' + pt(cx0 + (cx1 - cx0) * 0.2, hy) + ' L' + pt(cx0 + (cx1 - cx0) * 0.2, seatY - H * 0.14) + ' L' + pt(cx0 + (cx1 - cx0) * 0.28, seatY - H * 0.15) + ' M' + pt(cx0 + (cx1 - cx0) * 0.2, seatY - H * 0.02) + ' L' + pt(cx0 + (cx1 - cx0) * 0.62, seatY - H * 0.02) + '"/>');
    if (m.cabType === 'cab') {
      var cr = H * 0.04;
      s.push('<path class="ex-glass" d="M' + pt(cx0, hy) + ' L' + pt(cx0, top + cr) + ' Q' + pt(cx0, top) + ' ' + pt(cx0 + cr, top) + ' L' + pt(cx1 - cr * 1.5, top) + ' Q' + pt(cx1, top) + ' ' + pt(cx1, top + cr * 1.5) + ' L' + pt(cx1 + (hx1 - cx1) * 0.25, hy) + ' Z"/>');
      // Door split and window sill
      s.push('<line class="ex-line" x1="' + n(cx0 + (cx1 - cx0) * 0.55) + '" y1="' + n(top + cr) + '" x2="' + n(cx0 + (cx1 - cx0) * 0.55) + '" y2="' + n(hy) + '"/>');
      s.push('<line class="ex-line" x1="' + n(cx0) + '" y1="' + n(hy - H * 0.16) + '" x2="' + n(cx1 + (hx1 - cx1) * 0.12) + '" y2="' + n(hy - H * 0.16) + '"/>');
    } else {
      // Canopy: roof slab, a vertical post behind the seat and a raked post in front
      var roofT = H * 0.035;
      s.push('<rect class="ex-panel" x="' + n(cx0 - 60) + '" y="' + n(top) + '" width="' + n(cx1 - cx0 + 160) + '" height="' + n(roofT) + '" rx="' + n(roofT / 2) + '"/>');
      s.push('<line class="ex-post" x1="' + n(cx1 + 40) + '" y1="' + n(top + roofT) + '" x2="' + n(cx1 + 40) + '" y2="' + n(hy) + '"/>');
      s.push('<line class="ex-post" x1="' + n(cx0 + 90) + '" y1="' + n(top + roofT) + '" x2="' + n(cx0 + 10) + '" y2="' + n(hy) + '"/>');
      // Control levers
      s.push('<path class="ex-line" d="M' + pt(cx0 + (cx1 - cx0) * 0.72, hy) + ' L' + pt(cx0 + (cx1 - cx0) * 0.8, hy - H * 0.1) + '"/>');
    }
    // Boom (tapered), stick (tapered), bucket
    var bt = H * 0.055, st = H * 0.04;
    s.push('<path class="ex-arm" d="M' + pt(px, py - bt) + ' L' + pt(kx - bt * 0.4, ky) + ' L' + pt(kx + bt * 0.6, ky + bt * 0.6) + ' L' + pt(px + bt * 0.2, py + bt) + ' Z"/>');
    s.push('<path class="ex-arm" d="M' + pt(kx - st * 0.6, ky - st * 0.2) + ' L' + pt(kx + st * 0.8, ky - st * 0.4) + ' L' + pt(bpx + st * 0.5, bpy) + ' L' + pt(bpx - st * 0.5, bpy + st * 0.2) + ' Z"/>');
    // Boom cylinder and stick cylinder
    s.push('<line class="ex-cyl" x1="' + n(px - TL * 0.1) + '" y1="' + n(hy) + '" x2="' + n(px + (kx - px) * 0.55) + '" y2="' + n(py + (ky - py) * 0.5 - bt * 0.5) + '"/>');
    s.push('<line class="ex-cyl" x1="' + n(px + (kx - px) * 0.6) + '" y1="' + n(py + (ky - py) * 0.7 - bt * 1.2) + '" x2="' + n(kx + (bpx - kx) * 0.35) + '" y2="' + n(ky + (bpy - ky) * 0.25) + '"/>');
    // Bucket: pivot, curved back, teeth on the ground
    s.push('<path class="ex-bucket" d="M' + pt(bpx, bpy) + ' L' + pt(bpx - bw * 0.35, bpy + bh * 0.25) + ' Q' + pt(bpx - bw * 0.42, G - 30) + ' ' + pt(bpx + bw * 0.05, G - 20) + ' L' + pt(L, G - 20) + ' L' + pt(L - bw * 0.15, G - bh * 0.7) + ' Z"/>');
    s.push('<circle class="ex-pin" cx="' + n(bpx) + '" cy="' + n(bpy) + '" r="' + n(st * 0.35) + '"/>');
    s.push('<circle class="ex-pin" cx="' + n(kx) + '" cy="' + n(ky + bt * 0.15) + '" r="' + n(st * 0.35) + '"/>');
    s.push('<circle class="ex-pin" cx="' + n(px) + '" cy="' + n(py) + '" r="' + n(st * 0.35) + '"/>');
    s.push('</g>');
    return s.join('');
  }

  /* A 1.8 m person in a hard hat and work boots, as a line figure. */
  function person(h) {
    h = h || 1800; var G = GROUND, top = G - h;
    var headR = h * 0.062, cx = 550;
    var s = [];
    s.push('<g class="ref">');
    s.push('<circle class="ref-line" cx="' + cx + '" cy="' + n(top + headR + 20) + '" r="' + n(headR) + '"/>');
    // Hard hat brim
    s.push('<line class="ref-line" x1="' + n(cx - headR * 1.3) + '" y1="' + n(top + headR * 0.95) + '" x2="' + n(cx + headR * 1.1) + '" y2="' + n(top + headR * 0.95) + '"/>');
    var shoulder = top + headR * 2 + 60, hip = top + h * 0.5, knee = top + h * 0.75;
    s.push('<path class="ref-line" d="M' + pt(cx, shoulder - 30) + ' L' + pt(cx, hip) + '"/>');
    s.push('<path class="ref-line" d="M' + pt(cx - h * 0.11, shoulder) + ' L' + pt(cx + h * 0.11, shoulder) + '"/>');
    s.push('<path class="ref-line" d="M' + pt(cx - h * 0.11, shoulder) + ' L' + pt(cx - h * 0.14, hip - 40) + ' M' + pt(cx + h * 0.11, shoulder) + ' L' + pt(cx + h * 0.16, hip - 120) + '"/>');
    s.push('<path class="ref-line" d="M' + pt(cx, hip) + ' L' + pt(cx - h * 0.08, knee) + ' L' + pt(cx - h * 0.1, G - 30) + ' L' + pt(cx - h * 0.16, G - 30) + '"/>');
    s.push('<path class="ref-line" d="M' + pt(cx, hip) + ' L' + pt(cx + h * 0.08, knee) + ' L' + pt(cx + h * 0.08, G - 30) + ' L' + pt(cx + h * 0.15, G - 30) + '"/>');
    s.push('</g>');
    return s.join('');
  }

  /* Dual-cab ute, side on, tow bar at the rear. */
  function ute(len, h) {
    len = len || 5300; h = h || 1850; var G = GROUND;
    var wr = 390, wy = G - wr, clearance = 260;
    var sill = G - clearance - 80;
    var bonnet = G - h * 0.56, roof = G - h, tub = G - h * 0.62;
    var s = [];
    s.push('<g class="ref">');
    s.push('<path class="ref-body" d="M' + pt(80, sill) + ' L' + pt(80, bonnet + 300) + ' Q' + pt(90, bonnet + 60) + ' ' + pt(300, bonnet) + ' L' + pt(1450, bonnet - 40) + ' L' + pt(1900, roof + 40) + ' Q' + pt(1960, roof) + ' ' + pt(2060, roof) + ' L' + pt(3200, roof) + ' Q' + pt(3300, roof) + ' ' + pt(3330, roof + 60) + ' L' + pt(3400, tub) + ' L' + pt(len - 80, tub) + ' L' + pt(len - 80, sill) + ' Z"/>');
    // Windows
    s.push('<path class="ref-glass" d="M' + pt(1560, bonnet - 60) + ' L' + pt(1960, roof + 110) + ' L' + pt(2560, roof + 110) + ' L' + pt(2560, bonnet - 60) + ' Z"/>');
    s.push('<path class="ref-glass" d="M' + pt(2640, roof + 110) + ' L' + pt(3180, roof + 110) + ' L' + pt(3260, bonnet - 60) + ' L' + pt(2640, bonnet - 60) + ' Z"/>');
    // Door split
    s.push('<line class="ref-line" x1="2600" y1="' + n(bonnet - 60) + '" x2="2600" y2="' + n(sill) + '"/>');
    // Tub line
    s.push('<line class="ref-line" x1="3400" y1="' + n(tub) + '" x2="3400" y2="' + n(sill) + '"/>');
    // Wheels
    [900, len - 1000].forEach(function (x) {
      s.push('<circle class="ref-wheel" cx="' + x + '" cy="' + n(wy) + '" r="' + wr + '"/>');
      s.push('<circle class="ref-hub" cx="' + x + '" cy="' + n(wy) + '" r="' + n(wr * 0.52) + '"/>');
    });
    // Tow bar
    s.push('<path class="ref-line" d="M' + pt(len - 80, sill - 40) + ' L' + pt(len - 10, sill - 40) + ' L' + pt(len - 10, sill - 120) + '"/>');
    s.push('</g>');
    return s.join('');
  }

  /* Side gate: a hinge post, the leaf swung open (seen edge on), a dimension
     line across the gap and the far post. The far post is in its own group so
     the browser can slide it with a CSS transform when the slider moves. */
  function gate(gap, h, max) {
    h = h || 1800; max = max || 2000; var G = GROUND;
    var post = 100, top = G - h;
    var s = [];
    s.push('<g class="ref">');
    s.push('<rect class="ref-post" x="0" y="' + n(top) + '" width="' + post + '" height="' + h + '"/>');
    s.push('<rect class="ref-cap" x="-20" y="' + n(top - 30) + '" width="' + (post + 40) + '" height="30"/>');
    // Leaf, open, edge on: a thin bar with three hinge marks
    s.push('<rect class="ref-leaf" x="' + (post + 20) + '" y="' + n(top + 60) + '" width="50" height="' + n(h - 160) + '"/>');
    [0.15, 0.5, 0.85].forEach(function (f) {
      s.push('<line class="ref-line" x1="' + post + '" y1="' + n(top + 60 + (h - 160) * f) + '" x2="' + (post + 20) + '" y2="' + n(top + 60 + (h - 160) * f) + '"/>');
    });
    // Dimension line with architectural ticks. x2 is set from the gap.
    var dy = top - 220;
    s.push('<g class="gate-dim">');
    s.push('<line class="ref-dim" x1="' + post + '" y1="' + n(dy) + '" x2="' + n(post + gap) + '" y2="' + n(dy) + '"/>');
    s.push('<line class="ref-dim" x1="' + post + '" y1="' + n(dy - 120) + '" x2="' + post + '" y2="' + n(dy + 120) + '"/>');
    s.push('<line class="ref-dim" x1="' + n(post - 50) + '" y1="' + n(dy + 50) + '" x2="' + n(post + 50) + '" y2="' + n(dy - 50) + '"/>');
    s.push('<g class="gate-far" style="transform:translate(' + n(gap) + 'px,0)">');
    s.push('<line class="ref-dim" x1="' + post + '" y1="' + n(dy - 120) + '" x2="' + post + '" y2="' + n(dy + 120) + '"/>');
    s.push('<line class="ref-dim" x1="' + n(post - 50) + '" y1="' + n(dy + 50) + '" x2="' + n(post + 50) + '" y2="' + n(dy - 50) + '"/>');
    s.push('<rect class="ref-post" x="' + post + '" y="' + n(top) + '" width="' + post + '" height="' + h + '"/>');
    s.push('<rect class="ref-cap" x="' + (post - 20) + '" y="' + n(top - 30) + '" width="' + (post + 40) + '" height="30"/>');
    s.push('</g></g></g>');
    return s.join('');
  }

  /* Attachment icons, drawn front on so a 900 mm bucket really is three times
     the width of a 300 mm one. Each returns inner SVG for a 1000 x 600 viewBox. */
  function attachment(kind, size) {
    var s = [];
    if (kind === 'bucket') {
      var w = size || 450, x0 = 500 - w / 2, x1 = 500 + w / 2, y0 = 120, y1 = 470;
      s.push('<path class="at-panel" d="M' + pt(x0, y0) + ' L' + pt(x1, y0) + ' L' + pt(x1 - w * 0.06, y1) + ' L' + pt(x0 + w * 0.06, y1) + ' Z"/>');
      var teeth = Math.max(2, Math.round(w / 150));
      for (var i = 0; i < teeth; i++) {
        var tx = x0 + w * 0.06 + (w * 0.88) * ((i + 0.5) / teeth);
        s.push('<path class="at-panel" d="M' + pt(tx - 28, y1) + ' L' + pt(tx + 28, y1) + ' L' + pt(tx, y1 + 90) + ' Z"/>');
      }
      s.push('<rect class="at-panel" x="' + n(500 - Math.min(w * 0.3, 120)) + '" y="40" width="' + n(Math.min(w * 0.6, 240)) + '" height="80"/>');
      s.push('<line class="at-line" x1="' + n(x0 + 20) + '" y1="' + n(y0 + 90) + '" x2="' + n(x1 - 20) + '" y2="' + n(y0 + 90) + '"/>');
    } else if (kind === 'thumb') {
      s.push('<path class="at-panel" d="M380,60 L520,60 L540,200 Q560,420 420,540 L340,500 Q440,400 430,200 Z"/>');
      s.push('<circle class="ex-pin" cx="450" cy="120" r="24"/>');
      s.push('<path class="at-line" d="M540,200 L700,210 M540,320 L680,360"/>');
    } else if (kind === 'ripper') {
      s.push('<path class="at-panel" d="M420,40 L580,40 L580,180 Q640,380 560,560 L500,560 Q540,380 460,200 L420,180 Z"/>');
      s.push('<circle class="ex-pin" cx="500" cy="110" r="24"/>');
    } else if (kind === 'hitch') {
      s.push('<path class="at-panel" d="M300,120 L700,120 L700,220 L640,220 L640,460 L360,460 L360,220 L300,220 Z"/>');
      s.push('<circle class="ex-pin" cx="400" cy="170" r="30"/><circle class="ex-pin" cx="600" cy="170" r="30"/>');
      s.push('<path class="at-line" d="M420,320 L580,320 M420,400 L580,400"/>');
    }
    return s.join('');
  }

  function svg(inner, w, h, cls, attrs) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 ' + n(w) + ' ' + n(h) + '" ' + (attrs || '') + ' aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  return {
    GROUND: GROUND,
    excavator: excavator,
    person: person,
    ute: ute,
    gate: gate,
    attachment: attachment,
    svg: svg
  };
});
