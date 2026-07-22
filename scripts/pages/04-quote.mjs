import { SITE, icons, layout, breadcrumbs, breadcrumbSchema, stars } from "../lib/layout.mjs";
import { products } from "../lib/products-data.mjs";

const modelOptions = products
  .map((p) => `<option value="${p.slug}">${p.name} — from $${p.price.toLocaleString("en-AU")}</option>`)
  .join("\n                  ");

const body = `
    <section class="page-hero">
      <div class="wrap">
        ${breadcrumbs([["Home", "index.html"], ["Get a Free Quote", "quote.html"]])}
        <span class="eyebrow">Free &middot; no obligation &middot; one business day</span>
        <h1>Get your delivered price</h1>
        <p class="lead">Tell us a little about your plans and we'll send fixed delivered pricing for your postcode, current lead times, floor plans and finance estimates. One email or call — no pressure and no endless follow-up.</p>
      </div>
    </section>

    <section class="section section-white">
      <div class="wrap">
        <div class="grid" style="grid-template-columns:1.4fr 1fr;align-items:start;gap:2.5rem">
          <form class="form-card reveal" data-enquiry novalidate aria-label="Quote request form" id="quote-form">
            <h2 style="font-size:var(--fs-600)">Request your free quote</h2>
            <p class="muted" style="margin-bottom:1.5rem">Fields marked * are required — everything else just helps us quote faster.</p>
            <div class="form-grid">
              <div class="field"><label for="q-name">Full name *</label><input id="q-name" name="name" type="text" autocomplete="name" required></div>
              <div class="field"><label for="q-phone">Phone *</label><input id="q-phone" name="phone" type="tel" autocomplete="tel" required></div>
              <div class="field"><label for="q-email">Email *</label><input id="q-email" name="email" type="email" autocomplete="email" required></div>
              <div class="field"><label for="q-postcode">Delivery postcode *</label><input id="q-postcode" name="postcode" type="text" inputmode="numeric" pattern="[0-9]{4}" autocomplete="postal-code" required></div>
              <div class="field"><label for="q-model">Which model interests you?</label>
                <select id="q-model" name="model">
                  <option value="">Not sure yet — recommend one</option>
                  ${modelOptions}
                </select>
              </div>
              <div class="field"><label for="q-purpose">What will it be used for?</label>
                <select id="q-purpose" name="purpose">
                  <option value="">Select&hellip;</option>
                  <option>Primary residence / first home</option>
                  <option>Granny flat / family accommodation</option>
                  <option>Airbnb / holiday accommodation</option>
                  <option>Rural property / farm</option>
                  <option>Home office or studio</option>
                  <option>Workforce accommodation</option>
                  <option>Investment / rental</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="field"><label for="q-when">When are you hoping to install?</label>
                <select id="q-when" name="timeframe">
                  <option value="">Select&hellip;</option>
                  <option>As soon as possible</option>
                  <option>Within 3 months</option>
                  <option>3–6 months</option>
                  <option>6–12 months</option>
                  <option>Just researching</option>
                </select>
              </div>
              <div class="field"><label for="q-contact">Preferred contact</label>
                <select id="q-contact" name="preferred_contact">
                  <option>Phone call</option>
                  <option>Email</option>
                  <option>SMS</option>
                  <option>Video call</option>
                </select>
              </div>
              <div class="field full"><label for="q-msg">Anything else? (site access, questions, must-haves)</label><textarea id="q-msg" name="message"></textarea></div>
              <div class="field full">
                <label style="display:flex;gap:0.6rem;align-items:flex-start;font-weight:600;text-transform:none">
                  <input type="checkbox" name="brochure" value="yes" checked style="width:auto;margin-top:0.3rem"> Also email me the full range brochure &amp; price list (PDF)
                </label>
              </div>
            </div>
            <p class="honeypot" aria-hidden="true"><input type="text" name="company_website" tabindex="-1" autocomplete="off"></p>
            <button class="btn btn-gold btn-lg" type="submit" style="width:100%;margin-top:1.5rem">Send my free quote request ${icons.arrow}</button>
            <p class="form-success" role="status">Thank you! Your request is in. A Sydney-based project manager will be in touch within one business day with your delivered pricing.</p>
            <p class="form-note">${icons.lock} Secure enquiry. Your details are never sold or shared. We contact you once — you choose whether we keep talking.</p>
          </form>

          <div style="display:grid;gap:1.5rem">
            <div class="card reveal reveal-d1">
              <h3>Prefer to talk now?</h3>
              <p class="muted">Our team is available 8am–6pm AEST, Monday to Saturday.</p>
              <a class="btn btn-navy" href="${SITE.phoneHref}" style="width:100%;margin-top:0.5rem">${icons.phone} Call ${SITE.phone}</a>
              <a class="btn btn-ghost" href="mailto:${SITE.email}" style="width:100%;margin-top:0.75rem">Email ${SITE.email}</a>
            </div>
            <div class="card reveal reveal-d2">
              <h3>Book instead</h3>
              <ul class="checklist" style="margin-top:0.75rem">
                <li>${icons.check}<span><strong>Request a callback</strong> — choose "Phone call" in the form and we'll ring at a time that suits.</span></li>
                <li>${icons.check}<span><strong>Book a video walkthrough</strong> — a live guided tour of a display home from your couch.</span></li>
                <li>${icons.check}<span><strong>Book a site inspection</strong> — Sydney, Central Coast and Illawarra, free for confirmed orders.</span></li>
              </ul>
            </div>
            <div class="card reveal reveal-d3">
              ${stars()}
              <blockquote style="margin:0.75rem 0 0;border:0;padding:0;font-size:0.95rem;color:var(--muted)">&ldquo;I filled in the form on a Sunday night expecting the usual sales barrage. Instead I got one thorough email with exact pricing for my postcode and a polite follow-up call. That restraint is why they got the order.&rdquo;</blockquote>
              <p style="margin-top:0.75rem;font-weight:700;color:var(--navy);font-size:var(--fs-300)">James W. — Margaret River, WA</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="next-h">
      <div class="wrap-narrow">
        <div class="center reveal"><span class="eyebrow eyebrow-center">What happens next</span><h2 id="next-h">After you hit send</h2></div>
        <div class="steps reveal" style="margin-top:2rem">
          <div class="step"><div><h3>Within one business day</h3><p>A project manager reviews your postcode and plans, then sends delivered pricing and floor plans for the models that fit.</p></div></div>
          <div class="step"><div><h3>One conversation</h3><p>A call or email — your choice — to answer questions about approvals, site prep and finance. No scripts, no countdown-timer discounts.</p></div></div>
          <div class="step"><div><h3>Your decision, your pace</h3><p>Take the quote and think. It stays valid for 60 days, and we're here when you're ready.</p></div></div>
        </div>
      </div>
    </section>

    <script>
      /* Pre-select model from ?model= links on product pages */
      (function () {
        var params = new URLSearchParams(window.location.search);
        var model = params.get("model");
        var sel = document.getElementById("q-model");
        if (model && sel) {
          for (var i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value === model) { sel.selectedIndex = i; break; }
          }
        }
        if (params.get("brochure")) {
          var h = document.querySelector("#quote-form h2");
          if (h) h.textContent = "Get the brochure + your free quote";
        }
      })();
    </script>
`;

export const page = {
  path: "quote.html",
  html: layout({
    path: "quote.html",
    title: "Get a Free Tiny Home Quote | Bondi Tiny Homes",
    description:
      "Free, no-obligation quote for any Bondi expandable tiny home: fixed delivered pricing to your postcode, lead times and finance estimates in one business day.",
    body,
    active: null,
    schema: [
      breadcrumbSchema([["Home", ""], ["Get a Free Quote", "quote.html"]]),
      { "@type": "ContactPage", "@id": `${SITE.url}/quote.html`, name: "Get a Free Quote" },
    ],
  }),
};
