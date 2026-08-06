import { SITE, icons, layout, faqItem, faqSchema } from "../lib/layout.mjs";

const FAQS = [
  ["How much does the Model 0206 cost delivered?", `We quote one fixed delivered price for your postcode — home, shipping, customs, transport and installation, GST included. Free, within a business day. <a href="#quote">Request yours</a> or read the <a href="blog-how-much-does-a-tiny-home-cost.html">cost guide</a>.`],
  ["Do I need council approval?", `Usually, if someone will live in it. We supply the specification documents your certifier needs — see the <a href="blog-do-tiny-homes-need-council-approval.html">state-by-state guide</a>.`],
  ["How big is it?", `Expanded: 6.2m long, 6.14m wide and 2.53m high — about 38 m&sup2; with two bedrooms, living/dining, a fitted kitchen and a full bathroom. It folds to standard road width for transport.`],
  ["How long does delivery take?", `Your quote includes the current factory and shipping timeline — typically a few months end to end. Installation itself takes about a day.`],
  ["What arrives on the truck?", `The complete home, folded — bedrooms, kitchen cabinetry, bathroom, flooring, wiring and glazing already fitted. On site it expands to its full footprint and is connected to services by licensed local trades.`],
  ["What's the difference between the two editions?", `The layout is identical. Classic White: white EPS panels, RAL 7015 light-grey frame, white grid windows. Black Edition: 20mm feature cladding, matte black RAL 9011 frame and door, thermal-break aluminium windows with fly screens.`],
  ["Can I finance it?", `Yes — typically a secured personal loan, chattel mortgage (business) or home equity. The <a href="#finance">calculator above</a> models repayments at your numbers.`],
  ["Is my deposit protected?", `Your deposit is held against a signed agreement with staged payments tied to build milestones you verify through inspection photo reports. The balance is only payable when your home lands in Australia and passes final inspection. Consumer guarantees under Australian Consumer Law apply.`],
];

const body = `
    <section class="hero hero-cinema">
      <div class="wrap hero-top">
        <div class="hero-copy">
          <h1>A real two-bedroom home, <em>delivered on one truck</em></h1>
          <p class="lead">The Model 0206 expandable — 38&nbsp;m&sup2;, factory-built, one fixed delivered quote.</p>
          <div class="hero-actions">
            <a class="btn btn-gold btn-lg" href="#quote">Get a Free Quote ${icons.arrow}</a>
            <a class="btn btn-ghost btn-lg" href="#quote">${icons.doc} Download Brochure</a>
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
    <section class="section section-navy" aria-label="Key numbers">
      <div class="wrap">
        <div class="stats reveal">
          <div><div class="num" data-count="38" data-suffix="&nbsp;m&sup2;">0</div><div class="label">Expanded footprint</div></div>
          <div><div class="num" data-count="2.5" data-suffix="m" data-decimals="1">0</div><div class="label">Wide on the truck</div></div>
          <div><div class="num" data-count="1" data-suffix="-day">0</div><div class="label">Typical installation</div></div>
          <div><div class="num" data-count="3" data-suffix="&times;">0</div><div class="label">Staged factory inspections</div></div>
        </div>
      </div>
    </section>

    <section class="section section-white" id="home" aria-labelledby="home-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="sec-num" aria-hidden="true">01</span>
          <span class="eyebrow eyebrow-center">The home</span>
          <h2 id="home-h">Meet the <em>Model 0206</em></h2>
          <p class="lead center" style="margin-inline:auto">Two real bedrooms, a fitted kitchen and a full bathroom in 38&nbsp;m&sup2; — built in the factory, unfolded on your site.</p>
        </div>
        <div class="two-col" style="margin-top:3rem;align-items:start">
          <div class="reveal">
            <table class="spec-table">
              <tbody>
                <tr><th scope="row">Expanded size</th><td>L6.2m &times; W6.14m &times; H2.53m</td></tr>
                <tr><th scope="row">Footprint</th><td>&asymp;38 m&sup2; — two bedrooms, living/dining, kitchen, bathroom</td></tr>
                <tr><th scope="row">Transport</th><td>Folds to standard road width — one truck, no escorts or permits</td></tr>
                <tr><th scope="row">Weight</th><td>From 3,345 kg</td></tr>
                <tr><th scope="row">Structure</th><td>Welded steel frame, 50mm fire-resistant EPS wall panels</td></tr>
                <tr><th scope="row">Bathroom</th><td>Toilet, basin and shower — fitted at the factory</td></tr>
                <tr><th scope="row">Kitchen</th><td>Fitted cabinetry, ready for your appliances</td></tr>
                <tr><th scope="row">Flooring</th><td>016 PVC timber-look flooring throughout</td></tr>
                <tr><th scope="row">Electrical</th><td>Australian standard, 240V</td></tr>
              </tbody>
            </table>
            <p class="muted" style="margin-top:1rem;font-size:var(--fs-300)">Specifications from the current production order sheets. Your delivered quote includes the full dimensioned drawings.</p>
          </div>
          <div class="reveal reveal-d1">
            <div class="media-frame" style="background:#fff"><img src="assets/img/floorplan-model-0206-two-bedroom-white.svg" alt="Model 0206 floor plan: living, dining and kitchen on one wing, both bedrooms on the other, bathroom and entry at the centre" loading="lazy" width="1000" height="560"></div>
            <figure class="media-frame" style="margin:1rem 0 0"><img src="assets/photos/interior-hall.webp" alt="Looking across the kitchen to both bedroom doors inside the Model 0206" loading="lazy" style="aspect-ratio:16/10;object-fit:cover;object-position:50% 60%"></figure>
            <p class="muted" style="font-size:var(--fs-300);margin-top:0.75rem">The layout as built — both bedrooms open off the central hall.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="editions" aria-labelledby="editions-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="sec-num" aria-hidden="true">02</span>
          <span class="eyebrow eyebrow-center">Two editions</span>
          <h2 id="editions-h">Same home. <em>Choose your exterior.</em></h2>
        </div>
        <div class="editions" style="margin-top:2.5rem">
          <a class="edition reveal" href="#quote" data-model="model-0206-two-bedroom-white">
            <img src="assets/photos/white-factory-1.webp" alt="Model 0206 Classic White fully expanded, white panels with grid-design windows" loading="lazy">
            <div class="edition-overlay">
              <span class="edition-tag">Model 0206 &middot; Two bedrooms</span>
              <h3>Classic White</h3>
              <p>White EPS panels, RAL 7015 light-grey frame, white grid windows with net shades. Bright and timeless.</p>
              <span class="edition-cta">Get a delivered quote ${icons.arrow}</span>
            </div>
          </a>
          <a class="edition reveal reveal-d1" href="#quote" data-model="model-0206-two-bedroom-black">
            <img src="assets/photos/hero-backyard.webp" alt="Model 0206 Black Edition with timber-look cladding in a landscaped backyard" loading="lazy">
            <div class="edition-overlay">
              <span class="edition-tag">Model 0206 &middot; Two bedrooms</span>
              <h3>Black Edition</h3>
              <p>20mm feature cladding, matte black RAL 9011 frame and door, thermal-break aluminium windows with fly screens.</p>
              <span class="edition-cta">Get a delivered quote ${icons.arrow}</span>
            </div>
          </a>
        </div>
        <div class="table-scroll reveal" style="margin-top:2.5rem">
          <table class="compare">
            <thead>
              <tr><th scope="col">What differs</th><th scope="col">Classic White</th><th scope="col">Black Edition</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">Wall panels</th><td>50mm fire-resistant white EPS</td><td>50mm EPS + 20mm exterior feature cladding</td></tr>
              <tr><th scope="row">Frame &amp; entrance door</th><td>RAL 7015 light grey, white interior</td><td>RAL 9011 matte black</td></tr>
              <tr><th scope="row">Windows</th><td>White plastic-steel, grid design, net shades</td><td>Thermal-break aluminium, fly screens</td></tr>
              <tr><th scope="row">Glazing</th><td class="yes">Double-glazed door &amp; window</td><td class="yes">Double-glazed door &amp; window</td></tr>
              <tr><th scope="row">Layout, kitchen &amp; bathroom</th><td class="yes">Identical</td><td class="yes">Identical</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section section-white" id="inside" aria-labelledby="inside-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="sec-num" aria-hidden="true">03</span>
          <span class="eyebrow eyebrow-center">Step inside</span>
          <h2 id="inside-h">Complete and liveable, <em>as delivered</em></h2>
          <p class="lead center" style="margin-inline:auto">Photographed in current production units.</p>
        </div>
        <div class="grid grid-3 reveal" style="margin-top:2.5rem">
          <figure class="media-frame" style="margin:0"><img src="assets/photos/interior-dining.webp" alt="Dining area with table and chairs inside the Model 0206" loading="lazy"></figure>
          <figure class="media-frame" style="margin:0"><img src="assets/photos/interior-kitchen.webp" alt="Fitted kitchen with cabinetry, oven and fridge inside the Model 0206" loading="lazy"></figure>
          <figure class="media-frame" style="margin:0"><img src="assets/photos/interior-living.webp" alt="Living area with sofa and double glass doors inside the Model 0206" loading="lazy"></figure>
          <figure class="media-frame" style="margin:0"><img src="assets/photos/interior-bedroom.webp" alt="Furnished bedroom with double bed and curtains inside the Model 0206" loading="lazy"></figure>
          <figure class="media-frame" style="margin:0"><img src="assets/photos/interior-bathroom.webp" alt="Bathroom with shower, vanity and toilet inside the Model 0206" loading="lazy"></figure>
          <figure class="media-frame" style="margin:0"><img src="assets/photos/interior-empty.webp" alt="Inside the Model 0206 with both wings expanded, before fit-out — full-height ceilings" loading="lazy"></figure>
        </div>
      </div>
    </section>

    <section class="section" id="delivery" aria-labelledby="delivery-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="sec-num" aria-hidden="true">04</span>
          <span class="eyebrow eyebrow-center">Delivery, handled end-to-end</span>
          <h2 id="delivery-h">From our factory <em>to your front door</em></h2>
        </div>
        <div class="two-col" style="margin-top:3rem">
          <div class="reveal">
            <figure class="media-frame" style="margin:0"><img src="assets/photos/factory-gate.webp" alt="A Model 0206 Classic White outside the factory, ready for folding and shipping" loading="lazy"></figure>
            <p class="muted" style="font-size:var(--fs-300);margin-top:0.75rem">A Model 0206 leaving the production line.</p>
          </div>
          <div class="reveal reveal-d1">
            <p class="lead">It folds to 2.5m and travels on one standard truck — no escort vehicles, no oversize permits. The wings unfold on your site the same day.</p>
            <div class="steps" style="margin-top:1.75rem">
              <div class="step"><div><h3>Built &amp; inspected</h3><p>Factory-built to your locked-in specification, with three staged inspections — you receive every photo report.</p></div></div>
              <div class="step"><div><h3>Shipped &amp; cleared</h3><p>Ocean freight, customs, duties and quarantine — all handled by us, all inside your delivered price.</p></div></div>
              <div class="step"><div><h3>Delivered &amp; unfolded</h3><p>Positioned, levelled, expanded and weather-sealed — usually within one working day.</p></div></div>
              <div class="step"><div><h3>Connected &amp; handed over</h3><p>Licensed local trades connect services. Documented walkthrough, paperwork, keys.</p></div></div>
            </div>
          </div>
        </div>
        <div class="two-col" style="margin-top:3.5rem">
          <div class="reveal">
            <h3 style="font-size:var(--fs-600)">Every state. Every territory. <em>Genuinely.</em></h3>
            <p class="lead" style="margin-top:0.75rem">Standard road-width transport means the map isn't marketing — it's logistics.</p>
            <ul class="checklist" style="margin-top:1.5rem">
              <li>${icons.check}<span><strong>Metro:</strong> all eight capital cities</span></li>
              <li>${icons.check}<span><strong>Regional:</strong> daily carrier routes on every major corridor</span></li>
              <li>${icons.check}<span><strong>Remote:</strong> stations, islands and mine sites — quoted up front</span></li>
            </ul>
          </div>
          <div class="media-frame reveal reveal-d1"><img src="assets/img/map-au.svg" alt="Australia-wide delivery map with routes to all capital cities and regional centres" loading="lazy" width="900" height="720"></div>
        </div>
      </div>
    </section>

    <section class="section section-white" id="about" aria-labelledby="about-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="sec-num" aria-hidden="true">05</span>
          <span class="eyebrow eyebrow-center">Why trust us</span>
          <h2 id="about-h">Inspection isn't a promise. <em>It's a process.</em></h2>
          <p class="lead center" style="margin-inline:auto">We tour the factories we buy from and hold direct manufacturing agreements — no trading companies, no middlemen. Every home passes three staged inspections before it ships, and you receive the photo reports as yours is built.</p>
        </div>
        <div class="grid grid-2 reveal" style="margin-top:2.5rem">
          <figure class="media-frame" style="margin:0"><img src="assets/photos/factory-yard.webp" alt="A Model 0206 expanded for inspection in the manufacturer's yard" loading="lazy"></figure>
          <figure class="media-frame" style="margin:0"><img src="assets/photos/black-factory-2.webp" alt="Model 0206 fully expanded on the factory floor during pre-shipment inspection" loading="lazy"></figure>
        </div>
        <div class="grid grid-3" style="margin-top:2.5rem">
          <div class="card reveal">
            <div class="icon">${icons.doc}</div>
            <h3>The quote is the price</h3>
            <p>Itemised, fixed for 60 days, GST included. Site extras are written line items before you commit.</p>
          </div>
          <div class="card reveal reveal-d1">
            <div class="icon">${icons.shield}</div>
            <h3>Proof before payment</h3>
            <p>Progress payments only after you've seen inspection photos of your own build.</p>
          </div>
          <div class="card reveal reveal-d2">
            <div class="icon">${icons.phone}</div>
            <h3>Support that answers</h3>
            <p>One Sydney-based project manager, first call to handover. Parts ship from Australia.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="finance" aria-labelledby="finance-h">
      <div class="wrap">
        <div class="two-col" style="align-items:start">
          <div class="reveal">
            <span class="sec-num" aria-hidden="true">06</span>
            <span class="eyebrow">Finance</span>
            <h2 id="finance-h">Run your numbers</h2>
            <p class="lead">Most owners finance with a secured personal loan or home equity. Drag the sliders — indicative only, not financial advice.</p>
            <ul class="checklist" style="margin-top:1.5rem">
              <li>${icons.check}<span>Terms from 3 to 7 years with most lenders</span></li>
              <li>${icons.check}<span>Business buyers: chattel mortgage + GST credits</span></li>
              <li>${icons.check}<span>Rental income often covers repayments — model your local rents conservatively</span></li>
            </ul>
          </div>
          <div class="form-card reveal reveal-d1" data-calc>
            <div class="calc">
              <div class="row">
                <div class="vals"><span>Amount financed</span><span id="calc-amount-val">$55,000</span></div>
                <input type="range" id="calc-amount" min="20000" max="120000" step="500" value="55000" aria-label="Amount financed">
              </div>
              <div class="row">
                <div class="vals"><span>Deposit</span><span id="calc-deposit-val">$10,000</span></div>
                <input type="range" id="calc-deposit" min="0" max="60000" step="500" value="10000" aria-label="Deposit">
              </div>
              <div class="row">
                <div class="vals"><span>Loan term</span><span id="calc-years-val">7 years</span></div>
                <input type="range" id="calc-years" min="3" max="7" step="1" value="7" aria-label="Loan term in years">
              </div>
              <div class="row">
                <div class="vals"><span>Interest rate</span><span id="calc-rate-val">9.0% p.a.</span></div>
                <input type="range" id="calc-rate" min="6" max="16" step="0.5" value="9" aria-label="Interest rate">
              </div>
              <div class="calc-result">
                <div class="per">Estimated monthly repayment</div>
                <div class="amount" id="calc-result">$803</div>
                <div class="per">Indicative only. Confirm figures with your lender or adviser.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-white" id="faq" aria-labelledby="faq-h">
      <div class="wrap-narrow">
        <div class="center reveal">
          <span class="sec-num" aria-hidden="true">07</span>
          <span class="eyebrow eyebrow-center">Straight answers</span>
          <h2 id="faq-h">Frequently asked <em>questions</em></h2>
        </div>
        <div style="margin-top:2rem" class="reveal">
          ${FAQS.map(([q, a]) => faqItem(q, a)).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section" id="quote" aria-labelledby="quote-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="sec-num" aria-hidden="true">08</span>
          <span class="eyebrow eyebrow-center">Free &middot; no obligation &middot; one business day</span>
          <h2 id="quote-h">Get your <em>delivered price</em></h2>
          <p class="lead center" style="margin-inline:auto">Postcode and plans in — delivered pricing, drawings and lead times back within one business day.</p>
        </div>
        <div class="quote-grid" style="margin-top:2.5rem">
          <form class="form-card reveal" data-enquiry novalidate aria-label="Quote request form" id="quote-form">
            <div class="form-grid">
              <div class="field"><label for="q-name">Full name *</label><input id="q-name" name="name" type="text" autocomplete="name" required></div>
              <div class="field"><label for="q-phone">Phone *</label><input id="q-phone" name="phone" type="tel" autocomplete="tel" required></div>
              <div class="field"><label for="q-email">Email *</label><input id="q-email" name="email" type="email" autocomplete="email" required></div>
              <div class="field"><label for="q-postcode">Delivery postcode *</label><input id="q-postcode" name="postcode" type="text" inputmode="numeric" pattern="[0-9]{4}" autocomplete="postal-code" required></div>
              <div class="field"><label for="q-model">Which edition?</label>
                <select id="q-model" name="model">
                  <option value="">Not sure yet — recommend one</option>
                  <option value="model-0206-two-bedroom-white">Model 0206 — Classic White</option>
                  <option value="model-0206-two-bedroom-black">Model 0206 — Black Edition</option>
                </select>
              </div>
              <div class="field"><label for="q-purpose">What will it be used for?</label>
                <select id="q-purpose" name="purpose">
                  <option value="">Select&hellip;</option>
                  <option>Primary residence / first home</option>
                  <option>Granny flat / family accommodation</option>
                  <option>Airbnb / holiday accommodation</option>
                  <option>Rural property / farm</option>
                  <option>Investment / rental</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="field full"><label for="q-msg">Anything else? (site access, timing, questions)</label><textarea id="q-msg" name="message"></textarea></div>
            </div>
            <p class="honeypot" aria-hidden="true"><input type="text" name="company_website" tabindex="-1" autocomplete="off"></p>
            <button class="btn btn-gold btn-lg" type="submit" style="width:100%;margin-top:1.5rem">Send my free quote request ${icons.arrow}</button>
            <p class="form-success" role="status">Thank you! Your request is in. A Sydney-based project manager will be in touch within one business day with your delivered pricing.</p>
            <p class="form-note">${icons.lock} Secure enquiry. Your details are never sold or shared.</p>
          </form>
          <div style="display:grid;gap:1.5rem">
            <div class="card reveal reveal-d1">
              <h3>Prefer to talk now?</h3>
              <p class="muted">8am&ndash;6pm AEST, Monday to Saturday.</p>
              <a class="btn btn-navy" href="${SITE.phoneHref}" style="width:100%;margin-top:0.5rem">${icons.phone} Call ${SITE.phone}</a>
              <a class="btn btn-ghost" href="mailto:${SITE.email}" style="width:100%;margin-top:0.75rem">Email us</a>
            </div>
            <div class="card reveal reveal-d2">
              <h3>What happens next</h3>
              <ul class="checklist" style="margin-top:0.75rem">
                <li>${icons.check}<span><strong>One business day:</strong> delivered pricing and drawings for your postcode.</span></li>
                <li>${icons.check}<span><strong>One conversation:</strong> approvals, site prep, finance — no scripts.</span></li>
                <li>${icons.check}<span><strong>Your pace:</strong> the quote stays valid for 60 days.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <script>
      /* Edition panels pre-select their edition in the quote form */
      (function () {
        var sel = document.getElementById("q-model");
        if (!sel) return;
        document.querySelectorAll("[data-model]").forEach(function (a) {
          a.addEventListener("click", function () {
            for (var i = 0; i < sel.options.length; i++) {
              if (sel.options[i].value === a.getAttribute("data-model")) { sel.selectedIndex = i; break; }
            }
          });
        });
      })();
    </script>
`;

export const page = {
  path: "index.html",
  html: layout({
    path: "index.html",
    title: "Expandable Tiny Homes Australia | Model 0206 | Go Tiny Homes",
    description:
      "The Model 0206 two-bedroom expandable tiny home — 38 m&#178;, factory-built, delivered and installed Australia-wide with one fixed quote. Classic White or Black Edition.",
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
      {
        "@type": "Product",
        "@id": `${SITE.url}/#model0206`,
        name: "Model 0206 Two-Bedroom Expandable Home",
        description: "Two-bedroom expandable home, 6.2m x 6.14m x 2.53m expanded (approx. 38 sqm), steel frame with 50mm fire-resistant EPS panels. Available in Classic White and Black Edition.",
        image: `${SITE.url}/assets/photos/og-image.jpg`,
        brand: { "@type": "Brand", name: SITE.name },
      },
      faqSchema(`${SITE.url}/#faq`, FAQS),
    ],
  }),
};
