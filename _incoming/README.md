# Drop photos here

Each folder you put in `_incoming/` becomes (or extends) a gallery album.
The **folder name is the place name** — it's geocoded for the globe pin.

```
_incoming/
  Tokyo/           <- new album "tokyo" at Tokyo's coordinates
    IMG_0134.jpg
    IMG_0135.heic
  new york/        <- photos appended to the existing "new york" album
    IMG_0201.jpg
```

Two ways to run the pipeline:

- **At the Mac:** `python3 scripts/add_album.py` — interactive: confirms the
  geocoded location, opens a contact sheet to pick the cover, asks before
  committing/pushing.
- **From anywhere:** upload the folder on github.com (Add file → Upload files,
  put `_incoming/Tokyo/` in the path) — the "Ingest photo albums" Action runs
  the same pipeline non-interactively (first photo becomes the cover; you can
  change `cover:` in `_data/gallery.yml` later).

What it does: converts to web-sized webp (EXIF/GPS stripped), fills in
`_data/gallery.yml` + `_data/photo_dims.yml`, creates the album page, and
commits. New albums join the globe's voyage line automatically (see
`route_order` in `_data/gallery.yml`).
