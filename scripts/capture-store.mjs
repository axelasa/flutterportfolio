// Captures a Google Play listing as a project image so new case-study cards
// match the existing assets (2879 x 1422, original colors preserved).
//
// Usage:
//   node scripts/capture-store.mjs com.capitalfm.capitalfm capital_fm
//   node scripts/capture-store.mjs com.craftmyskin.craftmyskin craftmyskin

import { existsSync } from 'node:fs';
import { chromium } from '@playwright/test';

const [appId, name] = process.argv.slice(2);
if (!appId || !name) {
  console.error('Usage: node scripts/capture-store.mjs <appId> <outputName>');
  process.exit(1);
}

const localChrome =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await chromium.launch(
  existsSync(localChrome) ? { executablePath: localChrome } : {},
);
const page = await browser.newPage({
  viewport: { width: 1440, height: 712 },
  deviceScaleFactor: 2,
  locale: 'en-US',
});
await page.goto(
  `https://play.google.com/store/apps/details?id=${appId}&hl=en&gl=US`,
  { waitUntil: 'networkidle' },
);
await page.evaluate(() => {
  // Hide consent/sign-in overlays that can cover the listing header.
  document
    .querySelectorAll('[role="dialog"], [aria-modal="true"], iframe')
    .forEach((node) => node.remove());
  document.documentElement.scrollTop = 0;
});
await page.waitForTimeout(1200);
await page.screenshot({
  path: `assets/projects/${name}.png`,
  clip: { x: 0, y: 0, width: 1440, height: 712 },
});
await browser.close();
console.log(`Wrote assets/projects/${name}.png`);
