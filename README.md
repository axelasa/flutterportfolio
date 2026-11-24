# Axel Asa portfolio

A responsive React portfolio built with Vite, designed to turn visitors into
project inquiries. Dark mode is the default, with a persistent light-mode
toggle. The interface uses one locally bundled font, DM Sans, and a warm
palette, with project imagery shown in its original colors.

## Replace these before going live

All placeholder values are marked with comments in the source:

| Value | Where | Notes |
| --- | --- | --- |
| Production domain | `index.html`, `public/robots.txt`, `public/sitemap.xml` | Replace `axelasa.netlify.app` everywhere |
| Store proof numbers | `src/data.js` → `stats` and each project’s `store` | Currently: 4 apps, 55K+ downloads, 4.5 average rating (LCT Africa 50K+ / 4.2, My1Health 5K+, CraftMySkin 10+ / 4.8) |
| Share card | `public/og.png` | Regenerate with `node scripts/generate-og.mjs` after copy changes |

The work section is driven entirely by the `projects` array in `src/data.js`:
filters, counts, and the hero “01 / 0N” counter all derive from it, so adding
or removing a project needs no other edits. The four Dafric apps now live in
`archivedProjects` (same file) after their Play listings were retired; move any
entry back into `projects` to restore it.

CraftMySkin and LCT Africa also include an `appStore` URL. Project cards and
case study buttons select the App Store for iPhone/iPad visitors, including
iPad desktop browsing mode, and Google Play for Android and desktop visitors.
Apps without an App Store URL keep their existing Google Play destination.

New project images are captured from the Play listing, then the screenshot
strip and the app icon are cropped out as WebP (the page only loads the WebP
files):

```sh
node scripts/capture-store.mjs com.example.app output_name
node scripts/check-image.mjs assets/projects/output_name.png
node scripts/make-webp.mjs assets/projects/output_name.png assets/projects/output_name.webp 144 943 1640 473 1400
node scripts/make-webp.mjs assets/projects/output_name.png assets/projects/output_name-960.webp 144 943 1640 473 960
node scripts/make-webp.mjs assets/projects/output_name.png assets/projects/output_name-icon.webp 2256 224 480 480 160
```

Crop boxes are `x y width height` in the source PNG; check the capture and
adjust them, since the Play layout shifts with the length of the listing.

The second command prints brightness and colour variance, a quick check that a
capture is real content and not a blank page or an overlay.

## What the site does to win projects

- **Low-friction inquiry form**: tap-to-select chips for project type, budget,
  and timeline; only name, email, and message are typed. Replies promised
  within 24 hours.
- **Parallel lead channels**: WhatsApp chat, the published Cal.com booking page, and
  a direct email link in the contact section, the mobile sticky bar, the
  desktop WhatsApp pill, and the post-submit success state.
- **Case study dialogs** on every project: challenge, approach, outcome, tech
  stack, and store proof, each ending in a CTA that pre-selects the project
  type in the form. Deep-linkable via `#case-dafric-cargo` style hashes.
- **Trust building**: a stats bar with app-store proof, a 4-step process
  section, and a FAQ accordion mirrored in `FAQPage` structured data.
- **Funnel tracking** (`src/analytics.js`): `contact_form_started`,
  `contact_form_submitted`, `whatsapp_click`, `cal_click`, `email_click`,
  `case_study_open`, `case_study_cta`, `store_link_click`, and more.

### Activating analytics

No provider is bundled. Add one script to `index.html` and the events above
flow automatically:

```html
<!-- Plausible -->
<script defer data-domain="your-domain.com" src="https://plausible.io/js/script.js"></script>
```

GA4 also works: `track()` calls `window.gtag` when it is present.

## Development

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

## Build and deploy

```sh
npm run build
npm run preview
```

Deploy `dist/` to Netlify. If you use Netlify Functions, the contact form is
routed through `netlify/functions/contact.mjs` in production builds, which
keeps the EmailJS key server-side and rate limits submissions. The site falls
back to calling EmailJS directly whenever the function is missing or errors,
so nothing breaks during setup.

Optional Netlify environment variables:

| Variable | Purpose |
| --- | --- |
| `EMAILJS_SERVICE_ID` | EmailJS service id (default matches current site) |
| `EMAILJS_TEMPLATE_ID` | EmailJS template id (default matches current site) |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key, kept server-side |
| `CONTACT_ALLOWED_ORIGINS` | Comma-separated allowlist, e.g. `https://axelasa.netlify.app` |

Set the same origin in the EmailJS dashboard (Account → Security) before
sharing the deployed domain.

## Analytics events

Funnel events are named for direct reporting: `contact_form_started`,
`contact_form_submitted`, `contact_form_failed`, `whatsapp_click`, `cal_click`,
`email_click`, `store_link_click`, `case_study_open`, `case_study_cta`,
`hero_cta_click`, `linkedin_click`.

## Checks

```sh
npm test
npx playwright install chromium
npm run test:e2e
```

Unit tests cover the contact pipeline including the Netlify Function fallback.
Browser tests cover both themes, persistence, widths from 280 to 2560 pixels,
images, filtering, case study dialogs (open, escape, deep link, focus), FAQ,
lead channels, the sticky CTA, reduced motion, and form validation, success,
and failure. Accessibility is verified with axe in both themes and with the
case study dialog open. Email requests are intercepted in tests; no real
messages are sent. Verify live delivery from the deployed domain before
sharing.
