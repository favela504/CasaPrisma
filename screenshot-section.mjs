import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const selector = process.argv[3] || 'body';
const label = process.argv[4] || 'section';
const outDir = './temporary screenshots';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let i = 1;
while (fs.existsSync(path.join(outDir, `section-${i}-${label}.png`))) i++;
const outPath = path.join(outDir, `section-${i}-${label}.png`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('visible');
    el.style.transition = 'none';
  });
});
await new Promise(r => setTimeout(r, 600));

const el = await page.$(selector);
if (el) {
  await el.screenshot({ path: outPath });
} else {
  console.error('Selector not found:', selector);
}
await browser.close();
console.log(`Saved: ${outPath}`);
