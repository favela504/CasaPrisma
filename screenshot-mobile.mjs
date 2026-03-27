import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const outDir = './temporary screenshots';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let i = 1;
while (fs.existsSync(path.join(outDir, `mobile-${i}.png`))) i++;
const outPath = path.join(outDir, `mobile-${i}.png`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('visible');
    el.style.transition = 'none';
  });
});
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();
console.log(`Mobile screenshot: ${outPath}`);
