'use strict';
const { esc, attr } = require('../lib/format');

const LINKS = [
  ['excavators', '/excavators/', 'Excavators'],
  ['skid-steers', '/skid-steers/', 'Skid steers'],
  ['attachments', '/attachments/', 'Attachments'],
  ['finance', '/finance/', 'Finance'],
  ['contact', '/contact/', 'Contact'],
];

module.exports = function header({ site, section }) {
  const links = LINKS.map(([key, href, label]) =>
    `<a href="${href}"${key === section ? ' aria-current="page"' : ''}>${esc(label)}</a>`).join('');
  return `<header class="header">
  <div class="wrap header__in">
    <a class="logo" href="/">Rippa <span>Victoria</span></a>
    <nav class="nav" aria-label="Main">
      ${links}
    </nav>
    <a class="btn btn--call" href="${attr(site.phone_href)}"><span class="call-short">Call</span><span class="call-long">Call ${esc(site.phone_display)}</span></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav" data-menu>Menu</button>
  </div>
  <nav class="mnav" id="mobile-nav" aria-label="Main, mobile" hidden data-mobile-nav>
    ${links}
  </nav>
</header>`;
};
