// Generates public/og.png (1200x630) for social and search previews.
// Run with: node scripts/generate-og.mjs
// Uses installed Google Chrome when available, otherwise Playwright Chromium.

import { existsSync } from 'node:fs';
import { chromium } from '@playwright/test';

const localChrome =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #171715; color: #f0eee8;
    font-family: 'DM Sans', sans-serif;
    padding: 64px 72px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .top { display: flex; justify-content: space-between; align-items: center; }
  .wordmark { font-size: 40px; font-weight: 700; letter-spacing: -2.4px; }
  .wordmark span { color: #a8a69e; }
  .badge {
    display: flex; align-items: center; gap: 12px;
    font-size: 15px; letter-spacing: 2px; color: #a8a69e; font-weight: 500;
  }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: #dedbd0; }
  h1 {
    font-size: 84px; font-weight: 500; letter-spacing: -4px; line-height: 1.06;
    max-width: 820px;
  }
  h1 em { font-style: normal; font-weight: 300; color: #a8a69e; }
  .bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; }
  .stats { display: flex; gap: 54px; }
  .stat strong { display: block; font-size: 40px; font-weight: 500; letter-spacing: -1.5px; }
  .stat span { display: block; font-size: 14px; color: #a8a69e; margin-top: 6px; max-width: 150px; line-height: 1.5; }
  .stack { font-size: 13px; letter-spacing: 2.4px; color: #a8a69e; text-align: right; line-height: 2; }
</style>
</head>
<body>
  <div class="top">
    <div class="wordmark">axel asa<span>.</span></div>
    <div class="badge"><span class="dot"></span> AVAILABLE FOR NEW PROJECTS</div>
  </div>
  <h1>Thoughtful code.<br />Useful <em>products.</em></h1>
  <div class="bottom">
    <div class="stats">
      <div class="stat"><strong>04</strong><span>Apps published on Google Play</span></div>
      <div class="stat"><strong>55K+</strong><span>Downloads across live apps</span></div>
      <div class="stat"><strong>4.5</strong><span>Average rating across rated apps</span></div>
    </div>
    <div class="stack">MOBILE / WEB / BACKEND<br />FLUTTER · KOTLIN · SWIFT</div>
  </div>
</body>
</html>`;

const browser = await chromium.launch(
  existsSync(localChrome) ? { executablePath: localChrome } : {},
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('Wrote public/og.png');
