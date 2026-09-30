import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';

type Props = Record<string, never>;

const ZoomPresentation: React.FC<TransitionPresentationComponentProps<Props>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = presentationProgress;
  const style: React.CSSProperties =
    presentationDirection === 'entering'
      ? { transform: `scale(${0.6 + 0.4 * p})`, opacity: p, filter: `blur(${(1 - p) * 12}px)` }
      : { transform: `scale(${1 + 0.6 * p})`, opacity: 1 - p, filter: `blur(${p * 12}px)` };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

/** Transition « zoom » (zoom avant + flou). */
export const zoom = (): TransitionPresentation<Props> => ({ component: ZoomPresentation, props: {} });
