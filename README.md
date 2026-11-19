# Luix Arcade

🇺🇸 A home for my games, mods, homebrew, and other projects.

🇧🇷 Um espaço para meus jogos, mods, homebrews e outros projetos.

Luix Arcade is my personal, free-to-browse library for games, patches, homebrew, and tools. No payments, user accounts, advertising, or tracking. The catalog remains empty until I choose what to publish.

**Site (once GitHub Pages is enabled):** https://luixmath.github.io/LuixArcade/

## Getting started / Começando

You only need **Node.js 20 or newer**. No third-party npm dependencies are required.

```sh
npm run dev
```

Open **http://localhost:4173/LuixArcade/**. The preview command builds the site and starts a local server.

| Command | Purpose |
| --- | --- |
| `npm run build` | Generate the static site in `dist/` |
| `npm run dev` | Build and preview locally |
| `npm run test` | Run validation and localization tests |
| `npm run smoke` | Test pages in Chrome at desktop and mobile sizes |
| `npm run check` | Check scripts, tests, and production build |
| `npm run audit` | Audit the npm dependency graph |

The site uses plain HTML, CSS, and JavaScript. Pages are pre-rendered at build time, including localized project pages. The browser script only handles theme preference, menus, language choice, catalog search, filters, sorting, and image galleries.

## Publishing a project / Publicando um projeto

Open **`content/projects.json`**. It contains **`[]`**, intentionally. Add a new entry only when you want to publish something.

Example (**documentation only; this project does not appear on the site**):

```json
[
  {
    "slug": "my-project",
    "category": "tools",
    "status": "development",
    "platforms": ["3ds"],
    "updated": "2026-11-19",
    "repository": "https://github.com/LuixMath/my-project",
    "featured": false,
    "translations": {
      "pt-BR": {
        "title": "Meu projeto",
        "summary": "Uma descrição curta e natural.",
        "description": "Uma apresentação mais detalhada.",
        "features": ["Recurso principal"],
        "compatibility": ["Nintendo 3DS"],
        "installation": ["Consulte as instruções no repositório."],
        "knownIssues": []
      },
      "en": {
        "title": "My project",
        "summary": "A short, natural description.",
        "description": "A closer look at what it does.",
        "features": ["Main feature"],
        "compatibility": ["Nintendo 3DS"],
        "installation": ["See the instructions in the repository."],
        "knownIssues": []
      },
      "es": {
        "title": "Mi proyecto",
        "summary": "Una descripción breve y natural.",
        "description": "Una explicación más detallada.",
        "features": ["Función principal"],
        "compatibility": ["Nintendo 3DS"],
        "installation": ["Consulta las instrucciones del repositorio."],
        "knownIssues": []
      }
    }
  }
]
```

Available categories: `games`, `mods`, `homebrew`, `tools`, `experiments`.

Available platforms: `3ds`, `pc`, `ps2`, `xbox360`, `web`, `android`, `other`.

Available statuses: `released`, `development`, `paused`, `archived`.

Optional properties:

- `version`: the actual released version.
- `cover`: image path such as `/media/my-project/cover.webp` (the file goes in `public/media/`) or a trusted HTTPS image URL.
- `gallery`: an array of `{ "src": "...", "alt": { "pt-BR": "...", "en": "...", "es": "..." } }` entries.
- `featured`: `true` to display the project in the home spotlight.
- `website`: a real, working HTTPS project website.
- `releaseUrl`: a verified GitHub release page (no automatic asset selection).
- `downloadUrl`: a **real** GitHub Releases asset URL, not a placeholder.
- `features`, `compatibility`, `installation`, `knownIssues`, `changelog`: additional editorial content in each language.

**Do not add a download URL until a distributable release exists.** If there is no release, download buttons are omitted. When available, repository and website links are still shown. Never upload commercial ROMs, unauthorized patches containing game files, or third-party assets without permission.

Then run `npm run check`. Invalid URLs, duplicate project slugs, invalid dates, and missing language versions fail the build. Edit an entry to update it; remove the entry to remove a project. No page or component edits are needed.

## Translations / Traduções

**Interface:** `content/i18n.mjs`.

**Project descriptions:** `content/projects.json`, inside each project's `translations` field.

- 🇧🇷 `pt-BR` — default language.
- 🇺🇸 `en` — natural, idiomatic English.
- 🇪🇸 `es` — clear, international Spanish.

Write each version naturally rather than translating word for word. Do not translate project names that are proper nouns. Tests ensure the interface has matching translation keys across the three languages.

The language menu preserves the page (and catalog query/filter state). Theme and language preferences are saved only on the visitor's device.

## Project structure / Organização

```text
content/
  i18n.mjs                Translated interface text
  projects.json           Project catalog (initially [])
public/
  app.js                  Theme, language, menu, filters, gallery
  styles.css              Responsive light and dark UI
  favicon.svg             Luix Arcade icon
  hero-art.svg            Original decorative artwork
  og-preview.svg          Social sharing artwork
  media/                  Approved project covers/screenshots
scripts/
  build.mjs               Catalog validation and static generation
  serve.mjs               Local development preview
tests/
  site.test.mjs           Language, safety and build checks
.github/workflows/
  pages.yml               Automated verification and Pages publishing
dist/                      Generated files; excluded from Git
```

## GitHub Pages

1. Open the `LuixMath/LuixArcade` repository.
2. Go to **Settings → Pages**.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. Push or merge an approved change to `main`.
5. Check the **Actions** tab. If validation succeeds, the deploy job publishes `dist/`.
6. Visit https://luixmath.github.io/LuixArcade/

The build accounts for GitHub Pages' **`/LuixArcade/`** base path. Pull requests run validation without publishing.

## Security and licensing

The site is static and has no backend. Project text is HTML-escaped, entries and URLs are validated, all external links use `noopener noreferrer`, and a meta CSP restricts resource origins where supported. GitHub Pages does not support arbitrary custom HTTP headers, so some CSP protections cannot be enforced at the server level. See [SECURITY.md](SECURITY.md).

This repository holds the storefront only. Each listed project keeps its own distribution and licensing terms. Public source code is not permission to redistribute third-party game assets.

Made by Luix, just for the fun of it.
