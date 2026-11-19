# Security policy

Please don't post credentials or private data in public issues. If you find a vulnerability, reach the maintainer privately through their available GitHub contact methods.

## Protections

- Pre-rendered static pages; no accounts, payment processing, visitor tracking, or backend.
- No third-party runtime scripts, external font requests, or npm dependencies.
- Catalog validation for slugs, dates, categories, language content, image paths and HTTPS links.
- Project titles, descriptions, instructions and notes are escaped before they become HTML.
- Download URLs must be GitHub Releases links; no fabricated or unverified downloads.
- External links use `rel="noopener noreferrer"`.
- An HTML meta Content Security Policy limits scripts, styles, connections, images, objects and forms.
- CI runs translation tests, static-build checks and dependency audits before publishing.

## Limitations

GitHub Pages does not permit custom HTTP response headers, so a fully header-enforced CSP and directives such as `frame-ancestors` are unavailable here. Avoid copying untrusted HTML into templates or importing third-party JavaScript. Do not commit credentials or unauthorized copyrighted game files.

These measures reduce risk; they do not guarantee absolute security.
