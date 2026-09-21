/* The line-up: gate slider, job filter, machine selection. Everything is
   pre-rendered by build.js; this only changes state. */
(function () {
  'use strict';
  var root = document.getElementById('lineup');
  var dataEl = document.getElementById('lineup-data');
  if (!root || !dataEl) return;
  var data = JSON.parse(dataEl.textContent);
  var byslug = {};
  data.machines.forEach(function (m) { byslug[m.slug] = m; });
  var docEl = document.documentElement;
  var gate = document.getElementById('gate');
  var gateOut = document.getElementById('gate-out');
  var gateCap = root.querySelector('[data-gate-cap]');
  var gateFar = root.querySelector('.gate-far');
  var chips = root.querySelectorAll('.chip');
  var jobStatus = document.getElementById('job-status');
  var live = document.getElementById('lu-live');
  var plate = document.getElementById('lu-plate');
  var scroller = root.querySelector('.lineup-scroll');
  var items = {}, caps = {};
  root.querySelectorAll('.lu-machine').forEach(function (b) { items[b.dataset.slug] = b; });
  root.querySelectorAll('[data-cap]').forEach(function (c) { caps[c.dataset.cap] = c; });
  var jobLabel = {};
  data.jobs.forEach(function (j) { jobLabel[j.key] = j.label; });
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = { gap: parseInt(gate.value, 10), job: '', selected: null };
  var fmt = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };

  /* One shared scale for everything drawn. Fit the strip on wide screens,
     keep a fixed comfortable scale on phones and let it scroll. */
  function setScale() {
    var w = docEl.clientWidth, g = w >= 900 ? 40 : 16;
    var s = w >= 900 ? Math.max(0.036, Math.min(0.07, (w - 2 * g - 12) / data.totalMm)) : 0.055;
    docEl.style.setProperty('--px-per-mm', s);
  }
  var resizeTimer;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(setScale, 80); });

  function apply(announce) {
    var fitCount = 0, litCount = 0;
    data.machines.forEach(function (m) {
      var fits = m.widthMin <= state.gap;
      var suited = !state.job || m.goodFor.indexOf(state.job) !== -1;
      var lit = fits && suited;
      var it = items[m.slug], cap = caps[m.slug];
      it.classList.toggle('is-out', !lit);
      it.classList.toggle('is-fit', lit);
      cap.classList.toggle('is-fit', lit);
      var tag = cap.querySelector('[data-tag]');
      tag.textContent = !fits ? "Won't fit" : (!suited ? 'Not for this job' : 'Fits');
      if (fits) fitCount++;
      if (lit) litCount++;
    });
    if (announce && live) {
      live.textContent = fitCount + ' of ' + data.machines.length + ' machines fit through ' + fmt(state.gap) + ' mm' + (state.job ? ', ' + litCount + ' suited to ' + jobLabel[state.job].toLowerCase() : '') + '.';
    }
    if (jobStatus) {
      jobStatus.textContent = state.job ? litCount + ' of ' + data.machines.length + ' machines suit ' + jobLabel[state.job].toLowerCase() + ' and fit your access.' : '';
    }
  }

  function setGap(v, announce) {
    state.gap = v;
    gateOut.textContent = fmt(v) + ' mm';
    if (gateCap) gateCap.textContent = fmt(v) + ' mm clear';
    docEl.style.setProperty('--gap', v);
    if (gateFar) gateFar.style.transform = 'translate(' + v + 'px,0)';
    apply(announce);
  }
  gate.addEventListener('input', function () {
    gateOut.classList.add('is-live');
    setGap(parseInt(gate.value, 10), false);
  });
  gate.addEventListener('change', function () {
    gateOut.classList.remove('is-live');
    apply(true);
  });

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      state.job = c.dataset.job || '';
      chips.forEach(function (o) { o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
      apply(true);
    });
  });

  function select(slug) {
    var m = byslug[slug];
    if (!m) return;
    if (state.selected === slug) { deselect(); return; }
    state.selected = slug;
    Object.keys(items).forEach(function (k) {
      items[k].classList.toggle('is-selected', k === slug);
      items[k].setAttribute('aria-pressed', k === slug ? 'true' : 'false');
      caps[k].classList.toggle('is-selected', k === slug);
    });
    document.getElementById('lp-name').textContent = m.name;
    document.getElementById('lp-price').textContent = m.priceFmt;
    document.getElementById('lp-weekly').textContent = m.weeklyFmt;
    var lines = document.getElementById('lp-lines');
    lines.innerHTML = '';
    m.summary.forEach(function (s) { var li = document.createElement('li'); li.textContent = s; lines.appendChild(li); });
    document.getElementById('lp-tow').textContent = m.transportWeight;
    var fits = m.widthMin <= state.gap;
    document.getElementById('lp-status').textContent = (m.status) + '. ' + fmt(m.widthMin) + ' mm wide with the tracks in, so it ' + (fits ? 'fits' : "won't fit") + ' your ' + fmt(state.gap) + ' mm access.';
    var see = document.getElementById('lp-see');
    see.href = m.url; see.textContent = 'See the ' + m.shortName;
    var enq = document.getElementById('lp-enquire');
    enq.href = m.url + '#enquire'; enq.textContent = 'Enquire about the ' + m.shortName;
    plate.hidden = false;
    plate.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  }
  function deselect() {
    state.selected = null;
    Object.keys(items).forEach(function (k) { items[k].classList.remove('is-selected'); items[k].setAttribute('aria-pressed', 'false'); caps[k].classList.remove('is-selected'); });
    plate.hidden = true;
  }
  Object.keys(items).forEach(function (k) {
    items[k].addEventListener('click', function () { select(k); });
  });

  /* Keyboard: left and right move through machines when the strip is focused */
  scroller.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var keys = Object.keys(items);
    var i = keys.indexOf(document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.slug : '');
    var next = e.key === 'ArrowRight' ? Math.min(keys.length - 1, i + 1) : Math.max(0, i - 1);
    items[keys[next]].focus();
    e.preventDefault();
  });

  setScale();
  setGap(state.gap, false);
})();
