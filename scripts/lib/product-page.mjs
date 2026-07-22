/* Apple-launch-style product page template, rendered per product. */
import { SITE, icons, layout, faqItem, faqSchema, breadcrumbs, breadcrumbSchema, ctaBanner } from "./layout.mjs";
import { products } from "./products-data.mjs";

const fmt = (n) => "$" + n.toLocaleString("en-AU");

const isExpandable = (p) => p.expanded !== p.closed && !p.expanded.includes("fixed");

export function productPage(p) {
  const path = `product-${p.slug}.html`;
  const related = products.filter((x) => x.slug !== p.slug).slice(0, 3);

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

  const upgrades = p.upgrades
    .map(([u, price]) => `<tr><th scope="row">${u}</th><td>${price}</td></tr>`)
    .join("\n              ");

  const specs = p.specs
    .map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`)
    .join("\n              ");

  const faqs = p.faqs.map(([q, a]) => faqItem(q, a)).join("\n          ");

  const relatedCards = related
    .map(
      (r) => `
          <a class="product-card reveal" href="product-${r.slug}.html">
            <div class="media"><span class="badge">${r.badge}</span><img src="assets/img/scene-${r.slug}.svg" alt="${r.name} exterior illustration" loading="lazy" width="1200" height="800"></div>
            <div class="body">
              <h3>${r.name}</h3>
              <p class="meta">${r.area}m² &middot; ${r.bedrooms ? r.bedrooms + " bed &middot; " + r.bathrooms + " bath" : "studio / workspace"}</p>
              <div class="price-row"><span class="price">From ${fmt(r.price)}<small> incl. GST</small></span>${icons.arrow}</div>
            </div>
          </a>`
    )
    .join("");

  const expandSection = isExpandable(p)
    ? `
    <section class="section section-navy" aria-labelledby="expand-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">The expandable difference</span>
          <h2 id="expand-h">Watch it unfold</h2>
          <p class="lead center" style="margin-inline:auto">Transported at ${p.closed}. Living space of ${p.expanded}. The wings fold out on hidden hinges — walls, floors and roof lock into place and seal weather-tight.</p>
        </div>
        <div class="expand-demo reveal" data-expand-demo style="margin-top:2.5rem">
          <div class="stage">
            <svg class="expand-home" viewBox="0 0 560 240" aria-hidden="true">
              <g class="wing wing-l"><rect x="150" y="70" width="130" height="130" rx="8" fill="#1C3A5E" stroke="#2E4E74" stroke-width="2"/><rect x="170" y="95" width="90" height="60" rx="5" fill="#D6AF5E" opacity="0.9"/></g>
              <g class="wing wing-r"><rect x="280" y="70" width="130" height="130" rx="8" fill="#1C3A5E" stroke="#2E4E74" stroke-width="2"/><rect x="300" y="95" width="90" height="60" rx="5" fill="#D6AF5E" opacity="0.9"/></g>
              <rect x="190" y="60" width="180" height="140" rx="8" fill="#16304F" stroke="#3E5E7E" stroke-width="2"/>
              <rect x="215" y="85" width="130" height="90" rx="5" fill="#F5D488"/>
              <line x1="258" y1="85" x2="258" y2="175" stroke="#0F2743" stroke-width="5"/>
              <line x1="301" y1="85" x2="301" y2="175" stroke="#0F2743" stroke-width="5"/>
              <path d="M170 60 L 280 28 L 390 60" stroke="#0A1B30" stroke-width="14" fill="none" stroke-linecap="round"/>
            </svg>
            <div class="center"><button class="btn btn-gold expand-toggle" type="button" aria-pressed="false">Expand on site</button></div>
          </div>
        </div>
      </div>
    </section>`
    : `
    <section class="section section-navy" aria-labelledby="module-h">
      <div class="wrap two-col">
        <div class="reveal">
          <span class="eyebrow">Fixed module design</span>
          <h2 id="module-h">Craned, placed, done.</h2>
          <p class="lead">The ${p.name} arrives as a complete, finished module. No expansion needed — it's positioned on adjustable feet or piers, connected to services, and ready the same day.</p>
          <ul class="checklist" style="margin-top:1.5rem">
            <li>${icons.check}<span>Delivered fully finished inside and out</span></li>
            <li>${icons.check}<span>Most sites need no slab — adjustable feet handle gentle falls</span></li>
            <li>${icons.check}<span>Relocatable: take it with you if you move</span></li>
          </ul>
        </div>
        <div class="media-frame reveal reveal-d1"><img src="assets/img/scene-${p.slug}-alt.svg" alt="${p.name} positioned on site" loading="lazy" width="1200" height="800"></div>
      </div>
    </section>`;

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
      image: `${SITE.url}/assets/img/scene-${p.slug}.svg`,
      brand: { "@type": "Brand", name: SITE.name },
      offers: {
        "@type": "Offer",
        priceCurrency: "AUD",
        price: String(p.price),
        priceValidUntil: "2027-06-30",
        availability: "https://schema.org/PreOrder",
        url: `${SITE.url}/${path}`,
      },
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
            <p class="lead" style="font-size:var(--fs-600);color:#D5DEE9;font-weight:600">${p.tagline}</p>
            <p class="lead">${p.intro}</p>
            <div class="price-tag"><span class="from">From</span><span class="amount">${fmt(p.price)}</span><span class="from">incl. GST &middot; ${p.priceNote}</span></div>
            <div class="hero-actions">
              <a class="btn btn-gold btn-lg" href="quote.html?model=${p.slug}">Get a Free Quote ${icons.arrow}</a>
              <a class="btn btn-ghost-light btn-lg" href="quote.html?brochure=1">Download Brochure</a>
            </div>
            <div class="quick-specs">
              <div><strong>${p.area}m²</strong><span>Internal area</span></div>
              ${p.bedrooms ? `<div><strong>${p.bedrooms}</strong><span>Bedroom${p.bedrooms > 1 ? "s" : ""}</span></div><div><strong>${p.bathrooms}</strong><span>Bathroom${p.bathrooms > 1 ? "s" : ""}</span></div>` : `<div><strong>1 day</strong><span>Install time</span></div>`}
              <div><strong>${p.leadTime}</strong><span>Lead time</span></div>
            </div>
          </div>
          <div class="hero-media reveal"><img src="assets/img/scene-${p.slug}.svg" alt="${p.name} exterior at ${p.palette === "day" ? "midday" : "dusk"} with warm interior lighting" width="1200" height="800" fetchpriority="high"></div>
        </div>
      </div>
    </section>

    <section class="section section-white" aria-label="Gallery">
      <div class="wrap">
        <div class="gallery reveal">
          <figure><img src="assets/img/scene-${p.slug}.svg" alt="${p.name} — exterior view" loading="lazy" width="1200" height="800"></figure>
          <figure><img src="assets/img/scene-${p.slug}-alt.svg" alt="${p.name} — alternate site setting" loading="lazy" width="1200" height="800"></figure>
          <figure><img src="assets/img/floorplan-${p.slug}.svg" alt="${p.name} floor plan showing room layout" loading="lazy" width="1000" height="560"></figure>
          <figure><img src="assets/img/hero-home.svg" alt="Expandable tiny home lifestyle setting at dusk" loading="lazy" width="1200" height="900"></figure>
        </div>
        <p class="muted center" style="margin-top:1rem;font-size:var(--fs-300)">Illustrative renders shown — request the brochure for full photo galleries of completed customer homes.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="feat-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">Designed around you</span>
          <h2 id="feat-h">Why owners love the ${p.name.replace(" Expandable Tiny Home", "").replace(" Expandable Home", "")}</h2>
        </div>
        <div class="grid grid-2" style="margin-top:2.5rem">${featureCards}
        </div>
      </div>
    </section>

    ${expandSection}

    <section class="section section-white" aria-labelledby="plan-h">
      <div class="wrap two-col">
        <div class="reveal">
          <span class="eyebrow">Layout</span>
          <h2 id="plan-h">Every square metre earns its place</h2>
          <p class="lead">Transported at ${p.closed}, living at ${p.expanded} — ${p.area}m² of carefully zoned space with a ${p.height}.</p>
          <table class="spec-table" style="margin-top:1.5rem">
            <tbody>
              <tr><th scope="row">Sleeps</th><td>${p.sleeps || "—"}</td></tr>
              <tr><th scope="row">Transport size</th><td>${p.closed}</td></tr>
              <tr><th scope="row">Expanded size</th><td>${p.expanded}</td></tr>
              <tr><th scope="row">Approx. weight</th><td>${p.weight}</td></tr>
            </tbody>
          </table>
        </div>
        <div class="media-frame reveal reveal-d1" style="background:#fff"><img src="assets/img/floorplan-${p.slug}.svg" alt="Detailed floor plan of the ${p.name}" loading="lazy" width="1000" height="560"></div>
      </div>
    </section>

    <section class="section" aria-labelledby="inc-h">
      <div class="wrap">
        <div class="grid grid-2" style="align-items:start">
          <div class="card reveal">
            <span class="eyebrow">What's included</span>
            <h3 id="inc-h" style="font-size:var(--fs-600)">Standard. Not optional.</h3>
            <p class="muted">The advertised price includes a complete, finished home — not a shell.</p>
            <ul class="included-list" style="margin-top:1.25rem;grid-template-columns:1fr">
            ${included}
            </ul>
          </div>
          <div style="display:grid;gap:1.5rem">
            <div class="card reveal reveal-d1">
              <span class="eyebrow">Popular upgrades</span>
              <h3 style="font-size:var(--fs-600)">Make it yours</h3>
              <table class="spec-table">
                <tbody>
              ${upgrades}
                </tbody>
              </table>
            </div>
            <div class="card reveal reveal-d2">
              <span class="eyebrow">Specifications</span>
              <h3 style="font-size:var(--fs-600)">The technical detail</h3>
              <table class="spec-table">
                <tbody>
              ${specs}
                </tbody>
              </table>
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
          <p class="lead center" style="margin-inline:auto">Current lead time for the ${p.name}: <strong>${p.leadTime}</strong> from deposit to delivery. <a href="delivery.html">See the full delivery process</a>.</p>
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
          <h2 id="pfaq-h">${p.name} FAQs</h2>
        </div>
        <div style="margin-top:2rem" class="reveal">
          ${faqs}
        </div>
        <p class="center" style="margin-top:1.5rem"><a class="card-link" href="faq.html">Browse all 40+ FAQs ${icons.arrow}</a></p>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="rel-h">
      <div class="wrap">
        <div class="center reveal"><span class="eyebrow eyebrow-center">Keep exploring</span><h2 id="rel-h">Compare other models</h2></div>
        <div class="grid grid-3" style="margin-top:2.5rem">${relatedCards}
        </div>
      </div>
    </section>

    ${ctaBanner(
      `Picture the ${p.name} on your block`,
      `Tell us your postcode and we'll send delivered pricing, floor plans and current lead times for the ${p.name} — free, within one business day.`
    )}
`;

  return layout({
    path,
    title: `${p.name} | From ${fmt(p.price)} | ${SITE.name}`,
    description: `${p.intro} ${p.area}m² &middot; from ${fmt(p.price)} incl. GST with Australia-wide delivery. Get delivered pricing for your postcode.`.slice(0, 158),
    body,
    active: "products.html",
    schema,
    ogType: "product",
  });
}
