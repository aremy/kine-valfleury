# kine-valfleury

Static website for a physiotherapy & osteopathy practice in Meudon, France.
Live: <https://kine-valfleury.fr/>

## Stack

- **[Eleventy](https://www.11ty.dev/) (11ty) v3** - static site generator
- **Nunjucks** - templates
- **Plain CSS** - Material Design 3 tokens, no preprocessor
- **Vanilla JS** - app bar scroll, carousel, mobile menu, GA4 tracking
- **PWA** - Web App Manifest + Service Worker
- **AWS S3** (eu-west-2) - static hosting
- **GitHub Actions** - CI/CD (Node 20, no Docker, no Ruby)

## Prerequisites

- Node.js 20+
- AWS CLI (for manual deploys only - CI uses OIDC)

## Local development

```bash
npm install
npm start        # dev server → http://localhost:8080
npm run build    # outputs to _site/
```

## Deploy

Deployment runs automatically on every push to `master` via GitHub Actions.

For a manual deploy (requires AWS credentials):

```bash
npm run build
./deploy.sh
```

`deploy.sh` behaviour:

- Configures the S3 bucket error document (`404.html`)
- Syncs all assets with `max-age=31536000,immutable` cache headers
- Uploads `sw.js` and all HTML with `no-cache` headers
- Re-uploads CSS and JS gzip-compressed
- Runs a CloudFront invalidation if `CF_DISTRIBUTION_ID` is set

## i18n

All UI strings live in `_data/site.js` as `{ key: { fr: "...", en: "..." } }`.
Templates access them via `{{ site.key[lang] }}`.
URL structure: `/` = French, `/en/` = English.

## Structure

```text
_data/site.js          ← all i18n strings + site settings
_layouts/base.njk      ← outer HTML shell
_layouts/home.njk      ← home page layout (extends base)
_includes/head.njk     ← meta, SEO, PWA, GA4, JSON-LD
_includes/header.njk   ← nav + hero
_includes/sections.njk ← practice carousel, contact, map
_includes/footer.njk   ← links, contact info
index.njk              ← French page entry
en/index.njk           ← English page entry
404.njk                ← 404 error page (bilingual)
sw.js                  ← Service Worker
assets/css/main.css    ← MD3 design system
assets/js/main.js      ← interactive behaviour
```
