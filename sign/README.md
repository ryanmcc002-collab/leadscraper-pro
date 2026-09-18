# Quick Ink — sign documents in the browser

Open a PDF (or a photo/scan of a paper document), draw, type or upload your
signature, tap where it goes, download the signed PDF. Nothing is uploaded
anywhere: the file, your signature and the export all stay in the browser.

## Use it

Serve the folder with any static server and open it, e.g.

```
npx http-server sign -p 8080
```

Opening `sign/index.html` straight from disk also works in most browsers.

1. **Open document** – PDF, PNG, JPG or WebP. Photos are placed on an A4 page.
   Word/Pages/Google Docs files: save or export them as PDF first.
2. **Signature** – draw with finger, stylus or mouse; type your name in one of
   four handwriting styles; or upload a photo of your real signature (white
   paper background is removed automatically). It's saved on the device so
   next time it's one tap. **Initials** work the same way.
3. **Date** and **Text** drop editable text boxes (date defaults to today,
   Australian format).
4. Drag to move, pull the blue corner to resize, `Delete` removes, `Esc`
   cancels placing.
5. **Download signed PDF** writes the marks into a copy named
   `<original>-signed.pdf`. Rotated pages and mixed page sizes are handled.

## What it is (and isn't)

It draws an electronic signature into the PDF, the same thing a "draw your
signature" box in most e-sign tools does. That's fine for quotes, agreements
and everyday forms. It is **not** a certificate-based digital signature
(the padlock-verified kind); for those you need a provider such as DocuSign
or Adobe Sign.

## Stack

Plain HTML/CSS/JS, no build step.

```
sign/index.html          page
sign/css/sign.css        design tokens + components (light and dark)
sign/js/sign.js          rendering, placing, signature pad, export
sign/vendor/pdf.min.js   pdf.js 3.11.174 (Apache-2.0) – renders pages
sign/vendor/pdf.worker.min.js
sign/vendor/pdf-lib.min.js  pdf-lib 1.17.1 (MIT) – writes the signed PDF
```
