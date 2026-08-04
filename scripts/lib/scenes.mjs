/* Parametric SVG scene + floorplan generators for product imagery. */

const PALETTES = {
  dusk: {
    sky: ["#0E2440", "#1B3A5F", "#3E5E7E"],
    glow: "#D6AF5E",
    hill1: ["#122C4C", "#0B1E36"],
    hill2: ["#183A60", "#102A48"],
    ground: "#0A1A2E",
    wall: ["#233F60", "#16304F"],
    wing: "#1C3A5E",
    roof: "#0A1B30",
    warm: ["#F5D488", "#D6AF5E"],
    mullion: "#0F2743",
    sun: "#F0CE84",
    sunY: 200,
    stars: true,
  },
  day: {
    sky: ["#BFD8EA", "#DCEAF4", "#F2F7FB"],
    glow: "#FFFFFF",
    hill1: ["#9DBBAB", "#7FA391"],
    hill2: ["#B8CFC0", "#9DBBAB"],
    ground: "#7E9E8B",
    wall: ["#F4F6F8", "#DDE4EA"],
    wing: "#E8EDF1",
    roof: "#22384F",
    warm: ["#9FC4DC", "#6E9AB8"],
    mullion: "#22384F",
    sun: "#FFF3C9",
    sunY: 120,
    stars: false,
  },
  forest: {
    sky: ["#28454B", "#3C5D5B", "#6C8878"],
    glow: "#E9C87B",
    hill1: ["#1D3A38", "#12292A"],
    hill2: ["#2A4A44", "#1D3A38"],
    ground: "#10201E",
    wall: ["#3A4C48", "#263835"],
    wing: "#2F413D",
    roof: "#0F1E1C",
    warm: ["#F5D488", "#D6AF5E"],
    mullion: "#16302E",
    sun: "#F0CE84",
    sunY: 180,
    stars: true,
  },
};

/** Cinematic scene of the home, parameterised by palette and home width. */
export function sceneSvg({ palette = "dusk", homeWidth = 620, label }) {
  const p = PALETTES[palette];
  const W = 1200, H = 800;
  const cx = W / 2;
  const hw = homeWidth;
  const x0 = cx - hw / 2;
  const bodyY = 470, bodyH = 170;
  const glassW = Math.min(260, hw * 0.42);
  const glassX = cx - glassW / 2;
  const wingW = Math.max(90, (hw - glassW) / 2 - 30);
  const stars = p.stars
    ? `<g fill="#E8EEF5" opacity="0.65">
        <circle cx="150" cy="110" r="2"/><circle cx="340" cy="70" r="1.6"/><circle cx="540" cy="140" r="1.8"/>
        <circle cx="720" cy="80" r="1.4"/><circle cx="1040" cy="120" r="2"/><circle cx="1130" cy="230" r="1.5"/>
        <circle cx="250" cy="220" r="1.4"/><circle cx="950" cy="60" r="1.7"/>
      </g>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.sky[0]}"/><stop offset="0.55" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.72" cy="0.35" r="0.55">
      <stop offset="0" stop-color="${p.glow}" stop-opacity="0.4"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.hill1[0]}"/><stop offset="1" stop-color="${p.hill1[1]}"/></linearGradient>
    <linearGradient id="h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.hill2[0]}"/><stop offset="1" stop-color="${p.hill2[1]}"/></linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.wall[0]}"/><stop offset="1" stop-color="${p.wall[1]}"/></linearGradient>
    <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.warm[0]}"/><stop offset="1" stop-color="${p.warm[1]}"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <circle cx="880" cy="${p.sunY}" r="42" fill="${p.sun}" opacity="0.9"/>
  <circle cx="880" cy="${p.sunY}" r="66" fill="${p.sun}" opacity="0.16"/>
  ${stars}
  <path d="M0 520 Q 220 440 460 505 T 920 490 T ${W} 520 V ${H} H 0 Z" fill="url(#h1)"/>
  <path d="M0 590 Q 320 525 640 578 T ${W} 570 V ${H} H 0 Z" fill="url(#h2)"/>

  <!-- home -->
  <g>
    <path d="M${x0 - 22} ${bodyY - 16} L ${cx} ${bodyY - 58} L ${x0 + hw + 22} ${bodyY - 16} L ${x0 + hw + 22} ${bodyY + 2} L ${x0 - 22} ${bodyY + 2} Z" fill="${p.roof}"/>
    <rect x="${x0}" y="${bodyY}" width="${hw}" height="${bodyH}" rx="8" fill="url(#wall)"/>
    <rect x="${x0 + 4}" y="${bodyY + 12}" width="${wingW}" height="${bodyH - 12}" rx="6" fill="${p.wing}"/>
    <rect x="${x0 + 24}" y="${bodyY + 36}" width="${wingW - 40}" height="80" rx="5" fill="url(#warm)" opacity="0.92"/>
    <rect x="${x0 + hw - wingW - 4}" y="${bodyY + 12}" width="${wingW}" height="${bodyH - 12}" rx="6" fill="${p.wing}"/>
    <rect x="${x0 + hw - wingW + 16}" y="${bodyY + 36}" width="${wingW - 40}" height="66" rx="5" fill="url(#warm)" opacity="0.85"/>
    <rect x="${glassX}" y="${bodyY + 18}" width="${glassW}" height="${bodyH - 18}" rx="5" fill="url(#warm)"/>
    <g stroke="${p.mullion}" stroke-width="6">
      <line x1="${glassX + glassW / 3}" y1="${bodyY + 18}" x2="${glassX + glassW / 3}" y2="${bodyY + bodyH}"/>
      <line x1="${glassX + (2 * glassW) / 3}" y1="${bodyY + 18}" x2="${glassX + (2 * glassW) / 3}" y2="${bodyY + bodyH}"/>
    </g>
    <rect x="${x0 - 20}" y="${bodyY + bodyH}" width="${hw + 40}" height="14" rx="4" fill="#6B5430"/>
    <path d="M${glassX - 30} ${bodyY + bodyH + 14} L ${glassX + glassW + 30} ${bodyY + bodyH + 14} L ${glassX + glassW + 80} ${bodyY + bodyH + 70} L ${glassX - 80} ${bodyY + bodyH + 70} Z" fill="url(#warm)" opacity="0.13"/>
  </g>

  <path d="M0 700 Q 300 672 640 696 T ${W} 688 V ${H} H 0 Z" fill="${p.ground}"/>
</svg>
`;
}

/** Clean architectural floorplan diagram. */
export function floorplanSvg({ rooms, subtitle, label }) {
  const W = 1000, H = 560;
  const M = 90;
  const planW = W - M * 2, planH = 320, planY = 120;
  const roomRects = rooms
    .map((r) => {
      const x = M + (r.x / 100) * planW;
      const y = planY + (r.y / 100) * planH;
      const w = (r.w / 100) * planW;
      const h = (r.h / 100) * planH;
      /* Fit the label to the room: cap font size so text never overflows narrow rooms */
      const maxFs = h < 130 ? 19 : 22;
      const fs = Math.max(13, Math.min(maxFs, Math.floor((w - 18) / (r.label.length * 0.58))));
      return `<g>
      <rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="6" fill="#F7F8FA" stroke="#C6D0DC" stroke-width="2"/>
      <text x="${x + w / 2}" y="${y + h / 2}" text-anchor="middle" dominant-baseline="middle" font-size="${fs}" font-weight="700" fill="#0D233F">${r.label}</text>
    </g>`;
    })
    .join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}" font-family="Manrope, Arial, sans-serif">
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <text x="${M}" y="60" font-size="26" font-weight="800" fill="#0D233F">Floor Plan</text>
  <text x="${M}" y="88" font-size="17" fill="#5B6B7E">${subtitle}</text>
  <rect x="${M - 10}" y="${planY - 10}" width="${planW + 20}" height="${planH + 20}" rx="12" fill="#0D233F"/>
  ${roomRects}
  <g stroke="#D6AF5E" stroke-width="2.5" stroke-dasharray="8 6" fill="none">
    <rect x="${M + planW * 0.18}" y="${planY - 26}" width="${planW * 0.64}" height="${planH + 52}" rx="10"/>
  </g>
  <text x="${M + planW / 2}" y="${planY + planH + 62}" text-anchor="middle" font-size="16" font-weight="700" fill="#C29A45">— — transport core (wings fold in for delivery) — —</text>
  <g font-size="15" fill="#5B6B7E">
    <text x="${W - M}" y="60" text-anchor="end" font-weight="700">Indicative layout</text>
    <text x="${W - M}" y="82" text-anchor="end">Final dimensions confirmed on order</text>
  </g>
</svg>
`;
}
