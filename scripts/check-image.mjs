// Quick sanity check that captured store images are real content, not blank
// or overlay-covered. Prints brightness and color variance per image.
// Usage: node scripts/check-image.mjs assets/projects/*.png

import { existsSync, readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const files = process.argv.slice(2);
const localChrome =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch(
  existsSync(localChrome) ? { executablePath: localChrome } : {},
);
const page = await browser.newPage();

for (const file of files) {
  const dataUrl = `data:image/png;base64,${readFileSync(file).toString('base64')}`;
  const stats = await page.evaluate(async (src) => {
    const image = new Image();
    await new Promise((ok, fail) => {
      image.onload = ok;
      image.onerror = fail;
      image.src = src;
    });
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 120;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, 240, 120);
    const { data } = context.getImageData(0, 0, 240, 120);
    let sum = 0;
    let sumSq = 0;
    const colors = new Set();
    const count = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      sum += lum;
      sumSq += lum * lum;
      colors.add(`${data[i] >> 4}-${data[i + 1] >> 4}-${data[i + 2] >> 4}`);
    }
    const mean = sum / count;
    return {
      size: `${image.naturalWidth}x${image.naturalHeight}`,
      mean: Math.round(mean),
      stdDev: Math.round(Math.sqrt(sumSq / count - mean * mean)),
      distinctColors: colors.size,
    };
  }, dataUrl);
  console.log(file, JSON.stringify(stats));
}
await browser.close();
