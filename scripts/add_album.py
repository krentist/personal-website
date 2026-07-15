#!/usr/bin/env python3
"""Ingest photo albums from _incoming/ into the gallery.

Drop a folder of photos into _incoming/ — the folder name is the place name —
then run:  python3 scripts/add_album.py

For each _incoming/<Place>/ this will:
  1. convert photos to web-sized .webp (EXIF stripped, orientation applied)
  2. place them in assets/gallery/<slug>/
  3. geocode the place name (asks you to confirm; --ci takes the top hit)
  4. let you pick a cover from a contact sheet (--ci uses the first photo)
  5. update _data/gallery.yml, regenerate _data/photo_dims.yml,
     and create _albums/<slug>.md
  6. offer to commit + push (--ci always commits)

If the folder name matches an existing album, photos are appended to it.

Flags:  --ci   non-interactive mode (used by the GitHub Action)
        --no-push   commit but never push
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unicodedata
import urllib.parse
import urllib.request

from PIL import Image, ImageDraw, ImageOps

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
    HEIC_OK = True
except ImportError:
    HEIC_OK = False

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INCOMING = os.path.join(ROOT, "_incoming")
GALLERY = os.path.join(ROOT, "assets", "gallery")
GALLERY_YML = os.path.join(ROOT, "_data", "gallery.yml")
DIMS_YML = os.path.join(ROOT, "_data", "photo_dims.yml")
ALBUMS_DIR = os.path.join(ROOT, "_albums")

MAX_EDGE = 2400
WEBP_QUALITY = 85
EXTS = (".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".heic", ".heif")

CI = "--ci" in sys.argv
NO_PUSH = "--no-push" in sys.argv


def slugify(name):
    """ASCII slug — non-ASCII folder names break the Jekyll build."""
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s


def say(msg):
    print(msg, flush=True)


def ask(prompt, default=""):
    if CI:
        return default
    return input(prompt).strip() or default


# ---------- geocoding ----------

def _ssl_context():
    import ssl
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        # macOS framework Python often ships without linked certs
        return ssl.create_default_context()


def geocode(place):
    url = ("https://nominatim.openstreetmap.org/search?format=json&limit=3&q="
           + urllib.parse.quote(place))
    req = urllib.request.Request(url, headers={
        "User-Agent": "personal-website-album-ingest/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=15, context=_ssl_context()) as r:
            results = json.load(r)
    except Exception as e:
        say(f"  geocoding failed ({e})")
        if "CERTIFICATE" in str(e).upper():
            say("  (fix: pip3 install certifi)")
        results = []
    if results:
        if CI:
            top = results[0]
            say(f"  coordinates: {top['display_name']} -> {top['lat']}, {top['lon']}")
            return float(top["lat"]), float(top["lon"])
        say("  where is this?")
        for i, r in enumerate(results, 1):
            say(f"    {i}. {r['display_name']}  ({r['lat']}, {r['lon']})")
    elif CI:
        raise SystemExit(f"could not geocode '{place}' — add it manually or rename the folder")
    for _ in range(3):
        if results:
            choice = ask("  pick 1-3, or type 'lat, lng' manually [1]: ", "1")
        else:
            choice = ask("  no results — type 'lat, lng' manually: ")
        m = re.match(r"^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$", choice)
        if m:
            return float(m.group(1)), float(m.group(2))
        if results and choice.isdigit():
            r = results[max(0, min(int(choice) - 1, len(results) - 1))]
            return float(r["lat"]), float(r["lon"])
        say("  didn't understand that — expected a result number or 'lat, lng'")
    raise SystemExit(f"no usable coordinates for '{place}'")


# ---------- image conversion ----------

def convert_photos(src_dir, dest_dir, registered):
    os.makedirs(dest_dir, exist_ok=True)
    files = sorted(f for f in os.listdir(src_dir)
                   if f.lower().endswith(EXTS) and not f.startswith("."))
    if not files:
        return []
    done = []
    for f in files:
        if f.lower().endswith((".heic", ".heif")) and not HEIC_OK:
            say(f"  SKIP {f}: install pillow-heif for HEIC support "
                "(pip3 install pillow-heif)")
            continue
        stem = os.path.splitext(f)[0]
        out_name = stem + ".webp"
        out_path = os.path.join(dest_dir, out_name)
        if out_name in registered:
            say(f"  skip {f}: already in album")
            continue
        if os.path.exists(out_path):
            # converted by an earlier interrupted run — just register it
            say(f"  {f}: already converted, registering")
            done.append(out_name)
            continue
        with Image.open(os.path.join(src_dir, f)) as im:
            im = ImageOps.exif_transpose(im)  # bake in orientation
            if im.mode not in ("RGB", "RGBA"):
                im = im.convert("RGB")
            im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
            # save without exif= -> GPS and camera metadata stripped
            im.save(out_path, "WEBP", quality=WEBP_QUALITY)
        done.append(out_name)
        say(f"  {f} -> {out_name} ({os.path.getsize(out_path) // 1024} KB)")
    return done


def pick_cover(dest_dir, photos):
    if CI or len(photos) == 1:
        return photos[0]
    # contact sheet with numbered thumbnails
    cols = 4
    thumb = 260
    rows = (len(photos) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * thumb, rows * thumb), "#f4eede")
    draw = ImageDraw.Draw(sheet)
    for i, name in enumerate(photos):
        with Image.open(os.path.join(dest_dir, name)) as im:
            im.thumbnail((thumb - 12, thumb - 12))
            x = (i % cols) * thumb + 6
            y = (i // cols) * thumb + 6
            sheet.paste(im, (x, y))
            draw.rectangle([x + 2, y + 2, x + 34, y + 24], fill="#a63d2f")
            draw.text((x + 8, y + 6), str(i + 1), fill="#fff")
    tmp = os.path.join(tempfile.gettempdir(), "album-contact-sheet.png")
    sheet.save(tmp)
    if sys.platform == "darwin":
        subprocess.run(["open", tmp], check=False)
    say(f"  contact sheet: {tmp}")
    choice = ask(f"  cover photo number 1-{len(photos)} [1]: ", "1")
    idx = int(choice) - 1 if choice.isdigit() else 0
    return photos[max(0, min(idx, len(photos) - 1))]


# ---------- data files ----------

def load_gallery():
    import yaml
    with open(GALLERY_YML) as f:
        return yaml.safe_load(f)


def append_album_yaml(title, folder, slug, lat, lng, photos):
    block = [f"\n- title: {json.dumps(title, ensure_ascii=False)}",
             f"  folder: {json.dumps(folder, ensure_ascii=False)}",
             f"  slug: {slug}",
             f"  lat: {lat}",
             f"  lng: {lng}",
             "  cover: cover.webp",
             "  photos:"]
    block += [f"    - {p}" for p in photos]
    with open(GALLERY_YML, "a") as f:
        f.write("\n".join(block) + "\n")


def append_photos_yaml(slug, new_photos):
    """Insert photo lines at the end of an existing album's photos list."""
    with open(GALLERY_YML) as f:
        lines = f.readlines()
    # find the album block by its slug line, then the end of its photos list
    start = next(i for i, l in enumerate(lines) if re.match(rf"\s*slug:\s*{re.escape(slug)}\s*$", l))
    i = start
    while i < len(lines) and not re.match(r"\s*photos:", lines[i]):
        i += 1
    i += 1
    while i < len(lines) and re.match(r"\s*-\s", lines[i]):
        i += 1
    insert = [f"    - {p}\n" for p in new_photos]
    lines[i:i] = insert
    with open(GALLERY_YML, "w") as f:
        f.writelines(lines)


def regen_dims():
    entries = []
    for folder in sorted(os.listdir(GALLERY)):
        fpath = os.path.join(GALLERY, folder)
        if not os.path.isdir(fpath):
            continue
        for fn in sorted(os.listdir(fpath)):
            if fn.lower().endswith((".webp", ".png", ".jpg", ".jpeg")):
                with Image.open(os.path.join(fpath, fn)) as im:
                    w, h = im.size
                entries.append(f'"{folder}/{fn}":\n  w: {w}\n  h: {h}')
    with open(DIMS_YML, "w") as f:
        f.write("\n".join(entries) + "\n")


def write_album_page(title, slug):
    path = os.path.join(ALBUMS_DIR, f"{slug}.md")
    if os.path.exists(path):
        return
    pretty = " ".join(w.capitalize() for w in title.split())
    with open(path, "w") as f:
        f.write("---\n"
                "layout: album-detail\n"
                f"title: {pretty}\n"
                f"album_title: {title}\n"
                f"permalink: /albums/{slug}/\n"
                "---\n")


def validate():
    import yaml
    with open(GALLERY_YML) as f:
        yaml.safe_load(f)
    with open(DIMS_YML) as f:
        yaml.safe_load(f)


# ---------- main ----------

def process(src_dir):
    place = os.path.basename(src_dir.rstrip("/"))
    title = place.lower()
    slug = slugify(place)
    if not slug:
        say(f"skipping {place}: name has no ASCII characters to make a slug from")
        return False
    data = load_gallery()
    existing = next((a for a in data.get("albums", [])
                     if a.get("slug") == slug or a.get("title") == title), None)

    say(f"\n=== {place} -> {'existing album' if existing else 'new album'} '{slug}' ===")
    folder = existing["folder"] if existing else slug
    dest = os.path.join(GALLERY, folder)
    registered = set(existing.get("photos") or []) if existing else set()
    photos = convert_photos(src_dir, dest, registered)
    if not photos:
        say("  no photos converted; leaving folder in _incoming")
        return False

    if existing:
        append_photos_yaml(slug, photos)
    else:
        lat, lng = geocode(place)
        cover = pick_cover(dest, photos)
        shutil.copyfile(os.path.join(dest, cover), os.path.join(dest, "cover.webp"))
        append_album_yaml(title, folder, slug, lat, lng, photos)
        write_album_page(title, slug)

    regen_dims()
    validate()
    say(f"  added {len(photos)} photo(s) to '{title}'")

    # originals: CI removes them from the repo; locally, ask
    if CI:
        shutil.rmtree(src_dir)
    else:
        if ask(f"  delete originals in _incoming/{place}? [y/N]: ", "n").lower() == "y":
            shutil.rmtree(src_dir)
            say("  originals deleted")
        else:
            say("  originals kept in _incoming (they will not be re-imported: "
                "converted names are skipped)")
    return True


def git_commit_push(names):
    msg = "Add photos: " + ", ".join(names)
    subprocess.run(["git", "-C", ROOT, "add", "-A"], check=True)
    r = subprocess.run(["git", "-C", ROOT, "commit", "-m", msg,
                        "-m", "Via scripts/add_album.py"], check=False)
    if r.returncode != 0:
        say("nothing to commit")
        return
    if NO_PUSH:
        say("committed (push skipped)")
        return
    if CI or ask("push to publish? [Y/n]: ", "y").lower() != "n":
        subprocess.run(["git", "-C", ROOT, "push"], check=True)
        say("pushed — Netlify will deploy shortly")


def main():
    if not os.path.isdir(INCOMING):
        os.makedirs(INCOMING)
        say(f"created {INCOMING} — drop photo folders in there and rerun")
        return
    batches = [os.path.join(INCOMING, d) for d in sorted(os.listdir(INCOMING))
               if os.path.isdir(os.path.join(INCOMING, d)) and not d.startswith(".")]
    if not batches:
        say("nothing in _incoming/ — drop a folder of photos there, named after the place")
        return
    done = []
    for b in batches:
        try:
            if process(b):
                done.append(os.path.basename(b))
        except SystemExit as e:
            say(f"  ERROR: {e}")
        except Exception as e:
            say(f"  ERROR processing {b}: {e}")
    if done:
        if CI:
            git_commit_push(done)
        elif ask("\ncommit these changes? [Y/n]: ", "y").lower() != "n":
            git_commit_push(done)


if __name__ == "__main__":
    main()
