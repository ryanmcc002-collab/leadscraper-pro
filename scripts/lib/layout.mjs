/* Shared layout, navigation, footer, icons and SEO helpers for all pages. */

export const SITE = {
  name: "Go Tiny Homes",
  url: "https://www.gotinyhomes.com.au",
  phone: "1300 266 344",
  phoneHref: "tel:1300266344",
  email: "hello@gotinyhomes.com.au",
  address: "Sydney, NSW",
};

export const icons = {
  arrow: `<svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>`,
  phone: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  star: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  shield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
  truck: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
  expand: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`,
  clock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  home: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>`,
  tag: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/></svg>`,
  gem: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M2 9h20M12 21L8 9l4-6 4 6-4 12"/></svg>`,
  leaf: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 4 13c0-5 3-9 16-10-1 13-5 17-9 17z"/><path d="M4 21c3-5 7-8 12-10"/></svg>`,
  bolt: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L3 14h7l-1 8 11-13h-7l0-7z"/></svg>`,
  users: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  doc: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>`,
  lock: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
};

export const brandMark = `<svg class="brand-mark" viewBox="0 0 44 44" fill="none" aria-hidden="true"><rect width="44" height="44" rx="12" fill="#0D233F"/><path d="M9 24.5L22 13l13 11.5" stroke="#D6AF5E" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 22.5V32h18v-9.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 32v-6h6v6" stroke="#D6AF5E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const NAV = [
  ["products.html", "Products"],
  ["why-expandable-homes.html", "Why Expandable"],
  ["finance.html", "Finance"],
  ["delivery.html", "Delivery"],
  ["about.html", "About"],
  ["faq.html", "FAQ"],
  ["blog.html", "Blog"],
];

function header(active) {
  const links = NAV.map(
    ([href, label]) =>
      `<li><a href="${href}"${active === href ? ' aria-current="page"' : ""}>${label}</a></li>`
  ).join("\n          ");
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap nav">
      <a class="brand" href="index.html" aria-label="${SITE.name} — home">
        ${brandMark}
        <span>Go Tiny Homes<small>Expandable Living</small></span>
      </a>
      <nav aria-label="Main navigation">
        <ul class="nav-links" id="nav-links">
          ${links}
        </ul>
      </nav>
      <div class="nav-cta">
        <a class="nav-phone" href="${SITE.phoneHref}">${icons.phone}<span>${SITE.phone}</span></a>
        <a class="btn btn-gold btn-sm" href="quote.html">Get a Free Quote</a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Toggle menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="index.html">${brandMark}<span>Go Tiny Homes<small>Expandable Living</small></span></a>
          <p>Australia's premium supplier of expandable tiny homes. Factory-direct pricing, obsessive quality control and genuine Australian support — delivered to every state and territory.</p>
          <ul>
            <li><a href="${SITE.phoneHref}">${SITE.phone}</a></li>
            <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li>${SITE.address}</li>
          </ul>
        </div>
        <div>
          <h4>Products</h4>
          <ul>
            <li><a href="products.html">The Range</a></li>
            <li><a href="product-model-0206-two-bedroom-white.html">Model 0206 — Classic White</a></li>
            <li><a href="product-model-0206-two-bedroom-black.html">Model 0206 — Black Edition</a></li>
            <li><a href="quote.html">Get a Delivered Quote</a></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="why-expandable-homes.html">Why Expandable Homes</a></li>
            <li><a href="delivery.html">Delivery Process</a></li>
            <li><a href="finance.html">Finance Options</a></li>
            <li><a href="quote.html">Get a Free Quote</a></li>
          </ul>
        </div>
        <div>
          <h4>Resources</h4>
          <ul>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="blog.html">Blog &amp; Guides</a></li>
            <li><a href="blog-how-much-does-a-tiny-home-cost.html">Tiny Home Prices</a></li>
            <li><a href="blog-do-tiny-homes-need-council-approval.html">Council Approvals</a></li>
            <li><a href="quote.html">Download Brochure</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; <span data-year>2026</span> ${SITE.name}. All rights reserved. ABN 00 000 000 000.</span>
        <span>Proudly Australian owned &amp; operated. Prices in AUD incl. GST unless stated.</span>
      </div>
    </div>
  </footer>

  <a class="float-quote" href="quote.html">${icons.doc} Get a Free Quote</a>
  <div class="sticky-cta">
    <a class="call" href="${SITE.phoneHref}">${icons.phone} Call ${SITE.phone}</a>
    <a class="quote" href="quote.html">${icons.doc} Free Quote</a>
  </div>`;
}

const ORG_SCHEMA = {
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: `${SITE.url}/assets/img/hero-home.svg`,
  description:
    "Australia's premium supplier of expandable tiny homes with factory-direct pricing, premium quality and Australia-wide delivery.",
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sydney",
    addressRegion: "NSW",
    addressCountry: "AU",
  },
  areaServed: "AU",
};

/**
 * Render a full page.
 * @param {object} o
 * @param {string} o.path       output filename, e.g. "index.html"
 * @param {string} o.title      <title> / meta title
 * @param {string} o.description meta description
 * @param {string} o.body       page body HTML (between header and footer)
 * @param {string} [o.active]   nav href to mark current
 * @param {object[]} [o.schema] extra JSON-LD graph nodes
 * @param {string} [o.ogType]   Open Graph type
 */
export function layout(o) {
  const canonical = `${SITE.url}/${o.path === "index.html" ? "" : o.path}`;
  const graph = [ORG_SCHEMA, ...(o.schema || [])];
  const jsonld = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>document.documentElement.classList.add("js")</script>
  <title>${o.title}</title>
  <meta name="description" content="${o.description}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${o.ogType || "website"}">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:title" content="${o.title}">
  <meta property="og:description" content="${o.description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE.url}/assets/img/hero-home.svg">
  <meta property="og:locale" content="en_AU">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#0D233F">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/main.css">
  <script type="application/ld+json">${jsonld}</script>
</head>
<body>
${header(o.active)}
  <main id="main">
${o.body}
  </main>
${footer()}
  <script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

/* Small helpers shared by pages */

export function faqItem(q, a) {
  return `<details class="faq-item"><summary>${q}</summary><div class="answer"><p>${a}</p></div></details>`;
}

export function faqSchema(id, faqs) {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") },
    })),
  };
}

export function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, url], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE.url}/${url}`,
    })),
  };
}

export function breadcrumbs(items) {
  const lis = items
    .map(([name, url], i) =>
      i === items.length - 1
        ? `<li aria-current="page">${name}</li>`
        : `<li><a href="${url}">${name}</a></li>`
    )
    .join("");
  return `<ol class="breadcrumbs">${lis}</ol>`;
}

export function ctaBanner(heading, sub) {
  return `
    <section class="section">
      <div class="wrap">
        <div class="cta-banner reveal">
          <span class="eyebrow eyebrow-center">Ready when you are</span>
          <h2>${heading}</h2>
          <p class="lead center" style="margin-inline:auto">${sub}</p>
          <div class="actions">
            <a class="btn btn-gold btn-lg" href="quote.html">Get a Free Quote ${icons.arrow}</a>
            <a class="btn btn-ghost-light btn-lg" href="${SITE.phoneHref}">${icons.phone} Call ${SITE.phone}</a>
          </div>
        </div>
      </div>
    </section>`;
}
