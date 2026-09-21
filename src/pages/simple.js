'use strict';
/* Attachments, finance, contact, and the two placeholder pages. */
const band = require('../partials/band');
const estimator = require('../partials/estimator');
const enquiry = require('../partials/enquiry');

const ATTACHMENTS = ['Buckets', 'Trenching buckets', 'Mud buckets', 'Rippers', 'Rakes', 'Grabs', 'Hydraulic thumbs', 'Augers', 'Breakers', 'Pallet forks', '4-in-1 buckets', 'Trenchers', 'Dozer blades'];

module.exports = function simplePages(ctx) {
  const { site, machines, bySlug, weeklyFor, esc, attr } = ctx;
  const fin = site.finance;
  const location = /TODO/i.test(site.location || '') ? `${site.service_area}, Australia` : site.location;
  const email = /TODO/i.test(site.email || '') ? null : site.email;
  const pages = [];

  pages.push({
    path: '/attachments/',
    section: 'attachments',
    title: `Attachments | ${site.business_name}`,
    description: `Buckets, augers, breakers, grabs, pallet forks and more for Rippa mini excavators and skid steers in ${site.service_area}. Ask us for a price.`,
    body: `${band({ h1: 'Attachments', lead: 'The right attachment turns one machine into three. We stock the common ones and can order the rest.' })}

<section class="section">
  <div class="wrap">
    <div class="section__head"><h2>What we can fit</h2><p class="lead">Every machine comes with a starter package. These are the attachments we can add for your excavator or loader. Tell us the machine and the job and we'll quote the lot together.</p></div>
    <ul class="inc">${ATTACHMENTS.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
  </div>
</section>

${enquiry({
      site, machines, grey: true,
      heading: 'Ask about an attachment',
      lead: "Tell us which machine it's for and what you want to do with it. We'll come back with what fits and what it costs.",
    })}`,
  });

  const defaultMachine = bySlug('r13-pro') || machines[0];
  pages.push({
    path: '/finance/',
    section: 'finance',
    title: `Finance | ${site.business_name}`,
    description: `Work out a weekly repayment on any Rippa machine, then talk to ${fin.provider}. Estimates only, subject to lender approval.`,
    body: `${band({ h1: 'Finance', lead: `Put the machine to work and pay it off as it earns. Finance is arranged through ${fin.provider}, a broker who only does equipment.` })}

${estimator({ site, machines, selected: defaultMachine, weeklyFor, heading: 'Work out a weekly figure', lead: 'Pick a machine, set a deposit and a term. The figure updates as you go.', id: 'estimator' })}

<section class="section section--grey">
  <div class="wrap">
    <div class="section__head"><h2>How it works</h2><p class="lead">Three steps from picking a machine to having it on your trailer.</p></div>
    <ol class="steps">
      <li><div><strong>Pick a machine</strong>Choose the machine and the attachments you want. We'll confirm the price delivered.</div></li>
      <li><div><strong>A short chat with ${esc(fin.provider)}</strong>They'll ask a few questions about you and the business and come back with real terms. No obligation.</div></li>
      <li><div><strong>Approval and delivery</strong>Once it's approved we do the pre-delivery service and get the machine to you.</div></li>
    </ol>
  </div>
</section>

${enquiry({
      site, machines,
      heading: 'Ask about finance',
      lead: "Tick the finance box and we'll organise the introduction. Or call and we'll talk it through first.",
    })}`,
  });

  pages.push({
    path: '/contact/',
    section: 'contact',
    title: `Contact | ${site.business_name}`,
    description: `Call ${site.phone_display} or send an enquiry. Rippa mini excavators and skid steers in ${site.service_area}. Inspections welcome.`,
    body: `${band({ h1: 'Contact', lead: "Call, or send the form and we'll call you back. Inspections welcome, just let us know when you're coming." })}

<section class="section">
  <div class="wrap">
    <div class="section__head"><h2>Get in touch</h2></div>
    <ul class="checks contact-list">
      <li><span>Phone: <a href="${attr(site.phone_href)}">${esc(site.phone_display)}</a></span></li>
      ${email ? `<li><span>Email: <a href="mailto:${attr(email)}">${esc(email)}</a></span></li>` : ''}
      <li><span>Yard: ${esc(location)}</span></li>
      <li><span>Delivery across ${esc(site.service_area)}</span></li>
    </ul>
  </div>
</section>

${enquiry({
      site, machines, grey: true,
      heading: 'Send an enquiry',
      lead: "Tell us what the job is and we'll tell you which machine suits, what's in stock and what it costs delivered.",
    })}`,
  });

  for (const [slug, name] of [['terms', 'Terms and conditions'], ['manuals', 'Manuals']]) {
    pages.push({
      path: `/${slug}/`,
      section: null,
      title: `${name} | ${site.business_name}`,
      description: `${name} for ${site.business_name}. Coming with the full site.`,
      body: `${band({ h1: name })}
<section class="section placeholder">
  <div class="wrap"><p class="lead">Coming with the full site.</p></div>
</section>`,
    });
  }
  return pages;
};
