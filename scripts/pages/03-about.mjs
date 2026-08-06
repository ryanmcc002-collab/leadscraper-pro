import { SITE, icons, layout, breadcrumbs, breadcrumbSchema, ctaBanner } from "../lib/layout.mjs";

const body = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbs([["Home", "index.html"], ["About", "about.html"]])}
        <span class="eyebrow">Our story</span>
        <h1>We started as sceptical customers</h1>
        <p class="lead">Go Tiny Homes exists because our founders tried to buy an expandable home — and couldn't find a supplier they'd trust with their own money.</p>
      </div>
    </section>

    <section class="section section-white">
      <div class="wrap-narrow prose reveal">
        <p class="lead">When we first went looking for an expandable home for our own family property, we did what our customers do now: searched "expandable tiny homes Australia" and started making calls.</p>
        <p>What we found was unsettling. Importers who had never visited the factories they bought from. Prices that ballooned once "delivery extras" appeared. Homes that looked sharp in renders and arrived with single glazing, paper-thin walls and no compliance documentation. And when something went wrong? The support line rang out — or answered in a different time zone with no intention of helping.</p>
        <p>The product concept was brilliant. The industry around it wasn't. So we built the company we'd wanted to buy from.</p>
        <h2>Factory relationships, not factory listings</h2>
        <p>We went to the source ourselves. We tour the factories we buy from in person, and we only hold direct manufacturing agreements with factories that build to our written specification — steel grade, insulation, glazing, waterproofing and Australian electrical compliance. No trading companies, no middlemen, no mystery about where your home comes from.</p>
        <figure class="media-frame" style="margin:2rem 0 0"><img src="assets/photos/factory-yard.webp" alt="A Model 0206 expanded for inspection in the manufacturer's yard" loading="lazy"></figure>
        <p class="muted" style="font-size:var(--fs-300);margin-top:0.75rem">On the ground at our manufacturing partner's yard.</p>
        <h2>Inspection isn't a promise. It's a process.</h2>
        <p>Every single home passes three staged quality inspections — frame stage, fit-out stage and pre-shipment — carried out at the factory by independent inspectors. You receive the photo reports as your home is built. If a stage fails, it's rectified before the next begins.</p>
        <figure class="media-frame" style="margin:2rem 0 0"><img src="assets/photos/black-factory-2.webp" alt="Model 0206 fully expanded on the factory floor during inspection" loading="lazy"></figure>
        <p class="muted" style="font-size:var(--fs-300);margin-top:0.75rem">A Model 0206 expanded on the factory floor for pre-shipment inspection.</p>
        <h2>Transparent pricing, delivered</h2>
        <p>The price we quote is the price you pay: home, shipping, customs clearance, quarantine, transport to your site and installation. GST included. If a quote needs a crane or long-distance transport, you'll see it as a line item before you commit — never as a surprise afterwards.</p>
        <h2>Support that answers in an Australian accent</h2>
        <p>Our project managers and after-sales team are based in Sydney. When you call, the person who answers can see your file, your inspection photos and your delivery schedule. Replacement parts ship from our Australian warehouse, not from overseas.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="vmv-h">
      <div class="wrap">
        <h2 id="vmv-h" class="center reveal">What we stand for</h2>
        <div class="grid grid-3" style="margin-top:2.5rem">
          <div class="card reveal"><div class="icon">${icons.gem}</div><h3>Vision</h3><p>An Australia where owning a beautiful, high-quality home is achievable in months — not decades of saving and years of building.</p></div>
          <div class="card reveal reveal-d1"><div class="icon">${icons.bolt}</div><h3>Mission</h3><p>To deliver Australia's best-built expandable homes at honest factory-direct prices, with the kind of service we'd demand as customers ourselves.</p></div>
          <div class="card reveal reveal-d2"><div class="icon">${icons.shield}</div><h3>Values</h3><p>Honesty before the sale. Quality without exception. Support after the handover. If a home isn't right for your block, we'll tell you — and tell you why.</p></div>
        </div>
      </div>
    </section>

    <section class="section section-navy" aria-labelledby="num-h">
      <div class="wrap">
        <div class="center reveal"><span class="eyebrow eyebrow-center">In writing, on every order</span><h2 id="num-h">Our standards, in numbers</h2></div>
        <div class="stats reveal" style="margin-top:2.5rem">
          <div><div class="num" data-count="3" data-suffix="×">0</div><div class="label">Staged inspections per home</div></div>
          <div><div class="num" data-count="1" data-suffix="-day">0</div><div class="label">Typical installation</div></div>
          <div><div class="num" data-count="60" data-suffix="-day">0</div><div class="label">Quote validity</div></div>
          <div><div class="num" data-count="100" data-suffix="%">0</div><div class="label">Prices include GST</div></div>
        </div>
      </div>
    </section>

    ${ctaBanner(
      "Talk to the team behind the homes",
      "Ask us anything — approvals, sites, models, budgets. A real person in Sydney will call you back within one business day."
    )}
`;

export const page = {
  path: "about.html",
  html: layout({
    path: "about.html",
    title: "About Us | Our Story & Quality Process | Go Tiny Homes",
    description:
      "Direct factory relationships, three staged quality inspections per home, transparent delivered pricing and Sydney-based support. Meet Go Tiny Homes.",
    body,
    active: "about.html",
    schema: [
      breadcrumbSchema([["Home", ""], ["About", "about.html"]]),
      { "@type": "AboutPage", "@id": `${SITE.url}/about.html`, name: "About Go Tiny Homes" },
    ],
  }),
};
