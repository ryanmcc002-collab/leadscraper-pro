import { SITE, icons, layout, breadcrumbs, breadcrumbSchema, faqItem, faqSchema, ctaBanner } from "../lib/layout.mjs";

const DEL_FAQS = [
  ["How much does delivery cost?", "It's included as a fixed line item in every quote, calculated for your exact postcode and site access. As a guide: metro deliveries typically add $1,500–$4,000, regional $3,000–$8,000, and remote sites are quoted individually. You'll always know before you commit."],
  ["Can you deliver to remote and rural properties?", "Yes — it's a specialty. Because expandable homes travel at standard road width, our carriers can reach properties that fixed modular homes physically can't — from outback stations to island sites. Remote deliveries are quoted individually so you know the exact cost up front."],
  ["What site access do I need?", "A truck needs roughly 3.5m width and 4.5m height clearance to your pad, and room to slide or crane the home off. Tight access isn't a dealbreaker — smaller models can be walked in with a Franna crane. Send us photos and we'll assess for free."],
  ["Who handles customs and quarantine?", "We do, entirely. Import clearance, duties, GST and quarantine inspection are all managed by our freight team and included in your delivered price."],
];

const body = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbs([["Home", "index.html"], ["Delivery", "delivery.html"]])}
        <span class="eyebrow">Factory to front door</span>
        <h1>Delivery, handled end-to-end</h1>
        <p class="lead">Factory to keys in hand — one team owns every step.</p>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="steps-h">
      <div class="wrap-narrow">
        <h2 id="steps-h" class="center reveal">The seven stages of your delivery</h2>
        <div class="steps reveal" style="margin-top:2.5rem">
          <div class="step"><div><h3>Factory build</h3><p>Your home is built indoors to your locked-in specification. Frame-stage inspection verifies steel, welds and structure before walls close them in — you receive the photo report.</p></div></div>
          <div class="step"><div><h3>Fit-out inspection</h3><p>Midway, independent inspectors check waterproofing, electrical, plumbing and insulation. Anything below standard is rectified before finishing continues.</p></div></div>
          <div class="step"><div><h3>Pre-shipment inspection &amp; folding</h3><p>A final full-home inspection, then the wings are folded, sealed and the home is secured for ocean transit with humidity protection.</p></div></div>
          <div class="step"><div><h3>Shipping</h3><p>Your home travels to the nearest Australian port — typically 3–5 weeks. You get the vessel name and tracking so you can literally watch it come to you.</p></div></div>
          <div class="step"><div><h3>Australian customs &amp; quarantine</h3><p>Our licensed customs broker manages clearance, duties and biosecurity inspection. All costs are already in your delivered price.</p></div></div>
          <div class="step"><div><h3>Transport &amp; installation</h3><p>A carrier delivers to your site on the scheduled day. The home is positioned, levelled, expanded and weather-sealed — usually within one working day.</p></div></div>
          <div class="step"><div><h3>Connection &amp; handover</h3><p>Licensed local trades connect power, water and waste. We complete a documented walkthrough with you, hand over the compliance and handover paperwork — and the keys.</p></div></div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="map-h">
      <div class="wrap two-col">
        <div class="reveal">
          <span class="eyebrow">Coverage</span>
          <h2 id="map-h">Every state. Every territory. Genuinely.</h2>
          <p class="lead">Standard road-width transport means no escort vehicles and no oversize permits — so the map isn't marketing, it's logistics.</p>
          <ul class="checklist" style="margin-top:1.5rem">
            <li>${icons.check}<span><strong>Metro:</strong> Sydney, Melbourne, Brisbane, Perth, Adelaide, Hobart, Darwin, Canberra</span></li>
            <li>${icons.check}<span><strong>Regional:</strong> daily carrier routes on every major corridor</span></li>
            <li>${icons.check}<span><strong>Remote:</strong> stations, islands and mine sites — individually quoted up front</span></li>
          </ul>
        </div>
        <div class="media-frame reveal reveal-d1"><img src="assets/img/map-au.svg" alt="Australia-wide delivery map with routes to all capital cities and regional centres" loading="lazy" width="900" height="720"></div>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="dfaq-h">
      <div class="wrap-narrow">
        <div class="center reveal"><span class="eyebrow eyebrow-center">Delivery questions</span><h2 id="dfaq-h">The details people ask about</h2></div>
        <div style="margin-top:2rem" class="reveal">
          ${DEL_FAQS.map(([q, a]) => faqItem(q, a)).join("\n          ")}
        </div>
        <p class="center" style="margin-top:1.5rem"><a class="card-link" href="faq.html">More in the full FAQ ${icons.arrow}</a></p>
      </div>
    </section>

    ${ctaBanner(
      "How much to deliver to your postcode?",
      "Send your postcode and a few site photos — we'll confirm access and give you a fixed delivered price, free."
    )}
`;

export const page = {
  path: "delivery.html",
  html: layout({
    path: "delivery.html",
    title: "Australia-Wide Tiny Home Delivery | Go Tiny Homes",
    description:
      "Factory inspections, shipping, customs, transport and one-day installation — fixed delivered pricing to metro, regional and remote sites Australia-wide.",
    body,
    active: "delivery.html",
    schema: [
      breadcrumbSchema([["Home", ""], ["Delivery", "delivery.html"]]),
      faqSchema(`${SITE.url}/delivery.html#faq`, DEL_FAQS),
    ],
  }),
};
