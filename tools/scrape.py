#!/usr/bin/env python3
"""Pull every product from rippansw.com (note: .com, not .com.au) into
data/source-products.json and images/{slug}/NN.ext.
Plain HTTP only. No browser needed: Wix puts the product data in a JSON-LD block.
Usage: python3 scrape.py            (needs only the standard library)
"""
import html, json, os, re, sys, time, urllib.request

BASE = "https://www.rippansw.com"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36"}
CATEGORIES = {
    "excavators": "/category/excavators",
    "skid-steers": "/category/skid-steer-loaders",
    "attachments": "/category/untitled-category",
    "service-and-parts": "/category/untitled-category-1",
}

def get(url, binary=False):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    return data if binary else data.decode("utf-8", "ignore")

def product_urls():
    xml = get(BASE + "/store-products-sitemap.xml")
    return sorted(set(re.findall(r"<loc>([^<]*?/product-page/[^<]+)</loc>", xml)))

def category_map():
    out = {}
    for cat, path in CATEGORIES.items():
        try:
            page = get(BASE + path)
        except Exception as e:
            print("  category failed:", cat, e); continue
        for slug in set(re.findall(r"/product-page/([a-z0-9\-]+)", page)):
            out.setdefault(slug, cat)   # first match wins, excavators checked first
        time.sleep(0.5)
    return out

def parse(url):
    page = get(url)
    for block in re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', page, re.S):
        try:
            d = json.loads(block)
        except Exception:
            continue
        if d.get("@type") == "Product":
            return d
    return None

def original(img_url):
    # strip Wix's resize suffix, then ask for a sensible max size
    m = re.match(r"(https://static\.wixstatic\.com/media/[^/]+)", img_url)
    if not m: return img_url, "jpg"
    root = m.group(1)
    ext = root.rsplit(".", 1)[-1].lower()
    if ext not in ("jpg", "jpeg", "png", "webp"): ext = "jpg"
    return f"{root}/v1/fit/w_1600,h_1600,q_85/file.{ext}", ext

def main():
    os.makedirs("data", exist_ok=True)
    cats = category_map()
    products = []
    for url in product_urls():
        slug = url.rsplit("/", 1)[-1]
        d = parse(url)
        if not d:
            print("  no product data:", url); continue
        offer = d.get("offers") or {}
        if isinstance(offer, list): offer = offer[0]
        imgs = d.get("image") or []
        if isinstance(imgs, (str, dict)): imgs = [imgs]
        saved = []
        os.makedirs(f"images/{slug}", exist_ok=True)
        for i, im in enumerate(imgs, 1):
            src = im.get("contentUrl") if isinstance(im, dict) else im
            if not src: continue
            big, ext = original(src)
            path = f"images/{slug}/{i:02d}.{ext}"
            try:
                if not os.path.exists(path):
                    open(path, "wb").write(get(big, binary=True))
                saved.append(path)
            except Exception as e:
                print("  image failed:", big, e)
        products.append({
            "slug": slug,
            "category": cats.get(slug, "uncategorised"),
            "name": d.get("name"),
            "price_nsw": float(offer["price"]) if offer.get("price") else None,
            "in_stock_nsw": "InStock" in (offer.get("availability") or ""),
            "source_url": url,
            "images": saved,
            # Raw dealer text. Use it to extract spec numbers only. Do not publish it.
            "source_description": html.unescape(d.get("description") or ""),
        })
        print(f"  {slug}: {len(saved)} images")
        time.sleep(0.7)
    json.dump(products, open("data/source-products.json", "w"), indent=2, ensure_ascii=False)
    print(f"\n{len(products)} products written to data/source-products.json")

if __name__ == "__main__":
    main()
