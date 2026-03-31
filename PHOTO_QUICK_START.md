# Photo Gallery Quick Reference

## What Changed ✨

Your gallery is now a **beautiful masonry photo feed** (like Charlie Deets' site):
- Grid layout that adjusts to screen size
- Hover to see date + location
- All your photos displayed at once

---

## Right Now: Existing Setup

Your current photos are already set up! They're in:
- `/assets/gallery/los angeles/` - Contains your LA photos

The `_data/photos.yml` file has them ready to go.

---

## To Add More Photos

### Quick Checklist:

```
1. Create a new folder in /assets/gallery/[trip-name]/
2. Move WebP photos into that folder
3. Edit _data/photos.yml - add entries
4. Save & refresh browser
```

### Template to Copy-Paste:

```yaml
  - filename: YOUR_PHOTO.webp
    date: "March 15, 2024"
    place: "City Name"
    folder: city-name
```

---

## File Locations Reference

| Item | Location |
|------|----------|
| Photo Folders | `/assets/gallery/` |
| Photo Data | `_data/photos.yml` |
| Gallery Page | `_pages/gallery.md` |
| Full Instructions | `PHOTO_GUIDE.md` |

---

## Important Notes

✓ Use **WebP format** for photos (smaller file size)  
✓ Folder names: use **lowercase** with spaces OK  
✓ Names in `photos.yml` must match exactly  
✓ Hard refresh browser after making changes (Cmd+Shift+R)

---

## Workflow for Bulk Adding

Adding 5-15 photos? Do this:

1. Create trip folder: `/assets/gallery/paris/`
2. Convert photos to WebP
3. Move them to the folder
4. Open `_data/photos.yml`
5. Copy-paste the template 5-15 times
6. Fill in: filename, date, place, folder
7. Save and refresh!

Done in minutes.

---

## Need the Full Guide?

See **PHOTO_GUIDE.md** for detailed instructions with examples.
