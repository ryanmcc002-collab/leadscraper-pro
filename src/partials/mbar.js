'use strict';
const { attr } = require('../lib/format');
module.exports = ({ site, enquireHref = '#enquire' }) => `<div class="mbar"><a class="btn btn--call" href="${attr(site.phone_href)}">Call</a><a class="btn btn--primary" href="${attr(enquireHref)}">Enquire</a></div>`;
