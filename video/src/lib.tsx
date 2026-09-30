import React, { createContext, useContext } from 'react';
import { continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, Easing } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { FPS } from './config';

// ---------- Polices locales (aucune dépendance réseau au rendu) ----------
const fontHandle = delayRender('Chargement des polices');
Promise.all([
  loadFont({ family: 'Montserrat', url: staticFile('fonts/montserrat-latin-800-normal.woff2'), weight: '800' }),
  loadFont({ family: 'Montserrat', url: staticFile('fonts/montserrat-latin-700-normal.woff2'), weight: '700' }),
  loadFont({ family: 'Poppins', url: staticFile('fonts/poppins-latin-400-normal.woff2'), weight: '400' }),
  loadFont({ family: 'Poppins', url: staticFile('fonts/poppins-latin-500-normal.woff2'), weight: '500' }),
  loadFont({ family: 'Poppins', url: staticFile('fonts/poppins-latin-600-normal.woff2'), weight: '600' }),
  loadFont({ family: 'Poppins', url: staticFile('fonts/poppins-latin-700-normal.woff2'), weight: '700' }),
])
  .then(() => continueRender(fontHandle))
  .catch((e) => {
    console.error(e);
    continueRender(fontHandle);
  });

// ---------- Temps absolu (en secondes) à l'intérieur d'une scène ----------
const SceneStartContext = createContext(0);

export const SceneTime: React.FC<{ startFrame: number; children: React.ReactNode }> = ({ startFrame, children }) => (
  <SceneStartContext.Provider value={startFrame}>{children}</SceneStartContext.Provider>
);

/** Temps absolu de la vidéo en secondes (synchronisé avec la voix off). */
export const useTime = (): number => {
  const frame = useCurrentFrame();
  const start = useContext(SceneStartContext);
  return (frame + start) / FPS;
};

// ---------- Helpers d'animation ----------
export const sp = (
  t: number,
  at: number,
  config: { damping?: number; stiffness?: number; mass?: number } = { damping: 14, stiffness: 140 },
): number => spring({ frame: (t - at) * FPS, fps: FPS, config });

export const lerp = (t: number, [a, b]: [number, number], [from, to]: [number, number], ease = Easing.inOut(Easing.cubic)) =>
  interpolate(t, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

/** 0 → 1 à l'entrée, 1 → 0 à la sortie. */
export const window01 = (t: number, inAt: number, outAt: number, fade = 0.25) =>
  Math.min(lerp(t, [inAt, inAt + fade], [0, 1]), lerp(t, [outAt - fade, outAt], [1, 0]));

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
