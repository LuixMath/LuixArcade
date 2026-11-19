# Maintaining Luix Arcade

This document covers the site itself, not the projects listed in the catalog.

## Local setup

Node.js 20+ is required. There are no third-party npm dependencies.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Build and preview at `http://localhost:4173/LuixArcade/` |
| `npm run check` | Validate code, translations, catalog and static build |
| `npm run smoke` | Browser checks (requires Chrome or Chromium) |
| `npm run build` | Generate production files under `dist/` |

## Publishing a project

Open `content/projects.json`. The initial catalog is intentionally `[]`.

Each entry needs a unique `slug`, `category`, `status`, nonempty `platforms`, an ISO `updated` date, and `translations` for `pt-BR`, `en` and `es`. Each translation needs `title`, `summary`, and `description`.

Supported categories: `games`, `mods`, `homebrew`, `tools`, `experiments`.

Platforms: `3ds`, `pc`, `ps2`, `xbox360`, `web`, `android`, `other`.

Statuses: `released`, `development`, `paused`, `archived`.

Optional fields include `version`, `featured`, `cover`, `gallery`, `repository`, `website`, `releaseUrl`, and `downloadUrl`. Extra translated fields include `features`, `compatibility`, `installation`, `knownIssues`, and `changelog`.

Put your own permitted images under `public/media/<project-slug>/` and refer to them using paths such as `/media/<project-slug>/cover.webp`.

Never publish a download link until the real file exists as a GitHub Release asset. Never redistribute commercial ROMs or third-party media without authorization. Save the entry and run `npm run check`. Remove the entry if you want to remove a project.

## Languages

- Interface copy: `content/i18n.mjs`
- Project copy: `content/projects.json`, under `translations`

Write natural descriptions for each language rather than literal translations. The build checks the locale keys and rejects incomplete project translations.

## Site structure

`public/` contains the visual system and browser interactions. `scripts/build.mjs` validates the catalog and produces localized HTML. `tests/` contains build and browser checks.

## Publication

GitHub Pages uses the `dist/` output and the `/LuixArcade/` base path. Select **GitHub Actions** as the Pages source in the repository settings. The pipeline runs checks before deploying from `main`.

Do not commit generated `dist/`, credentials, user data, or content you cannot legally redistribute.
