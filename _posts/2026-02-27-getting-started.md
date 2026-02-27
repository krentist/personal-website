---
layout: note
title: Getting Started with This Site
date: 2026-02-27
excerpt: A guide to how this personal website works
published: false
---

This is your first post! Here's how the site works and how to customize it.

## How to write posts

Posts are written in **Markdown**, which is a simple text format. Each post needs a header section at the top (called "front matter") that looks like this:

```markdown
---
layout: note
title: Your Post Title
date: 2026-02-27
excerpt: A short description
---
```

## Markdown basics

### Bold text
Use `**text**` for **bold** or `__text__` for __bold__.

### Italic text
Use `*text*` for *italics* or `_text_` for _italics_.

### Links
Create a link like this: `[link text](https://example.com)` → [link text](https://example.com)

### Lists

Unordered list:
```markdown
- Item 1
- Item 2
- Item 3
```

Ordered list:
```markdown
1. First
2. Second
3. Third
```

### Code blocks

Inline code: `` `code` `` → `code`

Code block:
````
```python
def hello():
    print("Hello, World!")
```
````

### Blockquotes

```markdown
> This is a quote
> 
> It can span multiple lines
```

> This is a quote
> 
> It can span multiple lines

## Headings

```markdown
# H1 - Main heading
## H2 - Section heading
### H3 - Subsection
#### H4 - Minor heading
```

## Images

```markdown
![Alt text](https://example.com/image.jpg)
```

## Next steps

1. Customize `_pages/about.md` with your bio
2. Update social media links
3. Write your first real post!
4. Deploy to your domain

## Tips

- Keep post titles short and clear
- The `excerpt` shows up in lists - make it compelling
- Dates should be in YYYY-MM-DD format
- Use `layout: note` for all posts
- Posts automatically appear newest first

Happy writing! 🎉
