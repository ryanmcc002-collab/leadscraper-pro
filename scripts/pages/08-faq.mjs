import { SITE, icons, layout, breadcrumbs, breadcrumbSchema, faqItem, faqSchema, ctaBanner } from "../lib/layout.mjs";

const CATS = [
  ["Approvals & Regulations", [
    ["Do tiny homes need council approval in Australia?", `Usually, yes — but the pathway depends on use. A permanently occupied dwelling generally needs approval as a secondary dwelling (granny flat) or primary dwelling. Structures under 10m² and some temporary/moveable uses can be exempt in certain states. Read our detailed <a href="blog-do-tiny-homes-need-council-approval.html">state-by-state approval guide</a>.`],
    ["What's the difference between exempt, complying and DA approval?", "Exempt development needs no approval if strict criteria are met (size, setbacks, height). Complying development is a fast-tracked private-certifier approval against a standard checklist — often 2–4 weeks. A Development Application (DA) goes through council and takes longer. We help you identify which pathway your project fits."],
    ["Can I put a tiny home in my backyard?", `On most suburban blocks, yes — as a granny flat, studio or home office, subject to your state's secondary dwelling or outbuilding rules. Our guide <a href="blog-can-i-put-a-tiny-home-in-my-backyard.html">Can I Put a Tiny Home in My Backyard?</a> walks through the rules for every state.`],
    ["Do you help with the approval process?", "Yes. Every home comes with engineering documentation, structural drawings and specification sheets your certifier or council needs. We can also refer you to private certifiers and town planners experienced with expandable homes in your state."],
    ["Are your homes compliant with Australian building standards?", "Homes are engineered to relevant Australian standards including AS/NZS 1170 structural actions, with electrical work to AS/NZS 3000 and waterproofing to AS 3740. Site-specific requirements (wind rating, bushfire BAL, energy) are addressed through your approval pathway — tell us your site early and we'll spec accordingly."],
    ["Can I install one in a cyclone region?", "Yes, with site-specific engineering. Cyclonic regions (C and D) require engineered tie-down systems and, in some cases, glazing upgrades, which we arrange as part of your order. Tell us your region code when you request a quote."],
    ["What about bushfire (BAL) zones?", "Homes can be specified for most BAL ratings with ember guards, metal mesh screens and appropriate external materials. BAL-FZ (flame zone) sites need case-by-case assessment. Include your BAL rating in your quote request."],
  ]],
  ["Site & Installation", [
    ["What foundations does a tiny home need?", "Most homes sit on adjustable steel feet or concrete/screw piers — a full slab is rarely required. The site should be reasonably level (up to ~300mm fall is easily handled) with compacted, stable ground. Your quote includes a foundation recommendation for your site."],
    ["How is plumbing connected?", "Standard fittings connect to mains water and sewer, a septic system or a tank — the same connections any small dwelling uses. A licensed plumber typically completes connections in half a day; we can coordinate trades or work with yours."],
    ["How is electricity connected?", "Every home is wired to Australian-standard 240V at the factory. On site, a licensed electrician connects it to your supply — typically via your switchboard — and certifies the installation."],
    ["Can I go off-grid?", "Genuinely, yes. Solar + battery packages, composting toilets, rain tanks and gas or heat-pump hot water make full off-grid living practical. The insulation performance of panel construction keeps energy loads small enough for a modest solar array to carry."],
    ["How long does installation take?", "Positioning and expansion typically take 3–6 hours; weather sealing and finishing the same day. Service connections by licensed trades usually add half a day. Most customers sleep in their home within a week of delivery."],
    ["Do I need a crane?", "Only for tight-access or sloping sites. Standard sites are unloaded directly from a tilt-tray truck. Where a crane or Franna is needed, it appears as a transparent line item in your quote — never a surprise on the day."],
    ["What site preparation do I need to do?", "Three things: a reasonably level pad, clear access for the truck, and services within practical reach. We send a simple site-prep checklist with every order, and your project manager reviews photos of your site before delivery day."],
  ]],
  ["Construction & Quality", [
    ["What are the walls made of?", "50mm fire-resistant EPS insulated sandwich panels on a welded steel frame — the same panel technology used in commercial cold storage: light, thermally efficient, termite-proof and rot-proof. The Black Edition adds a 20mm exterior feature cladding over the panels."],
    ["How well insulated are the homes?", "Wall, roof and floor panels plus double glazing give thermal performance that surprises building professionals — the same panel systems are used in commercial cold storage, and they're specified to handle climates from alpine Victoria to tropical Queensland."],
    ["Are the windows double glazed?", "The door and window package is double glazed as standard. The Classic White uses plastic-steel framed windows with net shades; the Black Edition upgrades to thermal-break aluminium frames with fly screens."],
    ["Will it withstand Australian conditions?", "The structures are engineered to AS/NZS 1170 wind actions, with cyclone-region packages available. Colour-bonded steel exteriors handle coastal air, UV and hail far better than timber cladding, and there's nothing for termites to eat."],
    ["How long will a tiny home last?", "Structurally, decades — welded steel framing and EPS panel construction don't degrade the way timber does, and there's nothing for termites to eat. Build quality and basic maintenance drive lifespan, which is why every home is inspected three times before it ships."],
    ["Can I customise layouts and finishes?", "Yes. Start by choosing between the Classic White and Black Edition exteriors, then add options — decks, awnings, solar, furniture and appliance packages are scoped with your order and itemised in your delivered quote."],
    ["Are the kitchens and bathrooms really complete?", "The home arrives with fitted kitchen cabinetry and a complete bathroom — toilet, basin and shower — ready for connection by licensed trades. Appliances and any extras are itemised in your quote, so what you see in the specification is exactly what arrives."],
  ]],
  ["Pricing & Buying", [
    ["How much does a tiny home cost in Australia?", `Market-wide, Australian tiny homes run roughly $30,000–$150,000+ depending on size and specification. We quote every order as one fixed delivered price to your postcode rather than publishing list prices — <a href="quote.html">request yours free</a>. Our <a href="blog-how-much-does-a-tiny-home-cost.html">complete cost guide</a> breaks down every cost including site works.`],
    ["Are there hidden costs?", "Not from us — your quote is a delivered price including transport, customs and installation. Costs outside our control (council fees, trade connections, site works if your block needs them) are flagged in writing during your consultation so you can budget the full project."],
    ["Why are you cheaper than a granny flat builder?", "Factory construction eliminates most on-site labour — the single biggest cost in Australian building — and our direct manufacturing agreements remove importer margins. Same materials standards, radically different cost structure."],
    ["How do payments work?", "A deposit secures your build slot, a progress payment is due when your home passes pre-shipment inspection (you'll have the photo report), and the balance is payable on arrival in Australia before delivery. Every payment maps to a milestone you can verify."],
    ["Is finance available?", `Yes — secured personal loans, chattel mortgages for business use, and equity release, typically over terms of 3–7 years. Try the <a href="finance.html">repayment calculator</a> to model weekly repayments on any amount.`],
    ["Do prices include GST?", "Always. Every price on this website and every quote we issue includes GST. Business buyers may be able to claim GST credits — ask your accountant about a chattel mortgage structure."],
    ["What are current lead times?", "Lead times depend on the factory production schedule and shipping. Your quote includes the current timeline, and your order confirmation locks a delivery window."],
  ]],
  ["Aftercare & Support", [
    ["What warranty comes with the home?", "Warranty terms are set out in writing with your quote and order agreement — never as verbal promises. Whatever is agreed is administered from Sydney with parts stocked in Australia, and it sits on top of the consumer guarantees that apply automatically under Australian Consumer Law."],
    ["What if something goes wrong after delivery?", "Call or email our Sydney aftercare team. Minor issues are resolved with couriered parts and guided fixes or a local trade we arrange; anything structural triggers an on-site assessment. Every aftercare request gets a named owner and a written timeline."],
    ["What maintenance does a tiny home need?", "Very little: wash the exterior panels annually (like any colour-bonded structure), keep drainage paths clear, check sealants around wet areas yearly and service the split system as you would in any home. No painting, no restumping, no termite treatments."],
    ["Can the home be relocated later?", "Yes — that's a core advantage. The wings fold back in and the home travels as it arrived. Budget for a crane and transport, and check approvals at the new site. We can manage relocations end-to-end."],
    ["Does support transfer if I sell?", "Yes — aftercare follows the home, not just its first owner, and any written warranty in your order agreement transfers with it. A genuine selling point if you ever move it on."],
  ]],
  ["Living & Practicalities", [
    ["Can I live in a tiny home permanently?", "Thousands of Australians do. Legally it requires dwelling approval (see Approvals above); practically, the Model 0206's two bedrooms, kitchen and full bathroom are exactly the ingredients of a permanent small home."],
    ["How many people can live comfortably?", "The Model 0206 has two genuine bedrooms — comfortable for a couple, a small family, or an owner plus guests or a home office. We'd rather undersell capacity than have you cramped, so tell us your plans and we'll be straight about fit."],
    ["Are tiny homes hot in summer and cold in winter?", "Ours aren't — that's what 100mm insulated panels and double glazing are for. Combined with reverse-cycle air conditioning (standard on every model), owners report comfortable temperatures from Hobart to Cairns on minimal energy."],
    ["What about noise in rain or wind?", "Insulated panel roofs are dramatically quieter than a caravan or shed skillion in rain. In high wind the engineered tie-downs keep the structure solid — expect the ordinary sounds of any well-built small home, not a rattling box."],
    ["Can I run a washing machine, dishwasher and full-size fridge?", "Standard appliances run happily on the home's 240V Australian-standard electrical system. Where each appliance fits depends on your configuration — tell us what you need and we'll confirm placement and provisions in your quote."],
    ["Is insurance available for tiny homes?", "Yes — several Australian insurers cover tiny homes and granny flats, either under a home policy (once approved as a dwelling) or specialist portable-building policies. We provide the construction documentation insurers ask for."],
    ["Do tiny homes hold their value?", "Quality-built steel homes hold value far better than caravans or timber cabins; approved secondary dwellings can add rentable, appraisable value to a property. Like any structure, quality of build and maintenance drive the outcome — another reason the inspection reports matter."],
  ]],
];

const allFaqs = CATS.flatMap(([, faqs]) => faqs);

const toc = CATS.map(([cat]) => `<li><a href="#${cat.toLowerCase().replace(/[^a-z]+/g, "-")}">${cat}</a></li>`).join("");

const sections = CATS.map(
  ([cat, faqs]) => `
        <section class="faq-cat" id="${cat.toLowerCase().replace(/[^a-z]+/g, "-")}" aria-label="${cat}">
          <h2>${cat}</h2>
          ${faqs.map(([q, a]) => faqItem(q, a)).join("\n          ")}
        </section>`
).join("");

const body = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbs([["Home", "index.html"], ["FAQ", "faq.html"]])}
        <span class="eyebrow">${allFaqs.length} questions, answered properly</span>
        <h1>Everything people ask us</h1>
        <p class="lead">No dodges, no "contact us for details" cop-outs. If your question isn't here, call ${SITE.phone} and a human in Sydney will answer it.</p>
      </div>
    </section>

    <section class="section section-white">
      <div class="wrap-narrow">
        <nav aria-label="FAQ categories" class="reveal">
          <ul class="pill-list">${toc}</ul>
        </nav>
        <div style="margin-top:2.5rem">
        ${sections}
        </div>
      </div>
    </section>

    ${ctaBanner(
      "Still weighing it up?",
      "The fastest way to certainty is a ten-minute chat about your block and your plans — free, honest and obligation-free."
    )}
`;

export const page = {
  path: "faq.html",
  html: layout({
    path: "faq.html",
    title: "Tiny Home FAQs | Approvals, Prices & More | Go Tiny Homes",
    description:
      "Council approvals, foundations, insulation, cyclone ratings, aftercare, pricing, lead times and finance — 40 detailed answers on Australian tiny homes.",
    body,
    active: "faq.html",
    schema: [
      breadcrumbSchema([["Home", ""], ["FAQ", "faq.html"]]),
      faqSchema(`${SITE.url}/faq.html#faq`, allFaqs),
    ],
  }),
};
