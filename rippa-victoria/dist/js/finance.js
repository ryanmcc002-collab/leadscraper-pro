/* Finance maths, shared by build.js (for the numbers baked into the pages) and
   the browser estimator. Standard amortisation. Weekly = monthly x 12 / 52. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RippaFinance = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function monthly(principal, annualRatePct, years) {
    var n = Math.round(years * 12);
    if (principal <= 0 || n <= 0) return 0;
    var r = annualRatePct / 100 / 12;
    if (r === 0) return principal / n;
    return principal * r / (1 - Math.pow(1 + r, -n));
  }
  function weekly(price, opts) {
    var deposit = price * (opts.depositPct || 0) / 100;
    var m = monthly(price - deposit, opts.annualRatePct, opts.termYears);
    return m * 12 / 52;
  }
  function money(v, cents) {
    var f = cents ? v.toFixed(2) : Math.round(v).toString();
    var parts = f.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + parts.join('.');
  }
  return { monthly: monthly, weekly: weekly, money: money };
});
