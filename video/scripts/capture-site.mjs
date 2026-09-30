// Captures de https://akwabaia.com (mobile pleine page + desktop) dans public/site/
import { chromium } from 'playwright';
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined,
});
const shots = [
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, fullPage: true },
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, fullPage: false },
];
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: s.deviceScaleFactor, isMobile: s.isMobile });
  const page = await ctx.newPage();
  await page.goto(process.env.SITE_URL || 'https://akwabaia.com', { waitUntil: 'load', timeout: 60000 });
  // Déclenche le lazy-loading
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `public/site/${s.name}.png`, fullPage: s.fullPage });
  console.log('OK', s.name);
  await ctx.close();
}
await browser.close();
