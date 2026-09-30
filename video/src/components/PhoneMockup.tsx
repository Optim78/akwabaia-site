import React from 'react';
import { COLORS } from '../config';

/** Maquette de smartphone réaliste (cadre, encoche, reflets). Le contenu remplit l'écran. */
export const PhoneMockup: React.FC<{
  width?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  screenStyle?: React.CSSProperties;
  time?: string;
}> = ({ width = 520, children, style, screenStyle, time = '09:41' }) => {
  const height = width * 2.05;
  const bezel = width * 0.035;
  const radius = width * 0.14;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: radius,
        background: 'linear-gradient(145deg, #3a4150 0%, #12161f 45%, #2a303c 100%)',
        padding: bezel,
        boxShadow: '0 50px 120px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.08), inset 0 0 0 2px rgba(255,255,255,0.12)',
        ...style,
      }}
    >
      {/* boutons latéraux */}
      <div style={{ position: 'absolute', left: -6, top: height * 0.2, width: 6, height: 70, borderRadius: 3, background: '#2a303c' }} />
      <div style={{ position: 'absolute', left: -6, top: height * 0.3, width: 6, height: 110, borderRadius: 3, background: '#2a303c' }} />
      <div style={{ position: 'absolute', right: -6, top: height * 0.26, width: 6, height: 140, borderRadius: 3, background: '#2a303c' }} />
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: radius - bezel,
          overflow: 'hidden',
          background: '#fff',
          ...screenStyle,
        }}
      >
        {children}
        {/* barre de statut */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: width * 0.1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `0 ${width * 0.08}px`,
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontSize: width * 0.034,
            color: '#111',
            background: 'linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.75))',
            zIndex: 5,
          }}
        >
          <span>{time}</span>
          <span style={{ letterSpacing: 2 }}>▮▮▮ ◔</span>
        </div>
        {/* îlot / encoche */}
        <div
          style={{
            position: 'absolute',
            top: width * 0.025,
            left: '50%',
            transform: 'translateX(-50%)',
            width: width * 0.3,
            height: width * 0.06,
            borderRadius: 999,
            background: '#07090d',
            zIndex: 6,
          }}
        />
        {/* reflet */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(115deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 32%)',
            pointerEvents: 'none',
            zIndex: 7,
          }}
        />
      </div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: radius, boxShadow: `0 0 0 1px ${COLORS.nightLight}` }} />
    </div>
  );
};
