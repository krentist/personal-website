---
name: add-album
description: Ingest photo folders from _incoming/ into the gallery — converts to webp, geocodes the place, picks a cover, updates gallery data, and commits. Use when the user says "add an album", "add photos", "ingest photos", or has dropped folders into _incoming/.
---

# Add a photo album

The pipeline lives in `scripts/add_album.py`. It processes every folder in
`_incoming/` (folder name = place name).

1. If the user named a source folder that isn't in `_incoming/` yet, copy it:
   `cp -R "<source>" "_incoming/<Place Name>"` — the folder name is geocoded,
   so prefer a real place name ("Tokyo", "New Orleans").
2. Run it interactively so the user confirms geocoding and cover:
   `python3 scripts/add_album.py`
   - It prompts: geocode pick (or manual "lat, lng"), cover number from a
     contact sheet it opens, whether to delete originals, commit, and push.
3. If the user asked for a specific cover/coordinates/title up front, relay
   those at the prompts rather than re-asking them.
4. After a successful run, verify with `bundle exec jekyll build` and check
   `/gallery/` renders the new album (folders view card + globe pin).

Notes:
- HEIC input needs `pillow-heif` (`pip3 install pillow-heif`).
- Appending to an existing album: name the folder with the existing title or
  slug; geocode/cover are skipped automatically.
- The globe route includes new albums automatically (`route_order: journey`
  in `_data/gallery.yml`).
