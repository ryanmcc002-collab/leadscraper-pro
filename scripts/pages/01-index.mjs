import { SITE, icons, layout, faqItem, faqSchema, ctaBanner } from "../lib/layout.mjs";
import { products } from "../lib/products-data.mjs";

const HOME_FAQS = [
  ["How much does a tiny home cost?", `We quote one fixed delivered price for your postcode — free, within a business day. <a href="quote.html">Request yours</a> or read the <a href="blog-how-much-does-a-tiny-home-cost.html">cost guide</a>.`],
  ["Do I need council approval?", `Usually, if someone will live in it. We supply the documents your certifier needs — see the <a href="blog-do-tiny-homes-need-council-approval.html">state-by-state guide</a>.`],
  ["How long does it take?", `Your quote includes the current factory and shipping timeline. Installation itself takes about a day — <a href="delivery.html">how delivery works</a>.`],
  ["What does 'expandable' mean?", `The home ships folded at road width, then unfolds on site into a full two-bedroom home. <a href="why-expandable-homes.html">See how it works</a>.`],
]

const productCards = products
  .map(
    (p) => `
          <a class="product-card" href="product-${p.slug}.html">
            <div class="media"><span class="badge">${p.badge}</span><img src="assets/photos/${p.photos.card}" alt="${p.photos.cardAlt}" loading="lazy"></div>
            <div class="body">
              <h3>${p.name}</h3>
              <p class="meta">${p.bedrooms} bed &middot; ${p.bathrooms} bath &middot; sleeps ${p.sleeps}</p>
              <div class="price-row"><span class="price" style="font-size:var(--fs-400)">Delivered quote on request</span>${icons.arrow}</div>
            </div>
          </a>`
  )
  .join("");


const body = `
    <section class="hero hero-cinema">
      <div class="wrap hero-top">
        <div class="hero-copy">
          <h1>Premium Expandable Tiny Homes, <em>delivered Australia-wide</em></h1>
          <p class="lead">Two real bedrooms, factory-direct, one fixed delivered price.</p>
          <div class="hero-actions">
            <a class="btn btn-gold btn-lg" href="quote.html">Get a Free Quote ${icons.arrow}</a>
            <a class="btn btn-ghost btn-lg" href="quote.html?brochure=1">${icons.doc} Download Brochure</a>
          </div>
          <div class="hero-trust">
            <span class="item">${icons.shield} Australian owned &amp; supported</span>
            <span class="item">${icons.check} 3 staged factory inspections</span>
            <span class="item">${icons.truck} Delivery to every state</span>
          </div>
        </div>
        <div class="hero-mascot">
          <img src="assets/img/mascot.webp" alt="Go Tiny Homes wombat mascot flexing his bicep" width="480" height="594" fetchpriority="high">
        </div>
      </div>

      <div class="cinema-stage" data-cinema>
        <svg viewBox="0 0 1600 880" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Animated story of a Go Tiny Homes delivery: a truck arrives carrying the folded home, sets it down, and the home unfolds into a full two-bedroom house with lit windows">
          <defs>
            <linearGradient id="cn-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#D8E4EE"/><stop offset="0.55" stop-color="#E7EBDD"/><stop offset="1" stop-color="#F3EFDF"/>
            </linearGradient>
            <radialGradient id="cn-glow" cx="0.78" cy="0.24" r="0.5">
              <stop offset="0" stop-color="#E5C687" stop-opacity="0.35"/><stop offset="1" stop-color="#C99B54" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="cn-h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9C7A1"/><stop offset="1" stop-color="#A2B389"/></linearGradient>
            <linearGradient id="cn-h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CBD6B4"/><stop offset="1" stop-color="#B3C297"/></linearGradient>
            <linearGradient id="cn-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCFCF8"/><stop offset="1" stop-color="#E8EADF"/></linearGradient>
            <linearGradient id="cn-warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8CD91"/><stop offset="1" stop-color="#C99B54"/></linearGradient>
          </defs>

          <rect width="1600" height="880" fill="url(#cn-sky)"/>
          <rect width="1600" height="880" fill="url(#cn-glow)"/>
          <circle cx="1265" cy="300" r="46" fill="#E5C687" opacity="0.9"/>
          <circle cx="1265" cy="300" r="72" fill="#E5C687" opacity="0.15"/>
          
          <path d="M0 520 Q 260 430 560 500 T 1120 480 T 1600 515 V 880 H 0 Z" fill="url(#cn-h1)"/>
          <path d="M0 595 Q 380 525 800 580 T 1600 570 V 880 H 0 Z" fill="url(#cn-h2)"/>

          <!-- gum trees for depth -->
          <g opacity="0.9">
            <path d="M170 656 C 168 566 176 522 170 470" stroke="#55603E" stroke-width="11" fill="none" stroke-linecap="round"/>
            <ellipse cx="170" cy="448" rx="70" ry="42" fill="#75855A"/>
            <ellipse cx="118" cy="430" rx="45" ry="29" fill="#8A9A67"/>
            <ellipse cx="220" cy="426" rx="49" ry="31" fill="#8A9A67"/>
          </g>
          <g opacity="0.85">
            <path d="M1452 656 C 1450 580 1457 545 1452 505 " stroke="#55603E" stroke-width="9" fill="none" stroke-linecap="round"/>
            <ellipse cx="1452" cy="486" rx="56" ry="34" fill="#75855A"/>
            <ellipse cx="1412" cy="470" rx="36" ry="23" fill="#8A9A67"/>
          </g>

          <!-- delivery truck -->
          <g class="cine-truck" transform="translate(-9999 0)">
            <rect x="555" y="596" width="470" height="15" rx="4" fill="#333D26"/>
            <rect x="1018" y="600" width="26" height="12" fill="#333D26"/>
            <rect x="1036" y="520" width="100" height="116" rx="12" fill="#333D26"/>
            <rect x="1052" y="536" width="58" height="36" rx="5" fill="#B8C9D6"/>
            <rect x="1130" y="596" width="9" height="18" rx="2" fill="#E5C687" opacity="0.85"/>
            <g class="cine-wheel" data-cx="622" data-cy="632">
              <circle cx="622" cy="632" r="24" fill="#262E1B" stroke="#55603E" stroke-width="4"/>
              <line x1="622" y1="614" x2="622" y2="650" stroke="#55603E" stroke-width="4"/>
            </g>
            <g class="cine-wheel" data-cx="948" data-cy="632">
              <circle cx="948" cy="632" r="24" fill="#262E1B" stroke="#55603E" stroke-width="4"/>
              <line x1="948" y1="614" x2="948" y2="650" stroke="#55603E" stroke-width="4"/>
            </g>
            <g class="cine-wheel" data-cx="1082" data-cy="632">
              <circle cx="1082" cy="632" r="24" fill="#262E1B" stroke="#55603E" stroke-width="4"/>
              <line x1="1082" y1="614" x2="1082" y2="650" stroke="#55603E" stroke-width="4"/>
            </g>
          </g>

          <!-- the home -->
          <g class="cine-home">
            <rect class="cine-deck" x="505" y="640" width="590" height="13" rx="4" fill="#B98449"/>
            <g class="cine-wing-l">
              <rect x="530" y="450" width="175" height="190" rx="8" fill="#F4F5EF" stroke="#C6CBB8" stroke-width="2"/>
              <rect x="552" y="482" width="130" height="92" rx="5" fill="#42503A"/>
              <rect class="win-lit lit-l" x="552" y="482" width="130" height="92" rx="5" fill="url(#cn-warm)" opacity="0.95"/>
              <line x1="617" y1="482" x2="617" y2="574" stroke="#55603E" stroke-width="5"/>
            </g>
            <g class="cine-wing-r">
              <rect x="895" y="450" width="175" height="190" rx="8" fill="#F4F5EF" stroke="#C6CBB8" stroke-width="2"/>
              <rect x="917" y="482" width="130" height="92" rx="5" fill="#42503A"/>
              <rect class="win-lit lit-r" x="917" y="482" width="130" height="92" rx="5" fill="url(#cn-warm)" opacity="0.95"/>
              <line x1="982" y1="482" x2="982" y2="574" stroke="#55603E" stroke-width="5"/>
            </g>
            <g>
              <rect x="705" y="440" width="190" height="200" rx="8" fill="url(#cn-wall)" stroke="#C6CBB8" stroke-width="2"/>
              <rect x="725" y="462" width="150" height="178" rx="5" fill="#42503A"/>
              <rect class="win-lit lit-core" x="725" y="462" width="150" height="178" rx="5" fill="url(#cn-warm)"/>
              <line x1="775" y1="462" x2="775" y2="640" stroke="#55603E" stroke-width="5"/>
              <line x1="825" y1="462" x2="825" y2="640" stroke="#55603E" stroke-width="5"/>
            </g>
            <path class="cine-roof" d="M505 440 L 800 376 L 1095 440 L 1095 456 L 505 456 Z" fill="#333D26"/>
            <rect class="cine-flue" x="838" y="398" width="14" height="46" rx="3" fill="#333D26"/>
            <g fill="#9AA48B">
              <circle class="smoke" cx="845" cy="388" r="7"/>
              <circle class="smoke smoke2" cx="845" cy="388" r="9"/>
              <circle class="smoke smoke3" cx="845" cy="388" r="6"/>
            </g>
            <path class="cine-spill" d="M725 653 L 875 653 L 940 722 L 660 722 Z" fill="url(#cn-warm)" fill-opacity="0.14"/>
          </g>

          <path d="M0 656 Q 400 640 800 652 T 1600 648 V 880 H 0 Z" fill="#9CAD77"/>
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
          <span class="sec-num" aria-hidden="true">01</span>
          <span class="eyebrow eyebrow-center">Why Go Tiny Homes</span>
          <h2 id="why-h">Everything a site build gives you.<br><em>Without the year of your life.</em></h2>
        </div>
        <div class="bento reveal" style="margin-top:3rem">
          <article class="bento-tile bento-wide">
            <div class="icon">${icons.expand}</div>
            <h3>Expandable by design</h3>
            <p>Ships at road width, unfolds into a real two-bedroom home — not a caravan.</p>
            <div class="bento-figure"><strong>2.5m</strong><span>on the truck</span><strong>&rarr;</strong><strong>2-bed</strong><span>home on site</span></div>
          </article>
          <article class="bento-tile">
            <div class="icon">${icons.clock}</div>
            <h3>Installed in a day</h3>
            <p>Finished at the factory. Expanded on your site in a day.</p>
          </article>
          <article class="bento-tile">
            <div class="icon">${icons.gem}</div>
            <h3>Premium quality</h3>
            <p>Steel frame, fire-resistant panels, double glazing — inspected three times before it ships.</p>
          </article>
          <article class="bento-tile bento-gold">
            <div class="icon" style="background:rgba(51,61,38,0.12);border-color:rgba(51,61,38,0.25);color:var(--navy)">${icons.tag}</div>
            <h3>One fixed delivered quote</h3>
            <p>Home, transport, customs, installation, GST. One number.</p>
            <a class="btn btn-sm" href="quote.html">Get yours free ${icons.arrow}</a>
          </article>
          <article class="bento-tile bento-wide bento-media">
            <img src="assets/photos/black-backyard-angle.webp" alt="Model 0206 Black Edition installed in a backyard, timber-look cladding with black frame" loading="lazy">
            <div class="cap">Installed. Delivered Australia-wide, quoted to your postcode.</div>
          </article>
          <article class="bento-tile">
            <div class="icon">${icons.home}</div>
            <h3>Complete as delivered</h3>
            <p>Kitchen and full bathroom fitted before it leaves the factory.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section-navy" aria-label="Our standards">
      <div class="wrap">
        <div class="stats reveal">
          <div><div class="num" data-count="100" data-suffix="%">0</div><div class="label">Prices include GST</div></div>
          <div><div class="num" data-count="3" data-suffix="×">0</div><div class="label">Staged factory inspections</div></div>
          <div><div class="num" data-count="1" data-suffix="-day">0</div><div class="label">Typical installation</div></div>
          <div><div class="num" data-count="8" data-suffix="/8">0</div><div class="label">States &amp; territories covered</div></div>
        </div>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="range-h">
      <div class="wrap" style="padding-inline:0">
        <div class="wrap center reveal">
          <span class="sec-num" aria-hidden="true">02</span>
          <span class="eyebrow eyebrow-center">The range</span>
          <h2 id="range-h">One home. Two editions. <em>Zero compromises.</em></h2>
          <p class="lead center" style="margin-inline:auto">One layout. Classic White or feature-clad Black.</p>
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

    <section class="section" aria-labelledby="inside-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">Step inside</span>
          <h2 id="inside-h">Complete and liveable, <em>as delivered</em></h2>
        </div>
        <div class="grid grid-3 reveal" style="margin-top:2.5rem">
          <figure class="media-frame" style="margin:0"><img src="assets/photos/interior-dining.webp" alt="Dining and kitchen area with white cabinetry inside the Model 0206" loading="lazy"></figure>
          <figure class="media-frame" style="margin:0"><img src="assets/photos/interior-living.webp" alt="Living area with sofa inside the Model 0206" loading="lazy"></figure>
          <figure class="media-frame" style="margin:0"><img src="assets/photos/interior-bedroom.webp" alt="Bedroom with wardrobe inside the Model 0206" loading="lazy"></figure>
        </div>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="promise-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="sec-num" aria-hidden="true">03</span>
          <span class="eyebrow eyebrow-center">Our commitments</span>
          <h2 id="promise-h">Promises we put <em>in writing</em></h2>
          <p class="lead center" style="margin-inline:auto">In your contract, not just on this page.</p>
        </div>
        <div class="grid grid-3" style="margin-top:2.5rem">
          <div class="card reveal">
            <div class="icon">${icons.doc}</div>
            <h3>The quote is the price</h3>
            <p>Itemised, fixed for 60 days. Site extras are written line items before you commit.</p>
          </div>
          <div class="card reveal reveal-d1">
            <div class="icon">${icons.shield}</div>
            <h3>Proof before payment</h3>
            <p>Progress payments only after you've seen inspection photos of your own build.</p>
          </div>
          <div class="card reveal reveal-d2">
            <div class="icon">${icons.phone}</div>
            <h3>Support that answers</h3>
            <p>One Sydney-based project manager, first call to handover.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="cmp-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="sec-num" aria-hidden="true">04</span>
          <span class="eyebrow eyebrow-center">The honest comparison</span>
          <h2 id="cmp-h">Expandable home <em>vs the alternatives</em></h2>
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
              <tr><th scope="row">Aftercare handled in Australia</th><td class="yes">Yes</td><td>Varies by builder</td><td>Varies</td><td class="no">Rarely</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="hfaq-h">
      <div class="wrap-narrow">
        <div class="center reveal">
          <span class="sec-num" aria-hidden="true">05</span>
          <span class="eyebrow eyebrow-center">Straight answers</span>
          <h2 id="hfaq-h">Frequently asked <em>questions</em></h2>
        </div>
        <div style="margin-top:2rem" class="reveal">
          ${HOME_FAQS.map(([q, a]) => faqItem(q, a)).join("\n          ")}
        </div>
        <p class="center" style="margin-top:1.5rem"><a class="card-link" href="faq.html">See all 40+ questions answered ${icons.arrow}</a></p>
      </div>
    </section>

    ${ctaBanner(
      "Get delivered pricing for your postcode",
      "One number: home, transport, customs, installation. Free, within a business day."
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
