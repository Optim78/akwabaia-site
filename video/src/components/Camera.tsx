import React from 'react';
import { AbsoluteFill } from 'remotion';
import { lerp, useTime } from '../lib';

/** Mouvement de caméra lent : zoom progressif + légère dérive. */
export const Camera: React.FC<{ from: number; to: number; zoom?: [number, number]; drift?: number; children: React.ReactNode; shake?: number }> = ({
  from,
  to,
  zoom = [1, 1.06],
  drift = 14,
  children,
  shake = 0,
}) => {
  const t = useTime();
  const s = lerp(t, [from, to], zoom);
  const dx = Math.sin(t * 0.5) * drift * 0.5 + (shake ? Math.sin(t * 90) * shake : 0);
  const dy = lerp(t, [from, to], [drift, -drift]) + (shake ? Math.cos(t * 73) * shake : 0);
  return <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(${s})` }}>{children}</AbsoluteFill>;
};
