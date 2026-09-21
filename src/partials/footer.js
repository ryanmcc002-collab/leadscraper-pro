'use strict';
const { esc, attr } = require('../lib/format');

module.exports = function footer({ site }) {
  const location = /TODO/i.test(site.location || '') ? `${site.service_area}, Australia` : site.location;
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div><a class="logo" href="/">Rippa <span>Victoria</span></a><p class="footer__blurb">Rippa mini excavators, skid steer loaders and attachments for ${esc(site.service_area)}. Serviced and tested before delivery.</p></div>
      <div><h3>Machines</h3><ul><li><a href="/excavators/">Excavators</a></li><li><a href="/skid-steers/">Skid steers</a></li><li><a href="/attachments/">Attachments</a></li><li><a href="/finance/">Finance</a></li></ul></div>
      <div><h3>Contact</h3><ul><li><a href="${attr(site.phone_href)}">${esc(site.phone_display)}</a></li><li>${esc(location)}</li><li><a href="/terms/">Terms and conditions</a></li><li><a href="/manuals/">Manuals</a></li></ul></div>
    </div>
    ${site.demo ? `<p class="concept">${esc(site.concept_footer)}</p>` : ''}
  </div>
</footer>`;
};
