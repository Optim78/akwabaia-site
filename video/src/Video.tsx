import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { flip } from '@remotion/transitions/flip';
import { fade } from '@remotion/transitions/fade';
import {
  DURATION_IN_FRAMES,
  FPS,
  MUSIC_DUCKED_VOLUME,
  MUSIC_FADE_IN,
  MUSIC_FADE_OUT,
  MUSIC_VOLUME,
  SCENES,
  SFX_VOLUME,
  TRADES,
  CHECKMARKS,
  TRANSITION_FRAMES,
  WORDS,
  cue,
} from './config';
import { SceneTime } from './lib';
import { Background } from './components/Particles';
import { AnimatedSubtitle } from './components/AnimatedSubtitle';
import { WhatsAppBanner } from './components/WhatsAppBanner';
import { Watermark } from './components/Watermark';
import { zoom } from './components/ZoomTransition';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Reveal } from './scenes/Scene2Reveal';
import { Scene3Search } from './scenes/Scene3Search';
import { Scene4Problem } from './scenes/Scene4Problem';
import { Scene5Trades } from './scenes/Scene5Trades';
import { Scene6Demo } from './scenes/Scene6Demo';
import { Scene7Offer } from './scenes/Scene7Offer';
import { Scene8CTA } from './scenes/Scene8CTA';

const COMPONENTS: Record<(typeof SCENES)[number]['id'], React.FC> = {
  hook: Scene1Hook,
  reveal: Scene2Reveal,
  search: Scene3Search,
  problem: Scene4Problem,
  trades: Scene5Trades,
  demo: Scene6Demo,
  offer: Scene7Offer,
  cta: Scene8CTA,
};

// Transition qui mène À la scène i (i ≥ 1)
const TRANSITIONS = [
  null,
  { p: zoom(), timing: 'linear' },
  { p: slide({ direction: 'from-right' }), timing: 'spring' },
  { p: fade(), timing: 'linear' },
  { p: wipe({ direction: 'from-bottom-left' }), timing: 'linear' },
  { p: flip({ direction: 'from-right' }), timing: 'linear' },
  { p: zoom(), timing: 'linear' },
  { p: slide({ direction: 'from-bottom' }), timing: 'spring' },
] as const;

const SFX: { src: string; at: number; volume?: number }[] = [
  { src: 'sfx/glitch.mp3', at: cue('Détrompez-vous.'), volume: 0.45 },
  { src: 'sfx/typing.mp3', at: cue('tape') + 0.15, volume: 0.4 },
  { src: 'sfx/ding.mp3', at: cue('Google.') + 0.05, volume: 0.3 },
  { src: 'sfx/error.mp3', at: cue('rien...'), volume: 0.45 },
  ...TRADES.map((tr) => ({ src: 'sfx/ding.mp3', at: cue(tr.cue), volume: 0.22 })),
  { src: 'sfx/stamp.mp3', at: cue('professionnel.'), volume: 0.6 },
  ...CHECKMARKS.map((c) => ({ src: 'sfx/ding.mp3', at: cue(c.cue[0], c.cue[1]), volume: 0.22 })),
  { src: 'sfx/cash.mp3', at: cue('CFA.'), volume: 0.45 },
  ...SCENES.slice(1).map((s) => ({ src: 'sfx/whoosh.mp3', at: s.start - 0.05, volume: 0.28 })),
];

export const AkwabaVideo: React.FC = () => {
  const starts = SCENES.map((s) => Math.round(s.start * FPS));

  // Ducking : activité de la voix image par image, lissée
  const musicVolume = useMemo(() => {
    const active = new Float32Array(DURATION_IN_FRAMES);
    for (const w of WORDS) {
      const a = Math.max(0, Math.floor((w.start - 0.15) * FPS));
      const b = Math.min(DURATION_IN_FRAMES - 1, Math.ceil((w.end + 0.35) * FPS));
      for (let f = a; f <= b; f++) active[f] = 1;
    }
    const smooth = new Float32Array(DURATION_IN_FRAMES);
    let v = 0;
    for (let f = 0; f < DURATION_IN_FRAMES; f++) {
      v += (active[f] - v) * (active[f] > v ? 0.35 : 0.08);
      smooth[f] = v;
    }
    return (f: number) => {
      const duck = MUSIC_VOLUME + (MUSIC_DUCKED_VOLUME - MUSIC_VOLUME) * (smooth[Math.min(f, DURATION_IN_FRAMES - 1)] ?? 0);
      const fadeIn = interpolate(f, [0, MUSIC_FADE_IN * FPS], [0, 1], { extrapolateRight: 'clamp' });
      const fadeOut = interpolate(f, [DURATION_IN_FRAMES - MUSIC_FADE_OUT * FPS, DURATION_IN_FRAMES - 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      return duck * fadeIn * fadeOut;
    };
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B1D3A' }}>
      <Background />

      <TransitionSeries>
        {SCENES.map((s, i) => {
          const isLast = i === SCENES.length - 1;
          const dur = isLast ? DURATION_IN_FRAMES - starts[i] : starts[i + 1] - starts[i] + TRANSITION_FRAMES;
          const Comp = COMPONENTS[s.id];
          const tr = TRANSITIONS[i];
          return (
            <React.Fragment key={s.id}>
              {tr && (
                <TransitionSeries.Transition
                  presentation={tr.p as never}
                  timing={
                    tr.timing === 'spring'
                      ? springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })
                      : linearTiming({ durationInFrames: TRANSITION_FRAMES })
                  }
                />
              )}
              <TransitionSeries.Sequence durationInFrames={dur}>
                <SceneTime startFrame={starts[i]}>
                  <Comp />
                </SceneTime>
              </TransitionSeries.Sequence>
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      {/* éléments permanents */}
      <Watermark />
      <WhatsAppBanner />
      <AnimatedSubtitle />

      {/* audio */}
      <Audio src={staticFile('voiceover.mp3')} />
      <Audio src={staticFile('music.mp3')} volume={musicVolume} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.at * FPS))} layout="none">
          <Audio src={staticFile(s.src)} volume={(s.volume ?? 1) * (SFX_VOLUME / 0.35)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
