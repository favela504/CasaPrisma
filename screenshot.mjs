import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const outDir = './temporary screenshots';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Find next available index
let i = 1;
while (fs.existsSync(path.join(outDir, `screenshot-${i}${label ? '-' + label : ''}.png`))) i++;
const filename = `screenshot-${i}${label ? '-' + label : ''}.png`;
const outPath = path.join(outDir, filename);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));

// Force all reveals visible immediately
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('visible');
    el.style.transition = 'none';
  });
});
await new Promise(r => setTimeout(r, 600)); // let other animations settle

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outPath}`);
