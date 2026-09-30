// Rend des images fixes (secondes passées en argument) dans out/stills/ pour vérification.
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const times = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const browserExecutable = process.env.REMOTION_BROWSER || null;
const chromeMode = process.env.REMOTION_BROWSER ? 'chrome-for-testing' : 'headless-shell';
const composition = await selectComposition({ serveUrl, id: 'AkwabaIA', browserExecutable, chromeMode });
fs.mkdirSync('out/stills', { recursive: true });
for (const s of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * 30));
  const output = `out/stills/t${s.toFixed(2).padStart(5, '0')}.jpg`;
  await renderStill({ serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5, browserExecutable, chromeMode });
  console.log(output);
}
