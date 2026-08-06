/* Go Tiny Homes — static site build.
   Usage: node scripts/build.mjs
   Generates product imagery (SVG), all HTML pages and sitemap.xml at the repo root. */

import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "./lib/products-data.mjs";
import { sceneSvg, floorplanSvg } from "./lib/scenes.mjs";
import { productPage } from "./lib/product-page.mjs";
import { SITE } from "./lib/layout.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const img = join(root, "assets", "img");
await mkdir(img, { recursive: true });

const written = [];
async function out(rel, content) {
  await writeFile(join(root, rel), content);
  written.push(rel);
}

/* ------------------------- Product imagery (SVG) ------------------------- */

const ALT_PALETTE = { dusk: "day", day: "forest", forest: "dusk" };
const widthFor = (p) => p.sceneWidth || 560;

for (const p of products) {
  await out(
    `assets/img/scene-${p.slug}.svg`,
    sceneSvg({ palette: p.palette, homeWidth: widthFor(p), label: `${p.name} — illustrative exterior render` })
  );
  await out(
    `assets/img/scene-${p.slug}-alt.svg`,
    sceneSvg({ palette: ALT_PALETTE[p.palette], homeWidth: widthFor(p), label: `${p.name} — alternate setting render` })
  );
  await out(
    `assets/img/floorplan-${p.slug}.svg`,
    floorplanSvg({
      rooms: p.floorplan,
      subtitle: `${p.bedrooms} bedrooms · kitchen · bathroom · transports at standard road width`,
      label: `${p.name} floor plan`,
    })
  );
}

/* Favicon */
await out(
  "assets/img/favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44"><rect width="44" height="44" rx="10" fill="#333D26"/><path d="M9 24.5L22 13l13 11.5" stroke="#C99B54" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M13 22.5V32h18v-9.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`
);

/* ------------------------------ Product pages ---------------------------- */

for (const p of products) {
  await out(`product-${p.slug}.html`, productPage(p));
}

/* ------------------------------- Site pages ------------------------------ */

const pagesDir = join(root, "scripts", "pages");
const pageFiles = (await readdir(pagesDir)).filter((f) => f.endsWith(".mjs")).sort();
for (const f of pageFiles) {
  const mod = await import(join(pagesDir, f));
  const pages = mod.pages || [mod.page];
  for (const pg of pages) await out(pg.path, pg.html);
}

/* -------------------------------- Sitemap -------------------------------- */

const htmlPages = written.filter((f) => f.endsWith(".html") && f !== "404.html");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${htmlPages
  .map((f) => {
    const loc = `${SITE.url}/${f === "index.html" ? "" : f}`;
    const priority = f === "index.html" ? "1.0" : f.startsWith("product") || f === "products.html" || f === "quote.html" ? "0.9" : f.startsWith("blog-") ? "0.6" : "0.7";
    return `  <url><loc>${loc}</loc><changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
  })
  .join("\n")}
</urlset>
`;
await out("sitemap.xml", sitemap);

await out(
  "robots.txt",
  `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`
);

console.log(`Built ${written.length} files:`);
for (const f of written) console.log("  " + f);
