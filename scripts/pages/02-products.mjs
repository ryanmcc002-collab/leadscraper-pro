import { SITE, icons, layout, breadcrumbs, breadcrumbSchema, ctaBanner } from "../lib/layout.mjs";
import { products } from "../lib/products-data.mjs";

const cards = products
  .map(
    (p, i) => `
          <a class="product-card reveal reveal-d${i % 3}" href="product-${p.slug}.html">
            <div class="media"><span class="badge">${p.badge}</span><img src="assets/img/scene-${p.slug}.svg" alt="${p.name} exterior illustration" loading="lazy" width="1200" height="800"></div>
            <div class="body">
              <h3>${p.name}</h3>
              <p class="meta">${p.tagline}</p>
              <p class="meta">${p.bedrooms} bed &middot; ${p.bathrooms} bath &middot; sleeps ${p.sleeps}</p>
              <div class="price-row"><span class="price" style="font-size:var(--fs-400)">Delivered quote on request</span>${icons.arrow}</div>
            </div>
          </a>`
  )
  .join("");

const SPEC_KEYS = ["Wall panels", "Frame", "Windows", "Entrance door"];
const compareRows = SPEC_KEYS.map(
  (key) => `<tr>
              <th scope="row">${key}</th>
              ${products.map((p) => `<td>${(p.specs.find(([k]) => k === key) || ["", "—"])[1]}</td>`).join("")}
            </tr>`
).join("\n            ");

const body = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbs([["Home", "index.html"], ["Products", "products.html"]])}
        <span class="eyebrow">The range</span>
        <h1>The Model 0206 Two-Bedroom Expandable</h1>
        <p class="lead">One proven two-bedroom layout — kitchen, full bathroom, Australian-standard 240V — in two distinct editions. Every quote is a fixed delivered price to your postcode, with the full factory specification sheet included.</p>
        <div class="hero-actions" style="margin-top:2rem;margin-bottom:0">
          <a class="btn btn-gold" href="quote.html">Get a Free Quote ${icons.arrow}</a>
          <a class="btn btn-ghost-light" href="quote.html?brochure=1">Download Full Brochure</a>
        </div>
      </div>
    </section>

    <section class="section" aria-label="Product catalogue">
      <div class="wrap">
        <div class="grid grid-3">${cards}
        </div>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="cmp-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">Side by side</span>
          <h2 id="cmp-h">Compare the range at a glance</h2>
        </div>
        <div class="table-scroll reveal" style="margin-top:2.5rem">
          <table class="compare">
            <thead><tr><th scope="col">Specification</th>${products.map((p) => `<th scope="col">${p.name.split(" — ")[1]}</th>`).join("")}</tr></thead>
            <tbody>
            ${compareRows}
              <tr><th scope="row">Layout</th><td>2 bed &middot; kitchen &middot; bathroom</td><td>2 bed &middot; kitchen &middot; bathroom</td></tr>
              <tr><th scope="row">Pricing</th><td><a href="quote.html?model=model-0206-two-bedroom-white">Delivered quote</a></td><td><a href="quote.html?model=model-0206-two-bedroom-black">Delivered quote</a></td></tr>
            </tbody>
          </table>
        </div>
        <p class="muted center" style="margin-top:1.25rem;font-size:var(--fs-300)">Not sure which edition suits your block or budget? <a href="quote.html">Tell us your plans</a> — we'll recommend honestly, and quote both if you're weighing them up.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="use-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">Built for your plans</span>
          <h2 id="use-h">What will yours be?</h2>
        </div>
        <div class="grid grid-4" style="margin-top:2.5rem">
          <div class="card reveal"><div class="icon">${icons.home}</div><h3>First home</h3><p>Own sooner: a complete two-bedroom home without the site-build price tag. Pair with our <a href="finance.html">finance options</a>.</p></div>
          <div class="card reveal reveal-d1"><div class="icon">${icons.tag}</div><h3>Airbnb &amp; holiday lets</h3><p>The feature-clad <a href="product-model-0206-two-bedroom-black.html">Black Edition</a> photographs like an architectural cabin — built for nightly-rate returns.</p></div>
          <div class="card reveal reveal-d2"><div class="icon">${icons.users}</div><h3>Granny flat &amp; multi-gen</h3><p>Two bedrooms, kitchen and full bathroom make a genuine secondary dwelling — keep parents close or give teens space.</p></div>
          <div class="card reveal reveal-d3"><div class="icon">${icons.leaf}</div><h3>Farms &amp; stations</h3><p>Workers' quarters, farm-stay income or a manager's residence — see <a href="why-expandable-homes.html">why expandable works remote</a>.</p></div>
        </div>
      </div>
    </section>

    ${ctaBanner(
      "Want delivered pricing on any model?",
      "Send us your postcode and shortlist — we'll reply within one business day with transport costs, lead times and honest advice on the right fit."
    )}
`;

export const page = {
  path: "products.html",
  html: layout({
    path: "products.html",
    title: "Two-Bedroom Expandable Tiny Homes | Bondi Tiny Homes",
    description:
      "The Model 0206 two-bedroom expandable in Classic White and feature-clad Black Edition — factory specs, floor plans and fixed delivered quotes to any Australian postcode.",
    body,
    active: "products.html",
    schema: [
      breadcrumbSchema([["Home", ""], ["Products", "products.html"]]),
      {
        "@type": "ItemList",
        "@id": `${SITE.url}/products.html#list`,
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE.url}/product-${p.slug}.html`,
          name: p.name,
        })),
      },
    ],
  }),
};
