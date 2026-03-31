# How to Add Photos to Your Gallery

## 🎯 Quick Overview

Your new photo gallery shows photos in a beautiful masonry grid with date and location on hover. It's easy to add new photos whenever you want!

---

## 📁 Folder Structure (Where Your Photos Go)

**Main location:** `/assets/gallery/`

Inside this folder, organize your photos by **location/trip name** in subfolders:

```
/assets/gallery/
├── los angeles/
│   ├── R0002157.webp
│   ├── R0002160.webp
│   ├── cover.webp
│   └── ...
├── london/
│   ├── photo1.webp
│   ├── photo2.webp
│   └── ...
├── paris/
│   ├── photo1.webp
│   └── ...
└── [other trips]
```

---

## 📝 Adding Photos (Step-by-Step)

### Step 1: Prepare Your Image Files
- Convert your images to **WebP format** (smaller file size, better for web)
- Use a tool like [CloudConvert](https://cloudconvert.com/) or online tools
- Name your files clearly (e.g., `R0002157.webp`)

### Step 2: Move Photos to the Right Folder
1. **Decide which trip/location** your photos are from
2. **Create a new folder** if needed in `/assets/gallery/` (e.g., `tokyo/`, `new zealand/`)
   - Use LOWERCASE folder names
   - Use spaces in folder names if you want (e.g. `new york/`)
3. **Drag & drop your photo files** into that folder using Finder

### Step 3: Update the Data File
Edit the file: `_data/photos.yml`

**Add an entry for each photo** in this format:

```yaml
photos:
  - filename: R0002157.webp
    date: "March 15, 2024"
    place: "Los Angeles"
    folder: los angeles
    
  - filename: R0002160.webp
    date: "March 15, 2024"
    place: "Los Angeles"
    folder: los angeles
```

### What Each Field Means:
- **filename:** The exact name of your image file
- **date:** When you took it (any date format, e.g., "March 15, 2024" or "15 Mar 2024")
- **place:** Where you took it (will appear at the top when you hover)
- **folder:** The subfolder name inside `/assets/gallery/` (must match exactly)

---

## 🎨 Example: Adding 5 New Photos from a Trip

### Your Photos:
- `IMG_001.webp` - Beach at sunset
- `IMG_002.webp` - Street vendor
- `IMG_003.webp` - Temple
- `IMG_004.webp` - Night market
- `IMG_005.webp` - Local food

### Step 1: Folder
Create folder: `/assets/gallery/bangkok/`

### Step 2: Move Files
Put all 5 photos in `/assets/gallery/bangkok/`

### Step 3: Edit `_data/photos.yml`
Add to the bottom:

```yaml
  - filename: IMG_001.webp
    date: "March 20, 2024"
    place: "Bangkok"
    folder: bangkok
    
  - filename: IMG_002.webp
    date: "March 20, 2024"
    place: "Bangkok"
    folder: bangkok
    
  - filename: IMG_003.webp
    date: "March 21, 2024"
    place: "Bangkok"
    folder: bangkok
    
  - filename: IMG_004.webp
    date: "March 21, 2024"
    place: "Bangkok"
    folder: bangkok
    
  - filename: IMG_005.webp
    date: "March 22, 2024"
    place: "Bangkok"
    folder: bangkok
```

That's it! Your photos should appear on the gallery page after a refresh.

---

## ✅ Tips & Common Issues

### Make Sure:
- ✓ Photo files are in the right folder inside `/assets/gallery/`
- ✓ File names in `photos.yml` exactly match your actual files (case-sensitive)
- ✓ Folder names in `photos.yml` exactly match your folder names
- ✓ The date format is readable (no specific format required)
- ✓ The place is what you want to see on hover

### If Photos Don't Show:
1. **Check file path:** Is the file really in `/assets/gallery/[folder]/`?
2. **Check filename:** Does it match exactly in `photos.yml`?
3. **Check folder name:** Does it match exactly in `photos.yml`?
4. **Refresh your browser** (hard refresh: Cmd+Shift+R on Mac)

---

## 🎬 Adding Batches

**Easy workflow for adding 5-15 photos:**
1. Create the trip folder: `/assets/gallery/new-trip/`
2. Convert all photos to WebP
3. Move them to the folder
4. Open `_data/photos.yml`
5. Paste this template and fill it in:

```yaml
  - filename: 
    date: ""
    place: ""
    folder: new-trip
```

Copy-paste it as many times as you need, fill in `filename` and `date`, and you're done!

---

## 📱 How It Looks

When you **hover over a photo**, you'll see:
- The place (e.g., "Los Angeles")
- The date (e.g., "March 15, 2024")

The photos display in a responsive masonry grid that looks great on all devices.

---

Need help? Check that your files are in the right spots and that names match exactly!
