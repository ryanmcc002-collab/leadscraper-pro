'use strict';
/* Turns a machine record into the display facts the templates need.
   Everything here returns null or [] when the data isn't there, so templates can leave sections out. */
const { fmt, esc } = require('./format');

const STATUS = {
  'in-stock': { label: 'In stock', cls: '', schema: 'https://schema.org/InStock' },
  'arriving': { label: 'Arriving soon', cls: 'pill--arriving', schema: 'https://schema.org/PreOrder' },
  'order-in': { label: 'Order in', cls: 'pill--order-in', schema: 'https://schema.org/BackOrder' },
};
const status = m => STATUS[m.status] || STATUS['order-in'];

const CATEGORY = {
  'excavators': { name: 'Excavators', singular: 'excavator', path: '/excavators/' },
  'skid-steers': { name: 'Skid steers', singular: 'skid steer', path: '/skid-steers/' },
};
const category = m => CATEGORY[m.category];
const url = m => `${CATEGORY[m.category].path}${m.slug}/`;

function engineName(m) {
  const e = m.engine || {};
  if (!fmt.has(e.make)) return null;
  return e.model ? `${e.make} ${e.model}` : e.make;
}
function engineShort(m) {
  // "Kubota 14 hp" on excavator key boxes; falls back to make + model, then make + fuel.
  const e = m.engine || {};
  if (!fmt.has(e.make)) return null;
  if (fmt.has(e.power_hp)) return `${e.make} ${fmt.hp(e.power_hp)}`;
  if (e.model) return `${e.make} ${e.model}`;
  return e.fuel ? `${e.make} ${e.fuel.toLowerCase()}` : e.make;
}

/* Every fact a machine might have, in the order it should be offered. Missing data gives null and is dropped. */
function allFacts(m) {
  const s = m.specs || {}, e = m.engine || {};
  const f = {
    width: fmt.has(s.width_min_mm) && { label: 'Width, tracks in', value: fmt.mm(s.width_min_mm), chip: `${fmt.mm(s.width_min_mm).replace(' mm', '')} mm wide` },
    dig: fmt.has(s.dig_depth_mm) && { label: 'Digs to', value: fmt.m(s.dig_depth_mm), chip: `Digs ${fmt.m(s.dig_depth_mm)}` },
    weight: fmt.has(s.operating_weight_kg) && { label: 'Weight', value: fmt.kg(s.operating_weight_kg), chip: fmt.kg(s.operating_weight_kg) },
    engineHp: engineShort(m) && { label: 'Engine', value: engineShort(m), chip: engineName(m) || engineShort(m) },
    engineModel: engineName(m) && { label: 'Engine', value: engineName(m), chip: engineName(m) },
    power: fmt.has(e.power_hp) && { label: 'Power', value: fmt.hp(e.power_hp), chip: fmt.hp(e.power_hp) },
    load: fmt.has(s.rated_load_kg) && { label: 'Lifts', value: fmt.kg(s.rated_load_kg), chip: `Lifts ${fmt.kg(s.rated_load_kg)}` },
    flow: fmt.has(s.hyd_flow_lpm) && { label: 'Hydraulic flow', value: fmt.lpm(s.hyd_flow_lpm), chip: `${fmt.lpm(s.hyd_flow_lpm)} flow` },
    reach: fmt.has(s.reach_mm) && { label: 'Reach', value: fmt.m(s.reach_mm), chip: `Reaches ${fmt.m(s.reach_mm)}` },
    fuel: fmt.has(e.fuel) && { label: 'Fuel', value: e.fuel, chip: e.fuel },
  };
  const order = m.category === 'excavators'
    ? ['width', 'dig', 'weight', 'engineHp', 'reach', 'flow', 'load', 'fuel']
    : ['engineModel', 'power', 'load', 'flow', 'fuel', 'weight', 'width', 'dig'];
  return order.map(k => f[k]).filter(Boolean);
}
const chips = m => allFacts(m).slice(0, 3).map(f => f.chip);
const keys = m => allFacts(m).slice(0, 4);

/* "What the numbers mean": pairs each meaning with the figure it explains. */
const MEANINGS = {
  width: { label: 'Width with tracks in', value: m => fmt.mm(m.specs.width_min_mm) },
  dig_depth: { label: 'Dig depth', value: m => fmt.m(m.specs.dig_depth_mm) },
  reach: { label: 'Reach', value: m => fmt.m(m.specs.reach_mm) },
  weight: { label: 'Operating weight', value: m => fmt.kg(m.specs.operating_weight_kg) },
  rated_load: { label: 'Rated load', value: m => fmt.kg(m.specs.rated_load_kg) },
  engine: { label: 'Engine', value: m => engineName(m) },
  hyd_flow: { label: 'Hydraulic flow', value: m => fmt.lpm(m.specs.hyd_flow_lpm) },
};
function meanings(m) {
  const out = [];
  const src = m.meanings || {};
  const order = [...Object.keys(MEANINGS), ...Object.keys(src).filter(k => !MEANINGS[k])];
  for (const k of order) {
    const text = src[k];
    if (!fmt.has(text)) continue;
    const def = MEANINGS[k] || { label: k.replace(/_/g, ' '), value: () => null };
    let value = null;
    try { value = def.value(m); } catch { value = null; }
    out.push({ label: def.label, value, text });
  }
  return out;
}

/* Full spec table. Only rows with data. */
const SPEC_ROWS = [
  ['Operating weight', m => fmt.kg(m.specs.operating_weight_kg)],
  ['Rated load', m => fmt.kg(m.specs.rated_load_kg)],
  ['Track width', m => fmt.range(m.specs.width_min_mm, m.specs.width_max_mm, 'mm')],
  ['Length', m => fmt.mm(m.specs.length_mm)],
  ['Height', m => fmt.mm(m.specs.height_mm)],
  ['Ground clearance', m => fmt.mm(m.specs.ground_clearance_mm)],
  ['Dig depth', m => fmt.m(m.specs.dig_depth_mm)],
  ['Reach', m => fmt.m(m.specs.reach_mm)],
  ['Max dump height', m => fmt.mm(m.specs.dump_height_mm)],
  ['Max digging height', m => fmt.mm(m.specs.dig_height_mm)],
  ['Digging force', m => fmt.kn(m.specs.dig_force_kn)],
  ['Hydraulic flow', m => fmt.lpm(m.specs.hyd_flow_lpm)],
  ['Fuel tank', m => fmt.litres(m.specs.fuel_tank_l, m.engine && m.engine.fuel)],
  ['Engine', m => engineName(m)],
  ['Fuel', m => m.engine && fmt.has(m.engine.fuel) ? m.engine.fuel : null],
  ['Power', m => m.engine && fmt.has(m.engine.power_hp) ? fmt.hp(m.engine.power_hp) : null],
];
const KNOWN_SPECS = new Set(['operating_weight_kg', 'rated_load_kg', 'width_min_mm', 'width_max_mm', 'length_mm', 'height_mm', 'ground_clearance_mm', 'dig_depth_mm', 'reach_mm', 'dump_height_mm', 'dig_height_mm', 'dig_force_kn', 'hyd_flow_lpm', 'fuel_tank_l']);
function specRows(m) {
  const mm = { ...m, specs: m.specs || {} };
  const rows = SPEC_ROWS.map(([label, fn]) => { let v = null; try { v = fn(mm); } catch { v = null; } return v ? [label, v] : null; }).filter(Boolean);
  // Anything new that turns up in machines.json still gets printed rather than lost.
  for (const [k, v] of Object.entries(mm.specs)) {
    if (KNOWN_SPECS.has(k) || !fmt.has(v)) continue;
    rows.push([k.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()), String(v)]);
  }
  return rows;
}

/* Size for "smallest first" sorting: weight where we have it, otherwise price as a stand-in. */
const sizeKey = m => fmt.has(m.specs && m.specs.operating_weight_kg) ? m.specs.operating_weight_kg : 100000 + m.price;

/* Fit tool rows: every machine with a retracted width, narrowest first, machines sharing a width grouped on one row. */
function fitRows(machines) {
  const withWidth = machines.filter(m => fmt.has(m.specs && m.specs.width_min_mm));
  const groups = new Map();
  for (const m of withWidth) {
    const w = m.specs.width_min_mm;
    if (!groups.has(w)) groups.set(w, []);
    groups.get(w).push(m);
  }
  return [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([min, ms]) => ({ min, machines: ms, img: ms[0].images.primary, alt: '' }));
}

/* Names for a grouped fit row: "R10 Petrol and Diesel" with each name its own link. */
function fitRowName(ms) {
  if (ms.length === 1) return `<a href="${url(ms[0])}">${esc(ms[0].name)}</a>`;
  const words = ms.map(m => m.name.split(' '));
  let common = 0;
  while (words.every(w => w.length > common + 1 && w[common] === words[0][common])) common++;
  return ms.map((m, i) => {
    const label = i === 0 ? m.name : words[i].slice(common).join(' ');
    return `<a href="${url(m)}">${esc(label)}</a>`;
  }).join(' and ');
}

/* Short description for meta tags and JSON-LD, built from what the machine actually has. */
function metaDescription(m) {
  const bits = [`Rippa ${m.name} ${m.type.toLowerCase()}.`];
  const s = m.specs || {};
  if (fmt.has(s.width_min_mm)) bits.push(`${fmt.mm(s.width_min_mm)} wide with tracks retracted`);
  if (fmt.has(s.dig_depth_mm)) bits.push(`digs to ${fmt.m(s.dig_depth_mm)}`);
  if (fmt.has(s.rated_load_kg)) bits.push(`${fmt.kg(s.rated_load_kg)} rated load`);
  if (engineName(m)) bits.push(`${engineName(m)} ${m.engine.fuel ? m.engine.fuel.toLowerCase() : 'engine'}`);
  let text = bits.length > 1 ? bits[0] + ' ' + bits.slice(1).join(', ').replace(/^\w/, c => c.toUpperCase()) + '.' : bits[0];
  return text + ' Serviced and tested in Victoria before delivery.';
}

module.exports = { status, category, CATEGORY, url, engineName, engineShort, allFacts, chips, keys, meanings, specRows, sizeKey, fitRows, fitRowName, metaDescription };
