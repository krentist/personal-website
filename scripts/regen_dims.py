#!/usr/bin/env python3
"""Regenerate _data/photo_dims.yml from assets/gallery/ and validate gallery.yml.

Safe to run any time; CI runs it whenever gallery files change so browser
edits (/admin, github.com uploads) can never leave dimensions stale.
"""
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GALLERY = os.path.join(ROOT, "assets", "gallery")
DIMS_YML = os.path.join(ROOT, "_data", "photo_dims.yml")
GALLERY_YML = os.path.join(ROOT, "_data", "gallery.yml")


def main():
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
    print(f"photo_dims.yml: {len(entries)} entries")

    import yaml
    with open(GALLERY_YML) as f:
        data = yaml.safe_load(f)
    missing = []
    for a in data.get("albums", []):
        folder = os.path.join(GALLERY, a.get("folder", ""))
        for p in (a.get("photos") or []) + [a.get("cover", "")]:
            if p and not os.path.exists(os.path.join(folder, p)):
                missing.append(f"{a.get('title')}: {p}")
    if missing:
        print("WARNING — gallery.yml references missing files:")
        for m in missing:
            print("  " + m)
        sys.exit(1)
    print("gallery.yml: all referenced files exist")


if __name__ == "__main__":
    main()
