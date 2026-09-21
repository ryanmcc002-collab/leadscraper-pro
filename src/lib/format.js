'use strict';
/* Number and text formatting. One place, so every page prints numbers the same way. */

const has = v => v !== null && v !== undefined && v !== '' && !(typeof v === 'number' && Number.isNaN(v));
const comma = n => Math.round(n).toLocaleString('en-AU');

const fmt = {
  has,
  mm: v => has(v) ? `${comma(v)} mm` : null,                       // 1,300 mm
  m: v => has(v) ? `${(v / 1000).toFixed(2)} m` : null,             // 2.42 m
  kg: v => has(v) ? `${comma(v)} kg` : null,                        // 1,165 kg
  price: v => has(v) ? `$${comma(v)}` : null,                       // $18,499
  hp: v => has(v) ? `${Math.round(v)} hp` : null,                   // 14 hp
  lpm: v => has(v) ? `${Math.round(v)} L/min` : null,               // 25 L/min
  kn: v => has(v) ? `${v} kN` : null,
  litres: (v, fuel) => has(v) ? `${v} L${fuel ? ' ' + fuel.toLowerCase() : ''}` : null,
  range: (a, b, unit) => has(a) && has(b) && a !== b ? `${comma(a)} to ${comma(b)} ${unit}` : has(a) ? `${comma(a)} ${unit}` : null,
  comma,
};

/* Weekly repayment. Same maths as app.js so the number printed at build time matches the live one. */
function weekly(price, depositPct, months, ratePct) {
  const p = price * (1 - depositPct / 100), r = ratePct / 100 / 12;
  const monthly = r ? (p * r) / (1 - Math.pow(1 + r, -months)) : p / months;
  return (monthly * 12) / 52;
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const attr = esc;

module.exports = { fmt, weekly, esc, attr };
