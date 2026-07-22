#!/usr/bin/env node
/* Bondi Trailer CAD — build script (no dependencies).
   node build.js            -> dist/bondi-trailer-cad.html  (single-file app)
   node build.js --artifact -> dist/artifact.html           (Claude Artifact bundle:
                               same content without the doctype/head/body wrapper,
                               which the artifact host adds itself) */
'use strict';
const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const inlined = html.replace(
  /<script src="(js\/[\w.-]+\.js)"><\/script>/g,
  (_, src) => '<script>\n' + fs.readFileSync(path.join(root, src), 'utf8') + '</script>'
);

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });

if (process.argv.includes('--artifact')) {
  const m = inlined.match(/<body>([\s\S]*)<\/body>/);
  if (!m) throw new Error('could not find <body> in index.html');
  fs.writeFileSync(path.join(root, 'dist', 'artifact.html'), m[1]);
  console.log('wrote dist/artifact.html (' + m[1].length + ' bytes)');
} else {
  fs.writeFileSync(path.join(root, 'dist', 'bondi-trailer-cad.html'), inlined);
  console.log('wrote dist/bondi-trailer-cad.html (' + inlined.length + ' bytes)');
}
