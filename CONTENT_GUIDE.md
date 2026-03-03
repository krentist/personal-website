# How to Add Photos, Pages & Posts to Your Website

A beginner-friendly guide for non-technical users. No coding knowledge required!

---

## 📸 ADDING PHOTOS TO GALLERY (Easiest Method)

### Step 1: Prepare Your Photos in Finder
1. Open **Finder** and locate your photos
2. Select the photos you want to add
3. Right-click → **Get Info**, note which folder they're in (you'll need this)
4. Pick one "best" photo per album to be the cover image
5. **Rename photos simply**: `photo1.jpg`, `photo2.jpg`, etc. (use numbers, no spaces)

### Step 2: Upload Photos to Your Website Folder
1. Open the **personal-website** folder on your Desktop
2. Navigate to: `assets` → `gallery`
3. Create a new folder for your collection (e.g., `japan`, `nyc`, `mountains`)
4. **Drag and drop your photos** from Finder into this new folder
5. Done! Photos are now on your site.

**Example folder structure:**
```
personal-website/
└── assets/
    └── gallery/
        ├── japan/
        │   ├── cover.jpg (main photo)
        │   ├── photo1.jpg
        │   ├── photo2.jpg
        │   └── photo3.jpg
        └── nyc/
            ├── cover.jpg
            └── photo1.jpg
```

### Step 3: Tell Your Site About Your New Album
1. Open VS Code
2. Go to `_data` → `gallery.yml` 
3. Add your album at the bottom, following this format:

```yaml
  - title: "Japan"
    cover_image: "/assets/gallery/japan/cover.jpg"
    description: "Two weeks exploring Tokyo and Kyoto"
    photos:
      - image: "/assets/gallery/japan/photo1.jpg"
        alt: "Temple in Kyoto"
      - image: "/assets/gallery/japan/photo2.jpg"
        alt: "Street food in Tokyo"
```

**Key things:**
- `title`: What shows under the photo (e.g., "Japan", "NYC", "Mountains")
- `cover_image`: Path to your main photo (should match the folder structure)
- `photos`: All your photos in that album
- `alt`: Brief description (helps accessibility & if image fails)

### Step 4: Save & Push to Live Site
1. After editing `gallery.yml`, press **Cmd+S** to save
2. Open Terminal in VS Code (View → Terminal)
3. Copy-paste these commands one at a time:
```bash
git add .
git commit -m "Add Japan photo album"
git push origin main
```
4. Wait 1-2 minutes → Visit [kylehui.com/gallery](https://kylehui.com/gallery) to see your photos!

---

## 📝 WRITING BLOG POSTS (Using Obsidian)

### Setup: Connect Obsidian to Your Website
1. Open **Obsidian**
2. Create a new vault called "Kyle Website"
3. Point it to: `/Users/kyle/Desktop/personal-website/_notes`
4. Now Obsidian shows all your site's notes!

### Writing a New Post
1. In Obsidian, press **Cmd+N** (New Note)
2. Name it something simple: `my-first-post.md`
3. Start writing! Example:

```markdown
# My Trip to Japan

This was an amazing adventure where I...

## Tokyo

The energy in Tokyo is incredible.

## Kyoto

The temples were breathtaking.
```

4. **Save** (Cmd+S) — it automatically saves to your website

### Making Links to Other Posts
In Obsidian, you can link to your trips:
```markdown
I also wrote about my [[japan-food]] experiences.
```

Obsidian creates the link, and your website shows them too!

### Publishing Your Note
1. Your note is automatically on your site at: `kylehui.com/yournotename`
2. It's in the `/notes` section (already linked in navigation)
3. That's it!

---

## 📄 ADDING NEW PAGES (About, Now, Custom Pages)

### Example: Adding a "Projects" Page

1. Open VS Code, go to `_pages` folder
2. Right-click **New File** → `projects.md`
3. Copy this template:

```markdown
---
layout: page
title: Projects
permalink: /projects/
---

# My Projects

I'm working on a few things:

## Website Redesign
Started in 2026...

## Photography Series
Currently documenting...
```

4. Save the file
5. Go to `_layouts/default.html` (your navigation)
6. Find the nav section and add your link:
```html
<a href="/projects" class="muted plain">Projects</a>
```
7. Save, then in Terminal run:
```bash
git add .
git commit -m "Add Projects page"
git push origin main
```

---

## 🔄 COMPLETE WORKFLOW (Start to Finish)

### I Want to Add a Photo Album

1. **Organize photos in Finder**
   - Create folder like `Japan Trip`
   - Rename photos to `photo1.jpg`, `photo2.jpg`

2. **Add to website**
   - Drag folder into `personal-website/assets/gallery/japan/`

3. **Edit gallery.yml**
   - Open `_data/gallery.yml` in VS Code
   - Add your album details (copy-paste the template above)
   - Save (Cmd+S)

4. **Publish**
   - Terminal: `git add . && git commit -m "Add Japan album" && git push origin main`
   - Wait 2 minutes
   - Visit kylehui.com/gallery ✨

---

### I Want to Write a Blog Post

1. **Open Obsidian**
   - New note: `japan-reflections.md`
   - Write freely
   - Save

2. **Add front matter** (top of file):
```markdown
---
layout: note
title: Japan Reflections
date: 2026-03-04
---

# Japan Reflections

My thoughts after visiting...
```

3. **Publish**
   - Terminal: `git add . && git commit -m "Add Japan post" && git push origin main`
   - Visit kylehui.com/japan-reflections

---

## ⚠️ COMMON QUESTIONS

**Q: Do I need to code?**
No! Just edit text files and move folders around.

**Q: What if I break something?**
Don't worry. Worst case, undo with: `git reset --hard`

**Q: Can I edit old posts?**
Yes! Open the `.md` file in VS Code or Obsidian, edit, save, then:
```bash
git add .
git commit -m "Update Japan post"
git push origin main
```

**Q: How long do changes take?**
Usually 30 seconds to 2 minutes. Check your site after pushing.

**Q: Can I use photos from my phone?**
Yes! AirDrop to Mac, then drag into the gallery folder.

**Q: What file types work?**
- Photos: `.jpg`, `.png`, `.webp`
- Writing: `.md` (markdown)

---

## 📋 QUICK CHECKLIST

### Adding a Photo Album
- [ ] Photos named `photo1.jpg`, `photo2.jpg`, etc.
- [ ] Folder created in `assets/gallery/albumname/`
- [ ] Photos dragged into folder
- [ ] `gallery.yml` updated with new album info
- [ ] Saved and committed with message
- [ ] Pushed to main

### Writing a Post
- [ ] Created `mynote.md` in Obsidian (in `_notes`)
- [ ] Added title as heading: `# My Title`
- [ ] Wrote content
- [ ] Saved file
- [ ] Committed: `git commit -m "Add my note"`
- [ ] Pushed: `git push origin main`

---

## 🆘 NEED HELP?

If something doesn't work:
1. Check file paths match exactly (case-sensitive on Mac)
2. Make sure photos are `.jpg` or `.png` (not `.heic`)
3. Restart Jekyll if needed: Press Ctrl+C in Terminal, then run `bundle exec jekyll serve`
4. Clear browser cache: Cmd+Shift+Delete and reload

---

**Pro tip:** Keep this file open in VS Code for quick reference! You've got this. 🎉
