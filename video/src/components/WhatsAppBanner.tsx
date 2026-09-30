import React from 'react';
import { BRAND, COLORS, SAFE, WHATSAPP_BANNER_WINDOWS } from '../config';
import { lerp, sp, useTime } from '../lib';
import { ChatIcon } from './Icons';

/** Bandeau WhatsApp animé (bas de l'écran), visible dans les fenêtres définies dans config.ts. */
export const WhatsAppBanner: React.FC = () => {
  const t = useTime();
  const win = WHATSAPP_BANNER_WINDOWS.find(([a, b]) => t >= a - 0.1 && t <= b + 0.5);
  if (!win) return null;
  const [a, b] = win;
  const inn = sp(t, a, { damping: 13, stiffness: 150 });
  const out = lerp(t, [b, b + 0.4], [1, 0]);
  const v = inn * out;
  const pulse = 1 + 0.08 * Math.max(0, Math.sin((t - a) * Math.PI * 2.2));
  const shine = ((t - a) * 0.6) % 1.6;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: SAFE + 38,
        transform: `translate(-50%, ${(1 - v) * 180}px)`,
        opacity: v,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '16px 38px 16px 18px',
        borderRadius: 999,
        background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.greenDark})`,
        boxShadow: '0 18px 50px rgba(37,211,102,0.45), inset 0 2px 0 rgba(255,255,255,0.3)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 120,
          left: `${-30 + shine * 100}%`,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
          transform: 'skewX(-20deg)',
        }}
      />
      <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', transform: `scale(${pulse})` }}>
        <ChatIcon size={56} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 24, color: 'rgba(255,255,255,0.9)', letterSpacing: 1 }}>
          ÉCRIVEZ-MOI SUR WHATSAPP
        </span>
        <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 46, color: '#fff', letterSpacing: 1 }}>{BRAND.whatsapp}</span>
      </div>
    </div>
  );
};
