'use strict';
/* Category pages: navy band, filter bar, card grid, fit tool (excavators), enquiry. */
const band = require('../partials/band');
const card = require('../partials/card');
const fit = require('../partials/fit');
const enquiry = require('../partials/enquiry');

const JOBS = [
  ['any', 'Any job'],
  ['trenching', 'Trenching for plumbing and electrical'],
  ['backyard', 'Backyard and landscaping'],
  ['farm', 'Farm and fencing'],
  ['post-holes', 'Post holes'],
  ['demolition', 'Small demolition'],
];

const COPY = {
  'excavators': {
    lead: 'Six Kubota-powered mini excavators from 1 to 2.3 tonnes. Pick by the job, the access and the budget.',
    fitLead: 'Measure the narrowest point between you and the job. Slide to that width and see which excavators get through with their tracks pulled in.',
    enqLead: "Tell us what you're digging and how tight the access is. We'll tell you which excavator suits, what's in stock and what it costs delivered.",
  },
  'skid-steers': {
    lead: 'Stand-on and sit-in loaders for moving soil, mulch, pavers and rubbish. From a petrol mini loader to a four-pump cab machine.',
    enqLead: "Tell us what you're moving and how far. We'll tell you which loader suits, what's in stock and what it costs delivered.",
  },
};

module.exports = function categoryPages(ctx) {
  const { site, machines, byCategory, img, weeklyText, esc, attr, M } = ctx;
  return Object.entries(M.CATEGORY).map(([key, cat]) => {
    const list = byCategory(key);
    const copy = COPY[key];
    const lead = list.length === 6 || !copy.lead.startsWith('Six') ? copy.lead : copy.lead.replace(/^Six /, `${list.length} `);
    const fitRows = key === 'excavators' ? M.fitRows(list) : [];
    const body = `${band({ h1: cat.name, lead })}

<section class="section section--grey" id="machines">
  <div class="wrap" data-catalogue>
    <div class="filters">
      <div class="filters__row">
        <span class="field__title" id="job-label">What's the job?</span>
        <div class="presets" role="group" aria-labelledby="job-label">
          ${JOBS.map(([k, label]) => `<button type="button" data-job="${k}" aria-pressed="${k === 'any'}">${esc(label)}</button>`).join('\n          ')}
        </div>
      </div>
      <div class="filters__row">
        <span class="field__title" id="stock-label">Availability</span>
        <div class="presets"><button type="button" data-stock-only aria-pressed="false">In stock only</button></div>
      </div>
      <div class="filters__foot">
        <div class="field"><label for="sort">Sort by</label>
          <select id="sort" data-sort>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="size">Smallest first</option>
          </select></div>
        <p class="filters__count" data-count aria-live="polite">${list.length} of ${list.length} machines</p>
      </div>
    </div>
    <h2 class="sr-only">All ${cat.name.toLowerCase()}</h2>
    <div class="cards" data-grid>
      ${list.map(m => card(m, { img, weeklyText })).join('\n      ')}
    </div>
    <div class="empty" data-empty>
      <p>No ${cat.name.toLowerCase()} match those filters.</p>
      <button type="button" class="btn btn--primary" data-show-all>Show all machines</button>
    </div>
  </div>
</section>

${fitRows.length ? fit({
      site, rows: fitRows, img,
      heading: 'What size will fit your site?',
      lead: copy.fitLead,
      note: "Widths are with the tracks retracted. Once you're through, the tracks widen again for stability.",
    }).replace('class="section section--grey"', 'class="section"') : ''}

${enquiry({
      site, machines, grey: fitRows.length === 0,
      heading: `Talk to us about ${key === 'excavators' ? 'an excavator' : 'a skid steer'}`,
      lead: copy.enqLead,
    })}`;
    return {
      path: cat.path,
      section: key,
      title: `${cat.name} | ${site.business_name}`,
      description: key === 'excavators'
        ? `Rippa mini excavators in ${site.service_area}: ${list.length} Kubota-powered machines from 1 to 2.3 tonnes. Prices, dig depths and a fit checker for tight access.`
        : `Rippa skid steer and stand-on loaders in ${site.service_area}: ${list.length} machines from a petrol mini loader to a four-pump cab skid steer. Prices and finance.`,
      body,
    };
  });
};
