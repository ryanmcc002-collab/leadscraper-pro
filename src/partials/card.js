'use strict';
/* Product card. Same markup on the home strip, category grids and related machines. */
const { esc, attr, fmt } = require('../lib/format');
const M = require('../lib/machine');

module.exports = function card(m, { img, weeklyText }) {
  const st = M.status(m);
  const chips = M.chips(m);
  const jobs = (m.good_for || []).join(' ');
  return `<article class="card" data-price="${m.price}" data-size="${M.sizeKey(m)}" data-stock="${attr(m.status)}" data-jobs="${attr(jobs)}">
        <div class="card__img">${img(m.images.primary, { alt: `${m.name} ${m.type.toLowerCase()}`, sizes: '(min-width: 720px) 300px, 78vw' })}${m.badge ? `<span class="badge">${esc(m.badge)}</span>` : ''}</div>
        <div class="card__body">
          <span class="pill ${st.cls}">${st.label}</span>
          <h3 class="card__name"><a href="${M.url(m)}">${esc(m.name)}</a></h3><p class="card__type">${esc(m.type)}</p>
          ${chips.length ? `<ul class="chips">${chips.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
          <p class="price"><strong>${fmt.price(m.price)}</strong><small data-weekly="${m.price}">${esc(weeklyText(m.price))}</small></p>
          <span class="btn btn--primary btn--block">View ${esc(m.name)}</span>
        </div>
      </article>`;
};
