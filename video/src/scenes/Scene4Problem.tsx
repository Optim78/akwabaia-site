import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BRAND, COLORS, cue } from '../config';
import { lerp, sp, useTime } from '../lib';
import { Camera } from '../components/Camera';
import { PhoneMockup } from '../components/PhoneMockup';
import { SearchScreen } from '../components/SearchScreen';
import { AlertIcon } from '../components/Icons';
import { title } from '../styles';
import { PHONE_POS } from './Scene3Search';

/** Scène 4 – LE PROBLÈME */
export const Scene4Problem: React.FC<{ onRed?: number }> = () => {
  const t = useTime();
  const cEt = cue('Et');
  const cRien = cue('rien...');
  const cDoute = cue('doute.');
  const cPas = cue('Pas');
  const cPas2 = cue('pas', 2);
  const cCred = cue('crédibilité.');

  const loading = lerp(t, [cEt - 0.4, cRien], [0.85, 1]);
  const empty = sp(t, cRien, { damping: 14, stiffness: 160 });
  const desat = lerp(t, [cRien + 0.2, cDoute + 0.2], [0, 1]);
  const shakeAmt = t > cDoute ? Math.max(0, 1 - (t - cDoute) / 0.6) * 22 : 0;
  const shakeAmt2 = t > cPas2 ? Math.max(0, 1 - (t - cPas2) / 0.5) * 16 : 0;
  const alert = sp(t, cDoute, { damping: 8, stiffness: 200 });
  const dim = lerp(t, [cPas - 0.15, cPas + 0.25], [1, 0]);
  const l1 = sp(t, cPas, { damping: 12, stiffness: 180 });
  const l2 = sp(t, cPas2, { damping: 9, stiffness: 200 });
  const strike = lerp(t, [cCred + 0.3, cCred + 0.6], [0, 1]);

  return (
    <AbsoluteFill>
      {/* voile rouge */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(229,72,77,${0.28 * desat}) 0%, rgba(60,0,10,${0.6 * desat}) 100%)` }} />
      <Camera from={cEt - 0.3} to={cCred + 1.2} zoom={[1.06, 1.12]} drift={0} shake={shakeAmt + shakeAmt2}>
        <div
          style={{
            position: 'absolute',
            left: PHONE_POS.left - (1 - dim) * 240,
            top: PHONE_POS.top,
            opacity: 0.25 + 0.75 * dim,
            transform: `scale(${1.1 - (1 - dim) * 0.15})`,
            transformOrigin: 'center top',
            filter: `grayscale(${desat}) sepia(${desat * 0.5}) hue-rotate(${-30 * desat}deg) saturate(${1 + desat * 1.5}) blur(${(1 - dim) * 4}px)`,
          }}
        >
          <PhoneMockup width={PHONE_POS.width}>
            <SearchScreen query={BRAND.searchQuery} cursor={false} loading={loading} empty={empty} pressed={1} />
            <div style={{ position: 'absolute', inset: 0, background: `rgba(229,72,77,${0.25 * desat})`, mixBlendMode: 'multiply' }} />
          </PhoneMockup>
          <div style={{ position: 'absolute', right: -40, top: -50, transform: `scale(${alert}) rotate(${Math.sin(t * 12) * 6}deg)` }}>
            <AlertIcon size={150} />
          </div>
        </div>

        {/* texte choc */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center' }}>
          <div style={{ ...title(104), opacity: l1, transform: `scale(${1.4 - 0.4 * l1})` }}>Pas en ligne</div>
          <div style={{ ...title(110, COLORS.orange), opacity: l2, transform: `scale(${2 - l2})`, margin: '20px 0' }}>=</div>
          <div style={{ position: 'relative', display: 'inline-block', opacity: l2, transform: `scale(${1.6 - 0.6 * l2})` }}>
            <div style={{ ...title(104, COLORS.red), textShadow: '0 0 50px rgba(229,72,77,0.7)' }}>Pas crédible</div>
            <div style={{ position: 'absolute', left: -10, top: '104%', height: 12, width: `${strike * 104}%`, background: COLORS.red, borderRadius: 8, transform: 'rotate(-1.5deg)', boxShadow: '0 0 20px rgba(255,255,255,0.6)' }} />
          </div>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
