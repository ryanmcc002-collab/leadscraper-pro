'use strict';
/* Page shell: head, header, body, footer, mobile call bar, script. Every page goes through here. */
const { esc, attr } = require('./lib/format');
const header = require('./partials/header');
const footer = require('./partials/footer');
const mbar = require('./partials/mbar');

const FAVICON = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#14226B"/><path d="M8 24V8h9.5a5.5 5.5 0 0 1 2.3 10.5L24 24h-4.6l-3.6-5H12v5Zm4-8.6h5.2a2 2 0 0 0 0-4H12Z" fill="#FFC20E"/></svg>`);

function layout({ site, config, title, description, path, section, body, jsonld }) {
  const clientCfg = {
    ratePct: site.finance.rate_pct,
    termMonths: site.finance.default_term_months,
    clearanceMm: site.fit_tool.clearance_mm,
    fitMaxMm: site.fit_tool.max_mm,
    demo: !!site.demo,
    formAction: site.demo ? '' : (site.enquiry_form_action || ''),
  };
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${site.demo ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<title>${esc(title)}</title>
<meta name="description" content="${attr(description)}">
<meta name="theme-color" content="${attr(site.brand.navy)}">
<link rel="icon" href="${FAVICON}">
<link rel="preload" href="/assets/fonts/barlow-condensed-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/barlow-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/styles.css">
<script type="application/json" id="site-config">${JSON.stringify(clientCfg).replace(/</g, '\\u003c')}</script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>\n` : ''}</head>
<body>

${header({ site, section })}
${body}
${footer({ site, config })}
${mbar({ site, enquireHref: /id="enquire"/.test(body) ? '#enquire' : '/contact/#enquire' })}
<script src="/assets/app.js"></script>
</body>
</html>
`;
}
module.exports = layout;
