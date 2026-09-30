import React from 'react';
import { AbsoluteFill, Img, random, staticFile } from 'remotion';
import { COLORS, cue } from '../config';
import { lerp, sp, useTime } from '../lib';
import { Camera } from '../components/Camera';
import { CoinIcon, PersonIcon } from '../components/Icons';
import { title } from '../styles';

const FALLING = [
  { kind: 'person', x: 90, y: 860 },
  { kind: 'coin', x: 250, y: 960 },
  { kind: 'person', x: 410, y: 870 },
  { kind: 'coin', x: 140, y: 1090 },
  { kind: 'person', x: 320, y: 1110 },
];

/** Scène 1 – ACCROCHE */
export const Scene1Hook: React.FC = () => {
  const t = useTime();
  const cSite = cue('site');
  const cInternet = cue('internet,');
  const cTrouver = cue('trouver');
  const cClients = cue('clients');
  const cQ = cue('?');
  const cUniq = cue('uniquement');
  const cNo = cue('Détrompez-vous.');

  const lines = [
    { txt: 'Un site', at: cSite, color: COLORS.white },
    { txt: 'internet', at: cInternet, color: COLORS.white },
    { txt: '= des', at: cTrouver, color: COLORS.muted },
    { txt: 'clients', at: cClients, color: COLORS.orange },
  ];
  const titleOut = lerp(t, [cNo - 0.05, cNo + 0.15], [1, 0]);

  // Photo : entre par la droite, sort sur « Détrompez-vous »
  const pIn = sp(t, -0.15, { damping: 16, stiffness: 90 });
  const pOut = lerp(t, [cNo, cNo + 0.45], [0, 1]);
  const photoX = (1 - pIn) * 700 + pOut * 900;

  // Glitch
  const g = sp(t, cNo, { damping: 10, stiffness: 260 });
  const glitchActive = t > cNo && t < cNo + 0.5;
  const jitter = glitchActive ? (random(`g${Math.floor(t * 30)}`) - 0.5) * 26 : 0;

  return (
    <AbsoluteFill>
      <Camera from={0} to={4.4} zoom={[1.02, 1.1]}>
        {/* Titre mot par mot */}
        <div style={{ position: 'absolute', left: 70, top: 380, opacity: titleOut }}>
          {lines.map((l, i) => {
            const s = sp(t, l.at, { damping: 13, stiffness: 180 });
            return (
              <div
                key={i}
                style={{
                  ...title(i === 3 ? 124 : 104, l.color),
                  opacity: s,
                  transform: `translateX(${(1 - s) * -80}px) scale(${0.85 + 0.15 * s})`,
                  transformOrigin: 'left center',
                  textShadow: i === 3 ? '0 0 40px rgba(242,140,40,0.5)' : undefined,
                }}
              >
                {l.txt}
              </div>
            );
          })}
        </div>

        {/* Pièces / clients qui tombent puis sont barrés */}
        {FALLING.map((f, i) => {
          const at = cUniq + i * 0.14;
          const fall = sp(t, at, { damping: 9, stiffness: 120 });
          const out = lerp(t, [cNo + 0.35, cNo + 0.6], [1, 0]);
          const cross = lerp(t, [cNo + i * 0.04, cNo + 0.2 + i * 0.04], [0, 1]);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: f.x,
                top: f.y - (1 - fall) * 900,
                opacity: Math.min(1, fall * 2) * out,
                transform: `rotate(${(1 - fall) * 40 - 8 + i * 5}deg)`,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 30,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {f.kind === 'coin' ? <CoinIcon size={84} /> : <PersonIcon size={80} color="#cfe0ff" />}
              </div>
              <svg width={140} height={140} viewBox="0 0 140 140" style={{ position: 'absolute', left: -10, top: -10 }}>
                <path d="M20 20L120 120" stroke={COLORS.red} strokeWidth={14} strokeLinecap="round" strokeDasharray={142} strokeDashoffset={142 * (1 - cross)} />
                <path d="M120 20L20 120" stroke={COLORS.red} strokeWidth={14} strokeLinecap="round" strokeDasharray={142} strokeDashoffset={142 * (1 - cross)} />
              </svg>
            </div>
          );
        })}

        {/* Alassane – casquette, regard vers le haut, bulles de pensée */}
        <div style={{ position: 'absolute', right: -40, top: 700, width: 580, transform: `translateX(${photoX}px)` }}>
          {[0, 1, 2].map((i) => {
            const b = sp(t, 0.5 + i * 0.35, { damping: 12, stiffness: 140 });
            const float = Math.sin(t * 2.2 + i) * 8;
            const sizes = [26, 44, 150];
            const pos = [
              { l: 250, tp: -30 },
              { l: 190, tp: -100 },
              { l: 110, tp: -210 },
            ][i];
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: pos.l,
                  top: pos.tp + float,
                  width: sizes[i],
                  height: i === 2 ? 130 : sizes[i],
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.95)',
                  transform: `scale(${b})`,
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                {i === 2 && (
                  <span
                    style={{
                      ...title(100, COLORS.orange),
                      textShadow: 'none',
                      transform: `scale(${t > cQ ? 1 + 0.18 * Math.abs(Math.sin((t - cQ) * 7)) : 1})`,
                      display: 'inline-block',
                    }}
                  >
                    ?
                  </span>
                )}
              </div>
            );
          })}
          {/* petits ? orange qui flottent */}
          {[0, 1, 2].map((i) => {
            const b = sp(t, 1.2 + i * 0.4);
            return (
              <span
                key={`q${i}`}
                style={{
                  position: 'absolute',
                  left: 290 + i * 90,
                  top: -130 - ((t * 40 + i * 50) % 120),
                  ...title(54 - i * 8, COLORS.orange),
                  opacity: b * 0.85,
                  transform: `rotate(${Math.sin(t * 2 + i) * 15}deg)`,
                }}
              >
                ?
              </span>
            );
          })}
          <div style={{ position: 'absolute', inset: '12% 0 0 0', background: 'radial-gradient(circle at 50% 35%, rgba(242,140,40,0.35), transparent 60%)', filter: 'blur(20px)' }} />
          <Img
            src={staticFile('alassane-casquette.png')}
            style={{ width: '100%', position: 'relative', transform: `scale(${1 + t * 0.02})`, transformOrigin: 'bottom center', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.45))', maskImage: 'radial-gradient(ellipse 58% 74% at 66% 36%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 58% 74% at 66% 36%, black 50%, transparent 100%)' }}
          />
        </div>
      </Camera>

      {/* DÉTROMPEZ-VOUS (glitch) */}
      {t > cNo - 0.05 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 300 }}>
          {[
            { c: '#00E5FF', dx: -1 },
            { c: '#FF2D55', dx: 1 },
            { c: COLORS.white, dx: 0 },
          ].map((layer, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                textAlign: 'center',
                ...title(136, layer.c),
                opacity: g * (layer.dx === 0 ? 1 : glitchActive ? 0.8 : 0),
                mixBlendMode: layer.dx === 0 ? 'normal' : 'screen',
                transform: `translate(${layer.dx * (glitchActive ? 10 + Math.abs(jitter) : 0) + (layer.dx === 0 ? jitter * 0.3 : 0)}px, 0) scale(${0.7 + 0.3 * g})`,
                clipPath: glitchActive && layer.dx !== 0 ? `inset(${20 + jitter}% 0 ${30 - jitter}% 0)` : undefined,
              }}
            >
              Détrompez-
              <br />
              <span style={{ color: layer.dx === 0 ? COLORS.orange : layer.c }}>vous.</span>
            </div>
          ))}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
