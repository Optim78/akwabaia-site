import React from 'react';
import { BRAND, COLORS } from '../config';
import { lerp, sp, useTime } from '../lib';
import { Easing } from 'remotion';

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Compteur animé 0 → 100 000 FCFA. */
export const PriceCounter: React.FC<{ from: number; to: number; size?: number }> = ({ from, to, size = 140 }) => {
  const t = useTime();
  const appear = sp(t, from, { damping: 12, stiffness: 160 });
  const value = lerp(t, [from, to], [0, BRAND.price], Easing.out(Easing.cubic));
  const land = sp(t, to, { damping: 8, stiffness: 220 });
  const glow = t > to ? 0.5 + 0.5 * Math.sin((t - to) * 5) : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: appear, transform: `scale(${0.6 + 0.4 * appear + 0.08 * land * (1 - Math.min(1, (t - to) * 2))})` }}>
      <div
        style={{
          fontFamily: 'Montserrat',
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1,
          color: COLORS.orange,
          letterSpacing: -2,
          textShadow: `0 0 ${30 + glow * 40}px rgba(242,140,40,${0.45 + glow * 0.3}), 0 6px 0 #a4520c`,
          whiteSpace: 'nowrap',
        }}
      >
        {fmt(value)}
        <span style={{ fontSize: size * 0.42, marginLeft: 16, color: '#fff', textShadow: 'none' }}>{BRAND.currency}</span>
      </div>
    </div>
  );
};
