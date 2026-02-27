# Your Personal Website Setup - Complete Guide

## ✅ COMPLETED

I've set up your website infrastructure to match stephanango.com. Here's what I did:

### 1. **Configuration** ✅
- Updated `_config.yml` with your site title, description, author, and Twitter handle
- Added proper permalink structure

### 2. **Layout Files** ✅
- Updated `_layouts/default.html` with complete stephanango structure including:
  - Dark/light mode toggle with keyboard shortcut (press 'D')
  - Proper navigation bar
  - Footer with email subscription form
  - Anchor link functionality for headings
  
- Updated `_layouts/note.html` for article display

### 3. **Includes** ✅
- `_includes/head.html` - Complete meta tags for SEO, Twitter cards, OG tags, Plausible analytics
- `_includes/nav.html` - Navigation with dark mode toggle
- `_includes/footer.html` - Footer with email signup and social links

### 4. **Styling** ✅
- Created `_sass/_flexoki-base.scss` with complete color palette (light and dark modes)
- Updated `_sass/_style.scss` with all necessary styles:
  - Flexoki colors with automatic dark mode support
  - Responsive typography
  - Utility classes (flexbox, spacing, text)
  - Navigation and footer styling
  - Dark mode toggle styling
  - All form styling
  - Article/content styling

### 5. **Pages** ✅
- `_pages/index.md` - Homepage with latest post, topics, and writing list
- `_pages/about.md` - About page with colophon
- `_pages/now.md` - What you're doing now page
- `_pages/writing.md` - All posts archive
- `_pages/subscribe.md` - Email subscription page

---

## 📋 NEXT STEPS (What YOU Need to Do)

### STEP 1: Update Social Links
Edit these files and add YOUR actual Twitter handle, GitHub, Mastodon, etc:

**File: `_config.yml`**
- Change `twitter: krentist` to your Twitter handle

**File: `_includes/footer.html`**
- Change `https://twitter.com/{{ site.twitter }}` to your real Twitter
- Change `https://mastodon.social/@{{ site.twitter }}` to your real Mastodon

**File: `_pages/about.md`**
- Replace placeholder social links with your actual profiles

**File: `_includes/footer.html` (the email form)**
- Change `buttondown.email/api/emails/embed-subscribe/kylehui` to your own ButtonDown account (or use a different email service)

### STEP 2: Create Assets (Images, Icons, Favicon)

You need to create these image files and place them in your workspace root:

1. **favicon.ico** (32x32 pixels)
   - This is the small icon that appears in browser tabs
   - Use a favicon generator online (favicon.io) or design your own
   - Place in: `/Users/kyle/Desktop/personal-website/favicon.ico`

2. **icon.svg** (SVG format)
   - Scalable icon version
   - Place in: `/Users/kyle/Desktop/personal-website/icon.svg`

3. **apple-touch-icon.png** (180x180 pixels)
   - Icon for iOS/Mac bookmarks
   - Place in: `/Users/kyle/Desktop/personal-website/apple-touch-icon.png`

4. **assets/card.png** (1200x630 pixels recommended)
   - Social media share preview image
   - Used when people share your site on Twitter, Slack, etc.
   - Place in: `/Users/kyle/Desktop/personal-website/assets/card.png`

📌 **Simple Option**: Use an online service like:
- https://favicon.io/ (for favicon + apple-touch-icon)
- https://canva.com/ (for social card)
- Duplicate one design in multiple sizes

### STEP 3: Create Your First Posts

Posts go in `_posts/` folder with this naming format: `YYYY-MM-DD-your-post-title.md`

**Example file: `_posts/2026-02-27-hello-world.md`**
```markdown
---
layout: note
title: Hello World
date: 2026-02-27
excerpt: My first post
---

This is the content of your first post. Write in Markdown.

## Section heading

More content here...
```

### STEP 4: Set Up Email Newsletter (Optional but Recommended)

The footer form is configured for **ButtonDown**:

1. Go to https://buttondown.email
2. Sign up for a free account
3. Create a subscriber list (e.g., "kylehui")
4. Replace `kylehui` in the form URLs with your ButtonDown username

Alternative email services:
- Substack (substack.com)
- Beehiiv (beehiiv.com)
- ConvertKit (convertkit.com)

### STEP 5: Test Locally Before Deploying

1. Open Terminal and navigate to your project:
   ```bash
   cd /Users/kyle/Desktop/personal-website
   ```

2. Install Jekyll (if not already installed):
   ```bash
   gem install jekyll bundler
   bundle install
   ```

3. Build and serve locally:
   ```bash
   bundle exec jekyll serve
   ```

4. Open http://localhost:4000 in your browser

5. Test:
   - ✅ Dark/light mode toggle (click the button top-right, or press 'D')
   - ✅ Navigation links work
   - ✅ Footer looks good
   - ✅ Mobile responsive (resize browser)
   - ✅ Colors match Flexoki palette

### STEP 6: Deploy to Netlify (Final Step!)

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Initial website setup"
   git push origin main
   ```

2. Go to https://netlify.com and sign in

3. Select your repository (personal-website)

4. Build settings should be:
   - Build command: `jekyll build`
   - Publish directory: `_site`

5. Deploy!

6. Update your domain:
   - Go to Netlify site settings → Domain settings
   - Add your custom domain (kylehui.com)
   - Follow DNS instructions

---

## 🎨 CUSTOMIZATION IDEAS

Once basic setup is done, you can customize:

1. **Color Palette** - The Flexoki colors are defined in `_sass/_flexoki-base.scss`. You can tweak them!

2. **Font** - Change in `_sass/_flexoki-base.scss`:
   ```scss
   --font-content: /* change this */
   ```

3. **Typography** - Adjust heading sizes, line heights in `_sass/_style.scss`

4. **Spacing** - Modify margin/padding values in utility classes

5. **Dark Mode** - Tweak dark mode colors in `body.theme-dark` section of `_flexoki-base.scss`

---

## 📞 HELP & RESOURCES

- **Jekyll Docs**: https://jekyllrb.com/docs/
- **Markdown Guide**: https://www.markdownguide.org/
- **Flexoki Colors**: https://stephango.com/flexoki
- **ButtonDown Email**: https://buttondown.email/
- **Netlify Deploy Guide**: https://docs.netlify.com/get-started/overview/

---

## 🚀 YOUR WORKFLOW GOING FORWARD

1. Write posts in `_posts/` as Markdown files
2. Save and commit to Git
3. Push to GitHub
4. Netlify automatically redeploys
5. Your site updates instantly!

That's it! You now have a beautiful personal website identical to stephanango.com.

---

## Questions?

Feel free to ask me to clarify or help with any of these steps!
