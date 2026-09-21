/* Rippa Victoria: reference behaviours. Vanilla JS, no dependencies.
   In the real build these values come from data/site.config.json at build time. */
const CFG = { ratePct: 9.95, termMonths: 60, clearanceMm: 50, fitMaxMm: 1600 };

const money = n => '$' + Math.round(n).toLocaleString('en-AU');
function weekly(price, depositPct = 0, months = CFG.termMonths, ratePct = CFG.ratePct) {
  const p = price * (1 - depositPct / 100), r = ratePct / 100 / 12;
  const monthly = r ? (p * r) / (1 - Math.pow(1 + r, -months)) : p / months;
  return (monthly * 12) / 52;
}

/* 1. Weekly estimate on anything with data-weekly="price" */
document.querySelectorAll('[data-weekly]').forEach(el => {
  el.textContent = 'or about ' + money(weekly(+el.dataset.weekly)) + ' a week';
});

/* 2. Fit tool. Rows carry data-min (track width retracted, mm). */
(function fitTool() {
  const root = document.querySelector('[data-fit]'); if (!root) return;
  const range = root.querySelector('input[type=range]');
  const out = root.querySelector('[data-fit-value]');
  const rows = [...root.querySelectorAll('[data-min]')];
  const presets = [...root.querySelectorAll('[data-preset]')];
  const pct = mm => Math.min(100, (mm / CFG.fitMaxMm) * 100) + '%';
  function update() {
    const access = +range.value;
    out.textContent = access.toLocaleString('en-AU') + ' mm';
    presets.forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.preset === access)));
    rows.forEach(row => {
      const min = +row.dataset.min, spare = access - min;
      row.querySelector('.fit__bar').style.width = pct(min);
      row.querySelector('.fit__gate').style.left = pct(access);
      const v = row.querySelector('.fit__verdict');
      row.classList.remove('is-fit', 'is-tight', 'is-no');
      if (spare >= CFG.clearanceMm) { row.classList.add('is-fit'); v.textContent = 'Fits, ' + spare + ' mm to spare'; }
      else if (spare >= 0) { row.classList.add('is-tight'); v.textContent = 'Very tight, only ' + spare + ' mm to spare'; }
      else { row.classList.add('is-no'); v.textContent = 'Too wide by ' + Math.abs(spare) + ' mm'; }
    });
  }
  range.addEventListener('input', update);
  presets.forEach(b => b.addEventListener('click', () => { range.value = b.dataset.preset; update(); }));
  update();
})();

/* 3. Finance estimator */
(function estimator() {
  const root = document.querySelector('[data-est]'); if (!root) return;
  const machine = root.querySelector('[data-est-machine]');
  const dep = root.querySelector('[data-est-deposit]');
  const depOut = root.querySelector('[data-est-deposit-out]');
  const terms = [...root.querySelectorAll('[data-term]')];
  const fig = root.querySelector('[data-est-fig]');
  const sub = root.querySelector('[data-est-sub]');
  let months = CFG.termMonths;
  function update() {
    const price = +(machine.value || machine.dataset.price);
    const d = +dep.value;
    depOut.textContent = d + '% (' + money(price * d / 100) + ')';
    fig.textContent = money(weekly(price, d, months));
    sub.textContent = 'on ' + money(price * (1 - d / 100)) + ' over ' + months / 12 + (months === 12 ? ' year' : ' years');
    terms.forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.term === months)));
  }
  machine.addEventListener('change', update);
  dep.addEventListener('input', update);
  terms.forEach(b => b.addEventListener('click', () => { months = +b.dataset.term; update(); }));
  update();
})();

/* 4. Gallery */
document.querySelectorAll('[data-gallery]').forEach(g => {
  const main = g.querySelector('.gallery__main img');
  const thumbs = [...g.querySelectorAll('.gallery__thumbs button')];
  thumbs.forEach(b => b.addEventListener('click', () => {
    main.src = b.querySelector('img').src;
    thumbs.forEach(t => t.setAttribute('aria-pressed', String(t === b)));
  }));
});

/* 5. Enquiry form. Demo mode sends nothing and plays the lead flow. */
document.querySelectorAll('[data-enquiry]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const flow = document.querySelector('[data-flow]');
    form.querySelector('button[type=submit]').textContent = 'Enquiry sent';
    flow.classList.add('is-on');
    flow.querySelectorAll('li').forEach((li, i) => setTimeout(() => li.classList.add('is-in'), 350 + i * 650));
    flow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});
