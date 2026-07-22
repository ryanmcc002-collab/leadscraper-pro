#!/usr/bin/env python3
"""Validate tests/sample.dxf with ezdxf (pip install ezdxf).

Checks the file parses as DXF, audits it for structural errors, and confirms
the drawing conventions the factory relies on (AutoCAD 2000 format,
millimetre units). Exits non-zero on any problem.
"""
import os
import sys

import ezdxf
from ezdxf import recover

path = os.path.join(os.path.dirname(__file__), "sample.dxf")
if not os.path.exists(path):
    sys.exit("missing %s — run: node tests/generate_sample.js" % path)

try:
    doc, auditor = recover.readfile(path)
except IOError as e:
    sys.exit("not a readable DXF: %s" % e)
except ezdxf.DXFStructureError as e:
    sys.exit("invalid or corrupted DXF: %s" % e)

errors = list(auditor.errors)
if errors:
    for err in errors:
        print("AUDIT ERROR:", err.code, err.message, file=sys.stderr)
    sys.exit("%d audit error(s)" % len(errors))

acadver = doc.header.get("$ACADVER", "?")
insunits = doc.header.get("$INSUNITS", None)
msp = doc.modelspace()
counts = {}
for e in msp:
    counts[e.dxftype()] = counts.get(e.dxftype(), 0) + 1

print("ACADVER:", acadver, "| INSUNITS:", insunits)
print("layers:", ", ".join(layer.dxf.name for layer in doc.layers))
print("modelspace entities:", sum(counts.values()), counts)

problems = []
if acadver != "AC1015":
    problems.append("expected AutoCAD 2000 (AC1015), got %s" % acadver)
if insunits not in (None, 4):
    problems.append("expected millimetre units ($INSUNITS=4), got %s" % insunits)
if sum(counts.values()) < 100:
    problems.append("suspiciously few entities — sheet generation looks broken")
for p in problems:
    print("PROBLEM:", p, file=sys.stderr)
if problems:
    sys.exit(1)
print("OK — DXF is valid")
