import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS, cue } from '../config';
import { lerp, sp, useTime } from '../lib';
import { Camera } from '../components/Camera';
import { text, title } from '../styles';

/** Texte révélé par un masque lumineux qui balaie de gauche à droite. */
const SweepText: React.FC<{ at: number; children: React.ReactNode; style: React.CSSProperties; dur?: number }> = ({ at, children, style, dur = 0.55 }) => {
  const t = useTime();
  const p = lerp(t, [at, at + dur], [0, 1]);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ ...style, clipPath: `inset(0 ${100 - p * 100}% 0 0)` }}>{children}</div>
      {p > 0 && p < 1 && (
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            bottom: '-10%',
            left: `${p * 100}%`,
            width: 26,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(90deg, transparent, #fff, transparent)',
            boxShadow: '0 0 60px 30px rgba(255,200,120,0.7)',
            borderRadius: 20,
          }}
        />
      )}
      {/* reflet qui repasse ensuite */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          ...style,
          color: 'transparent',
          background: `linear-gradient(100deg, transparent ${((t - at - 0.8) * 60) % 200 - 30}%, rgba(255,255,255,0.8) ${((t - at - 0.8) * 60) % 200 - 20}%, transparent ${((t - at - 0.8) * 60) % 200 - 10}%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          textShadow: 'none',
          clipPath: `inset(0 ${100 - p * 100}% 0 0)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Storefront: React.FC<{ lit: number }> = ({ lit }) => {
  const glow = `rgba(255, 200, 110, ${0.15 + 0.75 * lit})`;
  return (
    <svg width={760} height={470} viewBox="0 0 760 470">
      <defs>
        <linearGradient id="win" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={lit > 0.5 ? '#FFE3B0' : '#2a3b5c'} />
          <stop offset="1" stopColor={lit > 0.5 ? '#F2A24A' : '#1a2742'} />
        </linearGradient>
      </defs>
      <ellipse cx="380" cy="455" rx={330} ry={16} fill="rgba(0,0,0,0.35)" />
      <rect x="40" y="110" width="680" height="340" rx="10" fill="#1d2f52" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
      {/* enseigne */}
      <rect x="150" y="20" width="460" height="74" rx="14" fill={lit > 0.2 ? COLORS.orange : '#36486b'} style={{ filter: lit > 0.2 ? `drop-shadow(0 0 ${30 * lit}px ${COLORS.orange})` : undefined }} />
      <text x="380" y="70" textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize="34" fill="#fff" letterSpacing="2">
        VOTRE ENTREPRISE
      </text>
      {/* store rayé */}
      {new Array(10).fill(0).map((_, i) => (
        <path key={i} d={`M${40 + i * 68} 110 h68 l-6 58 a28 28 0 0 1 -56 0z`} fill={i % 2 ? '#fff' : COLORS.orange} opacity={0.35 + 0.65 * lit} />
      ))}
      {/* vitrines */}
      <rect x="80" y="200" width="250" height="210" rx="8" fill="url(#win)" />
      <rect x="430" y="200" width="250" height="210" rx="8" fill="url(#win)" />
      <rect x="345" y="220" width="70" height="230" rx="6" fill="#0f1c34" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      {/* produits dans la vitrine */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={105 + i * 75} y={320 - i * 20} width="55" height={70 + i * 20} rx="6" fill="#fff" opacity={0.25 + 0.5 * lit} />
      ))}
      {[0, 1].map((i) => (
        <circle key={i} cx={500 + i * 110} cy={330} r={42} fill="#fff" opacity={0.25 + 0.5 * lit} />
      ))}
      <rect x="80" y="200" width="600" height="210" fill={glow} opacity={0.25} />
    </svg>
  );
};

/** Scène 2 – RÉVÉLATION */
export const Scene2Reveal: React.FC = () => {
  const t = useTime();
  const cUn = cue('Un');
  const cId = cue('identité');
  const cEn = cue('en');
  const cVotre = cue('Votre', 2);
  const cVitrine = cue('vitrine');
  const cPro = cue('professionnelle.');

  const intro = sp(t, cUn);
  const shop = sp(t, cVotre - 0.1, { damping: 15, stiffness: 110 });
  const lit = lerp(t, [cVitrine, cVitrine + 0.35], [0, 1]);
  const flicker = t > cVitrine && t < cVitrine + 0.3 ? (Math.sin(t * 90) > 0 ? 1 : 0.3) : 1;
  const proTag = sp(t, cPro);

  return (
    <AbsoluteFill>
      <Camera from={cUn - 0.3} to={cPro + 1} zoom={[1.08, 1.0]}>
        <div style={{ position: 'absolute', top: 370, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ ...text(46, COLORS.muted, 500), opacity: intro, transform: `translateY(${(1 - intro) * 30}px)` }}>Un site, c'est d'abord votre</div>
          <div style={{ marginTop: 16 }}>
            <SweepText at={cId} style={title(158)}>
              Identité
            </SweepText>
          </div>
          <div>
            <SweepText at={cEn} style={{ ...title(148, COLORS.orange), textShadow: '0 0 50px rgba(242,140,40,0.45)' }}>
              en ligne
            </SweepText>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 800,
            opacity: shop * flicker,
            transform: `translateY(${(1 - shop) * 200}px) scale(${0.8 + 0.2 * shop})`,
            filter: lit > 0 ? `drop-shadow(0 0 ${60 * lit}px rgba(242,160,70,0.55))` : undefined,
          }}
        >
          <Storefront lit={lit} />
          {/* rayons de lumière */}
          <div
            style={{
              position: 'absolute',
              inset: -120,
              opacity: lit * 0.5,
              background: 'conic-gradient(from 0deg at 50% 60%, transparent 0deg, rgba(255,200,120,0.25) 15deg, transparent 30deg, rgba(255,200,120,0.2) 55deg, transparent 70deg, transparent 290deg, rgba(255,200,120,0.25) 310deg, transparent 330deg)',
              transform: `rotate(${t * 6}deg)`,
              zIndex: -1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: -40,
              transform: `translateX(-50%) scale(${proTag})`,
              padding: '10px 30px',
              borderRadius: 999,
              background: COLORS.white,
              ...text(32, COLORS.night, 700),
              whiteSpace: 'nowrap',
              boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
            }}
          >
            Votre vitrine professionnelle
          </div>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
