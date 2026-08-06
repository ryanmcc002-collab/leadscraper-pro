import { SITE, icons, layout, faqItem, faqSchema, ctaBanner } from "../lib/layout.mjs";
import { products } from "../lib/products-data.mjs";

const HOME_FAQS = [
  ["How much does an expandable tiny home cost in Australia?", `Every quote we issue is a fixed delivered price to your exact postcode — home, transport, customs and quality inspection included — so we price per order rather than publishing a one-size-fits-all number. For market context, see our <a href="blog-how-much-does-a-tiny-home-cost.html">full pricing guide</a>, then <a href="quote.html">request your delivered quote</a> — it's free and takes one business day.`],
  ["Do tiny homes need council approval?", `It depends on how the home is used and where it's located. A home used as a permanent dwelling generally needs approval as a secondary dwelling or primary residence; some small structures and temporary uses have exemptions. We provide engineering documentation with every home and a state-by-state guide — read <a href="blog-do-tiny-homes-need-council-approval.html">our council approval guide</a>.`],
  ["How long does delivery take?", `Lead times depend on the production schedule and shipping — your quote includes the current timeline. Installation and expansion is typically completed in a single day. The <a href="delivery.html">delivery page</a> walks through every step from factory to handover.`],
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
              <p class="meta">${p.tagline}</p>
              <p class="meta">${p.bedrooms} bed &middot; ${p.bathrooms} bath &middot; sleeps ${p.sleeps}</p>
              <div class="price-row"><span class="price" style="font-size:var(--fs-400)">Delivered quote on request</span>${icons.arrow}</div>
            </div>
          </a>`
  )
  .join("");

const body = `
    <section class="hero hero-cinema">
      <div class="wrap">
        <div class="hero-copy">
          <span class="eyebrow eyebrow-center">Australia's premium expandable homes</span>
          <h1>Premium Expandable Tiny Homes, <span class="gold-text">Delivered Australia-Wide</span></h1>
          <p class="lead">Factory-direct pricing without the factory-direct gamble: every Go Tiny Homes build is independently quality-inspected, delivered to your site at a fixed price, and backed by a 10-year structural warranty and a real Australian support team.</p>
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
      </div>

      <div class="cinema-stage" data-cinema>
        <svg viewBox="0 0 1600 880" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Animated story of a Go Tiny Homes delivery: a truck arrives carrying the folded home, sets it down, and the home unfolds into a full two-bedroom house with lit windows">
          <defs>
            <linearGradient id="cn-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#0E2440"/><stop offset="0.55" stop-color="#1B3A5F"/><stop offset="1" stop-color="#3E5E7E"/>
            </linearGradient>
            <radialGradient id="cn-glow" cx="0.78" cy="0.24" r="0.5">
              <stop offset="0" stop-color="#D6AF5E" stop-opacity="0.38"/><stop offset="1" stop-color="#D6AF5E" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="cn-h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#122C4C"/><stop offset="1" stop-color="#0B1E36"/></linearGradient>
            <linearGradient id="cn-h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#183A60"/><stop offset="1" stop-color="#102A48"/></linearGradient>
            <linearGradient id="cn-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#233F60"/><stop offset="1" stop-color="#16304F"/></linearGradient>
            <linearGradient id="cn-warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5D488"/><stop offset="1" stop-color="#D6AF5E"/></linearGradient>
          </defs>

          <rect width="1600" height="880" fill="url(#cn-sky)"/>
          <rect width="1600" height="880" fill="url(#cn-glow)"/>
          <circle cx="1265" cy="300" r="46" fill="#F0CE84" opacity="0.9"/>
          <circle cx="1265" cy="300" r="72" fill="#F0CE84" opacity="0.15"/>
          <g fill="#E8EEF5">
            <circle class="tw" cx="160" cy="120" r="2.2"/><circle class="tw2" cx="360" cy="330" r="1.7"/><circle class="tw3" cx="560" cy="150" r="1.9"/>
            <circle class="tw2" cx="760" cy="85" r="1.5"/><circle class="tw" cx="1030" cy="105" r="2"/><circle class="tw3" cx="1480" cy="240" r="1.6"/>
            <circle class="tw3" cx="255" cy="235" r="1.5"/><circle class="tw" cx="960" cy="305" r="1.8"/><circle class="tw2" cx="1400" cy="352" r="2"/>
            <circle class="tw" cx="80" cy="320" r="1.6"/><circle class="tw3" cx="660" cy="230" r="1.4"/>
          </g>
          <path d="M0 520 Q 260 430 560 500 T 1120 480 T 1600 515 V 880 H 0 Z" fill="url(#cn-h1)"/>
          <path d="M0 595 Q 380 525 800 580 T 1600 570 V 880 H 0 Z" fill="url(#cn-h2)"/>

          <!-- gum trees for depth -->
          <g opacity="0.9">
            <path d="M170 656 C 168 566 176 522 170 470" stroke="#0A1B30" stroke-width="11" fill="none" stroke-linecap="round"/>
            <ellipse cx="170" cy="448" rx="70" ry="42" fill="#0E2440"/>
            <ellipse cx="118" cy="430" rx="45" ry="29" fill="#122C4C"/>
            <ellipse cx="220" cy="426" rx="49" ry="31" fill="#122C4C"/>
          </g>
          <g opacity="0.85">
            <path d="M1452 656 C 1450 580 1457 545 1452 505 " stroke="#0A1B30" stroke-width="9" fill="none" stroke-linecap="round"/>
            <ellipse cx="1452" cy="486" rx="56" ry="34" fill="#0E2440"/>
            <ellipse cx="1412" cy="470" rx="36" ry="23" fill="#122C4C"/>
          </g>

          <!-- delivery truck -->
          <g class="cine-truck" transform="translate(-9999 0)">
            <rect x="555" y="596" width="470" height="15" rx="4" fill="#0A1B30"/>
            <rect x="1018" y="600" width="26" height="12" fill="#0A1B30"/>
            <rect x="1036" y="520" width="100" height="116" rx="12" fill="#0A1B30"/>
            <rect x="1052" y="536" width="58" height="36" rx="5" fill="#3E5E7E"/>
            <rect x="1130" y="596" width="9" height="18" rx="2" fill="#F0CE84" opacity="0.85"/>
            <g class="cine-wheel" data-cx="622" data-cy="632">
              <circle cx="622" cy="632" r="24" fill="#0A1B30" stroke="#2E4E74" stroke-width="4"/>
              <line x1="622" y1="614" x2="622" y2="650" stroke="#2E4E74" stroke-width="4"/>
            </g>
            <g class="cine-wheel" data-cx="948" data-cy="632">
              <circle cx="948" cy="632" r="24" fill="#0A1B30" stroke="#2E4E74" stroke-width="4"/>
              <line x1="948" y1="614" x2="948" y2="650" stroke="#2E4E74" stroke-width="4"/>
            </g>
            <g class="cine-wheel" data-cx="1082" data-cy="632">
              <circle cx="1082" cy="632" r="24" fill="#0A1B30" stroke="#2E4E74" stroke-width="4"/>
              <line x1="1082" y1="614" x2="1082" y2="650" stroke="#2E4E74" stroke-width="4"/>
            </g>
          </g>

          <!-- the home -->
          <g class="cine-home">
            <rect class="cine-deck" x="505" y="640" width="590" height="13" rx="4" fill="#6B5430"/>
            <g class="cine-wing-l">
              <rect x="530" y="450" width="175" height="190" rx="8" fill="#1C3A5E" stroke="#2E4E74" stroke-width="2"/>
              <rect x="552" y="482" width="130" height="92" rx="5" fill="#16304F"/>
              <rect class="win-lit lit-l" x="552" y="482" width="130" height="92" rx="5" fill="url(#cn-warm)" opacity="0.95"/>
              <line x1="617" y1="482" x2="617" y2="574" stroke="#0F2743" stroke-width="5"/>
            </g>
            <g class="cine-wing-r">
              <rect x="895" y="450" width="175" height="190" rx="8" fill="#1C3A5E" stroke="#2E4E74" stroke-width="2"/>
              <rect x="917" y="482" width="130" height="92" rx="5" fill="#16304F"/>
              <rect class="win-lit lit-r" x="917" y="482" width="130" height="92" rx="5" fill="url(#cn-warm)" opacity="0.95"/>
              <line x1="982" y1="482" x2="982" y2="574" stroke="#0F2743" stroke-width="5"/>
            </g>
            <g>
              <rect x="705" y="440" width="190" height="200" rx="8" fill="url(#cn-wall)" stroke="#2E4E74" stroke-width="2"/>
              <rect x="725" y="462" width="150" height="178" rx="5" fill="#142C4C"/>
              <rect class="win-lit lit-core" x="725" y="462" width="150" height="178" rx="5" fill="url(#cn-warm)"/>
              <line x1="775" y1="462" x2="775" y2="640" stroke="#0F2743" stroke-width="5"/>
              <line x1="825" y1="462" x2="825" y2="640" stroke="#0F2743" stroke-width="5"/>
            </g>
            <path class="cine-roof" d="M505 440 L 800 376 L 1095 440 L 1095 456 L 505 456 Z" fill="#0A1B30"/>
            <rect class="cine-flue" x="838" y="398" width="14" height="46" rx="3" fill="#0A1B30"/>
            <g fill="#C9D4E2">
              <circle class="smoke" cx="845" cy="388" r="7"/>
              <circle class="smoke smoke2" cx="845" cy="388" r="9"/>
              <circle class="smoke smoke3" cx="845" cy="388" r="6"/>
            </g>
            <path class="cine-spill" d="M725 653 L 875 653 L 940 722 L 660 722 Z" fill="url(#cn-warm)" fill-opacity="0.14"/>
          </g>

          <path d="M0 656 Q 400 640 800 652 T 1600 648 V 880 H 0 Z" fill="#0A1A2E"/>
        </svg>

        <div class="cinema-ui">
          <div class="cinema-chips" role="group" aria-label="Jump to a stage of the delivery story">
            <button class="cinema-chip" type="button" data-go="0.31"><span class="n">01</span>Delivered</button>
            <button class="cinema-chip" type="button" data-go="0.82"><span class="n">02</span>Unfolds</button>
            <button class="cinema-chip" type="button" data-go="1"><span class="n">03</span>Move in</button>
          </div>
          <input class="cinema-scrub" type="range" min="0" max="1000" value="1000" step="1" aria-label="Scrub through the delivery and unfold animation">
          <div class="cinema-hint">
            <span class="cinema-status" role="status">Move-in ready. Lights on.</span>
            <button class="cinema-replay" type="button">&#8635; Replay</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="why-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">Why Go Tiny Homes</span>
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
            <p>Transports at standard road width, then unfolds on site into a complete two-bedroom home. Real bedrooms, real walls, real doors — engineered hinged construction, not a caravan.</p>
          </article>
          <article class="card reveal reveal-d2">
            <div class="icon">${icons.home}</div>
            <h3>Modern Living</h3>
            <p>Fitted kitchens, full bathrooms with shower, toilet and basin, double-glazed openings and clean modern finishes — complete and liveable as delivered.</p>
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
            <p>Welded steel frames, fire-resistant EPS insulated wall panels, double-glazed openings — and staged factory inspections photographed and shared with you before your home ships.</p>
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
          <h2 id="range-h">One home. Two editions. Zero compromises.</h2>
          <p class="lead center" style="margin-inline:auto">The Model 0206 two-bedroom expandable, in Classic White or the feature-clad Black Edition — same complete layout, two distinct characters.</p>
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
              <tr><th scope="col">Factor</th><th scope="col">Go Tiny Expandable</th><th scope="col">Traditional Build</th><th scope="col">Kit Granny Flat</th><th scope="col">Caravan / Trailer</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Typical cost</th><td>One fixed delivered quote</td><td>$180,000+</td><td>$120,000+</td><td>$60,000–$150,000</td></tr>
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
    title: "Expandable Tiny Homes Australia | Go Tiny Homes",
    description:
      "Premium two-bedroom expandable tiny homes, imported factory-direct and delivered Australia-wide. Fixed delivered quotes, Australian support. Free quotes in 1 business day.",
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
