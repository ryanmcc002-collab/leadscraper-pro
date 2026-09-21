/* Rippa Victoria: site behaviours. Vanilla JS, no dependencies.
   Config values are injected at build time into #site-config (see build.js). */
const CFG = Object.assign(
  { ratePct: 9.95, termMonths: 60, clearanceMm: 50, fitMaxMm: 1600, demo: true, formAction: '' },
  (() => { try { return JSON.parse(document.getElementById('site-config').textContent); } catch (e) { return {}; } })()
);
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const money = n => '$' + Math.round(n).toLocaleString('en-AU');
function weekly(price, depositPct = 0, months = CFG.termMonths, ratePct = CFG.ratePct) {
  const p = price * (1 - depositPct / 100), r = ratePct / 100 / 12;
  const monthly = r ? (p * r) / (1 - Math.pow(1 + r, -months)) : p / months;
  return (monthly * 12) / 52;
}

/* 1. Weekly estimate on anything with data-weekly="price" (already printed at build time; kept live here) */
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

/* 4. Gallery: thumbs, swipe on touch, arrow keys when focused */
document.querySelectorAll('[data-gallery]').forEach(g => {
  const main = g.querySelector('.gallery__main img');
  const stage = g.querySelector('.gallery__main');
  const thumbs = [...g.querySelectorAll('.gallery__thumbs button')];
  if (!main || !thumbs.length) return;
  let i = Math.max(0, thumbs.findIndex(t => t.getAttribute('aria-pressed') === 'true'));
  function show(n, focus) {
    i = (n + thumbs.length) % thumbs.length;
    const b = thumbs[i], t = b.querySelector('img');
    if (b.dataset.srcset) main.srcset = b.dataset.srcset;
    main.src = b.dataset.src || t.src;
    main.alt = thumbs[i].dataset.alt || main.alt;
    thumbs.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    if (focus) thumbs[i].focus();
  }
  thumbs.forEach((b, k) => b.addEventListener('click', () => show(k)));
  g.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1, document.activeElement !== stage); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1, document.activeElement !== stage); }
  });
  let x0 = null;
  stage.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  stage.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
  });
  stage.addEventListener('pointercancel', () => { x0 = null; });
});

/* 5. Enquiry form. Plain-words validation. Demo mode sends nothing and plays the lead flow. */
document.querySelectorAll('[data-enquiry]').forEach(form => {
  const name = form.querySelector('#f-name'), phone = form.querySelector('#f-phone');
  const status = form.querySelector('[data-form-status]');
  function setError(input, msg) {
    const field = input.closest('.field'), err = field.querySelector('.field__err');
    field.classList.toggle('is-bad', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (err) err.textContent = msg || '';
  }
  function validate() {
    let first = null;
    const n = name.value.trim();
    const nameMsg = n ? '' : 'Add your name so we know who to ask for';
    setError(name, nameMsg); if (nameMsg) first = first || name;
    const digits = phone.value.replace(/\D/g, '');
    const phoneMsg = !digits ? 'Add a mobile number so we can call you back'
      : digits.length < 8 || digits.length > 12 ? "That number doesn't look right. Check it and try again" : '';
    setError(phone, phoneMsg); if (phoneMsg) first = first || phone;
    return first;
  }
  [name, phone].forEach(el => el.addEventListener('input', () => { if (el.closest('.field').classList.contains('is-bad')) validate(); }));
  form.addEventListener('submit', e => {
    const bad = validate();
    if (bad) { e.preventDefault(); bad.focus(); return; }
    if (!CFG.demo && CFG.formAction) return; // real site: the form posts to its action
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Enquiry sent';
    btn.disabled = true;
    const flow = document.querySelector('[data-flow]');
    if (flow) {
      flow.classList.add('is-on');
      flow.querySelectorAll('li').forEach((li, k) => setTimeout(() => li.classList.add('is-in'), REDUCE ? 0 : 350 + k * 650));
      flow.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'nearest' });
    } else if (status) {
      status.textContent = "Thanks. We'll call you back shortly.";
      status.classList.add('is-on');
    }
  });
});

/* 6. "Ask about finance" ticks the finance box on the way to the form */
document.querySelectorAll('[data-finance-cta]').forEach(a => a.addEventListener('click', () => {
  const box = document.querySelector('#f-fin'); if (box) box.checked = true;
}));

/* 7. Mobile menu */
(function menu() {
  const btn = document.querySelector('[data-menu]'), panel = document.querySelector('[data-mobile-nav]');
  if (!btn || !panel) return;
  const set = open => { panel.hidden = !open; btn.setAttribute('aria-expanded', String(open)); btn.textContent = open ? 'Close' : 'Menu'; };
  btn.addEventListener('click', () => set(panel.hidden));
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
})();

/* 8. Category filters and sort */
(function catalogue() {
  const root = document.querySelector('[data-catalogue]'); if (!root) return;
  const grid = root.querySelector('[data-grid]');
  const cards = [...grid.querySelectorAll('.card')];
  const jobs = [...root.querySelectorAll('[data-job]')];
  const stock = root.querySelector('[data-stock-only]');
  const sort = root.querySelector('[data-sort]');
  const count = root.querySelector('[data-count]');
  const empty = root.querySelector('[data-empty]');
  let job = 'any', stockOnly = false;
  function apply() {
    jobs.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.job === job)));
    stock.setAttribute('aria-pressed', String(stockOnly));
    let shown = 0;
    cards.forEach(c => {
      const ok = (job === 'any' || (' ' + c.dataset.jobs + ' ').includes(' ' + job + ' ')) && (!stockOnly || c.dataset.stock === 'in-stock');
      c.classList.toggle('is-hidden', !ok);
      if (ok) shown++;
    });
    const key = sort.value;
    const val = c => key === 'size' ? +c.dataset.size : +c.dataset.price;
    const dir = key === 'price-desc' ? -1 : 1;
    [...cards].sort((a, b) => (val(a) - val(b)) * dir).forEach(c => grid.appendChild(c));
    count.textContent = shown + ' of ' + cards.length + (cards.length === 1 ? ' machine' : ' machines');
    empty.classList.toggle('is-on', shown === 0);
  }
  jobs.forEach(b => b.addEventListener('click', () => { job = b.dataset.job; apply(); }));
  stock.addEventListener('click', () => { stockOnly = !stockOnly; apply(); });
  sort.addEventListener('change', apply);
  root.querySelector('[data-show-all]').addEventListener('click', () => { job = 'any'; stockOnly = false; apply(); jobs[0].focus(); });
  apply();
})();
