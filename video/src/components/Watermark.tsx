import React from 'react';
import { Img, staticFile } from 'remotion';
import { BRAND, COLORS, SAFE, WATERMARK_OPACITY } from '../config';
import { sp, useTime } from '../lib';

/** Filigrane permanent (haut droite) + « © AkwabaIA » (bas gauche). */
export const Watermark: React.FC = () => {
  const t = useTime();
  const inn = sp(t, 0.1, { damping: 18, stiffness: 120 });
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: SAFE + 10,
          right: 36,
          opacity: WATERMARK_OPACITY * inn,
          transform: `translateX(${(1 - inn) * 60}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 22px 8px 8px',
          borderRadius: 999,
          background: 'rgba(6,18,42,0.6)',
          border: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        <Img
          src={staticFile('alassane-avatar.jpg')}
          style={{ width: 58, height: 58, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${COLORS.orange}` }}
        />
        <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#fff' }}>
          Akwaba<span style={{ color: COLORS.orange }}>IA</span>
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 36,
          bottom: SAFE - 44,
          fontFamily: 'Poppins',
          fontWeight: 500,
          fontSize: 22,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: 1,
        }}
      >
        © {BRAND.name}
      </div>
    </>
  );
};
