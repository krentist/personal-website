# 📸 Your Gallery Setup — Complete Reference

## ✅ What's Ready Now

Your gallery is fully rebuilt to match Charlie Deets' structure:

### Gallery Page (`/gallery/`)
- Shows album cards with cover images
- Grid layout responsive to all screen sizes
- Hover effects on album cards

### Album Detail Pages (`/albums/los-angeles/`, etc.)
- Click any album to see all photos
- Masonry grid of all photos in that album
- Back button to return to gallery

---

## 🚀 Quick Start: Adding Your First New Album

### Example: Adding Your London Trip (10 photos)

1. **Create folder:** `/assets/gallery/london/`

2. **Create `cover.webp`** — Pick your best London photo, convert to WebP, save as:
   - `/assets/gallery/london/cover.webp`

3. **Add all photos** — Convert to WebP and move to:
   - `/assets/gallery/london/photo1.webp`
   - `/assets/gallery/london/photo2.webp`
   - ... (all 10 photos)

4. **Update `_data/gallery.yml`** — Add this at the bottom:
   ```yaml
   - title: london
     folder: london
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
       - photo9.webp
       - photo10.webp
   ```

5. **Create album page** — Create file: `_albums/london.md`
   ```markdown
   ---
   layout: album-detail
   title: London
   album_title: london
   permalink: /albums/london/
   ---
   ```

6. **Save & refresh** ✓

---

## 📂 Your Current Structure

```
personal-website/
├── _pages/
│   └── gallery.md ✓ (already configured)
├── _layouts/
│   ├── gallery.html ✓ (shows album cards)
│   └── album-detail.html ✓ (shows photos)
├── _albums/
│   └── los-angeles.md ✓ (your LA album)
├── _data/
│   └── gallery.yml ✓ (album registry)
└── assets/gallery/
    ├── los angeles/ ✓ (your existing photos)
    ├── london/ (ready for new albums)
    └── [add more here]
```

---

## 📋 Checklist for New Albums

- [ ] Created `/assets/gallery/[name]/` folder
- [ ] Added `cover.webp` to the folder
- [ ] Converted all photos to WebP format
- [ ] Listed all filenames in `_data/gallery.yml`
- [ ] Created `_albums/[name].md` with correct `album_title`
- [ ] Album name in markdown matches `gallery.yml` exactly
- [ ] Folder name in `gallery.yml` matches actual folder

---

## ⚡ Pro Tips

### Batch Processing Photos
When adding 10+ photos:
1. Use batch converter (CloudConvert batch mode)
2. Note all filenames as they convert
3. Paste them into `gallery.yml` all at once

### Naming Consistency
- Folder names: **lowercase** (e.g., `london`, `new york`)
- File names: exact as they are (e.g., `photo1.webp`)
- Album titles: match in both `gallery.yml` and markdown

### Testing
After changes:
- Hard refresh browser: `Cmd + Shift + R` (Mac)
- Check album shows on gallery page
- Click to verify photos load

---

## 🔧 File Locations Reference

| What | Where |
|------|-------|
| Album front cards | `_data/gallery.yml` |
| Photo folders | `/assets/gallery/[album-name]/` |
| Album pages created | `_albums/[album-name].md` |
| Gallery page markup | `_layouts/gallery.html` |
| Album detail markup | `_layouts/album-detail.html` |
| Gallery page | `_pages/gallery.md` |

---

## 🎬 Full Documentation

- **PHOTO_GUIDE.md** — Detailed step-by-step with examples
- **PHOTO_QUICK_START.md** — At-a-glance reference

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Album appears but no photos | Missing `_albums/[name].md` file |
| Cover image missing | `cover.webp` not in folder |
| Photos don't show in album | Check filenames match exactly in `gallery.yml` |
| Folder not found error | Folder name in `gallery.yml` must match actual folder |

---

## Ready to Go!

Your Los Angeles album is already set up and working. Everything is ready for you to add more albums whenever you shoot with your Ricoh GR III. 📸

Just follow the 6-step process above and you'll be good!

Questions? Check the PHOTO_GUIDE.md for detailed instructions.
