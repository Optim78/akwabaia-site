// Rendu image par image de scenes.html -> build/video-muette.mp4 (1080x1920, 30 i/s).
// Usage : node render.mjs [--from=s --to=s]   puis   bash mix.sh
import { createRequire } from 'module';
import { spawn } from 'child_process';
import path from 'path';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }

const dir = path.dirname(new URL(import.meta.url).pathname);
const arg = k => (process.argv.find(a => a.startsWith(`--${k}=`)) || '').split('=')[1];
const FPS = 30, from = +(arg('from') || 0), to = +(arg('to') || 50);
const out = path.join(dir, 'build', 'video-muette.mp4');

const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file://' + path.join(dir, 'scenes.html') + '?render=1');
await page.evaluate(() => window.ready);

const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let i = Math.round(from * FPS); i < Math.round(to * FPS); i++) {
  await page.evaluate(t => window.render(t), i / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 150 === 0) console.log(`image ${i}`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('ok', out);
