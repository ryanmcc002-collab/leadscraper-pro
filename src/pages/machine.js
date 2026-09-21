'use strict';
/* One page per published machine, following reference/product.html section by section. */
const card = require('../partials/card');
const fit = require('../partials/fit');
const estimator = require('../partials/estimator');
const enquiry = require('../partials/enquiry');

module.exports = function machinePages(ctx) {
  const { site, machines, byCategory, img, imgSource, weeklyFor, weeklyText, fmt, esc, attr, M } = ctx;
  return machines.map(m => {
    const cat = M.category(m);
    const st = M.status(m);
    const keys = M.keys(m);
    const means = M.meanings(m);
    const specs = M.specRows(m);
    const gallery = (m.images.gallery && m.images.gallery.length ? m.images.gallery : [m.images.primary]);
    const alt = `Rippa ${m.name} ${m.type.toLowerCase()}`;
    const related = byCategory(m.category).filter(x => x !== m).slice(0, 3);
    const isExcavator = m.category === 'excavators' && fmt.has(m.specs.width_min_mm);
    const list = (title, lead, items) => items && items.length ? `
<section class="section">
  <div class="wrap">
    <div class="section__head"><h2>${esc(title)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}</div>
    <ul class="inc">${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
  </div>
</section>` : '';

    /* Sections alternate white and grey. Track it so two greys never sit together when a section is left out. */
    let grey = false;
    const tone = () => { grey = !grey; return grey ? ' section--grey' : ''; };

    const numbers = (means.length || specs.length) ? `
<section class="section${tone()}">
  <div class="wrap">
    <div class="section__head"><h2>What the numbers mean</h2><p class="lead">The specs that decide whether this is the right machine, in plain English.</p></div>
    ${means.length ? `<dl class="means">
      ${means.map(x => `<div><dt>${x.value ? esc(x.value) : esc(x.label)}${x.value ? `<small>${esc(x.label)}</small>` : ''}</dt><dd>${esc(x.text)}</dd></div>`).join('\n      ')}
    </dl>` : ''}
    ${specs.length ? `<details class="allspecs"><summary>See every specification</summary>
      <table><tbody>
        ${specs.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}
      </tbody></table>
    </details>` : ''}
  </div>
</section>` : '';

    const included = m.included && m.included.length ? list("What's included", 'Everything below comes with the machine at the listed price.', m.included).replace('class="section"', `class="section${tone()}"`) : '';
    const options = m.options && m.options.length ? list('Options', 'Available on request. Ask us for a price with the machine.', m.options).replace('class="section"', `class="section${tone()}"`) : '';
    const warranty = m.warranty && m.warranty.length ? list('Warranty and support', null, m.warranty).replace('class="section"', `class="section${tone()}"`) : '';

    const fitSection = isExcavator ? fit({
      site, rows: M.fitRows([m]), img,
      heading: `Will the ${m.name} fit?`,
      lead: 'Slide to the narrowest point between the street and the job.',
      presets: [[800, 'Narrow gate'], [900, 'Side gate'], [1200, 'Wide path']],
    }).replace('class="section section--grey"', `class="section${tone()}"`) : '';

    const est = estimator({ site, machine: m, weeklyFor, grey: !!tone().trim() });
    const enq = enquiry({
      site, machines, machine: m, showCall: false, grey: !!tone().trim(),
      heading: `Enquire about the ${m.name}`,
      lead: "We'll come back to you with availability and a delivered price. Inspections welcome.",
    });
    const rel = related.length ? `
<section class="section${tone()}">
  <div class="wrap">
    <div class="section__head"><h2>Other ${cat.name.toLowerCase()}</h2><p class="lead">More from the same range, in case the ${m.name} isn't quite the one.</p></div>
    <div class="cards">
      ${related.map(r => card(r, { img, weeklyText })).join('\n      ')}
    </div>
  </div>
</section>` : '';

    const body = `<div class="hazard" aria-hidden="true"></div>

<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="${cat.path}">${esc(cat.name)}</a> / ${esc(m.name)}</nav>

  <div class="product">
    <div data-gallery>
      <div class="gallery__main" tabindex="0" aria-label="${attr(m.name)} photos. Use the arrow keys or swipe to change photo.">${img(gallery[0], { alt, eager: true, sizes: '(min-width: 900px) 640px, 92vw' })}</div>
      ${gallery.length > 1 ? `<div class="gallery__thumbs">
        ${gallery.map((g, i) => `<button type="button" aria-pressed="${i === 0}" aria-label="Photo ${i + 1} of ${gallery.length}" data-alt="${attr(alt)}, photo ${i + 1}" data-src="${attr(imgSource(g).src)}" data-srcset="${attr(imgSource(g).srcset)}">${img(g, { alt: '', sizes: '(min-width: 900px) 100px, 15vw' })}</button>`).join('\n        ')}
      </div>` : ''}
    </div>

    <div class="buy">
      <span class="pill ${st.cls}">${st.label}</span>
      <h1>${esc(m.name)}</h1>
      <p class="buy__type">${esc(m.type)}</p>
      ${m.tagline ? `<p class="buy__tag">${esc(m.tagline)}</p>` : ''}
      ${m.summary && m.summary.length ? `<ul class="ticks">${m.summary.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
      <p class="price"><strong>${fmt.price(m.price)}</strong><small data-weekly="${m.price}">${esc(weeklyText(m.price))}</small></p>
      <div class="buy__btns">
        <a class="btn btn--primary" href="#enquire">Enquire about the ${esc(m.name)}</a>
        <a class="btn btn--outline" href="${attr(site.phone_href)}">Call ${esc(site.phone_display)}</a>
      </div>
      ${keys.length ? `<ul class="keys">
        ${keys.map(k => `<li><span>${esc(k.label)}</span><strong>${esc(k.value)}</strong></li>`).join('\n        ')}
      </ul>` : ''}
    </div>
  </div>
</main>
${numbers}${included}${options}${warranty}
${fitSection}
${est}
${enq}${rel}`;

    const jsonld = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `Rippa ${m.name}`,
      description: m.tagline || M.metaDescription(m),
      sku: m.slug,
      brand: { '@type': 'Brand', name: 'Rippa' },
      category: m.type,
      image: gallery.map(g => `https://${site.domain}/${g}`),
      offers: {
        '@type': 'Offer',
        price: m.price,
        priceCurrency: 'AUD',
        availability: st.schema,
        itemCondition: 'https://schema.org/NewCondition',
        url: `https://${site.domain}${M.url(m)}`,
        seller: { '@type': 'Organization', name: site.business_name, telephone: site.phone_href.replace('tel:', '') },
      },
    };

    return {
      path: M.url(m),
      section: m.category,
      title: `${m.name} ${m.type.toLowerCase()} | ${site.business_name}`,
      description: M.metaDescription(m),
      body,
      jsonld,
    };
  });
};
