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
index.html                        The entire site — one page, anchor-navigated
blog.html, blog-*.html            SEO guide articles (satellite pages)
assets/css/main.css               Design system
assets/js/main.js                 Interactions: nav, reveal, cinema, forms, calculator
assets/photos/*.webp              Real manufacturer photography
assets/img/*.svg                  Floor plan, map, favicon, mascot
scripts/build.mjs                 Build entry point
scripts/lib/layout.mjs            Shared header/footer/SEO layout + site constants
scripts/lib/products-data.mjs     Product/edition data (specs, floor plan, photos)
scripts/pages/*.mjs               01-index (one-pager), 09-blog, 10-404
sitemap.xml, robots.txt, 404.html SEO infrastructure
```

One-pager sections and anchors: `#home` (specs + floor plan), `#editions`, `#inside`
(gallery), `#delivery`, `#about` (quality), `#finance` (calculator), `#faq`, `#quote` (form).

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

## Project status (updated 2026-08-06)

Everything below is live on branch `claude/bondi-tiny-homes-website-48oqy4`:

- **Brand**: Go Tiny Homes (gotinyhomes.com.au), logo green `#4C5B3B`/`#333D26` + wombat tan `#C99B54`, roof-over-GO monogram, tagline "Go Tiny. Live Big.", mascot at `assets/img/mascot.webp` (source `mascot.png`).
- **Design**: light-first (paper/white pages, dark green only for stats band, CTA banners, footer), Fraunces serif headings with tan italic accents, bento grid, scrubbable delivery/unfold hero animation (daylight scene).
- **Products**: real Model 0206 two-bedroom expandable only (Classic White + Black Edition, specs from the manufacturer's order sheets). No published prices anywhere — all CTAs lead to delivered-quote requests. No invented reviews, stats, or warranty terms.
- **Lighthouse** (last run): Performance 96, Accessibility 100, Best Practices 96, SEO 100.

### Waiting on
1. **Manufacturer photos** — drop into repo, then replace scene SVG references in product hero/galleries and the homepage bento map tile.
2. Real contact details (phone/email/ABN) in `scripts/lib/layout.mjs` → `SITE`.
3. Warranty terms + exact dimensions when confirmed → product specs and FAQ.
4. Form backend (Formspree or HubSpot) → `assets/js/main.js` enquiry handler.
