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

  /* Cinematic hero — delivery + unfold story, auto-plays then scrubbable.
     A single progress value p (0..1) drives every element, so the timeline
     slider and stage chips can scrub the whole sequence like a video. */
  var cine = document.querySelector("[data-cinema]");
  if (cine) {
    var q = function (s) { return cine.querySelector(s); };
    var truck = q(".cine-truck");
    var homeG = q(".cine-home");
    var wingL = q(".cine-wing-l");
    var wingR = q(".cine-wing-r");
    var roof = q(".cine-roof");
    var deckEl = q(".cine-deck");
    var flue = q(".cine-flue");
    var spillEl = q(".cine-spill");
    var mascotEl = q(".cine-mascot");
    var litL = q(".lit-l");
    var litC = q(".lit-core");
    var litR = q(".lit-r");
    var wheelEls = cine.querySelectorAll(".cine-wheel");
    var scrubEl = q(".cinema-scrub");
    var statusEl = q(".cinema-status");
    var chipEls = cine.querySelectorAll(".cinema-chip");
    var replayEl = q(".cinema-replay");

    var clampN = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
    var segF = function (p, a, b) { return clampN((p - a) / (b - a), 0, 1); };
    var eOut = function (t) { return 1 - Math.pow(1 - t, 3); };
    var eIn = function (t) { return t * t * t; };
    var eInOut = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

    var prog = 1;
    var raf = null;

    var render = function (p) {
      prog = clampN(p, 0, 1);
      var driveIn = eOut(segF(prog, 0, 0.3));
      var settle = eInOut(segF(prog, 0.34, 0.46));
      var exit = eIn(segF(prog, 0.42, 0.62));
      var open = eInOut(segF(prog, 0.52, 0.84));

      var truckX = -760 * (1 - driveIn) + 1180 * exit;
      var homeX = -760 * (1 - driveIn);
      var homeY = -44 * (1 - settle);
      truck.setAttribute("transform", "translate(" + truckX + " 0)");
      homeG.setAttribute("transform", "translate(" + homeX + " " + homeY + ")");

      var deg = ((truckX % 151) / 151) * 360;
      wheelEls.forEach(function (w) {
        w.setAttribute("transform", "rotate(" + deg + " " + w.getAttribute("data-cx") + " " + w.getAttribute("data-cy") + ")");
      });

      wingL.setAttribute("transform", "translate(" + 175 * (1 - open) + " 0)");
      wingR.setAttribute("transform", "translate(" + -175 * (1 - open) + " 0)");
      var roofS = 0.36 + 0.64 * open;
      var deckS = 0.34 + 0.66 * open;
      roof.setAttribute("transform", "translate(800 0) scale(" + roofS + " 1) translate(-800 0)");
      deckEl.setAttribute("transform", "translate(800 0) scale(" + deckS + " 1) translate(-800 0)");
      deckEl.style.opacity = settle;
      flue.style.opacity = segF(prog, 0.8, 0.9);

      litL.style.opacity = 0.95 * segF(prog, 0.8, 0.88);
      litC.style.opacity = segF(prog, 0.84, 0.92);
      litR.style.opacity = 0.95 * segF(prog, 0.88, 0.96);
      spillEl.style.opacity = segF(prog, 0.9, 1);
      if (mascotEl) {
        var mt = segF(prog, 0.9, 1);
        mascotEl.style.opacity = mt;
        mascotEl.setAttribute("transform", "translate(0 " + 16 * (1 - eOut(mt)) + ")");
      }

      cine.classList.toggle("is-done", prog > 0.995);
      if (scrubEl) {
        scrubEl.value = Math.round(prog * 1000);
        scrubEl.style.setProperty("--cine-fill", prog * 100 + "%");
      }
      if (statusEl) {
        statusEl.textContent =
          prog < 0.05 ? "One truck. One delivery." :
          prog < 0.36 ? "Delivered on a single truck" :
          prog < 0.56 ? "Set down on your site" :
          prog < 0.92 ? "Wings unfold in hours" :
          "Move-in ready. Lights on.";
      }
      var active = prog < 0.45 ? 0 : prog < 0.94 ? 1 : 2;
      chipEls.forEach(function (c, i) { c.classList.toggle("active", i === active); });
      cine.classList.add("is-ready");
    };

    var stopAnim = function () {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    };
    var animateTo = function (target, ms) {
      stopAnim();
      var from = prog;
      var start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var t = clampN((ts - start) / ms, 0, 1);
        render(from + (target - from) * t);
        if (t < 1) raf = requestAnimationFrame(step);
        else raf = null;
      };
      raf = requestAnimationFrame(step);
    };
    var play = function () {
      render(0);
      animateTo(1, 5200);
    };

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      render(1);
    } else {
      render(0);
      window.setTimeout(play, 600);
    }

    if (scrubEl) {
      scrubEl.addEventListener("input", function () {
        stopAnim();
        render(parseInt(scrubEl.value, 10) / 1000);
      });
    }
    chipEls.forEach(function (c) {
      c.addEventListener("click", function () {
        animateTo(parseFloat(c.getAttribute("data-go")), reduce ? 0 : 900);
      });
    });
    if (replayEl) {
      replayEl.addEventListener("click", function () {
        if (reduce) { render(1); return; }
        play();
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

  /* Scroll progress bar under the sticky header */
  var progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    var updateProgress = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      progressBar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* Pointer tilt on product cards and bento tiles (pointer devices only) */
  var canTilt =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canTilt) {
    document.querySelectorAll(".product-card, .bento-tile").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        el.setAttribute("data-tilting", "");
        el.style.transform =
          "perspective(800px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
      });
      el.addEventListener("pointerleave", function () {
        el.removeAttribute("data-tilting");
        el.style.transform = "";
      });
    });
  }

  /* Current year in footer */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
