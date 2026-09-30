import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BRAND, COLORS, cue } from '../config';
import { lerp, sp, useTime } from '../lib';
import { Camera } from '../components/Camera';
import { PhoneMockup } from '../components/PhoneMockup';
import { SearchScreen } from '../components/SearchScreen';
import { PersonIcon } from '../components/Icons';
import { glass, text, title } from '../styles';

export const PHONE_POS = { left: 520, top: 400, width: 470 };

/** Illustration simple d'un décideur (costume) qui regarde son téléphone. */
const DecisionMaker: React.FC<{ t: number }> = ({ t }) => (
  <svg width={420} height={560} viewBox="0 0 420 560">
    <ellipse cx="210" cy="545" rx="170" ry="14" fill="rgba(0,0,0,0.3)" />
    {/* corps / costume */}
    <path d="M60 540c0-130 60-220 150-220s150 90 150 220z" fill="#22385f" />
    <path d="M170 322l40 80 40-80z" fill="#fff" />
    <path d="M203 340h14l8 90-15 22-15-22z" fill={COLORS.orange} />
    <path d="M150 330l60 110-30 10zM270 330l-60 110 30 10z" fill="#1a2c4d" />
    {/* tête */}
    <rect x="186" y="270" width="48" height="50" rx="14" fill="#6b4630" />
    <ellipse cx="210" cy="220" rx="72" ry="82" fill="#7a5038" transform={`rotate(${8 + Math.sin(t * 1.5) * 2} 210 260)`} />
    <path d="M140 200c0-60 40-90 72-90s70 30 70 86c-20-26-60-36-142 4z" fill="#1b1410" transform={`rotate(${8 + Math.sin(t * 1.5) * 2} 210 260)`} />
    {/* bras + téléphone */}
    <path d="M300 420c40-10 60-60 50-110" stroke="#22385f" strokeWidth="46" strokeLinecap="round" fill="none" />
    <rect x="318" y="248" width="56" height="96" rx="12" fill="#0e131c" transform="rotate(-12 346 296)" />
    <rect x="324" y="256" width="44" height="76" rx="6" fill={COLORS.orangeLight} opacity={0.6 + 0.4 * Math.sin(t * 4)} transform="rotate(-12 346 296)" />
  </svg>
);

/** Scène 3 – LA RECHERCHE */
export const Scene3Search: React.FC = () => {
  const t = useTime();
  const cQuand = cue('Quand');
  const cProp = cue('proposez');
  const cEntr = cue('entreprise,');
  const cDecr = cue('décrocher');
  const cQue = cue('que', 2);
  const cTape = cue('tape');
  const cGoogle = cue('Google.');

  // Phase A : services → entreprise → marché
  const aOut = lerp(t, [cQue - 0.2, cQue + 0.2], [1, 0]);
  const head = sp(t, cQuand + 0.1);
  const you = sp(t, cProp);
  const arrow = lerp(t, [cProp + 0.3, cEntr], [0, 1]);
  const comp = sp(t, cEntr);
  const market = sp(t, cDecr, { damping: 11, stiffness: 150 });

  // Phase B/C : question + décideur + téléphone
  const q = sp(t, cQue);
  const dm = sp(t, cQue + 0.25, { damping: 15, stiffness: 100 });
  const phone = sp(t, cQue + 0.1, { damping: 15, stiffness: 90 });
  const typeStart = cTape + 0.15;
  const typeEnd = cGoogle - 0.35;
  const n = Math.floor(lerp(t, [typeStart, typeEnd], [0, BRAND.searchQuery.length], (x) => x));
  const query = BRAND.searchQuery.slice(0, Math.max(0, n));
  const pressed = t > cGoogle ? lerp(t, [cGoogle, cGoogle + 0.3], [0, 1]) : 0;
  const loading = t > cGoogle + 0.15 ? lerp(t, [cGoogle + 0.15, cGoogle + 1.2], [0, 0.85]) : -1;
  const zoomIn = lerp(t, [cTape - 0.3, cGoogle], [1, 1.1]);

  return (
    <AbsoluteFill>
      <Camera from={cQuand - 0.3} to={cGoogle + 1} zoom={[1.0, 1.06]} drift={0}>
        {/* ---- Phase A ---- */}
        <AbsoluteFill style={{ opacity: aOut }}>
          <div style={{ position: 'absolute', top: 400, left: 70, right: 70, ...title(78), opacity: head, transform: `translateY(${(1 - head) * 40}px)` }}>
            Vous proposez
            <br />
            <span style={{ color: COLORS.orange }}>vos services</span>
          </div>
          <div style={{ position: 'absolute', top: 640, left: 70, width: 340, height: 300, ...glass, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, transform: `scale(${you})` }}>
            <PersonIcon size={120} color={COLORS.orange} />
            <div style={text(38, '#fff', 700)}>Vous</div>
          </div>
          <svg width={220} height={80} viewBox="0 0 220 80" style={{ position: 'absolute', left: 420, top: 750 }}>
            <path d="M10 40H190" stroke={COLORS.orange} strokeWidth="8" strokeDasharray="18 14" strokeDashoffset={-t * 60} strokeLinecap="round" style={{ clipPath: `inset(0 ${100 - arrow * 100}% 0 0)` }} />
            <path d="M180 18l30 22-30 22" stroke={COLORS.orange} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrow} />
          </svg>
          <div style={{ position: 'absolute', top: 640, right: 70, width: 340, height: 300, ...glass, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, transform: `scale(${comp})` }}>
            <svg width={120} height={120} viewBox="0 0 120 120">
              <rect x="22" y="14" width="76" height="100" rx="6" fill="#fff" />
              {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={34 + c * 20} y={26 + r * 20} width="12" height="12" rx="2" fill={COLORS.nightLight} />))}
              <rect x="50" y="90" width="20" height="24" fill={COLORS.orange} />
            </svg>
            <div style={text(34, '#fff', 700)}>Une entreprise</div>
          </div>
          <div
            style={{
              position: 'absolute',
              top: 990,
              left: 140,
              right: 140,
              padding: '28px 34px',
              ...glass,
              background: 'linear-gradient(135deg, rgba(242,140,40,0.25), rgba(242,140,40,0.08))',
              border: `2px solid ${COLORS.orange}`,
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              opacity: market,
              transform: `translateY(${(1 - market) * 120}px) rotate(${(1 - market) * -6}deg)`,
            }}
          >
            <svg width={100} height={100} viewBox="0 0 100 100">
              <path d="M28 12h44v28a22 22 0 01-44 0z" fill={COLORS.orange} />
              <path d="M28 20H12c0 16 8 24 18 26M72 20h16c0 16-8 24-18 26" stroke={COLORS.orange} strokeWidth="6" fill="none" />
              <rect x="44" y="62" width="12" height="16" fill={COLORS.orange} />
              <rect x="30" y="78" width="40" height="12" rx="4" fill="#fff" />
            </svg>
            <div>
              <div style={title(46)}>Décrocher</div>
              <div style={title(46, COLORS.orange)}>un marché</div>
            </div>
          </div>
        </AbsoluteFill>

        {/* ---- Phase B/C ---- */}
        {t > cQue - 0.3 && (
          <AbsoluteFill>
            <div style={{ position: 'absolute', top: 400, left: 60, width: 440, ...title(54), opacity: q, transform: `translateX(${(1 - q) * -60}px)` }}>
              Que fait-on
              <br />
              <span style={{ color: COLORS.orange }}>en premier&nbsp;?</span>
            </div>
            <div style={{ position: 'absolute', left: 30, top: 760, opacity: dm, transform: `translateY(${(1 - dm) * 150}px)` }}>
              <DecisionMaker t={t} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: PHONE_POS.left,
                top: PHONE_POS.top,
                transform: `translateX(${(1 - phone) * 600}px) rotate(${(1 - phone) * 12 + 3 - 3 * lerp(t, [cTape, cGoogle], [0, 1])}deg) scale(${zoomIn})`,
                transformOrigin: 'center top',
              }}
            >
              <PhoneMockup width={PHONE_POS.width}>
                <SearchScreen query={query} cursor={t < cGoogle && Math.floor(t * 3) % 2 === 0} loading={loading} empty={0} pressed={pressed} />
              </PhoneMockup>
            </div>
          </AbsoluteFill>
        )}
      </Camera>
    </AbsoluteFill>
  );
};
