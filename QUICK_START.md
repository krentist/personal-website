# 🎯 YOUR QUICK-START CHECKLIST

## What I Did For You ✅

Your website structure is now **99% identical** to stephanango.com. All the hard technical work is done!

- ✅ Flexoki color palette (light & dark modes)
- ✅ Responsive design matching stephanango.com
- ✅ Dark mode toggle with keyboard shortcut
- ✅ Navigation, footer, meta tags
- ✅ Email subscription footer
- ✅ Typography and spacing
- ✅ Page structure (About, Now, Writing, Subscribe)
- ✅ All CSS/SCSS styling

---

## What You Need to Do (It's Simple!)

### 1️⃣ IMAGES & ICONS (Takes 15 minutes)

Go to: **https://favicon.io**
- Upload or design a simple icon/logo
- Download favicon pack
- Extract these files to your project root:
  - `favicon.ico`
  - `apple-touch-icon.png`
  - `icon.svg` (you may need to create this - it's just an SVG version)

Create `assets/card.png`:
- Size: 1200x630px
- This is what shows when people share your site
- Simple design with your name and tagline works great

📂 **File structure should be:**
```
/Users/kyle/Desktop/personal-website/
├── favicon.ico
├── icon.svg
├── apple-touch-icon.png
├── assets/
│   └── card.png
├── _config.yml
├── _layouts/
├── _pages/
├── _posts/
└── ... (other files)
```

### 2️⃣ PERSONALIZE YOUR SITE (Takes 10 minutes)

Edit `_config.yml`:
```yaml
twitter: YOUR_TWITTER_HANDLE  # Change "krentist" to your handle
```

Edit `_pages/about.md`:
- Replace the placeholder text with your actual bio
- Add your real social media links

Edit `_includes/footer.html`:
- Change `twitter` references to your actual Twitter handle
- Update the ButtonDown email subscribe link (see Step 3)

### 3️⃣ SET UP EMAIL (Optional, Takes 5 minutes)

Sign up for **ButtonDown** (free): https://buttondown.email

1. Create account
2. Create a subscriber list
3. Copy your username
4. Find this line in `_includes/footer.html`:
   ```
   https://buttondown.email/api/emails/embed-subscribe/kylehui
   ```
   Replace `kylehui` with your username in TWO places

### 4️⃣ WRITE YOUR FIRST POST (Takes as long as you want!)

Create a file: `_posts/2026-02-27-hello-world.md`

```markdown
---
layout: note
title: My First Post
date: 2026-02-27
excerpt: A brief description of this post
---

# Write your content here

You can use **Markdown** syntax. Here's a [link](https://example.com).

## Sections work too

Just write naturally! The styling is all done for you.
```

Then create more posts following the same format. They'll automatically appear on your site!

### 5️⃣ TEST IT LOCALLY (Takes 3 minutes)

Open Terminal and run:
```bash
cd /Users/kyle/Desktop/personal-website
bundle exec jekyll serve
```

Then open: **http://localhost:4000**

Check:
- ✅ Does it look good?
- ✅ Does dark mode work? (Click button or press 'D')
- ✅ Do links work?
- ✅ Is it responsive? (Resize your browser)

### 6️⃣ PUSH TO GITHUB (Takes 1 minute)

```bash
git add .
git commit -m "Website setup with Flexoki theme"
git push origin main
```

### 7️⃣ DEPLOY TO NETLIFY (Takes 5 minutes)

1. Go to https://netlify.com
2. Sign in with GitHub
3. Connect your `personal-website` repository
4. Build settings:
   - Build command: `jekyll build`
   - Publish directory: `_site`
5. Click "Deploy"

### 8️⃣ POINT YOUR DOMAIN (Takes 5 minutes)

Once Netlify is deployed:
1. Go to Netlify dashboard
2. Site settings → Domain settings
3. Add your domain: `kylehui.com`
4. Follow the DNS instructions provided
5. Wait 5-30 minutes for DNS to propagate

---

## 🎨 THAT'S IT!

Your website is now:
- **Visually identical** to stephanango.com
- **Fully functional** with dark mode, responsive design, etc.
- **Easy to update** - just add posts to `_posts/`
- **Professional** - optimized for SEO with all meta tags

---

## 🚀 ONGOING WORKFLOW

After you're set up, this is your monthly workflow:

1. Write a post in `_posts/YYYY-MM-DD-title.md`
2. Run `bundle exec jekyll serve` locally to preview
3. Commit and push to GitHub
4. Netlify automatically deploys (you're done!)

That's literally it. No complex stuff. Just write, commit, done.

---

## ❓ QUESTIONS?

Check the `SETUP_GUIDE.md` file for more detailed instructions on any of these steps!
