# Rippa Victoria: build brief

Read this whole file first. Then open `reference/home.html` and `reference/product.html` in a browser and screenshot both at 390 px and 1280 px wide. **That is the design.** Your job is to turn it into a complete, data-driven site. You are not designing anything.

## What this is

A sales demo for Rippa Victoria (rippavictoria.com.au), a new dealer of Rippa mini excavators and skid steer loaders in Victoria. The owner, Min, asked for a site like her sister franchise's, rippansw.com, only much better and with the machines explained more clearly. She'll open this on her phone and decide in about a minute whether we get the job.

It has to read instantly as a machinery dealership: real machine photos, categories, prices, a phone number. The clever parts (fit tool, weekly repayments, lead flow) live inside that, they don't replace it.

Built by Can AI Help? (canaihelp.com.au). Build it as the real foundation of the live site, not a throwaway.

## What you've been given

```
BRIEF.md
reference/   home.html, product.html, styles.css, app.js   <- the design, working
data/        machines.json        <- 11 machines, specs extracted, copy written, photos chosen. USE THIS.
             site.config.json     <- phone, brand colours, finance rate, fit tool settings, demo flag
             source-products.json <- raw scrape. Reference only. Never publish its text.
images/      {source_slug}/NN.ext <- product photos. Paths are already in machines.json
tools/       scrape.py            <- how the raw data was pulled. You don't need to run it.
```

## Hard rules

1. **Do not scrape or fetch anything.** Everything you need is in this folder.
2. **Do not redesign.** Reuse `reference/styles.css` as the site stylesheet. Same colours, fonts, spacing, buttons, cards, sections. New pages are assembled from the existing components. If you need a new component, build it from the same tokens so it's indistinguishable from the rest.
3. **No drawings or illustrations of machines.** Photos only.
4. **No frameworks.** Hand-coded HTML, the supplied CSS, vanilla JS, and one plain Node build script with no dependencies.
5. **Never render an empty section, a blank value or "undefined".** Skid steers have far less spec data than excavators. If a machine has no data for a section, leave that section out.
6. **Machines with `"published": false` are skipped everywhere.**
7. Only use copy from `machines.json` or write it fresh. Nothing from `source_description` goes on the site.

## Build system

`build.js` reads `data/*.json` plus templates in `src/` and writes a static site to `dist/`.

- Shared partials for header, footer, mobile call bar, enquiry form, finance estimator and fit tool, so each exists once
- `styles.css` and `app.js` copied to `dist/assets/`, `images/` copied to `dist/images/`
- Config values (phone, finance rate, term, clearance) injected at build time. `app.js` currently hardcodes them in `CFG`: replace that with values read from a small inline JSON script tag
- Work out each machine's weekly estimate at build time and print it into the HTML, so there's no flash of empty text. JS still updates it live in the estimator
- Counts and "from $X" in the hero come from the data, not typed by hand
- Every page gets its own title and meta description. Every machine page gets Product JSON-LD. While `demo` is true, every page is `noindex, nofollow`
- `npm run build` and `npm run serve` (any zero-dependency static server) in `package.json`

## Pages

| URL | What it is |
|---|---|
| `/` | Home, exactly as `reference/home.html`, generated from data |
| `/excavators/` | Category page |
| `/skid-steers/` | Category page |
| `/attachments/` | Simple page, no products yet |
| `/excavators/{slug}/`, `/skid-steers/{slug}/` | One page per published machine, as `reference/product.html` |
| `/finance/` | Estimator page |
| `/contact/` | Enquiry form, phone, location |
| `/terms/`, `/manuals/` | One-line placeholders: "Coming with the full site." |

**Home.** Same sections in the same order as the reference. Featured machines: R13 Pro, R18 Pro, R22 Pro, RS06. Fit tool lists every published excavator, narrowest first. The two R10s share a width, so they share one row.

**Category pages.** Navy header band with the hazard stripe, H1 and one line of intro. Then a filter bar using the existing `.presets` button style:
- "What's the job?" with Any job, Trenching for plumbing and electrical, Backyard and landscaping, Farm and fencing, Post holes, Small demolition. These map to `good_for` keys: `trenching`, `backyard`, `farm`, `post-holes`, `demolition`
- "In stock only" toggle
- Sort: price low to high, price high to low, smallest first

Filtering hides non-matching cards and shows a count ("4 of 6 machines"). If nothing matches, say so and offer a "Show all machines" button. Below the grid: the fit tool (excavators page only), then the enquiry section. On category pages the cards use the normal grid, not the swipe strip.

**Machine pages.** Follow `reference/product.html` section by section. Breadcrumb, gallery and buy box, "What the numbers mean" from `meanings`, full spec table from `specs` inside the `<details>`, "What's included" from `included`, options and warranty as short lists, single-machine fit check (excavators only), estimator locked to this machine's price, enquiry form with the machine pre-filled, then up to three related machines from the same category as cards. The four boxes in the buy panel use the best four facts available for that machine.

Display rules for numbers: millimetres with a thousands comma ("1,300 mm"). Depth and reach in metres to two decimals ("2.42 m"). Weight in kg with a comma. Prices as "$18,499". Horsepower rounded to whole numbers.

**Attachments.** H1, a short paragraph, the attachment types as an `.inc` list (buckets, trenching buckets, mud buckets, rippers, rakes, grabs, hydraulic thumbs, augers, breakers, pallet forks, 4-in-1 buckets, trenchers, dozer blades), and an enquiry form titled "Ask about an attachment". No prices.

**Finance.** H1, the estimator with the machine dropdown, then three real steps as a numbered list: pick a machine, a short chat with OnlyForks Finance, approval and delivery. The disclaimer from config always sits under the estimator.

## Behaviour

`reference/app.js` already has working code for weekly estimates, the fit tool, the estimator, the gallery and the enquiry form with the lead flow reveal. Keep it and extend it:

- Mobile menu: the Menu button opens a full-width panel with the nav links. Closes on Escape and on link tap. `aria-expanded` kept in sync
- Category filters and sort as described above
- Gallery: swipe left and right on touch, arrow keys when focused
- Enquiry form: real validation messages in plain words ("Add a mobile number so we can call you back"). When `demo` is true nothing is sent and the lead flow reveal plays. When false, the reveal is not rendered at all and the form posts to a URL from config
- "Ask about finance" buttons scroll to the enquiry form and tick the finance box
- Motion only ever answers a user action. No scroll-triggered animations. Respect `prefers-reduced-motion`

## Copy

Australian spelling: metres, tonne, colour, enquiry, organise. Plain English for someone who has never bought a machine. Buttons say what they do ("Enquire about the R18 Pro"). No hype words, no exclamation marks. Headings are short because they render in heavy uppercase.

Don't mention NSW, Rynoquip, Gunnedah, or any phone number other than the one in config. Every page footer carries `concept_footer` from config while `demo` is true.

## Quality bar

- Lighthouse mobile 95+ for performance, accessibility, best practices
- Hero image loads eagerly with `fetchpriority="high"`. Every other image lazy-loads and has width and height set
- Visible keyboard focus everywhere, labels on every field, 44 px minimum tap targets, colour never the only signal (the fit tool always pairs colour with words)
- No horizontal scroll at 360 px. Test at 360, 390, 768, 1280
- No console errors, no broken images, no dead internal links

## Build order

1. `build.js`, partials, and the home page generated from data. Screenshot it next to `reference/home.html`. They should be indistinguishable. Don't move on until they are
2. Machine page template, all ten published machines. Check one excavator and one skid steer by eye. The skid steer page should look complete, not half-empty
3. Category pages with filters
4. Attachments, finance, contact, placeholders
5. Mobile menu, gallery swipe, form validation
6. Full screenshot pass at 390 and 1280 on home, one category, one excavator, one skid steer. Fix anything that looks broken, cramped or inconsistent with the reference
7. `README.md`: how to build and serve, how to change prices, stock and photos in `machines.json`, how to turn off demo mode, and a list of everything still unconfirmed (see below)

## Unconfirmed data, list these in the README

- All prices are the NSW franchise's. Min sets her own
- All stock statuses are placeholders
- Specs came from the NSW site's listings and need Min's check, especially the retracted track widths the fit tool depends on
- Warranty wording and the pre-delivery checklist need Min's confirmation
- Finance rate in config is a placeholder until OnlyForks Finance supplies one
- "Serviced and tested in Victoria" in the hero needs Min's confirmation
- Email and yard location in config are still TODO
- The Rynoquip RS-05 is unpublished until Min confirms she sells it

## Done when

Put the site and rippansw.com side by side on a phone. A stranger should say they're the same kind of business and that this one is obviously better: clearer, faster, easier to pick a machine, easier to enquire. And every page should look like it came from the same hand as the two reference pages.
