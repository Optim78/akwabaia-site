// =====================================================================
//  CONFIGURATION CENTRALE – AkwabaIA « Site vitrine »
//  Modifiez ici les textes, le prix, le numéro, les couleurs et les timings.
// =====================================================================
import timestamps from '../public/voiceover-timestamps.json';

export type Word = { word: string; start: number; end: number };
export const WORDS: Word[] = (timestamps as { words: Word[] }).words;
export const VOICE_DURATION: number = (timestamps as { duration: number }).duration;

// ---------- Format ----------
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const END_PADDING = 2; // secondes ajoutées après la voix off
export const TOTAL_SECONDS = VOICE_DURATION + END_PADDING;
export const DURATION_IN_FRAMES = Math.ceil(TOTAL_SECONDS * FPS);
export const SAFE = 250; // rien d'important dans les 250 px du haut et du bas

// ---------- Marque ----------
export const COLORS = {
  night: '#0B1D3A',
  nightDeep: '#06122A',
  nightLight: '#16305C',
  orange: '#F28C28',
  orangeLight: '#FFB35C',
  white: '#FFFFFF',
  muted: '#A9B8D4',
  green: '#25D366',
  greenDark: '#128C4B',
  red: '#E5484D',
};

export const FONTS = {
  title: 'Montserrat',
  text: 'Poppins',
};

export const BRAND = {
  name: 'AkwabaIA',
  tagline: 'Le Bon IT',
  founder: 'Alassane COULIBALY',
  founderRole: 'Fondateur AkwabaIA',
  whatsapp: '+225 07 78 62 74 60',
  whatsappGroups: ['+225', '07', '78', '62', '74', '60'],
  site: 'akwabaia.com',
  price: 100000,
  priceLabel: '100 000 FCFA',
  currency: 'FCFA',
  searchQuery: 'Konan Construction',
};

export const OFFER_CARDS = [
  { title: 'Site vitrine pro', sub: 'Design moderne, adapté au mobile' },
  { title: 'Nom de domaine .com', sub: 'votre-entreprise.com' },
  { title: '2 adresses e-mail pro', sub: 'contact@votre-entreprise.com' },
];

export const TRADES = [
  { label: 'Bâtiment', icon: 'helmet', cue: 'Bâtiment,' },
  { label: 'Formation', icon: 'board', cue: 'formation,' },
  { label: 'Peinture', icon: 'roller', cue: 'peinture,' },
  { label: 'Mécanique', icon: 'wrench', cue: 'mécanique,' },
  { label: 'Menuiserie', icon: 'saw', cue: 'menuiserie,' },
  { label: 'Commerce', icon: 'shop', cue: 'commerce...' },
] as const;

export const CHECKMARKS = [
  { text: 'Votre entreprise présentée', cue: ['vitrine,', 2] as [string, number] },
  { text: 'Vos réalisations en photos et vidéos', cue: ['photos', 1] as [string, number] },
  { text: 'Contact WhatsApp en un clic', cue: ['WhatsApp.', 1] as [string, number] },
];

// ---------- Recherche de mots dans la voix off ----------
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9'-]/g, '');

/** Index du n-ième mot correspondant (comparaison sans accents ni ponctuation). */
export const wordIndex = (text: string, nth = 1): number => {
  const target = norm(text);
  let count = 0;
  for (let i = 0; i < WORDS.length; i++) {
    if (norm(WORDS[i].word) === target && ++count === nth) return i;
  }
  throw new Error(`Mot introuvable dans la voix off : "${text}" (#${nth})`);
};

/** Décalage global des apparitions visuelles (en s). Négatif = un peu en avance. */
export const CUE_OFFSET = -0.06;

/** Instant (s) où le mot est prononcé. */
export const cue = (text: string, nth = 1): number => WORDS[wordIndex(text, nth)].start + CUE_OFFSET;
export const cueEnd = (text: string, nth = 1): number => WORDS[wordIndex(text, nth)].end;

// ---------- Découpage des scènes (début de chaque scène = premier mot) ----------
export const TRANSITION_FRAMES = 12;
const LEAD = 0.25; // la scène démarre un peu avant la phrase

export const SCENES = [
  { id: 'hook', start: 0 },
  { id: 'reveal', start: cue('Un') - LEAD },
  { id: 'search', start: cue('Quand') - LEAD },
  { id: 'problem', start: cue('Et') - LEAD },
  { id: 'trades', start: cue('Bâtiment,') - LEAD },
  { id: 'demo', start: cue('Avec') - LEAD },
  { id: 'offer', start: cue('Chez') - LEAD },
  { id: 'cta', start: cue('Moi,') - LEAD },
] as const;

// ---------- Éléments permanents ----------
// Bandeau WhatsApp : ~25 %, ~55 %, puis en continu dans la scène finale
export const WHATSAPP_BANNER_WINDOWS: [number, number][] = [
  [TOTAL_SECONDS * 0.25 - 1.6, TOTAL_SECONDS * 0.25 + 2.2],
  [TOTAL_SECONDS * 0.55 - 1.6, TOTAL_SECONDS * 0.55 + 2.2],
  [cue('Écrivez-moi'), TOTAL_SECONDS + 1],
];
export const WATERMARK_OPACITY = 0.85;

// ---------- Sous-titres ----------
export const SUBTITLE_MAX_WORDS = 5;
// Remplacements d'affichage (lisible sans le son). '' = mot fusionné avec le précédent.
export const SUBTITLE_REPLACE: Record<number, string> = (() => {
  const r: Record<number, string> = {};
  const set = (text: string, display: string, nth = 1) => (r[wordIndex(text, nth)] = display);
  set('cent', '100');
  set('mille', '000');
  set('francs', 'FCFA.');
  set('CFA.', '');
  set('deux', '2', 1);
  set('zéro', '07');
  set('sept,', '');
  set('soixante-dix-huit,', '78');
  set('soixante-deux,', '62');
  set('soixante-quatorze,', '74');
  set('soixante.', '60.');
  return r;
})();

// ---------- Audio ----------
export const MUSIC_VOLUME = 0.12; // volume de base
export const MUSIC_DUCKED_VOLUME = 0.055; // pendant la voix
export const MUSIC_FADE_IN = 1.2;
export const MUSIC_FADE_OUT = 2.5;
export const SFX_VOLUME = 0.35;
