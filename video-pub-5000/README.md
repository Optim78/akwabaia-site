# Vidéo publicitaire « Votre pub vidéo professionnelle à 5 000 FCFA » (AkwabaIA)

Spot de 46 secondes au format vertical 9:16 (1080×1920, 30 i/s), décliné en 4:5 pour les fils d'actualité.
L'histoire suit cet ordre : **problème → transformation → pour qui → ce qui est inclus → preuve → prix → appel à l'action**.

| Fichier | Rôle |
|---|---|
| `AkwabaIA-pub-video-5000F-9x16.mp4` | Master pour TikTok, Reels, Stories, statut WhatsApp, Facebook et LinkedIn mobile |
| `AkwabaIA-pub-video-5000F-4x5.mp4` | Déclinaison pour les fils Facebook, Instagram et LinkedIn |
| `scenes.html` | Moteur d'animation. Ouvert dans un navigateur, il montre l'aperçu en boucle (`?t=29` pour aller au prix) |
| `render.mjs` / `mix.sh` | Rendu image par image, puis mixage audio et export |
| `img/` | Visuels produits (générés avec Canva) et extrait de la pub CV utilisé comme preuve |
| `audio/` | Voix off (ElevenLabs « Nicolas »), musique afro / amapiano générée et bruitages |

## Script et découpage

| # | Temps | Scène | Voix off | Écran et animation |
|---|---|---|---|---|
| 1 | 0–3 s | **Accroche** | « Vos produits sont top… mais personne ne les voit ? » | Un téléphone affiche un fil d'actualité. Le produit passe en défilement rapide et flou, avec « 2 ♡ · 0 commentaire ». Une icône « œil barré » rouge apparaît. |
| 2 | 3–7 s | **Problème** | « Une simple photo, sans effet… et vos clients font défiler, sans s'arrêter. » | Une photo terne et grisée affiche « 2 ♡ · 0 commande ». Un doigt fait défiler l'écran et la photo s'envole hors champ. |
| 3 | 8–14 s | **Transformation** | « Moi, je transforme vos produits en vidéos publicitaires professionnelles, qui arrêtent le regard… et qui font vendre. » | **AVANT / APRÈS** : un balayage lumineux révèle la version pub du produit, avec couleurs vives, nom du plat, prix « 2 500 F » qui pulse et bouton « Commandez maintenant ». Les notifications « Nouvelle commande ! », « Je veux ça ! » et « Partagée 12 fois » s'affichent. |
| 4 | 14–19 s | **Pour tous** | « Boutique, restaurant, cosmétiques, mode, services : tous les business y ont droit. » | Cinq tuiles apparaissent au rythme des mots (baskets, plat, cosmétiques, mode wax, services), puis le tampon « TOUS LES BUSINESS ». |
| 5 | 19–25 s | **Inclus** | « Script accrocheur, voix off pro, musique, animations, et le format parfait pour TikTok, Facebook, Instagram et WhatsApp. » | La liste de 4 éléments s'affiche, avec un cadre 9:16 et les pastilles des 4 plateformes. |
| 6 | 25–29 s | **Preuve** | « Comme cette vidéo, réalisée par AkwabaIA. » | Un vrai extrait de la pub « CV pro » est lu dans un téléphone. |
| 7 | 29–36 s | **Prix** | « Et le prix ? Pas cinquante mille. Pas vingt mille… Seulement cinq mille francs CFA ! » | Fond noir et « ? » qui tremble. « 50 000 F » puis « 20 000 F » sont barrés en rouge (son de scratch). Après une montée de tension, l'étoile jaune s'affiche avec **5 000 FCFA**, un flash, une secousse, des confettis et le son « cha-ching ». |
| 8 | 36–46 s | **Appel à l'action** | « Envoyez-moi vos photos sur WhatsApp, au 07 78 62 74 60. Je m'occupe du reste. AkwabaIA : Le Bon IT. » | Ta photo, le badge « 5 000 FCFA », le bouton WhatsApp qui pulse, le numéro qui s'affiche au rythme de la voix, puis le logo, les plateformes et akwabaia.com. |

## Points à vérifier avant diffusion

- **Exemple « Chez Tantie Awa — 2 500 F »** et notifications « Nouvelle commande ! », « Partagée 12 fois » : c'est une démonstration illustrative, pas un vrai client. Remplace-la par une vraie réalisation dès que tu en as une.
- **« Pas 50 000, pas 20 000 »** : c'est une accroche de comparaison avec ce que coûte une pub ailleurs, pas un ancien prix barré. Si la plateforme publicitaire (Facebook Ads) refuse ce type de mention, supprime ces deux lignes.
- **Visuels produits** : ce sont des images générées avec Canva (le réseau ne permettait de récupérer que de petites versions). Elles restent nettes à la taille affichée, mais pour une version encore plus fine, remplace-les par les photos d'un vrai client dans `img/`.

## Légende suggérée

« 🎬 Votre business mérite d'être vu ! Vidéo publicitaire PRO pour vos produits : script, voix off, musique, animations. Seulement 5 000 FCFA 🔥 Envoyez vos photos sur WhatsApp : +225 07 78 62 74 60 #Abidjan #Pub #Business #Marketing #CôteDIvoire »

## Modifier

1. Pour changer un texte ou un visuel, modifiez `scenes.html`. Les temps sont calés sur les mots de la voix avec `at('mot')`.
2. Pour changer la voix off, modifiez `audio/voix-off.txt`, régénérez la voix et l'alignement, puis lancez `python3 build/timeline.py`.
3. Lancez `node render.mjs` (environ 10 min), puis `bash mix.sh`.
