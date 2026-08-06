import { SITE, icons, layout, breadcrumbs, breadcrumbSchema, faqItem, faqSchema, ctaBanner } from "../lib/layout.mjs";

const FIN_FAQS = [
  ["Can I get finance for a tiny home in Australia?", "Yes. Because most tiny homes aren't fixed to land, they're typically financed with a secured personal loan, chattel mortgage (for business use) or an equity release against an existing property — rather than a traditional mortgage. Several Australian lenders now offer purpose-built tiny home loans."],
  ["What deposit do I need?", "Secured personal loans often require no deposit, though 10–20% reduces your rate and repayments. Using home equity can also mean no cash deposit. Business purchases through a chattel mortgage may finance the full amount and claim GST credits — ask your accountant."],
  ["What interest rates should I expect?", "As a guide, secured personal loans currently range from roughly 7% to 14% p.a. depending on your credit profile and term. Equity release against property tracks home loan rates. The calculator above lets you model any rate."],
  ["Can rental income cover the repayments?", "Frequently, yes. As a worked example, $50,000 financed over 7 years at 9% costs about $186/week — while granny flats in most capital cities rent for $300–$450/week. Short-stay returns can be higher again. Income isn't guaranteed; model your own local rents conservatively."],
  ["Is the deposit to Go Tiny Homes protected?", "Your order deposit is held against a signed agreement with staged payments tied to build milestones you can verify through inspection photo reports. The balance is only payable when your home lands in Australia and passes final inspection."],
];

const body = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbs([["Home", "index.html"], ["Finance", "finance.html"]])}
        <span class="eyebrow">Make it happen sooner</span>
        <h1>Tiny home finance, minus the mystery</h1>
        <p class="lead">A complete home for less than many car repayments. Run your numbers below.</p>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="calc-h">
      <div class="wrap">
        <div class="two-col" style="align-items:start">
          <div class="reveal">
            <span class="eyebrow">Repayment calculator</span>
            <h2 id="calc-h">Run your numbers</h2>
            <p class="lead">Drag the sliders to estimate repayments. Indicative only — your rate depends on your lender, profile and term.</p>
            <ul class="checklist" style="margin-top:1.5rem">
              <li>${icons.check}<span>Terms from 3 to 7 years with most lenders</span></li>
              <li>${icons.check}<span>Secured and unsecured options available</span></li>
              <li>${icons.check}<span>Business buyers: chattel mortgage + GST credits</span></li>
              <li>${icons.check}<span>No exit fees with most tiny home lenders</span></li>
            </ul>
          </div>
          <div class="form-card reveal reveal-d1" data-calc>
            <div class="calc">
              <div class="row">
                <div class="vals"><span>Home price</span><span id="calc-amount-val">$55,000</span></div>
                <input type="range" id="calc-amount" min="20000" max="120000" step="500" value="55000" aria-label="Home price">
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
                <div class="per">Indicative only. Not financial advice — confirm figures with your lender or adviser.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="ex-h">
      <div class="wrap">
        <div class="center reveal"><span class="eyebrow eyebrow-center">Worked examples</span><h2 id="ex-h">What owners actually pay</h2></div>
        <div class="grid grid-3" style="margin-top:2.5rem">
          <div class="card reveal">
            <span class="eyebrow">Borrowing $30,000</span>
            <h3>5-year loan example</h3>
            <p>$30,000 over 5 years at 9% p.a. → about <strong>$144/week</strong>. Shorter terms cost more per week but far less in total interest.</p>
          </div>
          <div class="card reveal reveal-d1">
            <span class="eyebrow">Borrowing $50,000</span>
            <h3>7-year loan example</h3>
            <p>$50,000 over 7 years at 9% p.a. → about <strong>$186/week</strong> — against typical granny-flat rents of $300–$450/week in most capital cities.</p>
          </div>
          <div class="card reveal reveal-d2">
            <span class="eyebrow">Borrowing $70,000</span>
            <h3>7-year loan example</h3>
            <p>$70,000 over 7 years at 9% p.a. → about <strong>$260/week</strong>. Compare that with average capital-city rent of $600+/week — and in seven years you own it outright.</p>
          </div>
        </div>
        <p class="muted center" style="margin-top:1.5rem;font-size:var(--fs-300)">Examples are illustrative borrowing amounts only — they aren't our prices. They exclude fees and assume indicative rates. Not financial advice.</p>
      </div>
    </section>

    <section class="section section-white" aria-labelledby="ffaq-h">
      <div class="wrap-narrow">
        <div class="center reveal"><span class="eyebrow eyebrow-center">Finance questions</span><h2 id="ffaq-h">Asked at every kitchen table</h2></div>
        <div style="margin-top:2rem" class="reveal">
          ${FIN_FAQS.map(([q, a]) => faqItem(q, a)).join("\n          ")}
        </div>
      </div>
    </section>

    ${ctaBanner(
      "Want a real repayment figure?",
      "Request a quote and tick the finance box — we'll include indicative repayments from lenders familiar with tiny home purchases."
    )}
`;

export const page = {
  path: "finance.html",
  html: layout({
    path: "finance.html",
    title: "Tiny Home Finance & Calculator | Go Tiny Homes",
    description:
      "Finance an expandable tiny home: interactive repayment calculator, worked granny-flat and Airbnb examples, plus honest answers to Australia's common questions.",
    body,
    active: "finance.html",
    schema: [
      breadcrumbSchema([["Home", ""], ["Finance", "finance.html"]]),
      faqSchema(`${SITE.url}/finance.html#faq`, FIN_FAQS),
    ],
  }),
};
