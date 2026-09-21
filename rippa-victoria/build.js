#!/usr/bin/env node
/* Rippa Victoria concept demo build.
   Reads site.config.json, data/machines.json and src/templates, writes /dist.
   Plain Node, no dependencies. Run: node build.js */
'use strict';
const fs = require('fs');
const path = require('path');
const Draw = require('./src/js/draw.js');
const Fin = require('./src/js/finance.js');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/machines.json'), 'utf8'));
const machines = data.machines.slice().sort((a, b) => a.operatingWeight - b.operatingWeight);
const fin = config.finance;

/* ---------- helpers ---------- */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tpl = (name) => fs.readFileSync(path.join(ROOT, 'src/templates', name), 'utf8');
function render(template, vars) {
  return template
    .replace(/\{\{\{(\w+)\}\}\}/g, (_, k) => (vars[k] == null ? '' : String(vars[k])))
    .replace(/\{\{(\w+)\}\}/g, (_, k) => esc(vars[k]));
}
const fmtInt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const mm = (v) => fmtInt(v) + ' mm';
const metres = (v) => (Math.round(v / 100) / 10).toString() + ' m';
const kg = (v) => fmtInt(v) + ' kg';
const tonne = (v) => (Math.round(v / 100) / 10).toString() + ' tonne';
const weeklyOf = (price) => Fin.weekly(price, { depositPct: fin.defaultDepositPct, annualRatePct: fin.annualRatePct, termYears: fin.defaultTermYears });
const statusLabel = { 'in stock': 'In stock', 'arriving': 'Arriving soon', 'order in': 'Order in' };
const schemaAvail = { 'in stock': 'https://schema.org/InStock', 'arriving': 'https://schema.org/PreOrder', 'order in': 'https://schema.org/BackOrder' };
const jobLabel = Object.fromEntries(data.jobs.map((j) => [j.key, j.label]));
const shortJob = { trenching: 'trenching', landscaping: 'backyards and landscaping', farm: 'farm and fencing', postholes: 'post holes', demolition: 'small demolition' };

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }
function copyDir(src, dst) {
  if (!fs.existsSync(src)) return;
  mkdirp(dst);
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}
function write(rel, html) {
  const out = path.join(DIST, rel);
  mkdirp(path.dirname(out));
  fs.writeFileSync(out, html);
}
function photosFor(slug) {
  const dir = path.join(ROOT, 'assets/machines', slug);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.(webp|jpe?g|png|avif)$/i.test(f)).sort();
}

/* ---------- shared fragments ---------- */
const machineOptions = (selectedSlug) => machines.map((m) =>
  `<option value="${esc(m.slug)}" data-price="${m.price}"${m.slug === selectedSlug ? ' selected' : ''}>${esc(m.shortName)}, ${esc(Fin.money(m.price))}</option>`).join('\n');

function estimatorHtml(id, selectedSlug) {
  const m = machines.find((x) => x.slug === selectedSlug) || machines[0];
  const dep = m.price * fin.defaultDepositPct / 100;
  return render(tpl('estimator.html'), {
    id, rate: fin.annualRatePct, minTerm: fin.minTermYears, maxTerm: fin.maxTermYears,
    depositPct: fin.defaultDepositPct, termYears: fin.defaultTermYears,
    options: machineOptions(m.slug),
    weeklyFmt: Fin.money(weeklyOf(m.price)),
    breakdown: `Borrowing ${Fin.money(m.price - dep)} after a ${Fin.money(dep)} deposit, over ${fin.defaultTermYears} years at ${fin.annualRatePct}%.`,
    disclaimer: fin.disclaimer, buttonLabel: fin.buttonLabel, provider: fin.provider, providerLink: fin.link
  });
}
function enquiryHtml(id, selectedSlug) {
  const m = machines.find((x) => x.slug === selectedSlug);
  return render(tpl('enquiry.html'), {
    id, formAction: config.formAction || '', provider: fin.provider,
    options: machines.map((x) => `<option value="${esc(x.slug)}"${x.slug === selectedSlug ? ' selected' : ''}>${esc(x.name)}</option>`).join('\n'),
    submitLabel: m ? `Enquire about the ${m.shortName}` : 'Send my enquiry',
    contactName: config.contactName, phone: config.phone, phoneHref: config.phoneHref,
    leadflow: config.DEMO ? render(tpl('leadflow.html'), { contactName: config.contactName }) : ''
  });
}
const preDeliveryHtml = data.preDelivery.map((t) => `<li>${esc(t)}</li>`).join('\n');
const logoHtml = fs.existsSync(path.join(ROOT, 'assets/logo.svg')) ? (r) => `<img src="${r}assets/logo.svg" alt="" width="120" height="28">` : () => '';

function page(rel, vars) {
  const depth = rel.split('/').length - 1;
  const root = depth === 0 ? './' : '../'.repeat(depth);
  const html = render(tpl('layout.html'), Object.assign({
    root,
    robots: config.DEMO ? '<meta name="robots" content="noindex, nofollow">' : '',
    canonical: config.siteUrl.replace(/\/$/, '') + '/' + rel.replace(/index\.html$/, ''),
    businessName: config.businessName, phone: config.phone, phoneHref: config.phoneHref,
    serviceArea: config.serviceArea, builtByName: config.builtBy.name, builtByUrl: config.builtBy.url,
    logo: logoHtml(root), head: '', scripts: '', stickyBar: '', bodyClass: '',
    navExc: '', navSkid: '', navAtt: ''
  }, vars));
  write(rel, html);
}

/* ---------- line-up ---------- */
const refs = data.references;
const GAP = 300; // mm between items
const PERSON_W = 1100, UTE_W = refs.ute.length, GATE_VB = refs.gate.max + 200;
function lineupItems() {
  const items = [], caps = [];
  items.push(`<div class="lu-item lu-person" style="--mm:${PERSON_W}">${Draw.svg(Draw.person(refs.person.height), PERSON_W, Draw.GROUND, 'lu-svg')}</div>`);
  caps.push(`<div class="lu-cap lu-cap-person" style="--mm:${PERSON_W}"><span class="lu-name">1.8 m</span><span class="lu-dim">person</span></div>`);
  items.push(`<div class="lu-item lu-gate">${Draw.svg(Draw.gate(refs.gate.default, refs.gate.height, refs.gate.max), GATE_VB, Draw.GROUND, 'lu-svg', 'preserveAspectRatio="xMinYMax slice"')}</div>`);
  caps.push(`<div class="lu-cap lu-cap-gate"><span class="lu-name">Side gate</span><span class="lu-dim" data-gate-cap>${mm(refs.gate.default)} clear</span></div>`);
  for (const m of machines) {
    const fits = m.widthMin <= refs.gate.default;
    items.push(`<button type="button" class="lu-item lu-machine${fits ? ' is-fit' : ' is-out'}" style="--mm:${m.length}" data-slug="${esc(m.slug)}" aria-label="${esc(m.name)}, ${esc(mm(m.widthMin))} wide, ${esc(Fin.money(m.price))}" aria-pressed="false">${Draw.svg(Draw.excavator(m), m.length, Draw.GROUND, 'lu-svg')}<span class="lu-stripe"></span></button>`);
    caps.push(`<div class="lu-cap${fits ? ' is-fit' : ''}" style="--mm:${m.length}" data-cap="${esc(m.slug)}"><span class="lu-name">${esc(m.shortName)}</span><span class="lu-dim">${esc(mm(m.widthMin))} wide</span><span class="lu-tag" data-tag>${fits ? 'Fits' : "Won't fit"}</span></div>`);
  }
  items.push(`<div class="lu-item lu-ute" style="--mm:${UTE_W}">${Draw.svg(Draw.ute(refs.ute.length, refs.ute.height), UTE_W, Draw.GROUND, 'lu-svg')}</div>`);
  caps.push(`<div class="lu-cap" style="--mm:${UTE_W}"><span class="lu-name">Dual-cab ute</span><span class="lu-dim">for scale</span></div>`);
  return { items: items.join('\n'), caps: caps.join('\n') };
}
const totalMm = PERSON_W + (refs.gate.default + 200) + machines.reduce((a, m) => a + m.length, 0) + UTE_W + GAP * (machines.length + 2);

/* ---------- home ---------- */
(function buildHome() {
  const lu = lineupItems();
  const luData = machines.map((m) => ({
    slug: m.slug, name: m.name, shortName: m.shortName, price: m.price, priceFmt: Fin.money(m.price),
    weeklyFmt: Fin.money(weeklyOf(m.price)), widthMin: m.widthMin, goodFor: m.goodFor, summary: m.summary,
    transportWeight: kg(m.transportWeight), status: statusLabel[m.status] || m.status, url: `excavators/${m.slug}/`
  }));
  const content = render(tpl('home.html'), {
    root: './',
    gateDefault: refs.gate.default, gateDefaultFmt: fmtInt(refs.gate.default), gateMin: refs.gate.min, gateMax: refs.gate.max,
    gateMinFmt: fmtInt(refs.gate.min), gateMaxFmt: fmtInt(refs.gate.max), gateStep: refs.gate.step,
    lineupItems: lu.items, lineupCaptions: lu.caps,
    jobChips: data.jobs.map((j) => `<button type="button" class="chip" data-job="${esc(j.key)}" aria-pressed="false">${esc(j.label)}</button>`).join('\n'),
    contactName: config.contactName, serviceAreaLong: config.serviceAreaLong, phone: config.phone, phoneHref: config.phoneHref,
    preDelivery: preDeliveryHtml, financeProvider: fin.provider,
    estimator: estimatorHtml('fin', machines[0].slug), enquiryForm: enquiryHtml('enq', '')
  });
  const scaleScript = `<script>(function(){var w=document.documentElement.clientWidth,g=w>=900?40:16,t=${totalMm},s=w>=900?Math.max(0.036,Math.min(0.07,(w-2*g-12)/t)):0.055;document.documentElement.style.setProperty('--px-per-mm',s);document.documentElement.style.setProperty('--gap','${refs.gate.default}');})();</script>`;
  page('index.html', {
    title: `${config.businessName}: Rippa mini excavators, sized for the job`,
    description: 'Rippa mini excavators for Victoria. See the whole range drawn to scale, check it fits your side gate, and get a straight answer on which one you need.',
    content,
    head: scaleScript + `<script type="application/json" id="lineup-data">${JSON.stringify({ machines: luData, gate: refs.gate, totalMm, jobs: data.jobs }).replace(/</g, '\\u003c')}</script>`,
    scripts: '<script src="./js/lineup.js" defer></script>',
    bodyClass: 'page-home' + (config.DEMO ? ' is-demo' : '')
  });
})();

/* ---------- range page ---------- */
(function buildRange() {
  const rows = machines.map((m) => `
<li class="range-row">
  <div class="row-draw">${Draw.svg(Draw.excavator(m), m.length, Draw.GROUND, 'row-svg')}</div>
  <div>
    <h2><a href="./${esc(m.slug)}/">${esc(m.name)}</a></h2>
    <div class="row-price"><span class="plate-price">${esc(Fin.money(m.price))}</span><span class="plate-weekly">about ${esc(Fin.money(weeklyOf(m.price)))} a week <span class="est">estimate</span></span><span class="plate-status">${esc(statusLabel[m.status])}</span></div>
    <ul class="row-nums">
      <li><span class="n">${esc(metres(m.digDepth))}</span><span class="l">dig depth</span></li>
      <li><span class="n">${esc(mm(m.widthMin))}</span><span class="l">wide, tracks in</span></li>
      <li><span class="n">${esc(tonne(m.operatingWeight))}</span><span class="l">operating weight</span></li>
    </ul>
    <p class="row-good"><strong>Good for:</strong> ${esc(m.goodFor.map((k) => shortJob[k]).join(', '))}.</p>
    <p>${esc(m.summary[0])}</p>
    <a class="btn btn-secondary" href="./${esc(m.slug)}/">See the ${esc(m.shortName)}</a>
  </div>
</li>`).join('\n');
  page('excavators/index.html', {
    title: `Excavator range: R10 to R22 Pro | ${config.businessName}`,
    description: 'Every Rippa excavator we sell in Victoria, smallest to largest, with the three numbers that matter and what each machine is good for.',
    content: render(tpl('range.html'), { rows }), navExc: ' class="is-current"'
  });
})();

/* ---------- machine pages ---------- */
function specsHtml(m) {
  return data.specOrder.map((key) => {
    const h = data.specHelp[key];
    let n;
    switch (key) {
      case 'operatingWeight': n = kg(m.operatingWeight); break;
      case 'transportWeight': n = kg(m.transportWeight); break;
      case 'widthMin': n = mm(m.widthMin) + ' to ' + mm(m.widthMax); break;
      case 'engine': n = m.engine.split(',')[0]; break;
      default: n = mm(m[key]);
    }
    return `<li><details><summary><span><span class="spec-n">${esc(n)}</span><span class="spec-l">${esc(h.label)}</span></span><span class="spec-m">${esc(m.meaning[key])}</span></summary><p class="spec-more">${esc(h.help)}${key === 'engine' ? ' This machine: ' + esc(m.engine) + '.' : ''}</p></details></li>`;
  }).join('\n');
}
function includedHtml(m) {
  return m.included.map((k) => {
    const a = data.attachments[k];
    return `<li>${Draw.svg(Draw.attachment(a.icon, a.size), 1000, 600, 'at-svg')}${esc(a.label)}</li>`;
  }).join('\n');
}
for (const m of machines) {
  const photos = photosFor(m.slug);
  const root = '../../';
  let gallery, thumbs = '', note;
  if (photos.length) {
    gallery = `<img src="${root}assets/machines/${esc(m.slug)}/${esc(photos[0])}" alt="${esc(m.name)}" width="1600" height="1200" style="aspect-ratio:4/3;object-fit:contain;background:var(--plate)" data-gallery-main>`;
    if (photos.length > 1) thumbs = `<ul class="gallery-thumbs">${photos.map((p, i) => `<li><button type="button" data-gallery-thumb="${root}assets/machines/${esc(m.slug)}/${esc(p)}" aria-current="${i === 0}"><img src="${root}assets/machines/${esc(m.slug)}/${esc(p)}" alt="" loading="lazy" width="64" height="48"></button></li>`).join('')}</ul>`;
    note = 'Photos of the ' + m.shortName + '.';
  } else {
    gallery = Draw.svg(Draw.excavator(m), m.length, Draw.GROUND, 'lu-svg gallery-draw');
    note = `Drawn from the ${m.shortName}'s own dimensions: ${metres(m.length)} long, ${metres(m.height)} high. Photos to come.`;
  }
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'Product', name: m.name, sku: m.slug,
    brand: { '@type': 'Brand', name: 'Rippa' }, description: m.summary.join(' '),
    offers: { '@type': 'Offer', priceCurrency: 'AUD', price: m.price, availability: schemaAvail[m.status], url: `${config.siteUrl}/excavators/${m.slug}/`, seller: { '@type': 'Organization', name: config.businessName } }
  };
  const content = render(tpl('machine.html'), {
    gallery, galleryThumbs: thumbs, galleryNote: note,
    statusLabel: statusLabel[m.status], name: m.name, shortName: m.shortName,
    priceFmt: Fin.money(m.price), weeklyFmt: Fin.money(weeklyOf(m.price)),
    depositPct: fin.defaultDepositPct, termYears: fin.defaultTermYears,
    summaryLines: m.summary.map((s) => `<li>${esc(s)}</li>`).join('\n'),
    phone: config.phone, phoneHref: config.phoneHref, contactName: config.contactName,
    specs: specsHtml(m), included: includedHtml(m), preDelivery: preDeliveryHtml,
    financeProvider: fin.provider, estimator: estimatorHtml('fin', m.slug), enquiryForm: enquiryHtml('enq', m.slug)
  });
  page(`excavators/${m.slug}/index.html`, {
    title: `${m.name}: ${esc(Fin.money(m.price))}, ${metres(m.digDepth)} dig depth | ${config.businessName}`,
    description: m.summary[0] + ' ' + m.summary[2],
    content, navExc: ' class="is-current"',
    head: `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>`,
    stickyBar: `<div class="sticky-bar"><a class="btn btn-secondary" href="${config.phoneHref}">Call</a><a class="btn" href="#enquire">Enquire</a></div>`,
    bodyClass: 'page-machine has-sticky' + (config.DEMO ? ' is-demo' : '')
  });
}

/* ---------- coming-soon pages ---------- */
page('skid-steers/index.html', {
  title: `Skid steers | ${config.businessName}`, description: 'Rippa skid steers for Victoria. Coming with the full site.',
  content: render(tpl('coming.html'), { root: '../', heading: 'Skid steers', intro: 'Compact tracked loaders for moving soil, mulch and rubble where a bobcat won\'t fit.', what: 'The skid steer range will get the same treatment: drawn to scale, every number explained, and a finance estimate on each one.', askAbout: 'skid steers' }),
  navSkid: ' class="is-current"'
});
page('attachments/index.html', {
  title: `Attachments | ${config.businessName}`, description: 'Buckets, augers, rippers and hydraulic thumbs for Rippa excavators. Coming with the full site.',
  content: render(tpl('coming.html'), { root: '../', heading: 'Attachments', intro: 'Buckets, augers, rippers, thumbs and grabs, matched to each machine\'s hitch.', what: 'Attachments will be listed by the machines they fit, so you never order the wrong pin size.', askAbout: 'attachments' }),
  navAtt: ' class="is-current"'
});

/* ---------- static files ---------- */
mkdirp(path.join(DIST, 'css'));
const minifyCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
fs.writeFileSync(path.join(DIST, 'css/site.css'), minifyCss(fs.readFileSync(path.join(ROOT, 'src/css/site.css'), 'utf8')));
mkdirp(path.join(DIST, 'js'));
for (const f of ['finance.js', 'site.js', 'lineup.js']) fs.copyFileSync(path.join(ROOT, 'src/js', f), path.join(DIST, 'js', f));
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
mkdirp(path.join(DIST, 'assets'));
fs.writeFileSync(path.join(DIST, 'assets/favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#E6E7E3"/><rect x="6" y="12" width="14" height="8" fill="#2166CC"/><rect x="4" y="20" width="18" height="5" rx="2.5" fill="#1E2022"/><path d="M20 14 L27 8 L29 10 L24 15 L28 25 L25 26 Z" fill="#1E2022"/><rect y="26" width="32" height="2" fill="#1E2022"/></svg>');

const unconfirmed = machines.filter((m) => !m.confirmed).map((m) => m.slug);
console.log(`Built ${machines.length} machine pages + home, range, 2 coming-soon pages into dist/.`);
console.log(`DEMO=${config.DEMO}. Unconfirmed machines: ${unconfirmed.join(', ') || 'none'}.`);
