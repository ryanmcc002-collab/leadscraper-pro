'use strict';
/* Finance estimator. Pass `machines` for a dropdown, or `machine` to lock it to one price. */
const { esc, attr, fmt } = require('../lib/format');

module.exports = function estimator({ site, machines, machine, selected, weeklyFor, heading = 'Spread the cost', lead, grey = false, id = 'finance' }) {
  const fin = site.finance;
  const price = machine ? machine.price : (selected || machines[0]).price;
  const picker = machine
    ? `<input type="hidden" data-est-machine data-price="${machine.price}" value="${machine.price}">`
    : `<div class="field"><label for="est-machine">Machine</label>
          <select id="est-machine" data-est-machine>
            ${machines.map(m => `<option value="${m.price}"${m === (selected || machines[0]) ? ' selected' : ''}>${esc(m.name)}, ${fmt.price(m.price)}</option>`).join('\n            ')}
          </select></div>`;
  const terms = [24, 36, 48, 60].map(t => `<button type="button" data-term="${t}" aria-pressed="${t === fin.default_term_months}">${t / 12} years</button>`).join('');
  const dep = fin.default_deposit_pct;
  const fig = weeklyFor(price, dep, fin.default_term_months);
  return `<section class="section${grey ? ' section--grey' : ''}" id="${attr(id)}">
  <div class="wrap">
    <div class="section__head"><h2>${esc(heading)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}</div>
    <div class="est" data-est>
      <div>
        ${picker}
        <div class="field"><div class="fit__label"><label for="est-dep">Deposit</label><output data-est-deposit-out for="est-dep">${dep}% (${fmt.price(price * dep / 100)})</output></div>
          <input id="est-dep" type="range" min="0" max="50" step="5" value="${dep}" data-est-deposit></div>
        <div class="field"><span class="field__title" id="est-term-label">Term</span>
          <div class="seg" role="group" aria-labelledby="est-term-label">${terms}</div></div>
      </div>
      <div class="est__out" aria-live="polite">
        <span>About</span>
        <div class="est__fig"><span data-est-fig>${fmt.price(fig)}</span> <small>a week</small></div>
        <span data-est-sub>on ${fmt.price(price * (1 - dep / 100))} over ${fin.default_term_months / 12} years</span>
        <a class="btn btn--call btn--block est__cta" href="#enquire" data-finance-cta>Ask about finance</a>
        <p class="fineprint">${esc(fin.disclaimer)}</p>
      </div>
    </div>
  </div>
</section>`;
};
