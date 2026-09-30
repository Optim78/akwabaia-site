import React, { useMemo } from 'react';
import { COLORS, SAFE, SUBTITLE_MAX_WORDS, SUBTITLE_REPLACE, VOICE_DURATION, WORDS } from '../config';
import { lerp, sp, useTime } from '../lib';

type Chunk = { words: { idx: number; text: string; start: number; end: number }[]; start: number; end: number };

const buildChunks = (): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Chunk['words'] = [];
  WORDS.forEach((w, idx) => {
    const display = SUBTITLE_REPLACE[idx] ?? w.word;
    if (display === '' && cur.length) {
      // fusion avec le mot précédent (ex. « cent mille francs CFA » → « 100 000 FCFA »)
      cur[cur.length - 1].end = w.end;
    } else if (display !== '') {
      cur.push({ idx, text: display === '?' ? '?' : display, start: w.start, end: w.end });
    }
    const endsSentence = /[.?!…]$/.test(w.word);
    const endsClause = /[,;:]$/.test(w.word);
    if (endsSentence || (endsClause && cur.length >= 2) || cur.length >= SUBTITLE_MAX_WORDS || idx === WORDS.length - 1) {
      if (cur.length) chunks.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
      cur = [];
    }
  });
  // un mot isolé (« ? ») est rattaché au bloc précédent
  return chunks;
};

/** Sous-titres karaoké mot par mot : mot actif en orange, légèrement agrandi. */
export const AnimatedSubtitle: React.FC = () => {
  const t = useTime();
  const chunks = useMemo(buildChunks, []);
  let ci = -1;
  for (let i = 0; i < chunks.length; i++) if (t >= chunks[i].start - 0.12) ci = i;
  if (ci < 0 || t > VOICE_DURATION + 0.4) return null;
  const chunk = chunks[ci];
  const next = chunks[ci + 1];
  const hideAt = next ? next.start - 0.12 : VOICE_DURATION + 0.4;
  const enter = sp(t, chunk.start - 0.12, { damping: 16, stiffness: 220 });
  const gap = hideAt - chunk.end;
  const exit = gap > 0.6 ? lerp(t, [chunk.end + 0.35, chunk.end + 0.55], [1, 0]) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        bottom: SAFE + 200,
        minHeight: 150,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        opacity: enter * exit,
        transform: `translateY(${(1 - enter) * 30}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '6px 24px',
          padding: '18px 30px',
          borderRadius: 26,
          background: 'rgba(6,18,42,0.72)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {chunk.words.map((w) => {
          const active = t >= w.start - 0.03 && t < w.end + 0.05;
          const done = t >= w.end + 0.05;
          const pop = active ? sp(t, w.start - 0.03, { damping: 12, stiffness: 300 }) : 0;
          return (
            <span
              key={w.idx}
              style={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: 54,
                lineHeight: 1.18,
                color: active ? COLORS.orange : done ? COLORS.white : 'rgba(255,255,255,0.55)',
                transform: `scale(${1 + 0.1 * pop})`,
                display: 'inline-block',
                textShadow: active ? '0 0 24px rgba(242,140,40,0.55)' : '0 3px 10px rgba(0,0,0,0.5)',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
