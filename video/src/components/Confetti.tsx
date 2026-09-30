import React, { useMemo } from 'react';
import { random } from 'remotion';
import { COLORS } from '../config';
import { useTime } from '../lib';

/** Confettis légers déclenchés à `at`. */
export const Confetti: React.FC<{ at: number; x?: number; y?: number; count?: number }> = ({ at, x = 540, y = 1150, count = 70 }) => {
  const t = useTime() - at;
  const parts = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => {
        const ang = -Math.PI / 2 + (random(`a${i}`) - 0.5) * Math.PI * 1.3;
        const v = 900 + random(`v${i}`) * 900;
        return {
          vx: Math.cos(ang) * v,
          vy: Math.sin(ang) * v,
          rot: random(`r${i}`) * 720,
          c: [COLORS.orange, '#fff', COLORS.orangeLight, COLORS.green, '#9CC3FF'][i % 5],
          w: 10 + random(`w${i}`) * 12,
        };
      }),
    [count],
  );
  if (t < 0 || t > 2.6) return null;
  return (
    <>
      {parts.map((p, i) => {
        const px = x + p.vx * t * 0.8;
        const py = y + p.vy * t + 1400 * t * t;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: p.w,
              height: p.w * 0.5,
              background: p.c,
              borderRadius: 2,
              opacity: Math.max(0, 1 - t / 2.6),
              transform: `rotate(${p.rot + t * 600}deg)`,
            }}
          />
        );
      })}
    </>
  );
};
