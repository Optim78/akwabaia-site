import React from 'react';
import { COLORS } from '../config';

type P = { size?: number; color?: string; style?: React.CSSProperties };

/** Bulle de discussion générique (pas de logo de marque). */
export const ChatIcon: React.FC<P> = ({ size = 64, color = COLORS.green, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={style}>
    <path d="M32 5C17 5 5 16 5 30c0 6 2.2 11.4 6 15.6L8 58l13.4-4.4C24.6 55.2 28.2 56 32 56c15 0 27-11 27-25.5S47 5 32 5z" fill={color} />
    <path
      d="M24 20c1-.5 2-.3 2.5.6l2.3 4.6c.4.9.2 1.9-.5 2.5l-1.4 1.2c1.5 3.2 4 5.8 7.2 7.3l1.3-1.4c.6-.7 1.6-.9 2.5-.5l4.6 2.2c.9.5 1.2 1.6.7 2.5-1.3 2.6-3.9 4.1-6.7 3.5-7.6-1.6-13.6-7.6-15.2-15.2-.5-2.6.8-5.1 3.2-6.4z"
      fill="#fff"
    />
  </svg>
);

export const CheckIcon: React.FC<P> = ({ size = 48, color = COLORS.green, style }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
    <circle cx="24" cy="24" r="22" fill={color} />
    <path d="M14 24.5l7 7 13-14" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SearchIcon: React.FC<P> = ({ size = 40, color = '#5f6b7a', style }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <circle cx="17" cy="17" r="11" stroke={color} strokeWidth="4" fill="none" />
    <path d="M25 25l9 9" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

export const AlertIcon: React.FC<P> = ({ size = 120, color = COLORS.red, style }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={style}>
    <path d="M60 8L114 106H6L60 8z" fill={color} stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
    <rect x="54" y="40" width="12" height="38" rx="6" fill="#fff" />
    <circle cx="60" cy="90" r="7" fill="#fff" />
  </svg>
);

export const PersonIcon: React.FC<P> = ({ size = 90, color = COLORS.white, style }) => (
  <svg width={size} height={size} viewBox="0 0 90 90" style={style}>
    <circle cx="45" cy="28" r="17" fill={color} />
    <path d="M12 86c0-19 15-32 33-32s33 13 33 32z" fill={color} />
  </svg>
);

export const CoinIcon: React.FC<P> = ({ size = 80, style }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={style}>
    <circle cx="40" cy="40" r="36" fill={COLORS.orange} />
    <circle cx="40" cy="40" r="27" fill="none" stroke={COLORS.orangeLight} strokeWidth="4" />
    <text x="40" y="52" textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize="34" fill="#fff">
      F
    </text>
  </svg>
);

export const PlayIcon: React.FC<P> = ({ size = 90, style }) => (
  <svg width={size} height={size} viewBox="0 0 90 90" style={style}>
    <circle cx="45" cy="45" r="42" fill="rgba(0,0,0,0.55)" stroke="#fff" strokeWidth="4" />
    <path d="M36 27l28 18-28 18z" fill="#fff" />
  </svg>
);

export const FingerIcon: React.FC<P> = ({ size = 130, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 120" style={style}>
    <path
      d="M38 8c5 0 8 4 8 8v36l4-1V40c0-4 3-7 7-7s7 3 7 7v12l3-.5c0-4 3-6.5 7-6.5s7 3 7 7v6c3 0 6 2.5 6 6.5V86c0 16-12 28-28 28H55c-10 0-18-5-23-13L10 67c-2-4-1-9 3-11 4-2 8-1 11 2l6 7V16c0-4 3-8 8-8z"
      fill="#FFD9B8"
      stroke="#3b2a1e"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
  </svg>
);

/** Icônes métiers (SVG génériques). */
export const TradeIcon: React.FC<{ name: string; size?: number }> = ({ name, size = 130 }) => {
  const o = COLORS.orange;
  const w = '#fff';
  const common = { width: size, height: size, viewBox: '0 0 120 120' };
  switch (name) {
    case 'helmet':
      return (
        <svg {...common}>
          <path d="M18 78c0-26 19-46 42-46s42 20 42 46z" fill={o} />
          <rect x="52" y="24" width="16" height="30" rx="6" fill={COLORS.orangeLight} />
          <rect x="10" y="76" width="100" height="14" rx="7" fill={w} />
        </svg>
      );
    case 'board':
      return (
        <svg {...common}>
          <rect x="14" y="18" width="92" height="62" rx="6" fill={w} />
          <rect x="20" y="24" width="80" height="50" rx="3" fill="#1f7a55" />
          <path d="M30 60l14-14 10 8 20-20" stroke={w} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M40 80l-12 26M80 80l12 26M60 80v22" stroke={o} strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case 'roller':
      return (
        <svg {...common}>
          <rect x="14" y="18" width="74" height="30" rx="10" fill={o} />
          <path d="M88 33h14v26H62v14" stroke={w} strokeWidth="6" fill="none" strokeLinejoin="round" />
          <rect x="55" y="72" width="14" height="38" rx="6" fill={w} />
          <path d="M20 48v10" stroke={COLORS.orangeLight} strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case 'wrench':
      return (
        <svg {...common}>
          <path
            d="M82 14a26 26 0 00-24 35L16 91a9 9 0 0013 13l42-42a26 26 0 0035-24l-15 15-14-4-4-14 15-15a26 26 0 00-11-6z"
            fill={w}
          />
          <circle cx="23" cy="97" r="5" fill={o} />
        </svg>
      );
    case 'saw':
      return (
        <svg {...common}>
          <path d="M20 44h66l14 30H20z" fill={w} />
          <path d="M20 74l6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8" fill="none" stroke={w} strokeWidth="4" />
          <rect x="84" y="30" width="26" height="40" rx="10" fill={o} />
          <rect x="91" y="40" width="12" height="18" rx="5" fill={COLORS.night} />
        </svg>
      );
    case 'shop':
    default:
      return (
        <svg {...common}>
          <rect x="18" y="50" width="84" height="56" rx="4" fill={w} />
          <path d="M12 30h96l-6 22H18z" fill={o} />
          <path d="M28 30l-4 22M44 30l-2 22M60 30v22M76 30l2 22M92 30l4 22" stroke={w} strokeWidth="3" />
          <rect x="30" y="66" width="26" height="40" rx="3" fill={COLORS.nightLight} />
          <rect x="64" y="64" width="28" height="22" rx="3" fill={COLORS.orangeLight} />
        </svg>
      );
  }
};
