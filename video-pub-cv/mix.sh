#!/usr/bin/env bash
# Mixage audio + assemblage final.
#  - voix off découpée en 6 segments et replacée sur la timeline (build/segments.json)
#  - musique ducking (compression sidechain sous la voix), fondu de fin
#  - bruitages : whoosh sur les transitions, impact sur le tampon et le logo final, pop sur les notifications
#  - normalisation -14 LUFS (standard TikTok / Instagram / Facebook / LinkedIn)
set -euo pipefail
cd "$(dirname "$0")"
DUR=50
read -r -a SEG < <(python3 -c "
import json;print(' '.join(f\"{g['src0']}:{g['src1']}:{int(g['at']*1000)}\" for g in json.load(open('build/segments.json'))))")

inputs=(-i audio/voix-off.mp3 -i audio/musique.mp3 -i audio/sfx-whoosh.mp3 -i audio/sfx-impact.mp3 -i audio/sfx-pop.mp3)
fc="[0:a]aformat=sample_rates=44100:channel_layouts=stereo,asplit=${#SEG[@]}$(for i in "${!SEG[@]}"; do printf '[v%d]' "$i"; done);"
vo=""
for i in "${!SEG[@]}"; do
  IFS=: read -r a b d <<<"${SEG[$i]}"
  fc+="[v$i]atrim=$a:$b,asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=$(python3 -c "print(max(0,$b-$a-0.04))"):d=0.04,adelay=$d|$d[s$i];"
  vo+="[s$i]"
done
fc+="${vo}amix=inputs=${#SEG[@]}:normalize=0,apad=whole_dur=$DUR,atrim=0:$DUR,volume=1.6,asplit=2[vo][key];"
fc+="[1:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:$DUR,volume=0.55,afade=t=in:d=0.4,afade=t=out:st=$((DUR-3)):d=3[mus];"
fc+="[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[duck];"
# bruitages : (entrée, instant en ms, volume)
sfx=( "2 9750 0.6" "2 15850 0.6" "2 18150 0.45" "2 20050 0.45" "2 21700 0.45" "2 24200 0.6" "2 29800 0.6" "2 37400 0.6"
      "3 9000 0.7" "3 45150 0.9" "4 1950 0.7" "4 34200 0.7" "4 40050 0.6" )
fx=""
for k in "${!sfx[@]}"; do read -r src ms vol <<<"${sfx[$k]}"
  fc+="[$src:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=$vol,adelay=$ms|$ms[f$k];"; fx+="[f$k]"; done
fc+="${fx}amix=inputs=${#sfx[@]}:normalize=0,apad=whole_dur=$DUR,atrim=0:$DUR[sfx];"
fc+="[vo][duck][sfx]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9[out]"

ffmpeg -y -v error "${inputs[@]}" -filter_complex "$fc" -map "[out]" -ar 48000 -c:a pcm_s16le build/mix.wav
ffmpeg -y -v error -i build/video-muette.mp4 -i build/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart \
  AkwabaIA-pub-CV-9x16.mp4
echo "ok -> AkwabaIA-pub-CV-9x16.mp4"

# Déclinaison 4:5 (1080x1350) pour les fils Facebook / Instagram / LinkedIn : vidéo centrée sur fond flouté
ffmpeg -y -v error -i AkwabaIA-pub-CV-9x16.mp4 -filter_complex \
  "[0:v]scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350,boxblur=40:2,eq=brightness=-0.12[bg];[0:v]scale=-2:1350[fg];[bg][fg]overlay=(W-w)/2:0" \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -c:a copy -movflags +faststart AkwabaIA-pub-CV-4x5.mp4
echo "ok -> AkwabaIA-pub-CV-4x5.mp4"
