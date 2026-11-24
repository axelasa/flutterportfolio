// Crops the screenshot strip out of a Play listing capture and writes WebP.
// Uses the installed Chrome canvas encoder, so no image library is needed.
// Usage: node scripts/make-webp.mjs <in> <out.webp> [x y w h] [maxWidth]
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const [input, output, x, y, w, h, max = 1600] = process.argv.slice(2);
const localChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch(existsSync(localChrome) ? { executablePath: localChrome } : {});
const page = await browser.newPage();
const type = input.endsWith('.png') ? 'png' : 'jpeg';
const src = `data:image/${type};base64,${readFileSync(input).toString('base64')}`;
const data = await page.evaluate(async ({ src, crop, max }) => {
  const image = new Image();
  image.src = src;
  await image.decode();
  const [sx, sy, sw, sh] = crop.length === 4 ? crop.map(Number) : [0, 0, image.naturalWidth, image.naturalHeight];
  const scale = Math.min(1, max / sw);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(sw * scale);
  canvas.height = Math.round(sh * scale);
  canvas.getContext('2d').drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/webp', 0.82).split(',')[1];
}, { src, crop: [x, y, w, h].filter((v) => v !== undefined), max: Number(max) });
writeFileSync(output, Buffer.from(data, 'base64'));
await browser.close();
console.log(output, Math.round(Buffer.from(data, 'base64').length / 1024) + 'KB');
