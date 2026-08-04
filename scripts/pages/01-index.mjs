import { SITE, icons, layout, faqItem, faqSchema, ctaBanner } from "../lib/layout.mjs";
import { products } from "../lib/products-data.mjs";

const fmt = (n) => "$" + n.toLocaleString("en-AU");

const HOME_FAQS = [
  ["How much does an expandable tiny home cost in Australia?", `Our expandable tiny homes range from $18,900 for the Office Pod to $79,900 for the flagship Luxury Series, including GST. Every quote we issue is a delivered price to your postcode — transport, customs and quality inspection included. See our <a href="blog-how-much-does-a-tiny-home-cost.html">full pricing guide</a>.`],
  ["Do tiny homes need council approval?", `It depends on how the home is used and where it's located. A home used as a permanent dwelling generally needs approval as a secondary dwelling or primary residence; some small structures and temporary uses have exemptions. We provide engineering documentation with every home and a state-by-state guide — read <a href="blog-do-tiny-homes-need-council-approval.html">our council approval guide</a>.`],
  ["How long does delivery take?", `Current lead times are 6–18 weeks depending on the model, plus transport. Installation and expansion is typically completed in a single day. The <a href="delivery.html">delivery page</a> walks through every step from factory to handover.`],
  ["What does 'expandable' actually mean?", `The home transports as a standard shipping-width load, then hinged wing sections fold out on site to double or triple the floor area. You get real rooms and real ceilings — not a trailer, not a caravan. <a href="why-expandable-homes.html">Learn how expandable homes work</a>.`],
  ["Is finance available?", `Yes — through Australian lenders offering personal, secured and business loans for tiny homes, with terms from 3 to 7 years. Use the <a href="finance.html">repayment calculator</a> to estimate weekly repayments.`],
  ["What warranty do you offer?", `Every home carries a 10-year structural warranty and a minimum 2-year warranty on fixtures and fittings, backed by our Australian support team — not an overseas factory.`],
];

const productCards = products
  .map(
    (p) => `
          <a class="product-card" href="product-${p.slug}.html">
            <div class="media"><span class="badge">${p.badge}</span><img src="assets/img/scene-${p.slug}.svg" alt="${p.name} exterior illustration" loading="lazy" width="1200" height="800"></div>
            <div class="body">
              <h3>${p.name}</h3>
              <p class="meta">${p.area}m² &middot; ${p.bedrooms ? `${p.bedrooms} bed &middot; ${p.bathrooms} bath` : "studio / workspace"} &middot; ${p.leadTime}</p>
              <div class="price-row"><span class="price">From ${fmt(p.price)}<small> incl. GST</small></span>${icons.arrow}</div>
            </div>
          </a>`
  )
  .join("");

const body = `
    <section class="hero">
      <div class="wrap">
        <div class="hero-inner">
          <div>
            <span class="eyebrow">Australia's premium expandable homes</span>
            <h1>Premium Expandable Tiny Homes, <span class="gold-text">Delivered Australia-Wide</span></h1>
            <p class="lead">Factory-direct pricing without the factory-direct gamble: every Bondi Tiny Home is independently quality-inspected, delivered to your site at a fixed price, and backed by a 10-year structural warranty and a real Australian support team.</p>
            <div class="hero-actions">
              <a class="btn btn-gold btn-lg" href="quote.html">Get a Free Quote ${icons.arrow}</a>
              <a class="btn btn-ghost-light btn-lg" href="quote.html?brochure=1">${icons.doc} Download Brochure</a>
            </div>
            <div class="hero-trust">
              <span class="item">${icons.shield} 10-year structural warranty</span>
              <span class="item">${icons.check} 3 staged factory inspections</span>
              <span class="item">${icons.truck} Delivery to every state</span>
            </div>
          </div>
          <div class="hero-media reveal"><img src="assets/img/hero-home.svg" alt="Modern expandable tiny home at dusk with wings extended and warm interior lighting" width="1200" height="900" fetchpriority="high"></div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="why-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">Why Bondi Tiny Homes</span>
          <h2 id="why-h">Everything a site build gives you.<br>Without the year of your life.</h2>
        </div>
        <div class="grid grid-3" style="margin-top:3rem">
          <article class="card reveal">
            <div class="icon">${icons.clock}</div>
            <h3>Fast Installation</h3>
            <p>Delivered finished and expanded on site in a day. Most owners are living in their home the same week it arrives — not 12–18 months after a slab is poured.</p>
          </article>
          <article class="card reveal reveal-d1">
            <div class="icon">${icons.expand}</div>
            <h3>Expandable Design</h3>
            <p>Transports at 2.5m wide, unfolds to up to 6.6m of genuine living space. Real bedrooms, real ceilings, real doors — engineered hinged construction, not a caravan.</p>
          </article>
          <article class="card reveal reveal-d2">
            <div class="icon">${icons.home}</div>
            <h3>Modern Living</h3>
            <p>Double glazing, stone-look kitchens, hotel-grade bathrooms and reverse-cycle climate control come standard on every model. Nothing about it feels like a compromise.</p>
          </article>
          <article class="card reveal">
            <div class="icon">${icons.truck}</div>
            <h3>Australia-Wide Delivery</h3>
            <p>City block, coastal acreage or outback station — we quote a fixed delivered price to your postcode and manage transport, customs and installation end-to-end.</p>
          </article>
          <article class="card reveal reveal-d1">
            <div class="icon">${icons.tag}</div>
            <h3>Factory-Direct Pricing</h3>
            <p>We buy directly from the manufacturers we've personally audited, with no importer margin stacked in between. You see one transparent price, GST included.</p>
          </article>
          <article class="card reveal reveal-d2">
            <div class="icon">${icons.gem}</div>
            <h3>Premium Quality</h3>
            <p>Galvanised steel frames, 100mm insulated panels and staged factory inspections photographed and shared with you before your home ever ships.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section-navy" aria-label="Our standards">
      <div class="wrap">
        <div class="stats reveal">
          <div><div class="num" data-count="10" data-suffix="-yr">0</div><div class="label">Structural warranty</div></div>
          <div><div class="num" data-count="3" data-suffix="×">0</div><div class="label">Staged factory inspections</div></div>
          <div><div class="num" data-count="1" data-suffix="-day">0</div><div class="label">Typical installation</div></div>
          <div><div class="num" data-count="8" data-suffix="/8">0</div><div class="label">States &amp; territories covered</div></div>
        </div>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="range-h">
      <div class="wrap" style="padding-inline:0">
        <div class="wrap center reveal">
          <span class="eyebrow eyebrow-center">The range</span>
          <h2 id="range-h">Seven homes. One standard: premium.</h2>
          <p class="lead center" style="margin-inline:auto">From a backyard office to a three-bedroom family home — every model shares the same steel structure, insulation and finish quality.</p>
        </div>
        <div class="carousel" style="margin-top:2.5rem">
          <div class="carousel-nav">
            <button class="carousel-btn" data-dir="prev" aria-label="Previous products"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button>
            <button class="carousel-btn" data-dir="next" aria-label="Next products"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
          </div>
          <div class="carousel-track">${productCards}
          </div>
        </div>
        <div class="wrap center"><a class="btn btn-navy" href="products.html">Explore the full range ${icons.arrow}</a></div>
      </div>
    </section>

    <section class="section" aria-labelledby="how-h">
      <div class="wrap two-col">
        <div class="reveal">
          <span class="eyebrow">How it works</span>
          <h2 id="how-h">From first call to front-door keys</h2>
          <p class="lead">One dedicated Australian project manager guides your entire journey — you'll never be passed to an offshore call centre.</p>
          <div class="steps" style="margin-top:2rem">
            <div class="step"><div><h3>Free consultation &amp; site check</h3><p>We confirm access, approvals pathway and the right model for your block — before you spend a cent.</p></div></div>
            <div class="step"><div><h3>Factory build &amp; inspection</h3><p>Your home is built and independently inspected at each stage, with photo reports sent to you.</p></div></div>
            <div class="step"><div><h3>Delivery &amp; expansion</h3><p>Shipped, cleared through customs and installed on your site — usually expanded within a single day.</p></div></div>
            <div class="step"><div><h3>Connection &amp; handover</h3><p>Licensed trades connect power, water and waste. We walk you through everything, then hand over the keys.</p></div></div>
          </div>
        </div>
        <div class="reveal reveal-d1">
          <div class="media-frame"><img src="assets/img/map-au.svg" alt="Map of Australia showing delivery routes to Sydney, Melbourne, Brisbane, Perth, Adelaide, Darwin, Hobart and regional areas" loading="lazy" width="900" height="720"></div>
          <p class="muted center" style="margin-top:1rem;font-size:var(--fs-300)">Every state and territory. Metro, regional and remote.</p>
        </div>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="promise-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">Our commitments</span>
          <h2 id="promise-h">Promises we put in writing</h2>
          <p class="lead center" style="margin-inline:auto">No invented review scores, no stock-photo "happy customers". Just commitments you'll find in your contract — and can hold us to.</p>
        </div>
        <div class="grid grid-3" style="margin-top:2.5rem">
          <div class="card reveal">
            <div class="icon">${icons.doc}</div>
            <h3>The quote is the price</h3>
            <p>Your delivered quote is itemised and fixed for 60 days — home, transport, customs and installation. Anything site-specific is a written line item before you commit, never a surprise after.</p>
          </div>
          <div class="card reveal reveal-d1">
            <div class="icon">${icons.shield}</div>
            <h3>Proof before payment</h3>
            <p>Progress payments are tied to inspection milestones you can verify yourself — you receive the staged factory inspection photo reports of your own home as it's built.</p>
          </div>
          <div class="card reveal reveal-d2">
            <div class="icon">${icons.phone}</div>
            <h3>Support that answers</h3>
            <p>A Sydney-based project manager owns your order from first call to handover, and the 10-year structural warranty is administered here in Australia — not by an overseas factory.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="cmp-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">The honest comparison</span>
          <h2 id="cmp-h">Expandable home vs the alternatives</h2>
          <p class="lead center" style="margin-inline:auto">We'd rather you make an informed decision than a fast one. Here's how the options genuinely stack up.</p>
        </div>
        <div class="table-scroll reveal" style="margin-top:2.5rem">
          <table class="compare">
            <thead>
              <tr><th scope="col">Factor</th><th scope="col">Bondi Expandable</th><th scope="col">Traditional Build</th><th scope="col">Kit Granny Flat</th><th scope="col">Caravan / Trailer</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Typical cost</th><td>$18,900–$79,900</td><td>$180,000+</td><td>$120,000+</td><td>$60,000–$150,000</td></tr>
              <tr><th scope="row">Time to move in</th><td>10–18 weeks</td><td>12–24 months</td><td>4–8 months</td><td>Immediate</td></tr>
              <tr><th scope="row">Real bedrooms &amp; 2.6m+ ceilings</th><td class="yes">Yes</td><td class="yes">Yes</td><td class="yes">Yes</td><td class="no">Rarely</td></tr>
              <tr><th scope="row">Site trades required</th><td>Connections only</td><td class="no">Every trade</td><td class="no">Most trades</td><td>Connections only</td></tr>
              <tr><th scope="row">Relocatable later</th><td class="yes">Yes</td><td class="no">No</td><td class="no">No</td><td class="yes">Yes</td></tr>
              <tr><th scope="row">Weather delays</th><td class="yes">None — built indoors</td><td class="no">Constant risk</td><td>Some</td><td class="yes">None</td></tr>
              <tr><th scope="row">10-year structural warranty</th><td class="yes">Standard</td><td>Varies by builder</td><td>Varies</td><td class="no">Uncommon</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="hfaq-h">
      <div class="wrap-narrow">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">Straight answers</span>
          <h2 id="hfaq-h">Frequently asked questions</h2>
        </div>
        <div style="margin-top:2rem" class="reveal">
          ${HOME_FAQS.map(([q, a]) => faqItem(q, a)).join("\n          ")}
        </div>
        <p class="center" style="margin-top:1.5rem"><a class="card-link" href="faq.html">See all 40+ questions answered ${icons.arrow}</a></p>
      </div>
    </section>

    <section class="section" aria-labelledby="guide-h">
      <div class="wrap">
        <div class="cta-banner reveal" style="text-align:left;display:grid;grid-template-columns:1.2fr 1fr;gap:2rem;align-items:center">
          <div>
            <span class="eyebrow">Free buyer's guide</span>
            <h2 id="guide-h" style="margin-inline:0">The 2026 Australian Tiny Home Buyer's Guide</h2>
            <p class="lead" style="margin-inline:0">Pricing benchmarks, council approval checklists for every state, site preparation costs and the 12 questions to ask any supplier (including us). No spam — one useful email, then you're done.</p>
          </div>
          <form class="glass-panel" data-enquiry novalidate aria-label="Download the free buyer's guide">
            <div class="field" style="margin-bottom:1rem">
              <label for="guide-name" style="color:#fff">First name</label>
              <input id="guide-name" name="name" type="text" autocomplete="given-name" required>
            </div>
            <div class="field" style="margin-bottom:1.25rem">
              <label for="guide-email" style="color:#fff">Email</label>
              <input id="guide-email" name="email" type="email" autocomplete="email" required>
            </div>
            <p class="honeypot" aria-hidden="true"><input type="text" name="company_website" tabindex="-1" autocomplete="off"></p>
            <button class="btn btn-gold" type="submit" style="width:100%">Send me the free guide</button>
            <p class="form-success" role="status">Thanks! Your guide is on its way — check your inbox in the next few minutes.</p>
            <p class="form-note" style="color:#A9B8CB">${icons.lock} Your details stay with us. Unsubscribe anytime.</p>
          </form>
        </div>
      </div>
    </section>

    ${ctaBanner(
      "Get delivered pricing for your postcode",
      "Free quote within one business day — including transport, current lead times and finance estimates. No pressure, no obligation, no call-centre follow-up."
    )}
`;

export const page = {
  path: "index.html",
  html: layout({
    path: "index.html",
    title: "Expandable Tiny Homes Australia | Bondi Tiny Homes",
    description:
      "Premium expandable tiny homes from $18,900 delivered. Factory-direct pricing, 10-year warranty, Australian support, delivery to every state. Free quotes.",
    body,
    active: null,
    schema: [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: `${SITE.url}/`,
        name: SITE.name,
        publisher: { "@id": `${SITE.url}/#organization` },
      },
      faqSchema(`${SITE.url}/#faq`, HOME_FAQS),
    ],
  }),
};
