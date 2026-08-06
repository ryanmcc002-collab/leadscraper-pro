import { SITE, icons, layout, breadcrumbs, breadcrumbSchema, ctaBanner } from "../lib/layout.mjs";

const REASONS = [
  ["truck", "Transport advantages", "An expandable home ships at standard road width — 2.5m — so it travels on a normal truck with no escort vehicles, no oversize permits and no special routes. That's why we can deliver to an inner-Sydney backyard or a station 400km past Broken Hill for a fraction of the cost of moving a fixed modular home."],
  ["clock", "Quick installation", "The wings fold out on engineered hinges and lock down weather-tight in hours. Where a site build needs 20+ trade visits over a year, an expandable home needs a level pad, a day of installation and a plumber and electrician for connections."],
  ["shield", "Modern construction", "Welded steel frames don't warp, rot or feed termites. Fire-resistant EPS insulated wall panels and double-glazed openings keep the home easy to heat and cool, and the whole structure is built indoors — never rained on, never sun-damaged mid-build."],
  ["tag", "Cost savings", "You skip the two biggest costs of conventional building: on-site labour and time. No months of trades, no builder's margin on every fitting, no rent paid while you wait. One fixed delivered quote for a complete home."],
  ["leaf", "Energy efficiency", "Insulated panels, double glazing and airtight construction mean small heating and cooling loads — most owners run a single split system even in Tasmania or Far North Queensland. Add solar and a battery and off-grid living is genuinely practical."],
  ["gem", "Durability", "The same panel and steel technology used in commercial cold storage and mining accommodation — environments far harsher than any backyard. Engineered to AS/NZS 1170 wind actions with site-specific tie-down engineering available for cyclonic regions."],
  ["home", "Investment potential", "A granny flat or cabin that costs $50k and rents for $350/week pays itself off in under four years — then keeps earning. Unlike a caravan, an approved secondary dwelling can also add lasting value to your property."],
  ["bolt", "Environmental benefits", "Factory construction produces a fraction of the waste of a site build, transport is a single truck movement, and the home itself is relocatable — if your plans change, the home moves with you instead of being demolished."],
];

const body = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbs([["Home", "index.html"], ["Why Expandable Homes", "why-expandable-homes.html"]])}
        <span class="eyebrow">The smarter way to build</span>
        <h1>Why expandable homes are winning</h1>
        <p class="lead">How it works, what it saves, and the honest trade-offs.</p>
      </div>
    </section>

    <section class="section section-navy" aria-labelledby="how-h">
      <div class="wrap">
        <div class="center reveal">
          <span class="eyebrow eyebrow-center">The concept in 20 seconds</span>
          <h2 id="how-h">Ships like a container. Lives like a home.</h2>
          <p class="lead center" style="margin-inline:auto">Your home is built and finished in a factory, folded to standard transport width, delivered on one truck, then expanded on site. Hinged wall, floor and roof sections lock into place and seal — turning a single road-legal load into a complete two-bedroom home.</p>
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

    <section class="section section-white" aria-label="Expanded interior">
      <div class="wrap two-col">
        <figure class="media-frame reveal" style="margin:0"><img src="assets/photos/interior-empty.webp" alt="Inside the Model 0206 with both wings expanded, before fit-out" loading="lazy"></figure>
        <div class="reveal reveal-d1">
          <span class="eyebrow">The result</span>
          <h2>Real rooms. Real ceilings.</h2>
          <p class="lead">Both wings deployed — one continuous space with full-height ceilings and timber-look floors, ready for walls and fit-out. Not a caravan interior.</p>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="reasons-h">
      <div class="wrap">
        <div class="center reveal"><span class="eyebrow eyebrow-center">Eight honest reasons</span><h2 id="reasons-h">The case for expandable</h2></div>
        <div class="grid grid-2" style="margin-top:2.5rem">
          ${REASONS.map(([icon, t, d], i) => `<article class="card reveal reveal-d${i % 2}"><div class="icon">${icons[icon]}</div><h3>${t}</h3><p>${d}</p></article>`).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="honest-h">
      <div class="wrap-narrow prose reveal">
        <span class="eyebrow">And the honest fine print</span>
        <h2 id="honest-h" style="margin-top:0">Where expandable homes aren't the answer</h2>
        <p>Premium brands earn trust by telling you what the brochure won't. Three things to know:</p>
        <ul>
          <li><strong>Approvals are your project's critical path.</strong> The home arrives in weeks; council or certifier approval can take longer depending on your state and intended use. Start the approval conversation before you order — <a href="blog-do-tiny-homes-need-council-approval.html">our guide shows you how</a>.</li>
          <li><strong>Sites need preparation.</strong> A reasonably level, accessible pad with services nearby keeps installation simple. Steep, tight or remote sites are all solvable — but budget for cranes, longer service runs or extra transport, which we'll always quote up front.</li>
          <li><strong>Not every use suits every configuration.</strong> Permanent living needs the right approvals and the right specification — we'll tell you plainly what your plans require before you order, not after.</li>
        </ul>
        <p>If, after all that, a conventional build or kit granny flat is genuinely better for your situation — we'll say so. It costs us a sale occasionally. We think it's the only way to earn trust in an industry short on it.</p>
      </div>
    </section>

    ${ctaBanner(
      "See if expandable fits your block",
      "A five-minute conversation about your site, plans and budget will tell you more than five hours of reading. Free, honest, no obligation."
    )}
`;

export const page = {
  path: "why-expandable-homes.html",
  html: layout({
    path: "why-expandable-homes.html",
    title: "Why Expandable Homes? | Go Tiny Homes",
    description:
      "How expandable homes work, why they cost a fraction of a site build, and the honest trade-offs — speed, efficiency, durability and returns explained.",
    body,
    active: "why-expandable-homes.html",
    schema: [breadcrumbSchema([["Home", ""], ["Why Expandable Homes", "why-expandable-homes.html"]])],
  }),
};
