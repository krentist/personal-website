# ✅ FINAL CHECKLIST - BEFORE DEPLOYING

## Phase 1: Assets (15 mins)
- [ ] Created/downloaded favicon.ico
- [ ] Created/downloaded icon.svg
- [ ] Created/downloaded apple-touch-icon.png
- [ ] Created assets/card.png (1200x630px)
- [ ] All files placed in correct locations

## Phase 2: Personalization (10 mins)
- [ ] Updated `_config.yml` twitter handle
- [ ] Updated `_pages/about.md` with your bio
- [ ] Updated social media links in about.md
- [ ] Updated footer.html twitter handle
- [ ] Set up ButtonDown account (optional but recommended)
- [ ] Updated ButtonDown form in footer.html

## Phase 3: Content (30 mins)
- [ ] Created at least one post in `_posts/`
- [ ] Post has proper front matter (title, date, excerpt)
- [ ] Post uses Markdown formatting
- [ ] Deleted the example "getting-started" post (or kept it)

## Phase 4: Local Testing (10 mins)
- [ ] Ran `bundle exec jekyll serve`
- [ ] Site loads at http://localhost:4000
- [ ] Dark mode toggle works
- [ ] Keyboard shortcut 'D' works for dark mode
- [ ] Navigation links are clickable
- [ ] Posts display correctly
- [ ] Footer displays correctly
- [ ] Mobile responsive (tested by resizing)

## Phase 5: Git & GitHub (5 mins)
- [ ] Ran `git add .`
- [ ] Ran `git commit -m "..."` 
- [ ] Ran `git push origin main`
- [ ] Changes visible on GitHub.com

## Phase 6: Netlify Deployment (10 mins)
- [ ] Connected GitHub repository to Netlify
- [ ] Build command set to: `jekyll build`
- [ ] Publish directory set to: `_site`
- [ ] Site deployed successfully
- [ ] Netlify URL working (netlify.app domain)

## Phase 7: Domain Setup (5 mins)
- [ ] Added custom domain in Netlify settings
- [ ] Updated DNS settings at domain registrar
- [ ] Waited for DNS propagation (5-30 mins)
- [ ] Site accessible at kylehui.com

## Phase 8: Final Verification (5 mins)
- [ ] Visited kylehui.com in browser
- [ ] Site loads quickly
- [ ] All pages accessible
- [ ] Dark mode works
- [ ] Social sharing works (Twitter card preview)
- [ ] Mobile looks good
- [ ] Links work correctly

---

## Common Issues & Solutions

### Issue: Site doesn't build locally
**Solution**: Run `bundle install` first, then `bundle exec jekyll serve`

### Issue: Styles look different locally vs online
**Solution**: Make sure you're building with Jekyll, not just opening HTML files

### Issue: Dark mode not working
**Solution**: Check `_sass/_flexoki-base.scss` has `body.theme-dark` section

### Issue: Posts not appearing
**Solution**: Make sure posts are in `_posts/` folder with format `YYYY-MM-DD-title.md`

### Issue: Images not showing
**Solution**: Make sure image paths start with `/assets/` not `assets/`

### Issue: Domain shows Netlify 404
**Solution**: Check DNS settings - it can take 5-30 minutes to propagate

---

## Optional Enhancements

Once basic setup works, you can add:
- [ ] Google Analytics (instead of/in addition to Plausible)
- [ ] Sitemap.xml for SEO
- [ ] RSS feed (already set up!)
- [ ] Search functionality
- [ ] Comments system
- [ ] Related posts
- [ ] Reading time estimates

---

## Going Forward - Monthly Routine

1. Write a post
2. Save to `_posts/YYYY-MM-DD-title.md`
3. Test locally: `bundle exec jekyll serve`
4. Push to GitHub: `git add . && git commit -m "..." && git push`
5. Netlify auto-deploys
6. Done! 🚀

---

## Backup Strategy

Recommended:
- GitHub is your backup (all code versioned)
- Keep local copy synced
- Netlify has automatic builds from GitHub
- You're safe!

---

## Support

**If anything doesn't work:**
1. Check SETUP_GUIDE.md (very detailed)
2. Check QUICK_START.md (simplified version)
3. Check Jekyll official docs: https://jekyllrb.com
4. Check Netlify docs: https://docs.netlify.com

**You've got this!** 💪

---

*Generated: February 27, 2026*
*Website Template: Identical to stephanango.com*
*Color Palette: Flexoki*
