# Photo Gallery Quick Reference

## What Changed ✨

Your gallery now matches Charlie Deets' **two-tier structure**:

1. **Gallery Page** (`/gallery/`) — Album cards with cover images
2. **Album Pages** (`/albums/london/`, etc.) — All photos in masonry grid paysoff 

---

## How It Works

```
Gallery Page (Shows Albums)
    ↓ (Click an album)
Album Detail Page (Shows All Photos)
```

---

## Adding a Complete New Album (5 Steps)

### 1. Create Folder
`/assets/gallery/london/`

### 2. Add Cover Image
`/assets/gallery/london/cover.webp` ← Shown on gallery page

### 3. Add All Photos (WebP Format)
```
/assets/gallery/london/
├── cover.webp
├── photo1.webp
├── photo2.webp
└── ... (all your photos)
```

### 4. Update Data File
Edit `_data/gallery.yml`:

```yaml
- title: london
  folder: london
  cover: cover.webp
  photos:
    - photo1.webp
    - photo2.webp
    - photo3.webp
```

### 5. Create Album Page
Create file: `_albums/london.md`

```markdown
---
layout: album-detail
title: London
album_title: london
permalink: /albums/london/
---
```

**Done!** Now you can click the album on the gallery page to see all photos.

---

## Critical Files

| Item | Location |
|------|----------|
| Album Data | `_data/gallery.yml` |
| Album Pages | `_albums/` |
| Photo Folders | `/assets/gallery/` |
| Templates | `_layouts/gallery.html` |

---

## Batch Workflow (5-15 Photos)

1. Create trip folder
2. Add `cover.webp`
3. Add converted photos
4. Update `_data/gallery.yml` with all filenames
5. Create `_albums/trip-name.md`
6. Save & refresh

**That's it!**

---

## Key Rules

✓ Use **lowercase folder names**  
✓ **WebP format** only (smaller, faster)  
✓ **`cover.webp`** must exist in each album folder  
✓ Album title in `gallery.yml` **must match** `album_title` in markdown  
✓ Folder name in `gallery.yml` **must match** actual folder

---

## If Something Doesn't Work

**Album shows but no photos when clicked?**
→ Create the `_albums/[name].md` file

**Cover won't show?**
→ Make sure `cover.webp` exists in the folder

**Photos missing?**
→ Check filenames match exactly in `gallery.yml`

---

See **PHOTO_GUIDE.md** for full detailed instructions.

