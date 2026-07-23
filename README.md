# Stowly — share the space in your suitcase

A peer-to-peer baggage marketplace: travellers who **haven't** bought extra
carry-on or checked baggage pay travellers who **have spare allowance** to
carry items for them, per kilo, with escrow-protected payments.

## The product

- **Carriers** list an upcoming flight, how many spare kilos they have, and a
  price per kg. Flights are auto-verified against the airline.
- **Senders** browse verified carriers on their route (or post a request) and
  pay per kilo into escrow.
- **Safety model**: government-ID verification, inspect-at-hand-off rule,
  prohibited-items screening, and escrow that only releases when the receiver
  confirms delivery with a one-time code. Stowly takes a 10% service fee.

## This build

A fully interactive front-end prototype with mock data — no backend required.
Open `index.html` in a browser (or serve the folder with any static server).

| View | What it shows |
|---|---|
| Dashboard | Earnings chart, stat tiles, next trip, active shipments, activity feed |
| Find space | Marketplace search over verified carrier trips, booking flow with live fee calc |
| My trips | Carrier-side listings with unsold kilos and pending requests |
| Shipments | Escrow status timelines for everything you're carrying or sending |
| Messages | In-app chat for coordinating hand-offs (you can send messages) |
| Profile | Verification levels, safety rules, payout history |

Design system: Apple-style treatment — SF system font stack, `#F5F5F7` ground,
Apple blue `#0071E3` accent, frosted-glass sidebar, full light **and** dark
themes (follows OS preference), reduced-motion support, keyboard focus states.

## Stack

Zero dependencies: hand-written HTML + CSS custom properties + vanilla JS
(SPA rendering, SVG chart with hover tooltips, modals, toasts). ~1,300 lines.

```
index.html      app shell
css/app.css     design tokens + components (light/dark)
js/app.js       data, views, router, chart, interactions
```
