import { chromium } from 'playwright';
import fs from 'node:fs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [src, dst, w, h] of [['public/logo-icon.svg','public/logo.png',512,512],['public/logo-horizontal.svg','public/logo-horizontal.png',1082,250]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const svg = fs.readFileSync(src, 'utf8');
  await p.setContent(`<html><body style="margin:0;background:transparent"><img style="width:${w}px;height:${h}px" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"></body></html>`);
  await p.waitForTimeout(300);
  await p.screenshot({ path: dst, omitBackground: true });
}
await b.close();
