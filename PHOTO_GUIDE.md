# How to Add Photos to Your Gallery

## 🎯 Quick Overview

Your gallery now works in **two tiers** (like Charlie Deets):

1. **Gallery Page** (`/gallery/`) — Shows album cards with cover images
2. **Album Detail Page** (e.g., `/albums/london/`) — Shows all photos in a masonry grid

---

## 📁 Folder Structure (Where Your Photos Go)

**Main location:** `/assets/gallery/`

Organize photos by **trip/location** in subfolders:

```
/assets/gallery/
├── los angeles/
│   ├── cover.webp          ← This shows on the gallery page
│   ├── R0002157.webp
│   ├── R0002160.webp
│   └── ...
├── london/
│   ├── cover.webp
│   ├── photo1.webp
│   ├── photo2.webp
│   └── ...
├── paris/
│   ├── cover.webp
│   └── ...
└── [other locations]
```

---

## 📝 Adding a New Album (4 Steps)

### Step 1: Create the Folder
In Finder, go to `/assets/gallery/` and create a new folder for your trip.
- Use lowercase names
- Spaces are OK (e.g., `new york`, `los angeles`)

### Step 2: Prepare Cover Image
Inside your new folder, add a **cover image** named `cover.webp`
- This image will show on the gallery page
- Should be a representative photo from the trip
- Use WebP format (convert with CloudConvert or similar)

### Step 3: Add All Your Photos
Convert your photos to WebP and move them to the same folder.
Example:
- `photo1.webp`
- `photo2.webp`
- `photo3.webp`
- etc.

### Step 4: Register in Gallery Data
Edit `_data/gallery.yml` and add your album:

```yaml
albums:
  - title: los angeles
    folder: los angeles
    cover: cover.webp
    photos:
      - R0002157.webp
      - R0002160.webp
      - R0002162.webp

  - title: london
    folder: london
    cover: cover.webp
    photos:
      - photo1.webp
      - photo2.webp
      - photo3.webp
```

### Step 5: Create Album Page
Create a markdown file to activate the album detail page.

**File location:** `_albums/london.md`

**File content:**
```markdown
---
layout: album-detail
title: London
album_title: london
permalink: /albums/london/
---
```

**Important:** The `album_title` must match exactly what you put in `_data/gallery.yml`

---

## 🎨 Example: Adding Photos from a Paris Trip

### What you have:
- 8 photos from Paris
- One you want as the cover (sunset photo)

### Step 1: Create Folder
Create: `/assets/gallery/paris/`

### Step 2: Add Cover
Convert your sunset photo to WebP and save as: `/assets/gallery/paris/cover.webp`

### Step 3: Add Photos
Convert all 8 photos to WebP:
- `/assets/gallery/paris/photo1.webp`
- `/assets/gallery/paris/photo2.webp`
- etc.

### Step 4: Update Gallery Data
Edit `_data/gallery.yml`, add to the bottom:

```yaml
  - title: paris
    folder: paris
    cover: cover.webp
    photos:
      - photo1.webp
      - photo2.webp
      - photo3.webp
      - photo4.webp
      - photo5.webp
      - photo6.webp
      - photo7.webp
      - photo8.webp
```

### Step 5: Create Album Page
Create file: `_albums/paris.md`

Content:
```markdown
---
layout: album-detail
title: Paris
album_title: paris
permalink: /albums/paris/
---
```

### Result:
- Gallery page shows a Paris card with your sunset cover image
- Clicking it goes to `/albums/paris/` showing all 8 photos in a masonry grid

---

## ✅ Checklist Before You're Done

- ✓ Folder created in `/assets/gallery/[name]/`
- ✓ `cover.webp` in the folder (the album card image)
- ✓ All photo files in `.webp` format in the folder
- ✓ `_data/gallery.yml` updated with the album entry
- ✓ `_albums/[name].md` file created (if not, photos won't show when clicked)
- ✓ Album title in `.md` matches exactly in `gallery.yml`
- ✓ Folderpath in `gallery.yml` matches the actual folder name

---

## 🚀 Adding Batches (5-15 Photos at a Time)

Since you're adding from your Ricoh GR III regularly:

1. Convert your batch to WebP (use CloudConvert, keep batch conversion on)
2. Create the trip folder in `/assets/gallery/`
3. Move all WebP files there
4. Pick the best one, rename it `cover.webp`
5. In `_data/gallery.yml`, add one entry with all filenames:

```yaml
  - title: new-trip-name
    folder: new-trip-name
    cover: cover.webp
    photos:
      - photo1.webp
      - photo2.webp
      - photo3.webp
      (... copy-paste for all photos ...)
```

6. Create `_albums/new-trip-name.md` with the template
7. Save and refresh — done!

---

## Common Issues & Fixes

### Album Shows on Gallery Page but No Photos When Clicked

**Cause:** The `_albums/` markdown file is missing
**Fix:** Create the file with the correct `album_title` matching `gallery.yml`

### Cover Image Won't Show on Gallery Page

**Cause:** `cover.webp` missing or wrong path
**Fix:** Confirm `cover.webp` exists in your folder and is named exactly right

### Photos Won't Show in Album

**Cause:** Filenames in `gallery.yml` don't match actual files
**Fix:** Double-check exact filenames — case-sensitive!

### Folder Name Mismatch Error

**Cause:** Folder name in `gallery.yml` doesn't match your actual folder
**Fix:** Make sure `folder:` value matches your `/assets/gallery/[folder]/` exactly

---

## 📱 How It Works

**Gallery Page View:**
- Clean grid of album cards
- Each card shows cover image
- Hover effect scales the image slightly
- Click to see all photos in that album

**Album Detail View:**
- Back link to gallery page (pill at top)
- Masonry grid of all photos
- Responsive layout (looks great on mobile)
- Hover effect on photos

---

## File Structure Summary

```
Your website/
├── _data/
│   └── gallery.yml          ← Update this to add albums
├── _albums/
│   ├── los-angeles.md       ← Creates /albums/los-angeles/
│   ├── london.md            ← Creates /albums/london/
│   └── ...
├── _layouts/
│   ├── gallery.html         ← Shows album cards
│   └── album-detail.html    ← Shows photos in an album
├── assets/gallery/
│   ├── los angeles/         ← Your photo folders
│   ├── london/
│   └── ...
```

---

Questions? Check that:
1. Photo files are named exactly as in `gallery.yml`
2. Folders exist and are named exactly as in `gallery.yml`
3. Album markdown files exist in `_albums/`
4. Album titles match between `gallery.yml` and markdown files


