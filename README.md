# Rippa Victoria

Sales site for Rippa Victoria (rippavictoria.com.au): Rippa mini excavators and skid steer loaders in Victoria.
Built by Can AI Help? as the foundation of the live site. Static HTML, hand-written CSS and vanilla JS, no frameworks.

## Build and serve

Needs Node 18 or newer. Nothing to install.

```
npm run build     # reads data/*.json and src/, writes the site to dist/
npm run serve     # serves dist/ at http://localhost:8080  (PORT=3000 npm run serve to change it)
```

`dist/` is generated and not committed. Deploy the contents of `dist/` to any static host.

## Where things live

```
build.js                 the build: pages, image sizes, config injection, copies assets and photos
serve.js                 zero-dependency static server for local checks
data/machines.json       every machine: name, price, stock, specs, copy, photos
data/site.config.json    phone, finance rate and term, fit tool settings, demo flag, footer line
data/source-products.json  raw scrape from the NSW site, reference only, never published
images/{machine}/NN.ext  product photos, plus -160 / -480 / -800 WebP variants made by the tool below
src/layout.js            page shell: head, header, footer, mobile call bar
src/partials/            header, footer, mobile bar, card, fit tool, estimator, enquiry form, page band
src/pages/               home, machine, category, and the simple pages (attachments, finance, contact, terms, manuals)
src/lib/                 number formatting and the machine helpers (facts, chips, spec table, fit rows)
src/assets/styles.css    the site stylesheet: reference/styles.css plus a short additions block at the end
src/assets/app.js        behaviours: weekly estimates, fit tool, estimator, gallery, form, menu, filters
src/assets/fonts/        Barlow and Barlow Condensed, self-hosted (SIL Open Font License)
reference/               the pinned design (home.html, product.html). Not part of the build.
tools/make-image-variants.js  writes the resized photo variants (see Photos)
tools/scrape.py          how the raw data was pulled. Not needed to build.
```

## Changing prices, stock, specs and copy

Everything on the site comes from `data/machines.json`. Edit it and run `npm run build`.

- **Price:** `"price": 18499`. Weekly estimates, the finance dropdown and the "from $X" line in the hero all follow from it.
- **Stock:** `"status"` is one of `"in-stock"`, `"arriving"` (shows "Arriving soon") or `"order-in"` (shows "Order in").
  The "In stock only" filter on category pages only keeps `"in-stock"` machines.
- **Hide a machine:** set `"published": false`. It disappears from every page, the fit tool, the finance dropdown and the enquiry form, and its photos are not copied to `dist/`.
- **Specs:** in millimetres, kilograms, litres per minute and so on, as the key names say. Leave out any spec you don't have.
  The site prints only what is there, so a machine with no `dig_depth_mm` simply has no dig depth anywhere.
  The fit tool needs `width_min_mm` (track width with the tracks retracted). Machines without it are left out of the fit tool.
- **Copy:** `tagline`, `summary` (bullet points in the buy box), `meanings` (the "What the numbers mean" section, keyed by the spec it explains),
  `included`, `options`, `warranty`, `badge` (the small label on the photo). Empty lists mean the section is left out.
- **Job filters:** `good_for` uses the keys `trenching`, `backyard`, `farm`, `post-holes`, `demolition`.
- **Featured machines on the home page** are set by slug at the top of `src/pages/home.js`.

## Photos

Photos live in `images/{source_slug}/`. `images.primary` is the card and hero photo; `images.gallery` is the order on the machine page (first one is the main photo).

After adding or replacing a photo, run:

```
node tools/make-image-variants.js
```

It writes `NN-160.webp`, `NN-480.webp` and `NN-800.webp` next to each photo, which the build uses for `srcset` so phones get small files.
The tool uses Playwright's Chromium to resize (it is the only thing in the project that needs it). Without the variants the site still builds and works; it just serves the original files.

## Config

`data/site.config.json`:

- `phone_display` and `phone_href`: the only phone number on the site.
- `finance.rate_pct`, `default_term_months`, `default_deposit_pct`: drive every weekly estimate. `finance.disclaimer` sits under every estimator.
- `fit_tool`: slider range, default and the clearance (mm to spare) that separates "Fits" from "Very tight".
- `concept_footer`: the line in the footer while demo mode is on.
- `email` and `location`: still TODO. While they start with "TODO" the site shows "Victoria, Australia" and no email.

## Turning off demo mode

In `data/site.config.json` set `"demo": false` and put the live form endpoint in `"enquiry_form_action"` (for example a HubSpot form endpoint), then rebuild. This:

- removes the `noindex, nofollow` meta tag from every page
- removes the "What happens next on the live site" reveal, so the enquiry form posts to `enquiry_form_action` instead
- removes the concept footer line

The form posts `name`, `phone`, `machine`, `job` and `finance` as plain form fields.

## Checks the build does

- Fails if any page contains "undefined", "null" or "NaN" outside script tags, or references a photo that doesn't exist.
- Every page has its own title and description. Machine pages carry Product JSON-LD.
- Weekly repayments are printed into the HTML at build time and kept live by `app.js`, using the same formula.

## Still unconfirmed (needs Min)

- **All prices are the NSW franchise's.** Min sets her own. Every machine has `"price_confirmed": false`.
- **All stock statuses are placeholders.** Every machine has `"status_confirmed": false`.
- **Specs came from the NSW site's listings** and need Min's check, especially the retracted track widths (`width_min_mm`) the fit tool depends on.
- **Warranty wording** (`warranty` on each machine) and the **pre-delivery checklist** on the home page (`PRE_DELIVERY` in `src/pages/home.js`) need Min's confirmation.
- **Finance rate** in config (9.95%) is a placeholder until OnlyForks Finance supplies one (`rate_confirmed: false`).
- **"Serviced and tested in Victoria"** in the hero needs Min's confirmation.
- **Email and yard location** in config are still TODO.
- **The Rynoquip RS-05** is unpublished until Min confirms she sells it.
- **The enquiry form endpoint** (`enquiry_form_action`) is not set up yet; the site is in demo mode.
