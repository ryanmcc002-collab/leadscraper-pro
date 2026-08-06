/* Go Tiny Homes — site interactions */
(function () {
  "use strict";

  /* Sticky header state */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Animated counters */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          cio.unobserve(entry.target);
          var el = entry.target;
          var target = parseFloat(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          var prefix = el.getAttribute("data-prefix") || "";
          var dur = 1400;
          var start = null;
          var step = function (ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* Carousels */
  document.querySelectorAll(".carousel").forEach(function (carousel) {
    var track = carousel.querySelector(".carousel-track");
    if (!track) return;
    var prev = carousel.querySelector("[data-dir='prev']");
    var next = carousel.querySelector("[data-dir='next']");
    var scrollBy = function (dir) {
      var card = track.firstElementChild;
      var amount = card ? card.getBoundingClientRect().width + 24 : 360;
      track.scrollBy({ left: dir * amount, behavior: "smooth" });
    };
    if (prev) prev.addEventListener("click", function () { scrollBy(-1); });
    if (next) next.addEventListener("click", function () { scrollBy(1); });
  });

  /* Hero unfold demo — auto-plays on load, then user-toggleable */
  var heroDemo = document.querySelector("[data-hero-demo]");
  if (heroDemo) {
    var heroBtn = heroDemo.querySelector(".demo-toggle");
    var heroStatus = heroDemo.querySelector(".demo-status");
    var setHeroOpen = function (open) {
      heroDemo.classList.toggle("is-open", open);
      if (heroBtn) {
        heroBtn.textContent = open ? "Fold for transport" : "Expand on site";
        heroBtn.setAttribute("aria-pressed", open ? "true" : "false");
      }
      if (heroStatus) {
        heroStatus.textContent = open
          ? "Expanded on site — installed in a day"
          : "Folded to standard road width";
      }
    };
    setHeroOpen(false);
    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(function () { setHeroOpen(true); }, reduceMotion ? 0 : 800);
    if (heroBtn) {
      heroBtn.addEventListener("click", function () {
        setHeroOpen(!heroDemo.classList.contains("is-open"));
      });
    }
  }

  /* Expand animation concept */
  document.querySelectorAll("[data-expand-demo]").forEach(function (demo) {
    var home = demo.querySelector(".expand-home");
    var btn = demo.querySelector(".expand-toggle");
    if (!home || !btn) return;
    var setLabel = function () {
      var expanded = home.classList.contains("expanded");
      btn.textContent = expanded ? "Collapse for transport" : "Expand on site";
      btn.setAttribute("aria-pressed", expanded ? "true" : "false");
    };
    btn.addEventListener("click", function () {
      home.classList.toggle("expanded");
      setLabel();
    });
    /* Auto-play once when scrolled into view */
    if ("IntersectionObserver" in window) {
      var played = false;
      var eio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !played) {
            played = true;
            setTimeout(function () {
              home.classList.add("expanded");
              setLabel();
            }, 600);
            eio.unobserve(demo);
          }
        });
      }, { threshold: 0.5 });
      eio.observe(demo);
    }
    setLabel();
  });

  /* Enquiry forms — client-side validation + success state.
     Wire `action` to your form endpoint (Formspree, Netlify, CRM webhook)
     and remove the preventDefault below to submit for real. */
  document.querySelectorAll("form[data-enquiry]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var honeypot = form.querySelector(".honeypot input");
      if (honeypot && honeypot.value) return; /* bot */
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var success = form.querySelector(".form-success");
      if (success) {
        success.classList.add("visible");
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
      form.querySelectorAll("input, select, textarea, button").forEach(function (el) {
        if (!el.closest(".form-success")) el.disabled = true;
      });
    });
  });

  /* Finance calculator */
  var calc = document.querySelector("[data-calc]");
  if (calc) {
    var amount = calc.querySelector("#calc-amount");
    var deposit = calc.querySelector("#calc-deposit");
    var years = calc.querySelector("#calc-years");
    var rate = calc.querySelector("#calc-rate");
    var out = calc.querySelector("#calc-result");
    var fmt = function (n) {
      return "$" + Math.round(n).toLocaleString("en-AU");
    };
    var update = function () {
      var P = parseFloat(amount.value) - parseFloat(deposit.value);
      if (P < 0) P = 0;
      var r = parseFloat(rate.value) / 100 / 12;
      var n = parseFloat(years.value) * 12;
      var repay = r > 0 ? (P * r) / (1 - Math.pow(1 + r, -n)) : P / n;
      calc.querySelector("#calc-amount-val").textContent = fmt(parseFloat(amount.value));
      calc.querySelector("#calc-deposit-val").textContent = fmt(parseFloat(deposit.value));
      calc.querySelector("#calc-years-val").textContent = years.value + " years";
      calc.querySelector("#calc-rate-val").textContent = parseFloat(rate.value).toFixed(1) + "% p.a.";
      out.textContent = fmt(repay);
    };
    [amount, deposit, years, rate].forEach(function (el) {
      el.addEventListener("input", update);
    });
    update();
  }

  /* Current year in footer */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
