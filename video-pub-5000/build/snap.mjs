// Captures fixes à des instants donnés (contrôle visuel) : node build/snap.mjs <dossier> t1 t2 ...
import { createRequire } from 'module'; import path from 'path';
const require = createRequire(import.meta.url); const pw = require('/opt/node22/lib/node_modules/playwright');
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = process.argv[2]; const times = process.argv.slice(3).map(Number);
const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => console.log('LOG', m.text()));
await p.goto('file://' + dir + '/scenes.html?render=1'); await p.evaluate(() => window.ready);
for (const t of times) { await p.evaluate(t => render(t), t); await p.screenshot({ path: `${outDir}/t${t.toFixed(2).padStart(6, '0')}.jpg`, type: 'jpeg', quality: 70 }); }
await b.close();
