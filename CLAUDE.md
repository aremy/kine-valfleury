# kine-valfleury - Claude Context

## What this project is

Static website for **Andreea Almajan**, a physiotherapist/osteopath in Meudon, France (92190).
Live site: <https://kine-valfleury.fr/>
Two-language (French + English), single-page layout, zero CMS.

## Tech stack

| Layer | Current |
| --- | --- |
| SSG | Eleventy (11ty) v3 |
| Templates | Nunjucks (.njk) |
| CSS | Plain CSS - Material Design 3 tokens + custom components |
| Icons | Material Symbols Rounded (Google Fonts CDN) |
| JS | Vanilla JS (App Bar scroll, carousel, mobile menu, GA4 tracking) |
| Build | GitHub Actions → `npm install && npm run build` (no Docker, no Ruby) |
| Deploy | `deploy.sh` → AWS S3 `kine-valfleury.fr` (eu-west-2) via `aws s3 sync` |
| Auth | AWS OIDC role (`git-action-deployment-user`) |
| Analytics | GA4 `G-QQ2J1J39T6` |
| Map | OpenStreetMap embed (free, no API key, GDPR-friendly) |

## File structure

```text
.eleventy.js             ← Eleventy config (input: ., output: _site)
package.json             ← single dep: @11ty/eleventy
_data/
  site.js                ← ALL i18n strings + site-level settings
_layouts/
  base.njk               ← outer HTML (DOCTYPE → head → header → content → footer)
  home.njk               ← extends base, includes sections.njk
_includes/
  head.njk               ← meta, SEO, PWA, GA4, JSON-LD
  header.njk             ← Top App Bar (nav) + Hero section
  sections.njk           ← main page sections: Practice carousel, Contact, Map
  footer.njk             ← quick links + copyright
index.njk                ← French page entry  (lang: fr, layout: home.njk)
en/index.njk             ← English page entry (lang: en, layout: home.njk)
assets/
  css/main.css           ← MD3 design system CSS (no preprocessor)
  js/main.js             ← App Bar scroll, carousel, mobile menu, GA4
manifest-fr.json         ← PWA manifest French
en/manifest-en.json      ← PWA manifest English
sitemaps.xml.njk         ← Sitemap (outputs /sitemaps.xml via permalink)
deploy.sh                ← aws s3 sync + gzip CSS/JS upload
.github/workflows/deploy.yml  ← CI: Node 20 → npm install → build → deploy
img/                     ← images (WebP + PNG, pre-optimised, not managed by Eleventy)
```

## i18n pattern

All UI strings live in `_data/site.js` as nested objects:

```js
make_appointment: { fr: "Prendre rendez-vous", en: "Make an Appointment" }
```

Templates access them via `{{ site.make_appointment[lang] }}`.
`lang` is set in page front matter (`lang: fr` / `lang: en`), and flows through the layout chain.
URL structure: `/` = French, `/en/` = English.

## Build & deploy

**Local dev:**

```bash
npm install
npm start          # Eleventy dev server → http://localhost:8080
npm run build      # produces _site/
```

**CI/CD (GitHub Actions → push to master):**

1. `actions/setup-node@v4` - Node 20
2. `npm install`
3. `npm run build` (`eleventy`) - outputs to `_site/`
4. `./deploy.sh` - `aws s3 sync` + gzip CSS/JS

**deploy.sh behaviour:**

- All non-HTML assets: `aws s3 sync --delete --cache-control "max-age=31536000,immutable"`
- HTML files: individual `aws s3 cp` with `no-cache,no-store,must-revalidate`
- CSS + JS: additionally re-uploaded gzipped with `content-encoding: gzip`

## CSS design system

The CSS uses MD3 (Material Design 3) design tokens as CSS custom properties:

| Token | Value | Used for |
| --- | --- | --- |
| `--md-primary` | `#006874` | Nav scrolled tint, buttons, accents, footer bg |
| `--md-on-primary` | `#ffffff` | Text on primary surfaces |
| `--md-primary-container` | `#97f0ff` | Light teal highlights |
| `--md-background` | `#f4fafb` | Page background |
| `--md-surface` | `#ffffff` | Cards |
| `--md-surface-variant` | `#dbe4e6` | Contact section background |

Hero overlay colour: `rgba(0, 70, 83, .82)` over the `bg-banner.webp` image.

## AWS infrastructure

- S3 bucket: `kine-valfleury.fr`
- Region: `eu-west-2` (London)
- IAM role assumed via GitHub OIDC (no long-lived secrets)
- No CloudFront yet - S3 website endpoint serves directly (future improvement)

## Key things to know

- **No SCSS, no Bootstrap, no Ruby, no Docker** - pure Node.js build
- Nunjucks `{{ site.key[lang] }}` bracket notation works for all i18n lookups
- The `sitemaps.xml.njk` front matter has `permalink: /sitemaps.xml` so Eleventy outputs it as XML
- The carousel uses CSS scroll-snap + vanilla JS (no external library)
- Images in `/img/original/` are source files - web-ready ones are at `/img/`
- PWA manifests are static JSON files passthrough-copied by Eleventy
- Old Jekyll files (Gemfile, `_config.yml`, `_sass/`) have been removed

## Common tasks

**Change a UI string (both languages):**
Edit `_data/site.js` - update the `fr` and `en` values for the relevant key.

**Update contact info:**
`_data/site.js` → `phone_nb`, `phone_nb_link`, `physiotherapy_address`.

**Update images:**
Replace files in `/img/` (keep WebP format, same filenames).

**Tweak colours / spacing:**
`assets/css/main.css` - look for the `:root { }` block at the top for MD3 tokens.

**Add a new section:**
Edit `_includes/sections.njk` - add HTML using the existing section pattern.
Update `_includes/header.njk` to add a nav link if needed.
Add any new i18n strings to `_data/site.js`.
