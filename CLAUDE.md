# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Despite the directory name, this is no longer a Flutter project. It is a React 19 + Vite single-page portfolio (the old Flutter sources are deleted in the working tree). Node 22.12+.

## Commands

```sh
npm ci
npm run dev            # vite on 0.0.0.0:5173
npm run build          # outputs dist/, deploy to Netlify
npm test               # node:test unit tests (tests/*.test.js)
npm run test:e2e       # Playwright, tests/browser/, starts the dev server itself
npx playwright test -g "case study dialog"   # single browser test by name
node --test tests/contact.test.js            # single unit test file
```

Playwright uses local Google Chrome if installed, otherwise `npx playwright install chromium`. Some browser tests write screenshots to `test-results/` for visual review.

## Architecture

- `src/App.jsx` holds every section component (Header, Hero, Work, Proof, About, Process, Expertise, Faq, Contact) plus the shared `Dialog` (focus trap, Escape, scroll lock, focus restore), `CaseStudyDialog` and `LeadShortcuts`. `src/styles.css` is the single stylesheet; theming is `html[data-theme="dark"|"light"]` with tokens on `:root`.
- Motion is CSS only: entrance keyframes plus scroll-driven animations (`animation-timeline: scroll()/view()`) inside `@supports`, so unsupported browsers just show static content. Elements with `.reveal` fade in on scroll. Never animate opacity of text from a scroll timeline that is non-zero at rest: axe scrolls while checking contrast. Browser a11y tests call `settle(page)` to let entrance animations finish first.
- Project imagery is WebP cropped from Play listing captures by `scripts/make-webp.mjs` (Chrome canvas encoder, no image deps). The source PNGs stay in `assets/projects/` but are not imported.
- `src/data.js` is the content source. The Work section, filters, counts and the stats bar all derive from `projects`; `archivedProjects` holds retired apps (move back to restore). FAQ copy is duplicated in `index.html` as `FAQPage` JSON-LD, so keep both in sync.
- Theme: an inline script in `index.html` applies the saved theme (`localStorage['portfolio-theme']`) and `theme-color` meta before React mounts to avoid a flash; `Header` updates both on toggle.
- Case studies are deep-linkable via `#case-<slug>`; `App` reads the hash on mount and rewrites it with `history.replaceState`.
- `src/project-store.js` picks App Store vs Google Play per device (iPhone/iPad incl. iPad desktop mode → App Store when `appStore` is set).
- Contact pipeline (`src/contact.js`): in production it POSTs to `netlify/functions/contact.mjs` (server-side EmailJS key, rate limit, origin allowlist via `CONTACT_ALLOWED_ORIGINS`); on 404/501/network failure it falls back to calling EmailJS directly. In dev it always goes direct. `request` is injectable for unit tests.
- `src/analytics.js`: `track()` forwards to `window.plausible`/`window.gtag` if present, otherwise no-ops. No provider is bundled.
- `scripts/`: `make-webp.mjs` (crop + WebP), `capture-store.mjs` (screenshots a Play listing), `check-image.mjs` (sanity-checks a capture), `generate-og.mjs` (rebuilds `public/og.png`).

## Constraints enforced by tests

The browser suite is strict; changes to markup/CSS must keep these passing:
- No horizontal overflow from 280px to 2560px in both themes; axe WCAG 2.1 AA clean in both themes and with a dialog open.
- No em dash (`—`) anywhere in rendered page text.
- `prefers-reduced-motion: reduce` must leave `html` `scroll-behavior` at `auto`.
- Many selectors and accessible names are asserted directly (`.project`, `.project-image img`, `.hero-reel-image`, `.about-portrait`, `.sticky-cta`, `.wa-pill`, `.success-next`, `.faq-item`, "Send message", "Switch to light mode", "Read the X case study", "View on Google Play/App Store", etc.). Project images must keep `filter: none`.

## Placeholders to replace before launch

The `axelasa.netlify.app` domain in `index.html`, `public/robots.txt`, `public/sitemap.xml`.
