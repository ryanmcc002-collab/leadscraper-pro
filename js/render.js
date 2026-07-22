/* Bondi Trailer CAD — canvas renderer.
   Draws a Scene (world mm, y-up) onto a 2D canvas with pan/zoom camera.
   cam = { z: px per mm, ox, oy: screen position of world origin }.
   Screen: sx = ox + x*z ; sy = oy - y*z (y flipped). */
(function (root) {
  'use strict';
  const BFT = (root.BFT = root.BFT || {});

  function drawScene(ctx, scene, layersDef, cam, opts) {
    opts = opts || {};
    const X = (x) => cam.ox + x * cam.z;
    const Y = (y) => cam.oy - y * cam.z;

    for (const it of scene.items) {
      const def = layersDef[it.la] || layersDef.OUTLINE;
      ctx.strokeStyle = def.color;
      ctx.fillStyle = def.color;
      ctx.lineWidth = Math.max(0.6, (def.lw || 1) * Math.min(1.6, cam.z * 14));
      ctx.setLineDash(def.dash ? def.dash.map((d) => Math.max(2, d * cam.z)) : []);
      switch (it.k) {
        case 'line':
          ctx.beginPath();
          ctx.moveTo(X(it.x1), Y(it.y1));
          ctx.lineTo(X(it.x2), Y(it.y2));
          ctx.stroke();
          break;
        case 'pline': {
          ctx.beginPath();
          it.pts.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1]))));
          if (it.closed) ctx.closePath();
          ctx.stroke();
          break;
        }
        case 'circle':
          ctx.beginPath();
          ctx.arc(X(it.cx), Y(it.cy), it.r * cam.z, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'arc': {
          // world CCW from +X; canvas y is flipped so angles negate,
          // and CCW world = clockwise-flag true in canvas coords.
          ctx.beginPath();
          ctx.arc(X(it.cx), Y(it.cy), it.r * cam.z, -BFT.util.deg2rad(it.a1), -BFT.util.deg2rad(it.a2), true);
          ctx.stroke();
          break;
        }
        case 'solid': {
          ctx.beginPath();
          it.pts.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1]))));
          ctx.closePath();
          ctx.fill();
          break;
        }
        case 'text': {
          const px = it.h * cam.z * 1.35;
          if (px < 3.5) break; // unreadable, skip for speed
          ctx.setLineDash([]);
          ctx.font = px + 'px Arial, "Microsoft YaHei", sans-serif';
          ctx.textAlign = it.align === 'center' ? 'center' : it.align === 'right' ? 'right' : 'left';
          ctx.textBaseline = 'alphabetic';
          if (it.rot) {
            ctx.save();
            ctx.translate(X(it.x), Y(it.y));
            ctx.rotate(-BFT.util.deg2rad(it.rot));
            ctx.fillText(it.s, 0, 0);
            ctx.restore();
          } else {
            ctx.fillText(it.s, X(it.x), Y(it.y));
          }
          break;
        }
      }
    }
    ctx.setLineDash([]);
  }

  function drawGrid(ctx, cam, wpx, hpx, spacing, color) {
    // world-aligned grid; spacing in mm
    const step = spacing * cam.z;
    if (step < 7) return;
    ctx.strokeStyle = color || 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    const x0 = ((cam.ox % step) + step) % step;
    const y0 = ((cam.oy % step) + step) % step;
    ctx.beginPath();
    for (let x = x0; x < wpx; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, hpx); }
    for (let y = y0; y < hpx; y += step) { ctx.moveTo(0, y); ctx.lineTo(wpx, y); }
    ctx.stroke();
  }

  BFT.render = { drawScene, drawGrid };
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined') module.exports = globalThis.BFT;

