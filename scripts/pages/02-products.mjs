import { SITE, icons, layout, breadcrumbs, breadcrumbSchema, ctaBanner } from "../lib/layout.mjs";
import { products } from "../lib/products-data.mjs";

const fmt = (n) => "$" + n.toLocaleString("en-AU");

const cards = products
  .map(
    (p, i) => `
          <a class="product-card reveal reveal-d${i % 3}" href="product-${p.slug}.html">
            <div class="media"><span class="badge">${p.badge}</span><img src="assets/img/scene-${p.slug}.svg" alt="${p.name} exterior illustration" loading="lazy" width="1200" height="800"></div>
            <div class="body">
              <h3>${p.name}</h3>
              <p class="meta">${p.tagline}</p>
              <p class="meta">${p.area}m² &middot; ${p.bedrooms ? `${p.bedrooms} bed &middot; ${p.bathrooms} bath &middot; sleeps ${p.sleeps}` : "studio / workspace"}</p>
              <div class="price-row"><span class="price">From ${fmt(p.price)}<small> incl. GST</small></span>${icons.arrow}</div>
            </div>
          </a>`
  )
  .join("");

const compareRows = products
  .map(
    (p) => `<tr>
              <th scope="row"><a href="product-${p.slug}.html">${p.name}</a></th>
              <td>From ${fmt(p.price)}</td>
              <td>${p.area}m²</td>
              <td>${p.bedrooms || "—"}</td>
              <td>${p.bathrooms || "—"}</td>
              <td>${p.leadTime}</td>
            </tr>`
  )
  .join("\n            ");

const body = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbs([["Home", "index.html"], ["Products", "products.html"]])}
        <span class="eyebrow">The range</span>
        <h1>Expandable Tiny Homes &amp; Pods</h1>
        <p class="lead">Seven models, one uncompromising build standard. Every price below is a complete, finished home including GST — and every quote is a fixed delivered price to your postcode.</p>
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
            <thead><tr><th scope="col">Model</th><th scope="col">Price (incl. GST)</th><th scope="col">Area</th><th scope="col">Beds</th><th scope="col">Baths</th><th scope="col">Lead time</th></tr></thead>
            <tbody>
            ${compareRows}
            </tbody>
          </table>
        </div>
        <p class="muted center" style="margin-top:1.25rem;font-size:var(--fs-300)">Not sure which model suits your block or budget? <a href="quote.html">Tell us your plans</a> — we'll recommend honestly, even if the answer is our cheapest model.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="use-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">Built for your plans</span>
          <h2 id="use-h">What will yours be?</h2>
        </div>
        <div class="grid grid-4" style="margin-top:2.5rem">
          <div class="card reveal"><div class="icon">${icons.home}</div><h3>First home</h3><p>Own sooner: a complete home for the price of a city apartment deposit. Pair with our <a href="finance.html">finance options</a>.</p></div>
          <div class="card reveal reveal-d1"><div class="icon">${icons.tag}</div><h3>Airbnb &amp; holiday lets</h3><p>The <a href="product-airbnb-cabin.html">Airbnb Cabin</a> and <a href="product-luxury-series.html">Luxury Series</a> are engineered for nightly-rate returns.</p></div>
          <div class="card reveal reveal-d2"><div class="icon">${icons.users}</div><h3>Family &amp; multi-gen</h3><p>Keep parents close or give teens space — the <a href="product-studio-pod.html">Studio Pod</a> and <a href="product-family-series.html">Family Series</a> handle both.</p></div>
          <div class="card reveal reveal-d3"><div class="icon">${icons.leaf}</div><h3>Farms &amp; stations</h3><p>Workforce quarters, farm-stay income or a manager's residence — with full <a href="why-expandable-homes.html">off-grid capability</a>.</p></div>
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
    title: "Tiny Home Prices & Models From $18,900 | Bondi Tiny Homes",
    description:
      "Compare 7 premium expandable tiny homes, pods and cabins from $18,900 incl. GST — floor plans, specs and fixed delivered quotes to any Australian postcode.",
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
