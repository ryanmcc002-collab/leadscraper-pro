/* Apple-launch-style product page template, rendered per product.
   No prices are shown — manufacturer costs are confidential and retail
   pricing is quoted per postcode via the quote flow. */
import { SITE, icons, layout, faqItem, faqSchema, breadcrumbs, breadcrumbSchema, ctaBanner } from "./layout.mjs";
import { products } from "./products-data.mjs";

export function productPage(p) {
  const path = `product-${p.slug}.html`;
  const related = products.filter((x) => x.slug !== p.slug);

  const featureCards = p.features
    .map(
      ([t, d], i) => `
        <article class="card reveal reveal-d${i % 4}">
          <div class="icon">${icons.gem}</div>
          <h3>${t}</h3>
          <p>${d}</p>
        </article>`
    )
    .join("");

  const included = p.included
    .map((li) => `<li>${icons.check}<span>${li}</span></li>`)
    .join("\n            ");

  const specs = p.specs
    .map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`)
    .join("\n              ");

  const faqs = p.faqs.map(([q, a]) => faqItem(q, a)).join("\n          ");

  const relatedCards = related
    .map(
      (r) => `
          <a class="product-card reveal" href="product-${r.slug}.html" style="max-width:420px;margin-inline:auto">
            <div class="media"><span class="badge">${r.badge}</span><img src="assets/photos/${r.photos.card}" alt="${r.photos.cardAlt}" loading="lazy"></div>
            <div class="body">
              <h3>${r.name}</h3>
              <p class="meta">${r.tagline}</p>
              <div class="price-row"><span class="price" style="font-size:var(--fs-400)">Delivered quote on request</span>${icons.arrow}</div>
            </div>
          </a>`
    )
    .join("");

  const schema = [
    breadcrumbSchema([
      ["Home", ""],
      ["Products", "products.html"],
      [p.name, path],
    ]),
    {
      "@type": "Product",
      "@id": `${SITE.url}/${path}#product`,
      name: p.name,
      description: p.intro,
      image: `${SITE.url}/assets/photos/${p.photos.hero}`,
      brand: { "@type": "Brand", name: SITE.name },
    },
    faqSchema(`${SITE.url}/${path}#faq`, p.faqs),
  ];

  const body = `
    <section class="product-hero">
      <div class="wrap">
        ${breadcrumbs([["Home", "index.html"], ["Products", "products.html"], [p.name, path]])}
        <div class="product-hero-inner" style="padding-top:0">
          <div>
            <span class="eyebrow">${p.series}</span>
            <h1>${p.name}</h1>
            <p class="lead" style="font-size:var(--fs-600);color:var(--gold-600);font-weight:600">${p.tagline}</p>
            <p class="lead">${p.intro}</p>
            <div class="price-tag"><span class="amount" style="font-size:var(--fs-600)">Delivered pricing on request</span></div>
            <p class="muted" style="font-size:var(--fs-300);margin-top:-1rem;margin-bottom:2rem">Fixed delivered quote for your postcode — including transport, customs and installation — within one business day.</p>
            <div class="hero-actions">
              <a class="btn btn-gold btn-lg" href="quote.html?model=${p.slug}">Get a Free Quote ${icons.arrow}</a>
              <a class="btn btn-ghost btn-lg" href="quote.html?brochure=1">Download Brochure</a>
            </div>
            <div class="quick-specs">
              <div><strong>${p.bedrooms}</strong><span>Bedrooms</span></div>
              <div><strong>${p.bathrooms}</strong><span>Bathroom</span></div>
              <div><strong>240V</strong><span>AU standard</span></div>
              <div><strong>Sleeps ${p.sleeps}</strong><span>Comfortably</span></div>
            </div>
          </div>
          <div class="hero-media reveal"><img src="assets/photos/${p.photos.hero}" alt="${p.photos.heroAlt}" fetchpriority="high"></div>
        </div>
      </div>
    </section>

    <section class="section section-white" aria-label="Gallery">
      <div class="wrap">
        <div class="gallery reveal">
          ${p.photos.gallery.map(([f, alt]) => `<figure><img src="assets/photos/${f}" alt="${alt}" loading="lazy"></figure>`).join("\n          ")}
        </div>
        <p class="muted center" style="margin-top:1rem;font-size:var(--fs-300)">Photographed in current production units — interiors shown are the shared two-bedroom layout.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="feat-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">Designed around you</span>
          <h2 id="feat-h">Why owners choose this edition</h2>
        </div>
        <div class="grid grid-2" style="margin-top:2.5rem">${featureCards}
        </div>
      </div>
    </section>

    <section class="section section-navy" aria-labelledby="expand-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">The expandable difference</span>
          <h2 id="expand-h">Watch it unfold</h2>
          <p class="lead center" style="margin-inline:auto">Transported at ${p.closed}, then expanded on site to ${p.expanded}. Hinged sections lock into place and seal weather-tight — typically within a single day.</p>
        </div>
        <div class="expand-demo reveal" data-expand-demo style="margin-top:2.5rem">
          <div class="stage">
            <svg class="expand-home" viewBox="0 0 560 240" aria-hidden="true">
              <g class="wing wing-l"><rect x="150" y="70" width="130" height="130" rx="8" fill="#455436" stroke="#5C6B49" stroke-width="2"/><rect x="170" y="95" width="90" height="60" rx="5" fill="#C99B54" opacity="0.9"/></g>
              <g class="wing wing-r"><rect x="280" y="70" width="130" height="130" rx="8" fill="#455436" stroke="#5C6B49" stroke-width="2"/><rect x="300" y="95" width="90" height="60" rx="5" fill="#C99B54" opacity="0.9"/></g>
              <rect x="190" y="60" width="180" height="140" rx="8" fill="#3A4730" stroke="#75825A" stroke-width="2"/>
              <rect x="215" y="85" width="130" height="90" rx="5" fill="#E8CD91"/>
              <line x1="258" y1="85" x2="258" y2="175" stroke="#2E3722" stroke-width="5"/>
              <line x1="301" y1="85" x2="301" y2="175" stroke="#2E3722" stroke-width="5"/>
              <path d="M170 60 L 280 28 L 390 60" stroke="#262E1B" stroke-width="14" fill="none" stroke-linecap="round"/>
            </svg>
            <div class="center"><button class="btn btn-gold expand-toggle" type="button" aria-pressed="false">Expand on site</button></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="plan-h">
      <div class="wrap two-col">
        <div class="reveal">
          <span class="eyebrow">Layout</span>
          <h2 id="plan-h">Two bedrooms. Nothing wasted.</h2>
          <p class="lead">Bedrooms at each end, living and kitchen at the centre, and a full bathroom with toilet, basin and shower.</p>
          <p class="muted">${p.planNote}</p>
          <table class="spec-table" style="margin-top:1.5rem">
            <tbody>
              <tr><th scope="row">Bedrooms</th><td>${p.bedrooms}</td></tr>
              <tr><th scope="row">Bathroom</th><td>Toilet, basin and shower</td></tr>
              <tr><th scope="row">Kitchen</th><td>Fitted cabinetry</td></tr>
              <tr><th scope="row">Sleeps</th><td>${p.sleeps}</td></tr>
            </tbody>
          </table>
        </div>
        <div class="media-frame reveal reveal-d1" style="background:#fff"><img src="assets/img/floorplan-${p.slug}.svg" alt="Indicative floor plan of the ${p.name}" loading="lazy" width="1000" height="560"></div>
      </div>
    </section>

    <section class="section" aria-labelledby="inc-h">
      <div class="wrap">
        <div class="grid grid-2" style="align-items:start">
          <div class="card reveal">
            <span class="eyebrow">What's included</span>
            <h3 id="inc-h" style="font-size:var(--fs-600)">As specified by the factory</h3>
            <p class="muted">Every item below comes from the manufacturer's order specification for this edition.</p>
            <ul class="included-list" style="margin-top:1.25rem;grid-template-columns:1fr">
            ${included}
            </ul>
          </div>
          <div style="display:grid;gap:1.5rem">
            <div class="card reveal reveal-d1">
              <span class="eyebrow">Specifications</span>
              <h3 style="font-size:var(--fs-600)">The technical detail</h3>
              <table class="spec-table">
                <tbody>
              ${specs}
                </tbody>
              </table>
            </div>
            <div class="card reveal reveal-d2">
              <span class="eyebrow">Options &amp; customisation</span>
              <h3 style="font-size:var(--fs-600)">Make it yours</h3>
              <p class="muted">Finishes, layout tweaks and add-ons — decks, awnings, solar, furniture — are scoped with your order and itemised in your delivered quote. Tell us what you're planning and we'll price it up front.</p>
              <a class="card-link" href="quote.html?model=${p.slug}">Ask about options ${icons.arrow}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="del-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">From order to handover</span>
          <h2 id="del-h">How delivery works</h2>
          <p class="lead center" style="margin-inline:auto">Current lead times are ${p.leadTime}. <a href="delivery.html">See the full delivery process</a>.</p>
        </div>
        <div class="steps reveal" style="margin-top:2.5rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
          <div class="step"><div><h3>Order &amp; build</h3><p>Your configuration is locked in and your home enters production with staged quality inspections.</p></div></div>
          <div class="step"><div><h3>Ship &amp; clear</h3><p>We manage shipping, Australian customs and quarantine — one fixed delivered price, no surprises.</p></div></div>
          <div class="step"><div><h3>Deliver &amp; install</h3><p>Transport to your site, positioning, expansion and weather-sealing — usually within one day.</p></div></div>
          <div class="step"><div><h3>Connect &amp; hand over</h3><p>Licensed trades connect services, we complete a walkthrough, and you get the keys.</p></div></div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="pfaq-h">
      <div class="wrap-narrow">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">Good questions</span>
          <h2 id="pfaq-h">${p.name.split(" — ")[1] || p.name} FAQs</h2>
        </div>
        <div style="margin-top:2rem" class="reveal">
          ${faqs}
        </div>
        <p class="center" style="margin-top:1.5rem"><a class="card-link" href="faq.html">Browse all 40+ FAQs ${icons.arrow}</a></p>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="rel-h">
      <div class="wrap">
        <div class="center reveal"><span class="eyebrow eyebrow-center">Keep exploring</span><h2 id="rel-h">Compare the other edition</h2></div>
        <div style="margin-top:2.5rem">${relatedCards}
        </div>
      </div>
    </section>

    ${ctaBanner(
      `Picture the ${p.name.split(" — ")[1] || p.name} on your block`,
      `Tell us your postcode and we'll send delivered pricing, the full specification sheet and current lead times — free, within one business day.`
    )}
`;

  return layout({
    path,
    title: `${p.name} | ${SITE.name}`,
    description: `${p.intro} Get a fixed delivered quote for your postcode within one business day.`.slice(0, 158),
    body,
    active: "products.html",
    schema,
    ogType: "product",
  });
}
