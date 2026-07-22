#!/usr/bin/env python3
"""Validate tests/sample.pdf with pypdf (pip install pypdf).

Checks the customer PDF parses, is a single A3-landscape page with drawable
content, and that the embedded project JSON extracts and parses — that's
what lets the app re-open a customer PDF for layout editing.
"""
import base64
import json
import os
import re
import sys

from pypdf import PdfReader

path = os.path.join(os.path.dirname(__file__), "sample.pdf")
if not os.path.exists(path):
    sys.exit("missing %s — run: node tests/generate_sample.js" % path)

reader = PdfReader(path)
if len(reader.pages) != 1:
    sys.exit("expected 1 page, got %d" % len(reader.pages))
page = reader.pages[0]
box = page.mediabox
w, h = float(box.width), float(box.height)
if not (1189 < w < 1192 and 840 < h < 843):
    sys.exit("expected A3 landscape (1190.55x841.89pt), got %.2fx%.2f" % (w, h))
content = page.get_contents().get_data()
if len(content) < 5000:
    sys.exit("content stream suspiciously small (%d bytes)" % len(content))

raw = open(path, "rb").read().decode("ascii")  # exporter guarantees ASCII
m = re.search(r"%BFT-PROJECT-v1%([A-Za-z0-9+/=\s]+)%END-BFT-PROJECT%", raw)
if not m:
    sys.exit("no embedded project marker found")
project = json.loads(base64.b64decode(m.group(1)).decode("utf8"))
if "trailer" not in project or "items" not in project:
    sys.exit("embedded project missing trailer/items")

print("page %.2fx%.2fpt, %d bytes of content, embedded project: %d items, shell %dx%d"
      % (w, h, len(content), len(project["items"]),
         project["trailer"]["boxLength"], project["trailer"]["boxWidth"]))
print("OK — PDF is valid and re-importable")
