/* Shared behaviour: nav, gallery, finance estimator, enquiry form, lead-flow reveal. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDemo = document.body.classList.contains('is-demo');
  var fmt = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };

  /* Nav */
  var toggle = document.querySelector('.nav-toggle'), nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }

  /* Gallery thumbs */
  var main = document.querySelector('[data-gallery-main]');
  document.querySelectorAll('[data-gallery-thumb]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!main) return;
      main.src = b.dataset.galleryThumb;
      document.querySelectorAll('[data-gallery-thumb]').forEach(function (o) { o.setAttribute('aria-current', o === b ? 'true' : 'false'); });
    });
  });

  /* Finance estimator */
  document.querySelectorAll('[data-estimator]').forEach(function (form) {
    var F = window.RippaFinance;
    var rate = parseFloat(form.dataset.rate);
    var sel = form.querySelector('[data-est-machine]');
    var dep = form.querySelector('[data-est-deposit]'), depOut = form.querySelector('[data-est-deposit-out]');
    var term = form.querySelector('[data-est-term]'), termOut = form.querySelector('[data-est-term-out]');
    var week = form.querySelector('[data-est-week]'), breakdown = form.querySelector('[data-est-breakdown]');
    var tickTimer;
    function update() {
      var opt = sel.options[sel.selectedIndex];
      var price = parseFloat(opt.dataset.price);
      var d = parseInt(dep.value, 10), t = parseInt(term.value, 10);
      depOut.textContent = d + '%';
      termOut.textContent = t + (t === 1 ? ' year' : ' years');
      var w = F.weekly(price, { depositPct: d, annualRatePct: rate, termYears: t });
      week.textContent = F.money(w);
      var depAmt = price * d / 100;
      breakdown.textContent = 'Borrowing ' + F.money(price - depAmt) + (d ? ' after a ' + F.money(depAmt) + ' deposit' : ' with no deposit') + ', over ' + t + (t === 1 ? ' year' : ' years') + ' at ' + rate + '%.';
      if (!reduced) {
        week.parentNode.classList.add('is-ticking');
        clearTimeout(tickTimer);
        tickTimer = setTimeout(function () { week.parentNode.classList.remove('is-ticking'); }, 300);
      }
    }
    [sel, dep, term].forEach(function (el) { el.addEventListener('input', update); });
    var ask = form.querySelector('[data-finance-ask]');
    if (ask) ask.addEventListener('click', function () {
      document.querySelectorAll('[data-enquiry]').forEach(function (f) {
        var flag = f.querySelector('[data-finance-flag]'), type = f.querySelector('[data-enquiry-type]');
        if (flag) flag.hidden = false;
        if (type) type.value = 'finance';
        var m = f.querySelector('[data-enquiry-machine]');
        if (m && sel.value) m.value = sel.value;
        var btn = f.querySelector('[data-enquiry-submit]');
        if (btn) btn.textContent = 'Ask about finance on this machine';
      });
    });
  });

  /* Enquiry form and the lead-flow reveal */
  document.querySelectorAll('[data-enquiry]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); return; }
      var hasAction = form.getAttribute('action');
      if (hasAction && !isDemo) return; // real site: post normally
      e.preventDefault();
      var done = form.querySelector('[data-enquiry-done]');
      Array.prototype.forEach.call(form.children, function (c) { if (c !== done) c.hidden = true; });
      done.hidden = false;
      done.focus();
      var flow = form.querySelector('[data-leadflow]');
      if (flow) {
        var steps = flow.querySelectorAll('li');
        steps.forEach(function (li, i) {
          if (reduced) { li.classList.add('is-in'); return; }
          setTimeout(function () { li.classList.add('is-in'); }, 500 + i * 700);
        });
      }
    });
  });
})();
