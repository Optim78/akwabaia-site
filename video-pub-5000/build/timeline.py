# Découpe la voix off en segments et les replace sur la timeline vidéo (respirations entre scènes).
import json
d = json.load(open('build/alignment.json')); t = d['text']; a = d['alignment']
s = a['character_start_times_seconds']; e = a['character_end_times_seconds']
# (premier mot du segment, position dans la vidéo en secondes)
SEGMENTS = [("Vos produits", 0.0), ("Moi,", 7.8), ("Boutique", 14.5), ("Script", 18.9), ("Comme cette", 25.2),
            ("Et le prix", 29.0), ("Pas cinquante", 29.9), ("Pas vingt", 31.0), ("Seulement", 32.3), ("Envoyez", 35.8)]
segs = []
for i, (k, at) in enumerate(SEGMENTS):
    a0 = max(0, s[t.find(k)] - 0.04)
    a1 = s[t.find(SEGMENTS[i+1][0])] - 0.04 if i + 1 < len(SEGMENTS) else e[-1] + 0.3
    segs.append({"src0": round(a0, 3), "src1": round(a1, 3), "at": at})
def to_video(x):
    for g in segs:
        if g["src0"] - 0.05 <= x <= g["src1"]: return round(x - g["src0"] + g["at"], 3)
    return None
# mots -> temps vidéo
words, i = [], 0
while i < len(t):
    if t[i].isspace(): i += 1; continue
    j = i
    while j < len(t) and not t[j].isspace(): j += 1
    words.append({"w": t[i:j], "t": to_video(s[i]), "end": to_video(e[j-1])}); i = j
json.dump(segs, open('build/segments.json', 'w'), indent=1)
open('build/timings.js', 'w').write("window.WORDS=" + json.dumps(words, ensure_ascii=False) + ";")
for w in words: print(w["t"], w["w"])
