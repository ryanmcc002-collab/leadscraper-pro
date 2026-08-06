# Go Tiny Homes — Website

A premium, conversion-focused marketing website for **Go Tiny Homes**, Australia's premium supplier of expandable tiny homes. Built as a fast, dependency-free static site with a small Node-based generator.

## Quick start

```bash
node scripts/build.mjs   # regenerate all HTML + SVG imagery + sitemap
npx serve .              # preview locally (any static server works)
```

The generated HTML at the repo root is committed, so the site can be deployed as-is to any static host (Netlify, Vercel, Cloudflare Pages, S3, GitHub Pages) with **no build step required**.

## Architecture

```
index.html, products.html, …      Generated pages (committed, deployable as-is)
product-*.html                    7 product pages, generated from data
blog-*.html                       SEO articles with BlogPosting schema
assets/css/main.css               Design system (navy #0D233F / gold #D6AF5E)
assets/js/main.js                 Interactions: nav, reveal, carousel, forms, calculator
assets/img/*.svg                  Generated illustrative imagery + hand-drawn hero/map
scripts/build.mjs                 Build entry point
scripts/lib/layout.mjs            Shared header/footer/SEO layout + site constants
scripts/lib/products-data.mjs     Single source of truth for the product catalogue
scripts/lib/scenes.mjs            Parametric SVG scene + floorplan generators
scripts/lib/product-page.mjs      Product page template
scripts/pages/*.mjs               One module per site page
sitemap.xml, robots.txt, 404.html SEO infrastructure (sitemap is generated)
```

To change site-wide details (phone, email, domain), edit `SITE` in `scripts/lib/layout.mjs` and rebuild. To add or edit a product, edit `scripts/lib/products-data.mjs` and rebuild — the product page, catalogue cards, imagery, floorplan and schema all update.

## Go-live checklist

- [ ] **Domain**: update `SITE.url` in `scripts/lib/layout.mjs` (currently `https://www.gotinyhomes.com.au`) and rebuild.
- [ ] **Forms**: forms are front-end complete with validation, honeypot and success states. Wire each `form[data-enquiry]` `action` to your endpoint (Formspree, Netlify Forms, or a CRM webhook) and remove the `preventDefault` in `assets/js/main.js`.
- [ ] **Photography**: illustrative SVG renders are used throughout. Replace hero/product/gallery images with real photography when available (keep the same filenames or update references). Also swap the `og:image` to a 1200×630 JPG/PNG for best social sharing.
- [ ] **Business details**: replace placeholder ABN in the footer (`scripts/lib/layout.mjs`), confirm the phone number and email.
- [ ] **Reviews**: the site intentionally ships with no testimonials or rating schema. Once real customer reviews exist (e.g. Google Reviews), add them and the matching `aggregateRating` structured data — never publish placeholder ratings, which breach Google's guidelines.
- [ ] **Analytics**: add your analytics snippet to `layout.mjs`.
- [ ] **404 page**: configure your host to serve `404.html` for missing routes.
- [ ] **Live chat**: a placeholder position is reserved bottom-right (floating quote button); swap in your chat widget if desired.

## Design system

- **Palette** (from the Go Tiny Homes logo): Forest Green `#333D26` (logo green `#4C5B3B` for mid-tones), Wombat Tan `#C99B54`, Warm Paper `#F7F7F1`, White. The mascot artwork itself should be added as an image asset when you have the master file.
- **Type**: Manrope (Google Fonts) with fluid `clamp()` scale.
- **Motion**: IntersectionObserver reveal animations, gated behind an `html.js` class so no-JS users and crawlers always see full content; `prefers-reduced-motion` respected.
- **Accessibility**: skip link, semantic landmarks, focus-visible styles, ARIA labels on interactive controls, keyboard-operable accordions (`<details>`), colour-contrast-checked palette.
- **SEO**: unique titles/descriptions, canonical URLs, Open Graph, JSON-LD (Organization, WebSite, Product, FAQPage, BlogPosting, BreadcrumbList, ItemList), sitemap.xml, robots.txt, semantic internal linking.
