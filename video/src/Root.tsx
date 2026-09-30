import React from 'react';
import { Composition } from 'remotion';
import { AkwabaVideo } from './Video';
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from './config';

export const RemotionRoot: React.FC = () => (
  <Composition id="AkwabaIA" component={AkwabaVideo} durationInFrames={DURATION_IN_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
);
