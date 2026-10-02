# Vidéo publicitaire : CV, lettre de motivation, LinkedIn et portfolio (AkwabaIA)

Spot de 50 secondes au format vertical 9:16 (1080×1920, 30 i/s), décliné en 4:5 pour les fils d'actualité.
L'histoire suit cet ordre : **problème → solution → services → preuves → témoignages → appel à l'action**.

| Fichier | Rôle |
|---|---|
| `AkwabaIA-pub-CV-9x16.mp4` | Master pour TikTok, Reels, Stories, statut WhatsApp, Facebook et LinkedIn mobile |
| `AkwabaIA-pub-CV-4x5.mp4` | Déclinaison pour les fils Facebook, Instagram et LinkedIn |
| `scenes.html` | Moteur d'animation. Ouvert dans un navigateur, il montre l'aperçu en boucle (`?t=30` pour démarrer à 30 s) |
| `render.mjs` / `mix.sh` | Rendu image par image, puis mixage audio et export |
| `audio/` | Voix off (ElevenLabs, voix française « Nicolas »), musique originale générée et bruitages |

## Script et découpage

| # | Temps | Scène | Voix off | Texte à l'écran et animation |
|---|---|---|---|---|
| 1 | 0–3 s | **Accroche** | « Vous envoyez des dizaines de CV… et personne ne vous rappelle ? » | Une pluie de CV grisés marqués « Envoyé » arrive, avec un compteur « CV envoyés : 0 → 48 ». Une notification « 0 appel · 0 réponse » apparaît en tremblant. Le texte est révélé mot à mot, en rythme avec la voix. |
| 2 | 3–10 s | **Problème** | « Le problème, ce n'est pas vous. C'est la façon dont vous vous présentez. Un recruteur ne passe que quelques secondes sur votre CV. » | Le mot « présentez » est surligné au marqueur jaune. Un chronomètre circulaire se vide puis passe au rouge. Un CV terne reçoit le tampon « IGNORÉ » (impact sonore et secousse). |
| 3 | 10–16 s | **Solution / humanisation** | « Je suis Alassane Coulibaly, d'AkwabaIA. Je transforme votre parcours en une candidature qui donne envie de vous rencontrer. » | Volet jaune. La photo détourée monte devant un disque jaune. Elle passe du plan large au gros plan (2ᵉ plan), avec un lent travelling. Les pastilles CV, Lettre, LinkedIn et Portfolio flottent autour. |
| 4 | 16–24 s | **Services 01 → 04** | « Un CV professionnel, sur mesure. Une lettre de motivation percutante. Un profil LinkedIn optimisé. Et un portfolio professionnel qui vous démarque. » | Volet vert. Quatre cartes glissent l'une après l'autre avec un whoosh, et un indicateur de progression les accompagne. On voit un CV en rotation 3D, une lettre qui « s'écrit » avec une phrase surlignée, un profil LinkedIn « avant / après » et les portfolios sur ordinateur et mobile. |
| 5 | 24–30 s | **Preuves** | « Des CV clairs, modernes, structurés. Des réalisations concrètes. » | Les étiquettes « clairs », « modernes » et « structurés » apparaissent en rythme. Un carrousel 3D (cover-flow) fait défiler 12 vrais modèles de CV, puis un bandeau montre les 5 affiches de portfolios. |
| 6 | 30–38 s | **Témoignages** | « Et ce sont mes clients qui en parlent le mieux : plus d'entretiens en deux mois… qu'en cinq ans. » | Cinq étoiles. Le vrai message client s'affiche dans un smartphone, avec la citation « Plus de réponses d'entretien en **2 mois** qu'en **5 ans** » et le badge « J'ai eu le JOB ! ». Les témoignages 2 et 3 entrent ensuite avec leurs citations. |
| 7 | 38–50 s | **Appel à l'action** | « Votre prochaine opportunité commence maintenant. Écrivez-moi sur WhatsApp, au 07 78 62 74 60. AkwabaIA : Le Bon IT. » | Retour de la photo. Le bouton WhatsApp pulse. Le numéro apparaît par paires, au moment où la voix le dicte. Puis flash, logo, rappel des 4 services et akwabaia.com. L'écran final reste affiché 3 s pour la capture d'écran ou la boucle. |

## Choix de motion design

- **Charte** : les couleurs du site (marine `#0F1B2D`, jaune `#F5A623`, vert `#1FA37A`) et la police Poppins, pour une identité cohérente entre le site et la publicité.
- **Rythme** : il y a un changement visuel toutes les 1 à 2 s. Les textes sont calés au mot près sur la voix, grâce aux horodatages ElevenLabs. Une respiration de 0,4 à 1,5 s sépare les scènes, le temps d'un volet de transition.
- **Transitions** : volets inclinés jaune, vert et blanc, glissements latéraux pour les services, flash blanc sur le logo.
- **Zones de sécurité** : aucun texte important dans les 250 px du bas ni sous les icônes à droite de TikTok et Reels.
- **Son** : la musique baisse automatiquement sous la voix (ducking). Le mix est normalisé à -14 LUFS, le niveau attendu par les plateformes.

## Diffusion

- **Légende suggérée** : « Votre CV vous fait-il perdre des entretiens ? ✍️ CV pro · Lettre de motivation · LinkedIn · Portfolio. 📲 WhatsApp : +225 07 78 62 74 60 #CV #Emploi #Abidjan #LinkedIn #RechercheEmploi »
- **Sous-titres** : le texte clé est déjà incrusté. Pour Facebook et LinkedIn (souvent regardés sans le son), on peut ajouter les sous-titres automatiques de la plateforme.
- **Statut WhatsApp** : il est limité à 60 s, donc la vidéo passe en entier.

## Modifier la vidéo

1. Pour changer un texte, une image ou un timing, modifiez `scenes.html`. Les temps sont calés sur les mots de la voix avec `at('mot')`.
2. Pour changer la voix off, modifiez `audio/voix-off.txt`, régénérez `audio/voix-off.mp3` et `build/alignment.json`, puis lancez `python3 build/timeline.py`.
3. Lancez `node render.mjs` (environ 10 min), puis `bash mix.sh`.

> L'exemple de profil LinkedIn (« Awa Koné ») et le contenu de la lettre de motivation sont des **maquettes illustratives**. Remplacez-les par de vrais exemples clients (avec leur accord) dès que vous les avez. Une deuxième photo personnelle peut aussi remplacer le gros plan de la scène 3 (`#s3photo`).
