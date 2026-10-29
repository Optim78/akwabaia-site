# AkwabaIA Connect — volet « mise en relation IT »

Code source du nouveau volet du site akwabaia.com. 100 % statique (HTML/CSS/JS),
prêt pour GitHub Pages. Aucun serveur, aucune clé secrète dans le code.

## Fichiers

```
connect/
├── index.html          Accueil du volet (hero, 2 portes, comment ça marche, pourquoi)
├── annuaire.html       Annuaire filtrable des prestataires
├── profil.html         Fiche profil d'un prestataire (?id=...)
├── inscription.html    Page prestataire + formulaire Airtable embarqué
├── besoin.html         Page entreprise + formulaire Airtable embarqué
└── assets/
    ├── connect.css     Charte + composants (une seule source de vérité)
    └── connect.js      Menu, bascule FR/EN, rendu annuaire/profil, devises
```

## Intégration à akwabaia.com

1. Copier le dossier `connect/` dans le site (ex. `dist/connect/` du dépôt
   Optim78/akwabaia-site).
2. Le volet est alors accessible sur `https://akwabaia.com/connect/`.
3. Ajouter un lien « Prestations IT » depuis le menu du site principal vers
   `/connect/`.

Les liens internes sont relatifs : le dossier fonctionne tel quel.

## Charte

- Bleu nuit `#0F1B2D` · Jaune `#F5A623` · Vert `#1FA37A`
- Polices Google : Poppins (titres) + Nunito Sans (texte)
- Tout est piloté par les variables CSS en haut de `connect.css`.

## Bilingue FR/EN

La bascule FR/EN de l'en-tête traduit les textes de l'interface (dictionnaire
`I18N` dans `connect.js`). Le choix est mémorisé dans le navigateur. Les
présentations des prestataires existent en FR et EN (`bio_fr` / `bio_en`).

## Tarifs en plusieurs devises

Le profil affiche le tarif en FCFA + une conversion approximative €/$ :
- **Euro : exact** (parité fixe 1 € = 655,957 FCFA).
- **Dollar : approximatif** (`FCFA_PER_USD = 600` dans `connect.js`) — à
  rafraîchir automatiquement plus tard via n8n.

## IMPORTANT — données de l'annuaire (sécurité)

Aujourd'hui, l'annuaire et les profils utilisent des **données d'exemple**
(`SAMPLE_PROVIDERS` dans `connect.js`).

⚠️ Il ne faut **jamais** mettre une clé Airtable dans ce code : elle serait
visible par tout le monde et exposerait les contacts privés des prestataires.

Pour passer en données réelles **en toute sécurité**, on remplacera la seule
fonction `fetchProviders()` par un appel à un **webhook n8n** qui ne renvoie que
les champs publics (nom, compétences, dispos, note — jamais téléphone/email) :

```js
function fetchProviders() {
  return fetch('https://n8n.akwabaia.com/webhook/connect-providers')
    .then(r => r.json());
}
```

Rien d'autre à changer : les cartes et les profils s'afficheront avec les vraies
données. (Étape 3 du projet, à faire plus tard.)

## Formulaires

Les pages `inscription.html` et `besoin.html` intègrent les formulaires Airtable
déjà publiés (via `<iframe>`). Ils fonctionnent dès maintenant, de façon
sécurisée, et écrivent directement dans la base Airtable « AkwabaIA — Vivier
Prestations IT ». Plus tard, on pourra remplacer l'iframe par un formulaire
sur-mesure qui POST vers un webhook n8n.

## Bouton « Contacter via AkwabaIA »

Sur un profil, il pointe vers `besoin.html?presta=<id>` (le prestataire est
transmis en paramètre). Plus tard, n8n créera une ligne « Lead » et t'enverra la
notification WhatsApp + mail.

## À prévoir avant mise en ligne publique

- **Conformité données personnelles (ARTCI)** : déclaration + page de
  confidentialité (collecte de données personnelles en Côte d'Ivoire).
- Remplacer les données d'exemple par le webhook n8n (étape 3).
- Vérifier les liens du menu principal vers `/connect/`.
