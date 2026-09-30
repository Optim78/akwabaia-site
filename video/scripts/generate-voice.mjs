// Génère public/voiceover.mp3 + public/voiceover-timestamps.json via ElevenLabs (with-timestamps).
// Usage : node scripts/generate-voice.mjs [VOICE_ID]
// La clé est lue dans .env (ELEVENLABS_API_KEY) ou dans l'environnement — jamais dans le code.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
if (fs.existsSync(path.join(root, '.env'))) {
  for (const line of fs.readFileSync(path.join(root, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const VOICE_ID = process.argv[2] || process.env.ELEVENLABS_VOICE_ID || 'aQROLel5sQbj1vuIVi6B'; // Nicolas Petit
const text = fs.readFileSync(path.join(root, 'scripts/voiceover-text.txt'), 'utf8').trim();

const headers = { 'Content-Type': 'application/json' };
if (process.env.ELEVENLABS_API_KEY) headers['xi-api-key'] = process.env.ELEVENLABS_API_KEY;

const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`,
  {
    method: 'POST',
    headers,
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    }),
  },
);
if (!res.ok) {
  console.error('Erreur ElevenLabs', res.status, await res.text());
  process.exit(1);
}
const data = await res.json();
fs.writeFileSync(path.join(root, 'public/voiceover.mp3'), Buffer.from(data.audio_base64, 'base64'));

// Regroupe les caractères en mots : [{word, start, end}]
const a = data.alignment;
const words = [];
let cur = null;
for (let i = 0; i < a.characters.length; i++) {
  const c = a.characters[i];
  if (/\s/.test(c)) {
    if (cur) words.push(cur);
    cur = null;
    continue;
  }
  if (!cur) cur = { word: '', start: a.character_start_times_seconds[i], end: 0 };
  cur.word += c;
  cur.end = a.character_end_times_seconds[i];
}
if (cur) words.push(cur);

fs.writeFileSync(
  path.join(root, 'public/voiceover-timestamps.json'),
  JSON.stringify({ voiceId: VOICE_ID, duration: a.character_end_times_seconds.at(-1), words, alignment: a }, null, 1),
);
console.log(`OK : ${words.length} mots, ${a.character_end_times_seconds.at(-1).toFixed(2)} s`);
