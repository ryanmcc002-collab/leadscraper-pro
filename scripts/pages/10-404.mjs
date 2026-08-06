import { icons, layout } from "../lib/layout.mjs";

const body = `
    <section class="section section-white" style="min-height:55vh;display:grid;place-items:center">
      <div class="wrap center">
        <span class="eyebrow eyebrow-center">404 — page not found</span>
        <h1 style="font-size:var(--fs-800)">That block is empty.</h1>
        <p class="lead center" style="margin-inline:auto">The page you're after has moved or never existed. Everything worth seeing is one click away.</p>
        <div style="display:flex;gap:0.9rem;justify-content:center;flex-wrap:wrap;margin-top:2rem">
          <a class="btn btn-gold" href="index.html">Back to home ${icons.arrow}</a>
          <a class="btn btn-ghost" href="products.html">Browse the range</a>
          <a class="btn btn-ghost" href="quote.html">Get a free quote</a>
        </div>
      </div>
    </section>
`;

export const page = {
  path: "404.html",
  html: layout({
    path: "404.html",
    title: "Page Not Found | Go Tiny Homes",
    description: "The page you're looking for isn't here. Explore Australia's premium expandable tiny homes from Go Tiny Homes.",
    body,
    active: null,
  }),
};
