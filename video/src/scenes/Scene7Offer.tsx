import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { COLORS, OFFER_CARDS, cue } from '../config';
import { lerp, sp, useTime } from '../lib';
import { Camera } from '../components/Camera';
import { PriceCounter } from '../components/PriceCounter';
import { Confetti } from '../components/Confetti';
import { CheckIcon } from '../components/Icons';
import { glass, text } from '../styles';

const CODE = [
  '<header class="pro">',
  'vitrine.render()',
  '<section id="realisations">',
  'whatsapp.contact()',
  'domaine: ".com"',
  '@media (mobile)',
];

/** Scène 7 – OFFRE */
export const Scene7Offer: React.FC = () => {
  const t = useTime();
  const cChez = cue('Chez');
  const cCard = [cue('site', 4), cue('nom', 2), cue('deux')];
  const cSeul = cue('seulement');
  const cCfa = cue('CFA.');

  const bg = lerp(t, [cChez - 0.4, cChez], [0, 1]);
  const frame = sp(t, cChez + 0.1, { damping: 15, stiffness: 120 });
  const shrink = sp(t, cCard[0] - 0.35, { damping: 18, stiffness: 110 });
  const frameScale = 1 - 0.46 * shrink;
  const floatOpacity = 1 - 0.55 * shrink;
  const tag = sp(t, cSeul + 1.4);

  return (
    <AbsoluteFill>
      {/* photo plein écran floutée (Ken Burns) */}
      <AbsoluteFill style={{ opacity: bg * 0.55 }}>
        <Img
          src={staticFile('alassane-pc.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(26px) brightness(0.55) saturate(1.2)', transform: `scale(${1.25 + (t - cChez) * 0.02})` }}
        />
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(11,29,58,0.55), rgba(11,29,58,0.85))' }} />
      </AbsoluteFill>

      <Camera from={cChez - 0.3} to={cCfa + 1} zoom={[1.0, 1.05]}>
        {/* photo nette dans un cadre + code / aperçus flottants */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 310,
            top: 370,
            width: 620,
            height: 826,
            transform: `scale(${frameScale * (0.7 + 0.3 * frame)})`,
            transformOrigin: 'center top',
            opacity: frame,
          }}
        >
          {CODE.map((c, i) => {
            const side = i % 2 ? 1 : -1;
            const y = 60 + i * 130 + Math.sin(t * 1.3 + i) * 14;
            const x = side > 0 ? 470 + Math.cos(t + i) * 12 : -170 + Math.cos(t + i) * 12;
            const s = sp(t, cChez + 0.3 + i * 0.12);
            return (
              <div
                key={c}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  padding: '10px 18px',
                  borderRadius: 14,
                  background: 'rgba(6,18,42,0.85)',
                  border: `1px solid ${i % 3 === 0 ? COLORS.orange : 'rgba(255,255,255,0.2)'}`,
                  fontFamily: 'monospace',
                  fontSize: 24,
                  color: i % 3 === 0 ? COLORS.orangeLight : i % 3 === 1 ? '#9CE5B7' : '#9CC3FF',
                  opacity: s * floatOpacity,
                  transform: `scale(${s})`,
                  zIndex: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                {c}
              </div>
            );
          })}
          {/* aperçus de sites */}
          {['site/desktop.png', 'realisations/akwabagest-1.webp'].map((src, i) => {
            const s = sp(t, cChez + 0.5 + i * 0.25);
            return (
              <Img
                key={src}
                src={staticFile(src)}
                style={{
                  position: 'absolute',
                  width: 300,
                  height: 188,
                  objectFit: 'cover',
                  objectPosition: 'top',
                  left: i ? 420 : -120,
                  top: i ? 640 + Math.sin(t * 1.1) * 12 : -40 + Math.cos(t * 1.2) * 12,
                  borderRadius: 14,
                  border: '3px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  opacity: s * floatOpacity,
                  transform: `rotate(${i ? 6 : -7}deg) scale(${s})`,
                  zIndex: 3,
                }}
              />
            );
          })}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 40, overflow: 'hidden', border: '6px solid rgba(255,255,255,0.9)', boxShadow: '0 40px 90px rgba(0,0,0,0.6)' }}>
            <Img src={staticFile('alassane-pc.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.05 + (t - cChez) * 0.012}) translateX(${(t - cChez) * -3}px)` }} />
          </div>
        </div>

        {/* cartes de l'offre en cascade */}
        <div style={{ position: 'absolute', left: 90, right: 90, top: 815, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {OFFER_CARDS.map((c, i) => {
            const s = sp(t, cCard[i], { damping: 13, stiffness: 170 });
            return (
              <div
                key={c.title}
                style={{
                  ...glass,
                  borderRadius: 24,
                  background: 'linear-gradient(135deg, rgba(11,29,58,0.92), rgba(22,48,92,0.92))',
                  border: `2px solid ${COLORS.orange}`,
                  padding: '10px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  opacity: s,
                  transform: `translateX(${(1 - s) * 700}px) rotate(${(1 - s) * 8}deg)`,
                }}
              >
                <CheckIcon size={52} color={COLORS.orange} />
                <div>
                  <div style={text(36, '#fff', 700)}>{c.title}</div>
                  <div style={text(22, COLORS.muted, 500)}>{c.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* prix */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1128, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {t > cSeul - 0.1 && <PriceCounter from={cSeul} to={cCfa} size={124} />}
        </div>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 1272,
            padding: '8px 20px',
            borderRadius: 999,
            background: COLORS.white,
            ...text(24, COLORS.night, 700),
            transform: `translateX(-50%) scale(${tag}) rotate(-2deg)`,
            boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
          }}
        >
          ⚡ Livraison rapide
        </div>
        <Confetti at={cCfa} x={540} y={1200} />
      </Camera>
    </AbsoluteFill>
  );
};
