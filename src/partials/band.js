'use strict';
/* Navy page header band with the hazard stripe, used on every page that isn't the home page or a machine page. */
const { esc } = require('../lib/format');
module.exports = ({ h1, lead }) => `<section class="band">
  <div class="wrap"><h1>${esc(h1)}</h1>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}</div>
</section>
<div class="hazard" aria-hidden="true"></div>`;
