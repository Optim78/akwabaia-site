import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { BRAND, COLORS, VOICE_DURATION, cue } from '../config';
import { lerp, sp, useTime } from '../lib';
import { Camera } from '../components/Camera';
import { ChatIcon } from '../components/Icons';
import { text, title } from '../styles';

/** Scène 8 – APPEL À L'ACTION + écran de fin */
export const Scene8CTA: React.FC = () => {
  const t = useTime();
  const cMoi = cue('Moi,');
  const cAlassane = cue('Alassane,');
  const cAkw = cue("d'AkwabaIA.");
  const cEcr = cue('Écrivez-moi');
  const groupCues = [cue('WhatsApp', 2), cue('zéro'), cue('soixante-dix-huit,'), cue('soixante-deux,'), cue('soixante-quatorze,'), cue('soixante.')];
  const cEt = cue('Et', 5);
  const cImage = cue("l'image");
  const endAt = VOICE_DURATION + 0.05;

  const photo = sp(t, cMoi - 0.1, { damping: 14, stiffness: 100 });
  const compact = sp(t, cEcr - 0.1, { damping: 18, stiffness: 110 });
  const name = sp(t, cAlassane);
  const role = sp(t, cAkw);
  const wa = sp(t, cEcr, { damping: 13, stiffness: 150 });
  const final1 = sp(t, cEt);
  const final2 = sp(t, cImage);
  const out = lerp(t, [endAt - 0.1, endAt + 0.3], [1, 0]);
  const end = sp(t, endAt + 0.1, { damping: 14, stiffness: 120 });
  const pulse = 1 + 0.12 * Math.max(0, Math.sin((t - cEcr) * 6));

  const circle = 520;
  return (
    <AbsoluteFill>
      <Camera from={cMoi - 0.3} to={endAt + 2} zoom={[1.0, 1.05]}>
        <AbsoluteFill style={{ opacity: out }}>
          {/* photo ronde avec bordure orange animée */}
          <div
            style={{
              position: 'absolute',
              left: 540 - circle / 2,
              top: 370,
              width: circle,
              height: circle,
              transform: `scale(${(0.5 + 0.5 * photo) * (1 - 0.4 * compact)})`,
              transformOrigin: 'center top',
              opacity: photo,
            }}
          >
            <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', background: `conic-gradient(from ${t * 140}deg, ${COLORS.orange}, ${COLORS.orangeLight}, transparent 40%, ${COLORS.orange} 70%, ${COLORS.orangeLight})`, filter: 'drop-shadow(0 0 30px rgba(242,140,40,0.6))' }} />
            <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', background: COLORS.night }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', background: `radial-gradient(circle at 50% 30%, ${COLORS.nightLight}, ${COLORS.nightDeep})` }}>
              <Img
                src={staticFile('alassane.png')}
                style={{ position: 'absolute', width: circle * 1.15, left: -circle * 0.075, top: circle * 0.04, transform: `scale(${1 + (t - cMoi) * 0.012})`, transformOrigin: '50% 20%' }}
              />
            </div>
          </div>

          {/* nom + rôle */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: lerp(compact, [0, 1], [930, 700], (x) => x), textAlign: 'center' }}>
            <div style={{ ...title(66 - 12 * compact), textTransform: 'none', opacity: name, transform: `translateY(${(1 - name) * 30}px)` }}>
              Alassane <span style={{ color: COLORS.orange }}>COULIBALY</span>
            </div>
            <div style={{ ...text(36 - 6 * compact, COLORS.muted, 600), marginTop: 8, opacity: role, letterSpacing: 2 }}>{BRAND.founderRole}</div>
          </div>

          {/* numéro WhatsApp */}
          <div
            style={{
              position: 'absolute',
              left: 60,
              right: 60,
              top: 840,
              padding: '26px 20px',
              borderRadius: 36,
              background: 'linear-gradient(135deg, rgba(37,211,102,0.22), rgba(18,140,75,0.18))',
              border: `3px solid ${COLORS.green}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              opacity: wa,
              transform: `translateY(${(1 - wa) * 120}px)`,
              boxShadow: '0 0 60px rgba(37,211,102,0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ transform: `scale(${pulse})` }}>
                <ChatIcon size={70} />
              </div>
              <span style={text(38, COLORS.green, 700)}>WhatsApp</span>
            </div>
            <div style={{ display: 'flex', gap: 18 }}>
              {BRAND.whatsappGroups.map((g, i) => {
                const s = sp(t, groupCues[i], { damping: 10, stiffness: 220 });
                return (
                  <span key={i} style={{ ...title(78), letterSpacing: 0, opacity: s, transform: `translateY(${(1 - s) * 30}px) scale(${0.6 + 0.4 * s})`, display: 'inline-block' }}>
                    {g}
                  </span>
                );
              })}
            </div>
          </div>

          {/* phrase finale */}
          <div style={{ position: 'absolute', left: 50, right: 50, top: 1130, textAlign: 'center' }}>
            <div style={{ ...text(46, '#fff', 700), opacity: final1, transform: `translateY(${(1 - final1) * 20}px)` }}>Donnez à votre entreprise</div>
            <div style={{ ...title(64, COLORS.orange), textTransform: 'none', opacity: final2, transform: `scale(${0.8 + 0.2 * final2})`, textShadow: '0 0 40px rgba(242,140,40,0.5)' }}>
              l'image qu'elle mérite.
            </div>
          </div>
        </AbsoluteFill>

        {/* écran de fin : logo + numéro */}
        {t > endAt - 0.1 && (
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 280, gap: 50 }}>
            <Img src={staticFile('logo-horizontal.png')} style={{ width: 820, opacity: end, transform: `scale(${0.8 + 0.2 * end})` }} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '20px 40px',
                borderRadius: 999,
                background: COLORS.green,
                opacity: sp(t, endAt + 0.35),
                transform: `translateY(${(1 - sp(t, endAt + 0.35)) * 60}px)`,
                boxShadow: '0 20px 60px rgba(37,211,102,0.45)',
              }}
            >
              <ChatIcon size={64} color="#fff" />
              <span style={{ ...title(60), letterSpacing: 0 }}>{BRAND.whatsapp}</span>
            </div>
            <div style={{ ...text(40, COLORS.muted, 600), opacity: sp(t, endAt + 0.6), letterSpacing: 2 }}>{BRAND.site}</div>
          </AbsoluteFill>
        )}
      </Camera>
    </AbsoluteFill>
  );
};
