import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS, TRADES, cue } from '../config';
import { lerp, sp, useTime } from '../lib';
import { Camera } from '../components/Camera';
import { TradeIcon } from '../components/Icons';
import { glass, title, text } from '../styles';

/** Scène 5 – TOUS LES MÉTIERS */
export const Scene5Trades: React.FC = () => {
  const t = useTime();
  const cQuelle = cue('Quelle');
  const cMeritez = cue('méritez');
  const cVrai = cue('vrai');
  const cPro = cue('professionnel.');

  const gridOut = lerp(t, [cMeritez - 0.2, cMeritez + 0.2], [1, 0]);
  const shrink = lerp(t, [cQuelle - 0.1, cQuelle + 0.35], [1, 0.84]);
  const header = sp(t, cQuelle);
  const deserve = sp(t, cMeritez);
  const vrai = sp(t, cVrai);
  const stamp = sp(t, cPro, { damping: 9, stiffness: 260, mass: 0.8 });
  const shake = t > cPro ? Math.max(0, 1 - (t - cPro) / 0.4) * 14 : 0;

  return (
    <AbsoluteFill>
      <Camera from={cue('Bâtiment,') - 0.3} to={cPro + 1.2} zoom={[1.0, 1.07]} shake={shake}>
        {/* grille des métiers */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 380, opacity: gridOut, transform: `scale(${shrink}) translateY(${(1 - shrink) * 900}px)`, transformOrigin: 'center top' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '440px 440px', gap: 36, justifyContent: 'center' }}>
            {TRADES.map((tr, i) => {
              const at = cue(tr.cue);
              const s = sp(t, at, { damping: 11, stiffness: 200 });
              const active = t >= at && t < at + 0.6;
              const wave = t > cQuelle ? Math.sin((t - cQuelle) * 6 - i * 0.7) * 6 : 0;
              return (
                <div
                  key={tr.label}
                  style={{
                    height: 270,
                    ...glass,
                    border: active ? `3px solid ${COLORS.orange}` : glass.border,
                    background: active ? 'linear-gradient(145deg, rgba(242,140,40,0.3), rgba(242,140,40,0.08))' : glass.background,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    opacity: s,
                    transform: `scale(${0.4 + 0.6 * s + (active ? 0.04 : 0)}) rotate(${(1 - s) * (i % 2 ? 12 : -12)}deg) translateY(${wave}px)`,
                  }}
                >
                  <TradeIcon name={tr.icon} size={130} />
                  <div style={text(40, '#fff', 700)}>{tr.label}</div>
                </div>
              );
            })}
          </div>
        </div>
        {/* en-tête */}
        <div style={{ position: 'absolute', top: 380, left: 0, right: 0, textAlign: 'center', ...title(62), opacity: header * gridOut, transform: `translateY(${(1 - header) * -40}px)` }}>
          Quelle que soit
          <br />
          <span style={{ color: COLORS.orange }}>votre activité</span>
        </div>

        {/* Vous méritez d'être vu comme un PRO */}
        <div style={{ position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ ...title(76), opacity: deserve, transform: `translateY(${(1 - deserve) * 40}px)` }}>
            Vous méritez
            <br />
            d'être vu
            <br />
            comme un <span style={{ color: COLORS.orange, opacity: vrai }}>vrai</span>
          </div>
          <div
            style={{
              display: 'inline-block',
              marginTop: 50,
              padding: '10px 60px',
              border: `16px solid ${COLORS.orange}`,
              borderRadius: 34,
              ...title(260, COLORS.orange),
              lineHeight: 1,
              opacity: Math.min(1, stamp * 1.5),
              transform: `scale(${3 - 2 * stamp}) rotate(-8deg)`,
              textShadow: '0 0 60px rgba(242,140,40,0.6)',
              boxShadow: '0 0 60px rgba(242,140,40,0.35), inset 0 0 40px rgba(242,140,40,0.25)',
            }}
          >
            PRO
          </div>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
