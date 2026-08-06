import { SITE, icons, layout, breadcrumbs, breadcrumbSchema, ctaBanner } from "../lib/layout.mjs";

const ARTICLES = [
  {
    slug: "how-much-does-a-tiny-home-cost",
    tag: "Pricing",
    date: "2026-06-10",
    minutes: 8,
    title: "How Much Does a Tiny Home Cost in Australia? (2026 Price Guide)",
    metaTitle: "Tiny Home Cost Australia: 2026 Price Guide",
    description:
      "Real 2026 tiny home prices: what $19k–$150k buys, the site costs nobody quotes, and a complete worked budget from deposit to move-in day.",
    excerpt: "What $19k–$150k actually buys, the site costs nobody quotes you, and a complete worked budget from deposit to move-in.",
    content: `
      <p class="lead">The honest answer: a complete, quality tiny home in Australia costs between roughly $20,000 and $150,000+, and the home itself is only 75–85% of your total project budget. Here's the full picture — including the numbers most suppliers leave out.</p>
      <h2>Tiny home prices by type (2026)</h2>
      <table>
        <thead><tr><th>Type</th><th>Typical price range</th><th>What you get</th></tr></thead>
        <tbody>
          <tr><td>Office / studio pod</td><td>$15,000–$35,000</td><td>Insulated single room, powered, no wet areas (or compact bathroom at the top end)</td></tr>
          <tr><td>Expandable tiny home (1 bed)</td><td>$30,000–$55,000</td><td>Complete small home: kitchen, bathroom, bedroom, living</td></tr>
          <tr><td>Expandable home (2–3 bed)</td><td>$55,000–$85,000</td><td>Genuine family-scale dwelling, two bathrooms at the top end</td></tr>
          <tr><td>Tiny house on wheels (THOW)</td><td>$60,000–$150,000+</td><td>Trailer-registered custom build, usually under 30m²</td></tr>
          <tr><td>Kit / site-built granny flat</td><td>$120,000–$200,000+</td><td>Conventional construction, months of trades on site</td></tr>
        </tbody>
      </table>
      <p>Why the huge spread? Three drivers: construction method (factory panel construction is dramatically cheaper than site labour), inclusions (a "from" price that excludes the kitchen is not a price), and the importer's margin structure. Factory-direct models like ours remove a middle layer — that's the difference between a $45,000 and a $70,000 quote for a comparable home. Compare complete models on <a href="products.html">our range page</a>.</p>
      <h2>The costs nobody puts in the brochure</h2>
      <p>Budget for these regardless of who you buy from:</p>
      <ul>
        <li><strong>Site preparation:</strong> $1,500–$8,000 — levelling, pad or piers, access clearing.</li>
        <li><strong>Delivery:</strong> $1,500–$8,000+ depending on distance and access (included as a fixed line in Go Tiny Homes quotes).</li>
        <li><strong>Crane (if needed):</strong> $1,200–$4,000 for tight or sloping sites.</li>
        <li><strong>Service connections:</strong> $2,000–$7,000 for a plumber and electrician to connect power, water and waste — more for long runs or new septic.</li>
        <li><strong>Approvals:</strong> $1,500–$6,000 for certifier/council fees, drawings and reports depending on state and pathway.</li>
      </ul>
      <blockquote>Rule of thumb: take the delivered home price and add 15–25% for a realistic move-in budget on a normal suburban block.</blockquote>
      <h2>A complete worked example</h2>
      <p>Take a Sydney homeowner adding a two-bedroom expandable as a granny flat, with a delivered home price of (say) $55,000: site prep on a level backyard $1,800; complying development approval $3,200; plumber and electrician $3,600. <strong>Total project: about $63,600</strong> — renting a two-bedroom flat at $450+/week, gross payback in around three years. For your own numbers, <a href="quote.html">get a delivered quote</a> for the <a href="product-model-0206-two-bedroom-white.html">Model 0206</a>.</p>
      <h2>Ways to pay less (without buying worse)</h2>
      <ul>
        <li><strong>Choose expandable over site-built</strong> — you're deleting on-site labour, not quality.</li>
        <li><strong>Prepare your own site access</strong> before delivery day; crane hire is charged by the hour.</li>
        <li><strong>Bundle upgrades at order time</strong> — factory-fitted solar or decks cost far less than retrofitting.</li>
        <li><strong>Get a delivered quote, not a "from" price.</strong> If a supplier can't fix the delivery cost to your postcode, the real number arrives later — and it's never smaller.</li>
      </ul>
      <p>Ready for real numbers? <a href="quote.html">Request a free delivered quote</a> for your postcode, or explore <a href="finance.html">what the weekly repayments look like</a>.</p>`,
  },
  {
    slug: "do-tiny-homes-need-council-approval",
    tag: "Approvals",
    date: "2026-05-22",
    minutes: 9,
    title: "Do Tiny Homes Need Council Approval? A State-by-State Guide",
    metaTitle: "Tiny Home Council Approval: State Guide",
    description:
      "When tiny homes need council approval, what's exempt, and the fastest pathways in NSW, VIC, QLD, WA, SA and TAS — in plain English.",
    excerpt: "When you need approval, what's exempt, and the fastest pathway in each state — in plain English, without the scare tactics.",
    content: `
      <p class="lead">Short answer: if people will live in it, plan on getting approval. If it's a backyard office under 10m², you may not need any. Everything between depends on your state, your council and how the home is classified — here's the map.</p>
      <h2>The three questions that decide everything</h2>
      <ol>
        <li><strong>Will someone live in it?</strong> Habitation triggers dwelling standards. A home office or studio has a far easier path than a granny flat.</li>
        <li><strong>Is it fixed or moveable?</strong> Homes on wheels are sometimes treated as caravans (with limits on permanent living); homes on footings are structures needing building approval.</li>
        <li><strong>What's your zoning?</strong> Residential blocks generally allow secondary dwellings; rural zoning often has generous provisions; some coastal and heritage overlays add hurdles.</li>
      </ol>
      <h2>State by state, in brief</h2>
      <table>
        <thead><tr><th>State</th><th>The headline</th></tr></thead>
        <tbody>
          <tr><td>NSW</td><td>Secondary dwellings up to 60m² can use fast-track complying development on eligible blocks — approval in weeks via a private certifier. Structures under 10m² meeting setback rules can be exempt.</td></tr>
          <tr><td>VIC</td><td>Small secondary dwellings ("small second homes") now have a dedicated pathway without a planning permit on many lots; building permit still required.</td></tr>
          <tr><td>QLD</td><td>Secondary dwellings broadly supported and can now be rented separately in most areas; building approval via private certifier is standard.</td></tr>
          <tr><td>WA</td><td>Ancillary dwellings up to 70m² permitted on most residential lots; rural provisions generous.</td></tr>
          <tr><td>SA</td><td>Ancillary accommodation supported through the planning portal; regional councils commonly pragmatic about rural worker and family accommodation.</td></tr>
          <tr><td>TAS</td><td>Secondary residences up to 60m² have a low-barrier pathway on many residential lots.</td></tr>
        </tbody>
      </table>
      <p><em>Rules change and councils vary — treat this as a starting map, confirm locally before ordering. This is general information, not planning advice.</em></p>
      <h2>The fast lanes most buyers miss</h2>
      <ul>
        <li><strong>Under 10m², non-habitable:</strong> in many council areas, structures under 10m² that meet setback and height rules are exempt development — the classic pathway for backyard offices and studios.</li>
        <li><strong>Complying development:</strong> where your block qualifies, a private certifier can approve a granny flat in 2–4 weeks — no council queue.</li>
        <li><strong>Rural land:</strong> farm stays, worker accommodation and family dwellings often enjoy specific provisions that suburban blocks don't.</li>
      </ul>
      <h2>What we provide for your application</h2>
      <p>Every Go Tiny Homes build ships with structural engineering drawings, specification sheets, electrical and waterproofing compliance documentation — the paperwork certifiers actually ask for. We'll also point you to certifiers and planners who have approved expandable homes before, so you're not paying someone to learn on your project.</p>
      <p>Two good next steps: read <a href="blog-can-i-put-a-tiny-home-in-my-backyard.html">Can I Put a Tiny Home in My Backyard?</a> for the suburban specifics, or <a href="quote.html">ask us about the approval pathway</a> for your postcode — we'll tell you honestly how hard or easy your site is.</p>`,
  },
  {
    slug: "can-i-put-a-tiny-home-in-my-backyard",
    tag: "Approvals",
    date: "2026-04-18",
    minutes: 7,
    title: "Can I Put a Tiny Home in My Backyard? Rules, Setbacks & Smart Moves",
    metaTitle: "Tiny Home in Your Backyard: The Rules",
    description:
      "Most Australian backyards can host a tiny home or granny flat. The setbacks, size limits and approval shortcuts to know before you order.",
    excerpt: "Most Australian backyards qualify. The setbacks, size limits and sequencing that make it smooth — or stall it for months.",
    content: `
      <p class="lead">For most suburban blocks the answer is yes — the real questions are what approval type you need, where on the block it can sit, and whether your access allows delivery. Here's how to answer all three before spending a dollar.</p>
      <h2>The three uses, ranked by ease</h2>
      <ol>
        <li><strong>Home office or studio (nobody sleeps there):</strong> easiest. Under 10m² it's often exempt development; under ~20m² it's usually a simple outbuilding approval.</li>
        <li><strong>Guest accommodation / teen retreat:</strong> middle ground — habitable outbuildings need building approval but not always a full secondary-dwelling process if not self-contained.</li>
        <li><strong>Self-contained granny flat (kitchen + bathroom):</strong> a secondary dwelling. More paperwork, but also the version that earns rent and adds property value.</li>
      </ol>
      <h2>The rules that actually bite</h2>
      <ul>
        <li><strong>Setbacks:</strong> typically 900mm–1.5m from side and rear boundaries for small structures (more for dwellings in some states). Measure before you fall in love with a corner.</li>
        <li><strong>Site coverage:</strong> councils cap the share of your block that can be built on — an issue mainly on small lots with big houses.</li>
        <li><strong>Height:</strong> exempt pathways usually cap height around 3–4.3m. Our homes sit near 3m — comfortably under most limits.</li>
        <li><strong>Minimum lot size:</strong> granny-flat fast-tracks often require 450m²+ lots. Smaller blocks can still get approval — just via a DA rather than the fast lane.</li>
        <li><strong>Easements and overlays:</strong> nothing gets built over a sewer easement, and flood/bushfire/heritage overlays add requirements. A $30 planning certificate reveals all of them.</li>
      </ul>
      <blockquote>Order of operations matters: check zoning → check easements → confirm the approval pathway → then order the home. Doing it backwards is how projects stall.</blockquote>
      <h2>Delivery into a backyard</h2>
      <p>A standard side access of about 3.5m lets a tilt-tray place the home directly. Tighter access is routinely solved with a Franna crane lifting over a fence or garage — budget roughly $1,200–$4,000. Because expandable homes travel folded at 2.5m wide, they fit where fixed modular buildings simply can't go — which makes backyard installs a natural fit for them.</p>
      <h2>Which home suits a backyard?</h2>
      <p>The <a href="product-model-0206-two-bedroom-white.html">Model 0206 two-bedroom expandable</a> is a natural backyard secondary dwelling: two real bedrooms, kitchen and full bathroom, transported folded at standard road width so it can be placed where fixed modular buildings can't. Prefer a darker, architectural look? The <a href="product-model-0206-two-bedroom-black.html">Black Edition</a> adds feature cladding and black thermal-break windows.</p>
      <p>Want certainty for your block? <a href="quote.html">Send us your address and a photo of your access</a> — we'll assess deliverability free, before you commit to anything.</p>`,
  },
  {
    slug: "tiny-homes-vs-granny-flats",
    tag: "Comparisons",
    date: "2026-03-30",
    minutes: 7,
    title: "Tiny Homes vs Granny Flats: Which Is Right for Your Block?",
    metaTitle: "Tiny Home vs Granny Flat: Compared",
    description:
      "Costs, timelines, approvals, rental returns and resale value compared honestly — including the cases where the granny flat wins.",
    excerpt: "Cost, speed, approvals, rent and resale compared honestly — including the scenarios where the site-built granny flat genuinely wins.",
    content: `
      <p class="lead">Both put a second dwelling on your block. One costs $120,000–$200,000 and takes most of a year; the other costs $28,000–$80,000 and is liveable within weeks of arrival. But the cheaper option isn't automatically the right one — here's the honest comparison.</p>
      <h2>Head to head</h2>
      <table>
        <thead><tr><th>Factor</th><th>Expandable tiny home</th><th>Site-built granny flat</th></tr></thead>
        <tbody>
          <tr><td>Typical all-in cost</td><td>$35,000–$95,000</td><td>$130,000–$220,000</td></tr>
          <tr><td>Time to occupancy</td><td>3–5 months (mostly lead time)</td><td>6–12 months</td></tr>
          <tr><td>Site disruption</td><td>1–2 days of installation</td><td>Months of trades, deliveries, waste</td></tr>
          <tr><td>Approval</td><td>Same secondary-dwelling pathways</td><td>Same secondary-dwelling pathways</td></tr>
          <tr><td>Relocatable</td><td>Yes — folds and moves</td><td>No</td></tr>
          <tr><td>Financing</td><td>Personal/secured loan, 3–7 yrs</td><td>Usually mortgage top-up</td></tr>
          <tr><td>Added to land value</td><td>Partially (as approved dwelling)</td><td>Substantially (permanent structure)</td></tr>
        </tbody>
      </table>
      <h2>When the tiny home wins</h2>
      <ul>
        <li><strong>Cash-flow projects:</strong> at half to a third of the capital cost, rental payback is 2–4× faster. An expandable granny flat costing ~$60,000 all-in and renting at $450/week grosses ~39% annual yield on cost — no site-built flat gets close.</li>
        <li><strong>Uncertain time horizons:</strong> selling in five years? The home can move to your next property or be sold separately.</li>
        <li><strong>Difficult sites:</strong> steep, tight or remote blocks where site building costs explode.</li>
        <li><strong>Speed:</strong> housing a parent this year, not next year.</li>
      </ul>
      <h2>When the granny flat wins</h2>
      <ul>
        <li><strong>Maximum resale uplift:</strong> a permanent, architect-matched flat on a premium suburb block can return more at sale than its build cost.</li>
        <li><strong>Fully custom footprints:</strong> odd-shaped spaces or matching the main house brick-for-brick.</li>
        <li><strong>Mortgage-rate money:</strong> if you're refinancing anyway, construction debt at home-loan rates is cheap.</li>
      </ul>
      <blockquote>Decision shortcut: optimising for income and flexibility → tiny home. Optimising for maximum long-term property value on a blue-chip block → site-built flat.</blockquote>
      <p>Halfway between the two: the feature-clad <a href="product-model-0206-two-bedroom-black.html">Model 0206 Black Edition</a> reads as architectural rather than transportable. Compare the numbers with the <a href="finance.html">repayment calculator</a>, or read the <a href="blog-how-much-does-a-tiny-home-cost.html">full cost guide</a> first.</p>`,
  },
  {
    slug: "best-tiny-homes-for-airbnb",
    tag: "Investment",
    date: "2026-03-05",
    minutes: 8,
    title: "Best Tiny Homes for Airbnb in Australia: Returns, Setups & Mistakes",
    metaTitle: "Best Tiny Homes for Airbnb: Returns Guide",
    description:
      "What tiny home Airbnbs really earn, the features that drive nightly rates, a worked ROI example, and the five mistakes new hosts make.",
    excerpt: "What tiny home Airbnbs really earn, the features that move nightly rates, and the five mistakes that sink new hosts.",
    content: `
      <p class="lead">Tiny home stays are among the highest-occupancy listings in regional Australia — "unique stays" get surfaced by the platforms themselves. But returns swing wildly on three decisions: location, the cabin itself, and compliance. Here's what the successful operators do.</p>
      <h2>The realistic numbers</h2>
      <p>Well-located, well-styled tiny home listings in regional NSW and VIC typically achieve $180–$350 per night at 55–75% occupancy. A worked example at the modest end:</p>
      <table>
        <thead><tr><th>Item</th><th>Amount</th></tr></thead>
        <tbody>
          <tr><td>Two-bedroom expandable cabin, delivered (example)</td><td>$55,000</td></tr>
          <tr><td>Site prep, approvals, connections, styling</td><td>$14,000</td></tr>
          <tr><td><strong>Total invested</strong></td><td><strong>$69,000</strong></td></tr>
          <tr><td>Income: $220/night × 60% occupancy</td><td>$48,180/yr gross</td></tr>
          <tr><td>Less platform fees, cleaning, running costs (~35%)</td><td>−$16,860</td></tr>
          <tr><td><strong>Net before finance/tax</strong></td><td><strong>≈ $31,300/yr</strong></td></tr>
        </tbody>
      </table>
      <p>That's payback in just over two years. Income is never guaranteed — model your own area on AirDNA or by shadowing comparable listings for a month — but the structural advantage is real: the capital cost is a fraction of a house, while the nightly rate isn't.</p>
      <h2>What actually moves the nightly rate</h2>
      <ul>
        <li><strong>The hero photo.</strong> Guests book on the first image — a striking exterior against your landscape. Feature cladding and black window frames (see the <a href="product-model-0206-two-bedroom-black.html">Black Edition</a>) photograph like an architectural build.</li>
        <li><strong>A genuine bathroom.</strong> Rainfall shower, real toilet. "Compost toilet" in a listing measurably suppresses rate outside the eco niche.</li>
        <li><strong>Climate control.</strong> Reviews mention temperature more than décor. Insulated panel construction plus a split system keeps the 5-star streak alive in February and July.</li>
        <li><strong>One signature outdoor feature.</strong> Fire pit, outdoor tub or deck with a view — the second photo, and the reason guests pay $60/night more.</li>
      </ul>
      <h2>Five mistakes that sink new hosts</h2>
      <ol>
        <li>Skipping council/short-stay registration — some regions cap nights or require permits. Check before you buy land.</li>
        <li>Buying a cheap cabin that photographs cheap. The algorithm punishes mediocre imagery forever.</li>
        <li>Underestimating cleaning logistics on remote blocks — build a local cleaner into the model.</li>
        <li>No owner storage — set aside a lockable cupboard so you're not hauling supplies every turnover.</li>
        <li>Furnishing as a house instead of a stay: fewer, better pieces; hotel linen; a coffee ritual guests photograph.</li>
      </ol>
      <p>Serious about the numbers? <a href="quote.html">Request a quote</a> and mention Airbnb — we'll include a state short-stay compliance checklist with your delivered pricing. For premium positioning, look at the <a href="product-model-0206-two-bedroom-black.html">Model 0206 Black Edition</a>.</p>`,
  },
  {
    slug: "expandable-homes-explained",
    tag: "Education",
    date: "2026-02-12",
    minutes: 6,
    title: "Expandable Homes Explained: How They Work & What to Look For",
    metaTitle: "Expandable Homes Explained: Buyer's Guide",
    description:
      "How expandable homes fold, ship and seal weather-tight — plus the checklist separating premium builds from cheap imports.",
    excerpt: "How the folding actually works, why it ships so cheaply — and the quality checklist that separates premium from junk.",
    content: `
      <p class="lead">An expandable home is a fully finished dwelling engineered to fold to shipping width for transport, then unfold on site into two or three times its transit footprint. Understand how it works and you'll also understand how to spot the difference between a premium build and the cheap imports flooding the market.</p>
      <h2>The mechanics, simply</h2>
      <p>The home has a rigid central core — kitchen, bathroom, all plumbing and the main electrical runs — flanked by hinged wing sections. Each wing carries its own floor, wall and roof panels. On site, the wings rotate out on engineered hinges, floors lock level with the core, roof sections seal over the join, and gaskets compress to make the envelope weather-tight. A trained two-person crew completes it in hours.</p>
      <p>Because all wet areas live in the never-folded core, nothing plumbing-related moves — the single most important reliability decision in the whole design.</p>
      <h2>Why it changes the economics</h2>
      <ul>
        <li><strong>Shipping:</strong> folded at 2.5m wide, it travels as a standard load — no oversize permits, escorts or special routes. That's thousands saved per delivery, and access to sites fixed modular can't reach.</li>
        <li><strong>Labour:</strong> the home is 95% finished in a factory where construction is faster, safer and cheaper than site work.</li>
        <li><strong>Weather:</strong> zero build-time rain delays, and the structure is never wet during construction.</li>
      </ul>
      <h2>The quality checklist (print this)</h2>
      <p>Ask any supplier — including us — these seven questions:</p>
      <ol>
        <li><strong>Steel spec:</strong> is the frame fully welded galvanised steel, or bolted box-section? Ask for the engineering drawings.</li>
        <li><strong>Panel specification:</strong> ask for the wall panel spec in writing — thickness, core material and fire rating — and compare suppliers like for like. A fire-resistant core matters more than headline thickness.</li>
        <li><strong>Glazing:</strong> double glazed throughout, or only in the brochure photo?</li>
        <li><strong>Hinge and seal engineering:</strong> what's the gasket system at the fold joins, and how many open/close cycles is it rated for?</li>
        <li><strong>Compliance paperwork:</strong> AS/NZS 3000 electrical certification, AS 3740 waterproofing, structural engineering to AS/NZS 1170 — documents, not assurances.</li>
        <li><strong>Inspection evidence:</strong> will you see staged photo reports of <em>your</em> home, or a stock factory video?</li>
        <li><strong>Warranty domicile:</strong> who honours the warranty, from where, with parts stocked in which country?</li>
      </ol>
      <blockquote>A supplier who answers all seven in writing is selling a home. One who changes the subject is selling a container with windows.</blockquote>
      <p>See how we answer them on the <a href="about.html">About page</a>, walk through the fold animation on <a href="why-expandable-homes.html">Why Expandable</a>, or go straight to the <a href="products.html">range</a>.</p>`,
  },
];

/* Upcoming topics shown without links (no dead pages) */
const UPCOMING = [
  ["Guides", "Modular Homes Explained: Types, Costs & Compliance"],
  ["Guides", "Portable Homes Guide: Cabins, Pods & Demountables Compared"],
  ["Rural", "Tiny Homes for Farms: Workers' Quarters to Farm-Stay Income"],
  ["Investment", "The Tiny Home Investment Guide: Yields, Depreciation & Exit"],
];

function articlePage(a) {
  const path = `blog-${a.slug}.html`;
  const related = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);
  const body = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbs([["Home", "index.html"], ["Blog", "blog.html"], [a.tag, path]])}
        <span class="eyebrow">${a.tag}</span>
        <h1 style="max-width:26ch">${a.title}</h1>
        <div class="post-meta" style="color:#93A5BB"><span>Go Tiny Homes Editorial</span><span>Updated ${new Date(a.date + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</span><span>${a.minutes} min read</span></div>
      </div>
    </section>
    <section class="section section-white">
      <div class="wrap-narrow prose reveal">${a.content}
      </div>
    </section>
    <section class="section" aria-labelledby="rel-h">
      <div class="wrap">
        <h2 id="rel-h" class="center reveal" style="font-size:var(--fs-700)">Keep reading</h2>
        <div class="grid grid-3" style="margin-top:2rem">
          ${related.map((r) => `<a class="card blog-card reveal" href="blog-${r.slug}.html"><span class="tag">${r.tag}</span><h3>${r.title}</h3><p>${r.excerpt}</p><span class="card-link">Read article ${icons.arrow}</span></a>`).join("\n          ")}
        </div>
      </div>
    </section>
    ${ctaBanner("Research done. Want real numbers?", "A free delivered quote for your postcode answers more than another hour of reading — and commits you to nothing.")}
`;
  return {
    path,
    html: layout({
      path,
      title: `${a.metaTitle} | ${SITE.name}`,
      description: a.description,
      body,
      active: "blog.html",
      ogType: "article",
      schema: [
        breadcrumbSchema([["Home", ""], ["Blog", "blog.html"], [a.title, path]]),
        {
          "@type": "BlogPosting",
          "@id": `${SITE.url}/${path}#article`,
          headline: a.title,
          description: a.description,
          datePublished: a.date,
          dateModified: a.date,
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@id": `${SITE.url}/#organization` },
          mainEntityOfPage: `${SITE.url}/${path}`,
        },
      ],
    }),
  };
}

const indexBody = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbs([["Home", "index.html"], ["Blog", "blog.html"]])}
        <span class="eyebrow">Guides &amp; insights</span>
        <h1>The Tiny Home Knowledge Base</h1>
        <p class="lead">Research-grade guides on pricing, approvals, investment returns and construction — written to answer the question, not to hide the answer behind a phone call.</p>
      </div>
    </section>
    <section class="section section-white">
      <div class="wrap">
        <div class="grid grid-3">
          ${ARTICLES.map((a, i) => `
          <a class="card blog-card reveal reveal-d${i % 3}" href="blog-${a.slug}.html">
            <span class="tag">${a.tag}</span>
            <h3>${a.title}</h3>
            <p>${a.excerpt}</p>
            <div class="post-meta" style="margin:0.75rem 0 0"><span>${a.minutes} min read</span></div>
            <span class="card-link">Read article ${icons.arrow}</span>
          </a>`).join("")}
        </div>
        <div class="center reveal" style="margin-top:3.5rem">
          <h2 style="font-size:var(--fs-600)">Coming soon</h2>
          <ul class="pill-list" style="justify-content:center;margin-top:1rem">
            ${UPCOMING.map(([tag, t]) => `<li>${t}</li>`).join("\n            ")}
          </ul>
          <p class="muted" style="margin-top:1rem;font-size:var(--fs-300)">Want one of these prioritised? <a href="mailto:${SITE.email}">Tell us what you're researching</a>.</p>
        </div>
      </div>
    </section>
    ${ctaBanner("Prefer answers about your exact situation?", "Skip the general guides — send us your postcode and plans for specific, honest advice and delivered pricing.")}
`;

export const pages = [
  {
    path: "blog.html",
    html: layout({
      path: "blog.html",
      title: "Tiny Home Guides & Advice | Go Tiny Homes",
      description:
        "Straight-talking tiny home guides: 2026 costs, council approval by state, Airbnb returns, granny flat comparisons and expandable construction explained.",
      body: indexBody,
      active: "blog.html",
      schema: [
        breadcrumbSchema([["Home", ""], ["Blog", "blog.html"]]),
        {
          "@type": "Blog",
          "@id": `${SITE.url}/blog.html#blog`,
          name: "Go Tiny Homes Blog",
          blogPost: ARTICLES.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: `${SITE.url}/blog-${a.slug}.html` })),
        },
      ],
    }),
  },
  ...ARTICLES.map(articlePage),
];
