# memocho

Personal blog and travel writing site built with Astro. Posts are written in Obsidian and synced via a git submodule.

**Live:** [amitkul.in](https://amitkul.in)

---

## Stack

| Layer | Tool |
|---|---|
| Framework | [Astro](https://astro.build) v6 |
| Styling | Tailwind CSS v4 |
| Content | Markdown / MDX via git submodule |
| Search | Pagefind |
| OG Images | @vercel/og (Satori) |
| Fonts | Fontsource (Poppins, Newsreader, Rubik, Fira Code) |
| Deployment | Cloudflare Pages |

---

## Project Structure

```
memocho/
├── src/
│   ├── components/       # Astro components
│   ├── layouts/          # BaseLayout, PageLayout, PostLayout
│   ├── pages/            # Routes including OG image generation
│   ├── schemas/          # Zod content schemas
│   ├── styles/           # tokens.css, theme.css, components.css
│   ├── utils/            # content.utils, text.utils, og/, remark plugins
│   ├── content.config.ts # Collection definitions
│   └── site.config.ts    # Site metadata, navigation, social links
├── src/content/          # Git submodule → personal-blog-content repo
│   ├── posts/            # Travel and writing posts
│   └── pages/            # Static pages (about, now, uses, home)
└── public/               # Static assets, robots.txt
```

---

## Content

Content lives in a separate private repository mounted as a git submodule at `src/content/`. Posts are written in Obsidian and synced via a GitHub Actions workflow.

### Sync content

```bash
# Pull latest content from the submodule remote
npm run sync-content
```

### Local sync (from Obsidian vault)

```bash
npm run sync-local
```

### Post frontmatter

```yaml
---
title: The Taj Mahal
description: A short description shown in listings and OG images.
published: 2024-03-15
draft: false
type: travel          # free-form — travel, tech, essay, etc.
theme: [heritage]     # shown as badge on OG image
tags: [india, agra, mughal]
countries: [India]
places: [Agra, Uttar Pradesh]
cover: posts/2024-taj-mahal/attachments/cover.jpg
series: India Road Trip
seriesOrder: 2
---
```

---

## Development

```bash
# Install dependencies
npm install

# Sync content submodule
npm run sync-content

# Start dev server (content cache disabled for fresh data)
npm run dev

# Build + generate Pagefind search index
npm run build

# Preview production build
npm run preview
```

---

## Environment Variables

Create a `.env` file at the root for local overrides:

```bash
# Optional — Cloudflare Web Analytics token
# Currently disabled in Head.astro; enable when ready
CF_ANALYTICS_TOKEN=your_token_here
```

---

## Design System

Tokens are defined in `src/styles/tokens.css` using CSS `light-dark()` — no separate dark mode block needed. Semantic tokens are exposed to Tailwind via `@theme inline` in `theme.css`.

| Token | Light | Dark |
|---|---|---|
| `--color-page` | `#F5F4ED` | `#141413` |
| `--color-brand` | `#7B5C42` | `#C8A07A` |
| `--color-content` | `#22201C` | `#ECE6DA` |
| `--color-muted` | `#6F6A60` | `#B3AB9D` |

Theme switching is handled via `document.documentElement.style.colorScheme` with localStorage persistence. No class-based dark mode.

---

## Content Filtering

The `/archive` page supports client-side filtering across multiple dimensions simultaneously. Filter state is managed in JS (no page reloads) and synced to the URL via `history.replaceState` for bookmarkable/shareable URLs.

**Active dimensions:** Year, Tags

**Ready to wire up:** Type, Destination, Theme, Country — utility functions and `PostListItem` data attributes already in place. Pass the prop to `<PostFilter>` in `archive.astro` to enable.

---

## OG Images

Generated at build time via `@vercel/og`. Two routes:

| Route | Source |
|---|---|
| `/og/posts/[slug].png` | One per post — title, description, theme badge, tags |
| `/og/[page].png` | Static pages — home, about, archive, now, uses, search |

Fonts (Rubik) are loaded from `node_modules/@fontsource/rubik` at build time. No network requests needed if dependencies are installed.

---

## Remark Plugins

Three custom plugins run during Markdown processing:

| Plugin | Purpose |
|---|---|
| `remark-obsidian-core` | Wikilinks `[[Page]]`, image embeds `![[img]]`, highlights `==text==`, comments `%%...%%` |
| `remark-image-processing` | Path resolution for vault-relative images, lazy loading, gallery grid generation |
| `remark-callouts` | Obsidian callout syntax `[!note]`, `[!tip]` etc. → styled HTML blocks |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server with content cache disabled |
| `npm run build` | Astro build + Pagefind index generation |
| `npm run preview` | Preview production build locally |
| `npm run sync-content` | Pull latest content submodule |
| `npm run sync-local` | Sync from local Obsidian vault |
| `npm run sync-attachments` | Sync attachment files |