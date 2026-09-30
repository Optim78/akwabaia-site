import React, { useMemo } from 'react';
import { AbsoluteFill, random } from 'remotion';
import { COLORS, WIDTH, HEIGHT } from '../config';
import { useTime } from '../lib';

/** Fond bleu nuit, dégradés animés subtils et particules lumineuses lentes. */
export const Particles: React.FC<{ count?: number; tint?: string }> = ({ count = 46, tint = COLORS.orange }) => {
  const t = useTime();
  const dots = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`x${i}`) * WIDTH,
        y: random(`y${i}`) * HEIGHT,
        r: 1.5 + random(`r${i}`) * 4.5,
        speed: 8 + random(`s${i}`) * 26,
        phase: random(`p${i}`) * Math.PI * 2,
        warm: random(`c${i}`) > 0.62,
      })),
    [count],
  );
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {dots.map((d, i) => {
        const y = (((d.y - t * d.speed) % HEIGHT) + HEIGHT) % HEIGHT;
        const x = d.x + Math.sin(t * 0.6 + d.phase) * 22;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.7 + d.phase));
        const c = d.warm ? tint : '#9CC3FF';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: '50%',
              background: c,
              opacity: tw * 0.55,
              boxShadow: `0 0 ${d.r * 5}px ${d.r * 1.6}px ${c}66`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Background: React.FC<{ red?: number }> = ({ red = 0 }) => {
  const t = useTime();
  const g1x = 30 + Math.sin(t * 0.25) * 18;
  const g1y = 22 + Math.cos(t * 0.2) * 10;
  const g2x = 72 + Math.cos(t * 0.18) * 16;
  const g2y = 78 + Math.sin(t * 0.22) * 10;
  return (
    <AbsoluteFill style={{ background: COLORS.night }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${g1x}% ${g1y}%, ${COLORS.nightLight} 0%, transparent 55%),
                       radial-gradient(circle at ${g2x}% ${g2y}%, rgba(242,140,40,0.16) 0%, transparent 50%),
                       radial-gradient(circle at 50% 120%, ${COLORS.nightDeep} 0%, transparent 70%)`,
        }}
      />
      {/* grille très discrète */}
      <AbsoluteFill
        style={{
          opacity: 0.06,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          backgroundPosition: `0 ${(t * 12) % 90}px`,
          maskImage: 'radial-gradient(circle at 50% 45%, black 0%, transparent 75%)',
        }}
      />
      <Particles />
      {red > 0 && <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(229,72,77,${0.25 * red}) 0%, rgba(80,0,10,${0.55 * red}) 100%)` }} />}
    </AbsoluteFill>
  );
};
