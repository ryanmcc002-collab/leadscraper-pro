# Rippa Victoria concept demo

A sales demo for Rippa Victoria (Min, 0423 499 172), built by Can AI Help?
One link, opens on a phone, explains the excavator range so clearly the buyer
picks their own machine. Built as the first third of the real site: same data
file, same templates, same build.

## Run it

```
node build.js
```

Plain Node, no dependencies. Writes the whole site to `dist/`. Open
`dist/index.html` directly or serve the folder with any static host
(Netlify, Cloudflare Pages, GitHub Pages: point it at `dist/`).

`dist/` is committed so the demo can be hosted straight from the repo.
Rebuild and commit after any change to data, config, templates or CSS.

## What is where

| Path | What it is |
|---|---|
| `PLAN.md` | Palette, type, wireframes, avoid-list check. Written before the code |
| `site.config.json` | Business name, phone, email, service area, finance settings, `DEMO` flag |
| `data/machines.json` | The single source of truth: every machine, every spec, every meaning line |
| `src/templates/*.html` | Page templates. `{{x}}` is escaped, `{{{x}}}` is raw HTML |
| `src/css/site.css` | The one stylesheet, minified into `dist/` by the build |
| `src/js/draw.js` | Parametric SVG: `excavator(dims)`, `person`, `ute`, `gate`, `attachment` |
| `src/js/finance.js` | Amortisation maths, shared by the build and the browser |
| `src/js/lineup.js` | Home page line-up: gate slider, job filter, machine select |
| `src/js/site.js` | Nav, gallery, finance estimator, enquiry form, lead-flow reveal |
| `assets/` | Fonts, logo, machine photos and brochures. Copied into `dist/assets/` |
| `build.js` | Reads all of the above and writes `dist/` |

Pages built: `/`, `/excavators/`, `/excavators/{slug}/` for all six machines,
`/skid-steers/` and `/attachments/` (coming-soon pages).

## Before Min sees it: what to check

Every machine is marked `"confirmed": false` in `data/machines.json`. The
build prints the list each time it runs. Right now that is all six:

- `r10-petrol`
- `r10-diesel`
- `r13-pro`
- `r15`
- `r18-pro`
- `r22-pro`

Prices are Rippa NSW's placeholders (from the screenshots Ryan supplied) and
are not Rippa Victoria's prices.

Spec numbers came from Rippa manufacturer pages and overseas dealer listings
found by web search, because rippansw.com and the other Rippa dealer sites were
blocked from the build environment. The numbers to treat with most suspicion:

| Machine | Solid from sources | Estimated to fill the drawing |
|---|---|---|
| R10 petrol | operating weight, engine, dig depth, width | height, length, track length, reach, dump height |
| R10 diesel | operating weight, engine, dig depth, width | height, length, track length, reach, dump height |
| R13 Pro | weight, engine, length, height, width, dig depth, reach | track length, dump height |
| R15 | weight, engine, width, length | height, dig depth, reach, dump height, track length |
| R18 Pro | weight, engine, width, dig depth, reach, dump height | height, length, track length |
| R22 Pro | weight, engine, width, length, dig depth, reach, dump height | height, track length |

Transport weights are operating weight less roughly 75 kg and are estimates
throughout. Included attachments are a plausible package per machine, not
confirmed. Status (in stock, arriving, order in) is made up for the demo.

Once Min confirms a machine, set `"confirmed": true` and it drops off the list.

## Swapping in the real thing

**Specs and prices.** Edit `data/machines.json`. All dimensions in millimetres,
weights in kilograms, prices in dollars including GST. `widthMin` is the
narrowest transport width (tracks in) and drives the "fits" logic. Rebuild.
The drawings, the line-up, the range page, the spec plates, the finance
figures and the JSON-LD all update from this one file.

**Brochure spec sheets.** Drop PDFs into `assets/brochure/`. They are copied
to the site for reference. Their numbers should win over anything scraped:
update the JSON by hand from them.

**Photos.** Put files in `assets/machines/{slug}/`, named `1.webp`, `2.webp`
and so on (jpg and png also work). Keep them at 1,600 px wide or less and
WebP if you can. The machine page shows the first one large and the rest as
thumbnails. With no photos, the page shows the profile drawing instead, so
nothing is ever broken. Never hotlink to the NSW site's Wix images.

**Logo.** Save it as `assets/logo.svg`. The header picks it up automatically
beside the business name.

**Phone, email, service area, finance.** `site.config.json`. The finance rate,
provider name, link and button label are all there. The disclaimer text is
there too and is shown under every estimate.

**Enquiry form.** Add `"formAction": "https://..."` to `site.config.json` with
the endpoint (HubSpot form, Formspree, a Make or n8n webhook). With `DEMO`
off and an action set, the form posts normally. With no action, it shows the
thank-you message without sending.

**Copy.** Home sections live in `src/templates/home.html`. Machine summaries
and the meaning lines are in the data file so Min can edit them later without
touching HTML.

## Turning off DEMO

In `site.config.json` set `"DEMO": false` and rebuild. This:

- removes `noindex, nofollow` from every page (Lighthouse SEO goes from 63 to 100)
- removes the "What happens next on the live site" panel from the enquiry form
- lets the enquiry form post to `formAction` if one is set

The "Concept preview by Can AI Help?" footer line is in
`src/templates/layout.html`; change it when the site goes live.

## Checks done on this build

- Lighthouse mobile (Chromium, local server): performance 99 to 100,
  accessibility 100, best practices 100 on home, range and machine pages.
  SEO 63 in demo mode because of the required `noindex`; 100 with `DEMO` off.
- Cumulative layout shift 0.000. The hero renders with no image requests.
- Total JavaScript 11.7 KB across the three scripts.
- 128 internal links and asset references checked, none broken.
- No console errors on any page.
- Reviewed at 380, 768 and 1280 px.

## The line-up, in one paragraph

Every item is an inline SVG with a viewBox in millimetres. One CSS custom
property, `--px-per-mm`, scales all of them, so the person, the gate, the ute
and the six machines are always at the same scale. On phones the scale is
fixed and the strip scrolls with the person pinned at the left. On wide
screens the scale is computed so the whole range fits the viewport. The gate
slider moves the far post with a CSS transform; machines wider than the gap
step back and get a "Won't fit" tag. Job buttons check `goodFor` in the data
file. Tapping a machine opens the spec plate. Nothing is drawn by hand: change
a dimension in the JSON and the drawing changes.
