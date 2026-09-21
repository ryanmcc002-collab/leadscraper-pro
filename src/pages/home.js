'use strict';
/* Home page. Same sections, same order as reference/home.html, everything from data. */
const card = require('../partials/card');
const fit = require('../partials/fit');
const estimator = require('../partials/estimator');
const enquiry = require('../partials/enquiry');

const FEATURED = ['r13-pro', 'r18-pro', 'r22-pro', 'rs06'];
/* Category tile photos are a design choice, so they live here rather than in machines.json. */
const TILES = [
  { href: '/excavators/', label: 'Excavators', img: 'images/r18-pro-excavator/05.webp', count: ms => `${ms.filter(m => m.category === 'excavators').length} machines` },
  { href: '/skid-steers/', label: 'Skid steers', img: 'images/rs03-skid-steer-loader/02.jpg', count: ms => `${ms.filter(m => m.category === 'skid-steers').length} machines` },
  { href: '/attachments/', label: 'Attachments', img: 'images/rippa-rs06-skid-steer-loader/04.webp', count: () => 'Buckets, augers, grabs' },
];
const PRE_DELIVERY = [
  'Running checks and full function test', 'Cooling system pressure test',
  'Hydraulic pressures set and tuned', 'Hydraulic oil changed and reservoir cleaned',
  'Hoses protected and separated', 'Fasteners upgraded and thread-locked',
  'Track tension set', 'Safety checks signed off',
];

module.exports = function home(ctx) {
  const { site, machines, byCategory, bySlug, img, weeklyFor, weeklyText, fmt, esc, attr, M } = ctx;
  const featured = FEATURED.map(bySlug).filter(Boolean);
  const hero = featured[0] || machines[0];
  const fromPrice = Math.min(...machines.map(m => m.price));
  const excavators = byCategory('excavators');
  const fitRows = M.fitRows(excavators);
  const heights = excavators.map(m => m.specs.height_mm).filter(fmt.has);
  const heightNote = heights.length ? ` Check overhead height as well: these machines stand ${(Math.min(...heights) / 1000).toFixed(1)} to ${(Math.max(...heights) / 1000).toFixed(1)} m tall.` : '';

  const body = `<section class="hero">
  <div class="hero__in">
    <div class="hero__text">
      <h1>Mini excavators and skid steers, ready to work</h1>
      <p>Kubota-powered Rippa machines from ${fmt.price(fromPrice)}. Every one is serviced and tested in ${esc(site.service_area)} before it reaches you.</p>
      <div class="hero__btns">
        <a class="btn btn--call" href="#machines">See the machines</a>
        <a class="btn btn--ghost" href="#fit">Will it fit my access?</a>
      </div>
      <ul class="ticks"><li>Kubota diesel engines</li><li>Pre-delivery serviced</li><li>Finance available</li></ul>
    </div>
    <div class="hero__stage">${img(hero.images.primary, { alt: `Rippa ${hero.name} ${hero.type.toLowerCase()}`, eager: true, sizes: '(min-width: 900px) 50vw, 92vw' })}</div>
  </div>
  <div class="hazard" aria-hidden="true"></div>
</section>

<section class="section">
  <div class="wrap">
    <div class="tiles">
      ${TILES.map(t => `<a class="tile" href="${t.href}">${img(t.img, { alt: '', sizes: '(min-width: 720px) 33vw, 100vw' })}<div class="tile__label"><strong>${esc(t.label)}</strong><span>${esc(t.count(machines))}</span></div></a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--grey" id="machines">
  <div class="wrap">
    <div class="section__head"><h2>Popular machines</h2><p class="lead">Prices include the attachment package listed on each machine. Tap one to see what it digs, what it weighs and whether it fits your site.</p></div>
    <div class="cards cards--scroll">
      ${featured.map(m => card(m, { img, weeklyText })).join('\n      ')}
    </div>
  </div>
</section>

${fit({
    site, rows: fitRows, img,
    heading: 'Will it fit down the side of your house?',
    lead: 'Measure the narrowest point between you and the job: a side gate, a path, the gap beside the carport. Slide to that width and see which excavators get through with their tracks pulled in.',
    note: `Widths are with the tracks retracted. Once you're through, the tracks widen again for stability.${heightNote}`,
  }).replace('class="section section--grey"', 'class="section"')}

<section class="section section--navy">
  <div class="wrap">
    <div class="section__head"><h2>Delivered ready to work</h2><p class="lead">No machine leaves our yard straight out of the crate. Each one goes through a full pre-delivery service first.</p></div>
    <ul class="checks">
      ${PRE_DELIVERY.map(t => `<li>${esc(t)}</li>`).join('')}
    </ul>
  </div>
</section>

${estimator({
    site, machines, selected: hero, weeklyFor, grey: true,
    lead: `Put the machine to work and pay it off as it earns. Finance is arranged through ${site.finance.provider}, a broker who only does equipment.`,
  })}

${enquiry({
    site, machines,
    heading: 'Talk to us about a machine',
    lead: "Tell us what the job is and we'll tell you which machine suits, what's in stock and what it costs delivered. Inspections welcome.",
  })}`;

  return [{
    path: '/',
    section: null,
    title: `${site.business_name} | Mini excavators and skid steers`,
    description: `Kubota-powered Rippa mini excavators and skid steer loaders in ${site.service_area}, from ${fmt.price(fromPrice)}. Serviced and tested before delivery. Finance available.`,
    body,
  }];
};
