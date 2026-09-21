'use strict';
/* Fit tool. rows = [{min, machines, img}] from machine.fitRows(). */
const { esc, attr, fmt } = require('../lib/format');
const M = require('../lib/machine');

module.exports = function fit({ site, rows, img, heading, lead, note, presets, id = 'fit' }) {
  const ft = site.fit_tool;
  const presetBtns = (presets || [[800, 'Narrow gate'], [900, 'Side gate'], [1200, 'Wide path'], [1500, 'Driveway']])
    .map(([mm, label]) => `<button type="button" data-preset="${mm}">${esc(label)} ${fmt.comma(mm)}</button>`).join('\n          ');
  const list = rows.map(r => `<li class="fit__row" data-min="${r.min}">${img(r.img, { alt: '', w: 56, h: 56, sizes: '56px' })}<div class="fit__top"><span class="fit__name">${M.fitRowName(r.machines)}</span><span class="fit__verdict"></span></div><div class="fit__track"><div class="fit__bar"></div><div class="fit__gate"></div></div></li>`).join('\n        ');
  return `<section class="section section--grey" id="${attr(id)}">
  <div class="wrap">
    <div class="section__head"><h2>${esc(heading)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}</div>
    <div class="fit" data-fit>
      <div class="fit__control">
        <div class="fit__label"><label for="access">Your narrowest access</label><output class="fit__value" data-fit-value for="access">${fmt.mm(ft.default_mm)}</output></div>
        <input id="access" type="range" min="${ft.min_mm}" max="${ft.max_mm}" step="10" value="${ft.default_mm}">
        <div class="presets" role="group" aria-label="Common widths">
          ${presetBtns}
        </div>
        ${note ? `<p class="fit__note">${esc(note)}</p>` : ''}
      </div>
      <ul class="fit__rows">
        ${list}
      </ul>
    </div>
  </div>
</section>`;
};
