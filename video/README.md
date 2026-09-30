# Vidéo publicitaire AkwabaIA – Site vitrine (Remotion)

Vidéo verticale 1080×1920, 30 fps, H.264 — WhatsApp Status, TikTok, Reels, Facebook.
Rendu final : `out/akwabaia-site-vitrine.mp4` (durée = voix off + 2 s).

## Installation

```bash
cd video
npm install
cp .env.example .env   # puis collez votre clé ElevenLabs dans .env (jamais dans le code)
```

## Commandes

| Action | Commande |
|---|---|
| Prévisualiser | `npm run studio` |
| Rendre la vidéo | `npm run render` |
| Regénérer la voix off | `npm run voice` |
| Recapturer le site | `npm run captures` |

> Si Remotion ne peut pas télécharger son navigateur, ajoutez
> `--browser-executable=/chemin/vers/chrome --chrome-mode=chrome-for-testing` au rendu.

## Changer la voix

1. Texte : `scripts/voiceover-text.txt`.
2. Voix : `node scripts/generate-voice.mjs <VOICE_ID>` (par défaut : Nicolas Petit `aQROLel5sQbj1vuIVi6B`),
   ou `ELEVENLABS_VOICE_ID=...` dans `.env`.
3. Le script écrit `public/voiceover.mp3` et `public/voiceover-timestamps.json`.
   Les scènes, sous-titres et apparitions se recalent automatiquement (elles cherchent les mots dans les timestamps).
   Si vous changez le texte, vérifiez les mots utilisés par `cue('...')` dans `src/config.ts` et `src/scenes/`.

Réglages : `eleven_multilingual_v2`, stability 0.45, similarity_boost 0.8, style 0.3, speaker boost.

## Changer la photo

Remplacez dans `public/` (mêmes noms) :
- `alassane.png` — photo principale détourée (scène finale)
- `alassane-avatar.jpg` — pastille du filigrane (carré, visage centré)
- `alassane-casquette.png` — scène 1 (détourée)
- `alassane-pc.jpg` — scène 7

Détourage : `pip install "rembg[cpu]"` puis
`python -c "from rembg import remove; from PIL import Image; remove(Image.open('photo.jpg')).save('public/alassane.png')"`.

## Changer le prix, le numéro, les textes

Tout est dans `src/config.ts` : `BRAND` (prix, numéro, site), `OFFER_CARDS`, `TRADES`, `CHECKMARKS`,
couleurs (`COLORS`), fenêtres du bandeau WhatsApp, volumes audio, remplacements des sous-titres
(`SUBTITLE_REPLACE`, ex. « cent mille francs CFA » → « 100 000 FCFA »).
Si vous changez le prix, pensez aussi au texte de la voix off.

## Structure

```
src/config.ts         textes, prix, numéro, couleurs, timings
src/Video.tsx         assemblage : scènes, transitions, audio (ducking), SFX
src/scenes/           Scene1Hook … Scene8CTA (une scène par phrase)
src/components/       PhoneMockup, AnimatedSubtitle, WhatsAppBanner, Watermark, PriceCounter, Particles…
public/               voix, musique, sfx, photos, logo, captures du site, polices locales
scripts/              génération voix, captures Playwright
samples/              échantillons de voix testés
```

## Sources audio

- Voix off, musique et effets sonores générés avec ElevenLabs (TTS, Music, Sound Effects) sur votre compte.
- Musique : volume 12 %, baisse automatique pendant la voix, fondu d'entrée et de sortie.
