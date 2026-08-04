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
    ["How is electricity connected?", "Smaller pods use a 15A weatherproof inlet from a suitable house circuit. Larger homes are hardwired to your switchboard by a licensed electrician. Every home ships with a compliant internal switchboard, safety switches and smoke alarms."],
    ["Can I go off-grid?", "Genuinely, yes. Solar + battery packages, composting toilets, rain tanks and gas or heat-pump hot water make full off-grid living practical. The insulation performance of panel construction keeps energy loads small enough for a modest solar array to carry."],
    ["How long does installation take?", "Positioning and expansion typically take 3–6 hours; weather sealing and finishing the same day. Service connections by licensed trades usually add half a day. Most customers sleep in their home within a week of delivery."],
    ["Do I need a crane?", "Only for tight-access or sloping sites. Standard sites are unloaded directly from a tilt-tray truck. Where a crane or Franna is needed, it appears as a transparent line item in your quote — never a surprise on the day."],
    ["What site preparation do I need to do?", "Three things: a reasonably level pad, clear access for the truck, and services within practical reach. We send a simple site-prep checklist with every order, and your project manager reviews photos of your site before delivery day."],
  ]],
  ["Construction & Quality", [
    ["What are the walls made of?", "100mm insulated sandwich panels — two colour-bonded steel skins around an insulating core — on a fully welded galvanised steel frame. It's the same technology used in commercial cold storage: strong, thermally excellent, termite-proof and rot-proof."],
    ["How well insulated are the homes?", "Wall, roof and floor panels plus double glazing give thermal performance that surprises building professionals — the same panel systems are used in commercial cold storage, and they're specified to handle climates from alpine Victoria to tropical Queensland."],
    ["Are the windows double glazed?", "Yes — every window and sliding door in every model, standard. Aluminium frames with double glazing for thermal and acoustic performance."],
    ["Will it withstand Australian conditions?", "The structures are engineered to AS/NZS 1170 wind actions, with cyclone-region packages available. Colour-bonded steel exteriors handle coastal air, UV and hail far better than timber cladding, and there's nothing for termites to eat."],
    ["How long will a tiny home last?", "Structurally, decades — galvanised steel and steel-skinned panels don't degrade the way timber does. That's why we're comfortable giving a 10-year structural warranty as standard, with homes expected to serve well beyond it."],
    ["Can I customise layouts and finishes?", "Yes. Each model offers curated interior palettes plus optional upgrades (decks, solar, joinery, appliances). Full custom floor plans are available on the Grand and Luxury Series for a design fee — talk to us early in the process."],
    ["Are the kitchens and bathrooms really complete?", "Completely. Cabinetry, benchtops, sink, cooktop, tapware, shower, toilet, vanity, hot water and exhaust ventilation are all standard. The advertised price is a finished home, not a shell — see each product page's What's Included list."],
  ]],
  ["Pricing & Buying", [
    ["How much does a tiny home cost in Australia?", `Our range spans $18,900 (Office Pod) to $79,900 (Luxury Series), including GST. Market-wide, Australian tiny homes run roughly $30,000–$150,000+ depending on size and spec. Our <a href="blog-how-much-does-a-tiny-home-cost.html">complete cost guide</a> breaks down every cost including site works.`],
    ["Are there hidden costs?", "Not from us — your quote is a delivered price including transport, customs and installation. Costs outside our control (council fees, trade connections, site works if your block needs them) are flagged in writing during your consultation so you can budget the full project."],
    ["Why are you cheaper than a granny flat builder?", "Factory construction eliminates most on-site labour — the single biggest cost in Australian building — and our direct manufacturing agreements remove importer margins. Same materials standards, radically different cost structure."],
    ["How do payments work?", "A deposit secures your build slot, a progress payment is due when your home passes pre-shipment inspection (you'll have the photo report), and the balance is payable on arrival in Australia before delivery. Every payment maps to a milestone you can verify."],
    ["Is finance available?", `Yes — secured personal loans, chattel mortgages for business use, and equity release. Terms of 3–7 years put an Office Pod around $76/week. Try the <a href="finance.html">repayment calculator</a>.`],
    ["Do prices include GST?", "Always. Every price on this website and every quote we issue includes GST. Business buyers may be able to claim GST credits — ask your accountant about a chattel mortgage structure."],
    ["What are current lead times?", "Model-dependent: 6–10 weeks for pods, 10–18 weeks for expandable homes, from deposit to delivery. Your quote includes the current lead time for your model, and your order confirmation locks a delivery window."],
  ]],
  ["Warranty & Aftercare", [
    ["What warranty comes with the home?", "A 10-year structural warranty on frame and panels, plus a minimum 2-year warranty on fixtures, fittings and appliances (3 years on the Luxury Series) — administered from Sydney, with parts stocked in Australia."],
    ["What if something goes wrong after delivery?", "Call or email our Sydney aftercare team. Minor issues are resolved with couriered parts and guided fixes or a local trade we arrange; anything structural triggers an on-site assessment. Every warranty claim gets a named owner and a written timeline."],
    ["What maintenance does a tiny home need?", "Very little: wash the exterior panels annually (like any colour-bonded structure), keep drainage paths clear, check sealants around wet areas yearly and service the split system as you would in any home. No painting, no restumping, no termite treatments."],
    ["Can the home be relocated later?", "Yes — that's a core advantage. The wings fold back in and the home travels as it arrived. Budget for a crane and transport, and check approvals at the new site. We can manage relocations end-to-end."],
    ["Does the warranty transfer if I sell?", "Yes, the balance of both warranties transfers to a new owner of the home — a genuine selling point if you ever move it on."],
  ]],
  ["Living & Practicalities", [
    ["Can I live in a tiny home permanently?", "Thousands of Australians do. Legally it requires dwelling approval (see Approvals above); practically, our Grand Series models are designed exactly for it — full kitchens, real bedrooms, laundry provisions and genuine insulation."],
    ["How many people can live comfortably?", "The 20ft suits singles and couples; the 40ft and Family Series genuinely house families of four to six; pods suit one to two. See each product page for honest sleeps ratings — we'd rather undersell than have you cramped."],
    ["Are tiny homes hot in summer and cold in winter?", "Ours aren't — that's what 100mm insulated panels and double glazing are for. Combined with reverse-cycle air conditioning (standard on every model), owners report comfortable temperatures from Hobart to Cairns on minimal energy."],
    ["What about noise in rain or wind?", "Insulated panel roofs are dramatically quieter than a caravan or shed skillion in rain. In high wind the engineered tie-downs keep the structure solid — expect the ordinary sounds of any well-built small home, not a rattling box."],
    ["Can I run a washing machine, dishwasher and full-size fridge?", "Yes on the expandable range — laundry provisions, dishwasher options and full-height fridge spaces are designed in. Pods trade some of these for footprint; the product pages show exactly what fits."],
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
    title: "Tiny Home FAQs | Approvals, Prices & More | Bondi Tiny Homes",
    description:
      "Council approvals, foundations, insulation, cyclone ratings, warranty, pricing, lead times and finance — 40 detailed answers on Australian tiny homes.",
    body,
    active: "faq.html",
    schema: [
      breadcrumbSchema([["Home", ""], ["FAQ", "faq.html"]]),
      faqSchema(`${SITE.url}/faq.html#faq`, allFaqs),
    ],
  }),
};
