import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { BRAND, CHECKMARKS, COLORS, cue } from '../config';
import { lerp, sp, useTime } from '../lib';
import { Camera } from '../components/Camera';
import { PhoneMockup } from '../components/PhoneMockup';
import { ChatIcon, CheckIcon, FingerIcon, PlayIcon } from '../components/Icons';
import { glass, text, title } from '../styles';

const PHONE_W = 450;
const SCREEN_W = PHONE_W * 0.93;
const REALISATIONS = ['portfolio-eric-konan', 'cafebox-1', 'akwabagest-1', 'portfolio-aicha-traore', 'cafebox-3', 'modeassist-1'];

/** Scène 6 – DÉMONSTRATION */
export const Scene6Demo: React.FC = () => {
  const t = useTime();
  const cAvec = cue('Avec');
  const cReal = cue('réalisations');
  const cVideos = cue('vidéos,');
  const cEt = cue('et', 3); // « et vous écrivent »
  const cEcrivent = cue('écrivent');
  const cDirect = cue('directement');
  const cWa = cue('WhatsApp.');

  const phoneIn = sp(t, cAvec - 0.2, { damping: 15, stiffness: 100 });
  const scroll = lerp(t, [cAvec + 0.2, cReal], [0, 1]);
  // capture mobile : 780 px de large (x2) → échelle à la largeur de l'écran
  const siteScale = SCREEN_W / 780;
  const siteScrollPx = scroll * 5200 * siteScale;

  const gallery = lerp(t, [cReal - 0.15, cReal + 0.15], [0, 1]);
  const slide = lerp(t, [cReal + 0.2, cVideos], [0, 3.2]);
  const video = sp(t, cVideos - 0.35, { damping: 14, stiffness: 160 });
  const contact = lerp(t, [cEt - 0.1, cEt + 0.2], [0, 1]);
  const finger = sp(t, cEt + 0.05, { damping: 16, stiffness: 120 });
  const tap = t > cEcrivent ? Math.sin(Math.min(1, (t - cEcrivent) / 0.25) * Math.PI) : 0;
  const ripple = lerp(t, [cEcrivent, cEcrivent + 0.5], [0, 1]);
  const chat = lerp(t, [cDirect - 0.05, cDirect + 0.2], [0, 1]);
  const msg = sp(t, cDirect + 0.3, { damping: 13, stiffness: 180 });
  const reply = sp(t, cWa + 0.3, { damping: 13, stiffness: 180 });

  return (
    <AbsoluteFill>
      <Camera from={cAvec - 0.3} to={cWa + 1} zoom={[1.0, 1.05]}>
        <div style={{ position: 'absolute', left: 60, top: 380, transform: `translateY(${(1 - phoneIn) * 1100}px) rotate(${-4 + (1 - phoneIn) * -10}deg)` }}>
          <PhoneMockup width={PHONE_W}>
            {/* 1. site qui défile */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: SCREEN_W, transform: `translateY(${-siteScrollPx}px)` }}>
              <Img src={staticFile('site/mobile.png')} style={{ width: SCREEN_W, display: 'block' }} />
            </div>

            {/* 2. carrousel de réalisations */}
            <div style={{ position: 'absolute', inset: 0, background: '#0B1D3A', opacity: gallery, paddingTop: 70 }}>
              <div style={{ ...text(30, '#fff', 700), padding: '20px 26px 6px' }}>Nos réalisations</div>
              <div style={{ ...text(18, COLORS.muted, 500), padding: '0 26px 20px' }}>Photos & vidéos de nos chantiers</div>
              <div style={{ display: 'flex', gap: 16, paddingLeft: 26, transform: `translateX(${-slide * (SCREEN_W * 0.78 + 16)}px)` }}>
                {REALISATIONS.map((r) => (
                  <Img key={r} src={staticFile(`realisations/${r}.webp`)} style={{ width: SCREEN_W * 0.78, height: SCREEN_W * 0.78 * 0.625, objectFit: 'cover', borderRadius: 18, flexShrink: 0, boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }} />
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '22px 26px' }}>
                {REALISATIONS.slice(2, 6).map((r) => (
                  <Img key={r} src={staticFile(`realisations/${r}.webp`)} style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 12 }} />
                ))}
              </div>
              {/* vignette vidéo */}
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  right: 20,
                  top: 250,
                  height: 300,
                  borderRadius: 22,
                  overflow: 'hidden',
                  opacity: video,
                  transform: `scale(${0.7 + 0.3 * video})`,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                }}
              >
                <Img src={staticFile('realisations/cafebox-3.webp')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.1 + (t - cVideos) * 0.05})` }} />
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.25)' }}>
                  <PlayIcon size={100} style={{ transform: `scale(${1 + 0.1 * Math.sin(t * 8)})` }} />
                </div>
                <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.3)' }}>
                  <div style={{ width: `${lerp(t, [cVideos, cVideos + 3], [5, 60])}%`, height: '100%', background: COLORS.orange, borderRadius: 3 }} />
                </div>
              </div>
            </div>

            {/* 3. bouton contact WhatsApp */}
            <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: contact, paddingTop: 110, textAlign: 'center' }}>
              <div style={{ ...title(40, COLORS.night), textShadow: 'none' }}>Un projet ?</div>
              <div style={{ ...text(22, '#5b6680', 500), margin: '12px 30px 40px' }}>Réponse rapide, devis gratuit.</div>
              <Img src={staticFile('realisations/portfolio-eric-konan.webp')} style={{ width: SCREEN_W - 60, height: 200, objectFit: 'cover', borderRadius: 18 }} />
              <div
                style={{
                  position: 'relative',
                  margin: '40px 30px 0',
                  padding: '24px 10px',
                  borderRadius: 999,
                  background: COLORS.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  transform: `scale(${1 - 0.07 * tap})`,
                  boxShadow: '0 12px 30px rgba(37,211,102,0.5)',
                  overflow: 'hidden',
                }}
              >
                <ChatIcon size={36} color="#fff" />
                <span style={{ ...text(21, '#fff', 700), whiteSpace: 'nowrap' }}>Nous écrire sur WhatsApp</span>
                <div style={{ position: 'absolute', left: '60%', top: '50%', width: 600 * ripple, height: 600 * ripple, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', transform: 'translate(-50%,-50%)', opacity: 1 - ripple }} />
              </div>
            </div>

            {/* 4. conversation stylisée */}
            <div style={{ position: 'absolute', inset: 0, background: '#ECE5DD', opacity: chat }}>
              <div style={{ height: 170, background: COLORS.greenDark, display: 'flex', alignItems: 'flex-end', padding: '0 20px 18px', gap: 14 }}>
                <Img src={staticFile('alassane-avatar.jpg')} style={{ width: 62, height: 62, borderRadius: '50%' }} />
                <div>
                  <div style={text(26, '#fff', 700)}>{BRAND.name}</div>
                  <div style={text(18, 'rgba(255,255,255,0.8)', 400)}>en ligne</div>
                </div>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ alignSelf: 'center', ...text(16, '#5b6680', 500), background: '#fff', padding: '4px 14px', borderRadius: 10 }}>AUJOURD'HUI</div>
                <div
                  style={{
                    alignSelf: 'flex-end',
                    maxWidth: '85%',
                    background: '#DCF8C6',
                    borderRadius: '20px 4px 20px 20px',
                    padding: '14px 18px',
                    ...text(26, '#111', 500),
                    opacity: msg,
                    transform: `translateY(${(1 - msg) * 40}px) scale(${0.8 + 0.2 * msg})`,
                    transformOrigin: 'right top',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  Bonjour, je veux un devis
                  <div style={{ ...text(15, '#5b8c6a', 500), textAlign: 'right' }}>10:24 ✓✓</div>
                </div>
                <div
                  style={{
                    alignSelf: 'flex-start',
                    maxWidth: '85%',
                    background: '#fff',
                    borderRadius: '4px 20px 20px 20px',
                    padding: '14px 18px',
                    ...text(24, '#111', 500),
                    opacity: reply,
                    transform: `translateY(${(1 - reply) * 40}px)`,
                  }}
                >
                  Bonjour ! Avec plaisir 😊
                </div>
              </div>
            </div>
          </PhoneMockup>
          {/* doigt animé */}
          <div
            style={{
              position: 'absolute',
              left: 250,
              top: 520,
              opacity: finger * (1 - chat),
              transform: `translate(${(1 - finger) * 300}px, ${(1 - finger) * 400 + tap * 18}px) scale(${1 - 0.08 * tap}) rotate(-15deg)`,
            }}
          >
            <FingerIcon size={150} />
          </div>
        </div>

        {/* checkmarks */}
        <div style={{ position: 'absolute', left: 560, right: 40, top: 470, display: 'flex', flexDirection: 'column', gap: 34 }}>
          {CHECKMARKS.map((c, i) => {
            const at = cue(c.cue[0], c.cue[1]);
            const s = sp(t, at, { damping: 12, stiffness: 180 });
            return (
              <div key={i} style={{ ...glass, borderRadius: 26, padding: '24px 22px', display: 'flex', gap: 16, alignItems: 'center', opacity: s, transform: `translateX(${(1 - s) * 200}px)` }}>
                <CheckIcon size={58} style={{ flexShrink: 0, transform: `scale(${s})` }} />
                <div style={text(32, '#fff', 700)}>{c.text}</div>
              </div>
            );
          })}
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
