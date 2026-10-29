/* ============================================================
   AkwabaIA Connect — logique partagée
   - Menu mobile + bascule FR/EN
   - Rendu de l'annuaire et des profils
   - Conversion de devises (FCFA -> EUR / USD)
   ------------------------------------------------------------
   BRANCHEMENT DES DONNÉES
   Aujourd'hui, l'annuaire utilise des données d'exemple (voir
   SAMPLE_PROVIDERS). Pour les rendre réelles SANS exposer de clé
   Airtable (ce qui révélerait les contacts privés), on remplacera
   la fonction fetchProviders() par un appel à un webhook n8n qui
   ne renvoie QUE les champs publics. Rien d'autre à changer.
   ============================================================ */

(function (global) {
  'use strict';

  /* ---------- Taux de change (approx., à actualiser via n8n) ---------- */
  var EUR_PER_FCFA = 1 / 655.957;   // parité fixe EUR/FCFA = exacte
  var FCFA_PER_USD = 600;           // approx. — à rafraîchir automatiquement plus tard

  function convFCFA(fcfa) {
    var eur = Math.round(fcfa * EUR_PER_FCFA);
    var usd = Math.round(fcfa / FCFA_PER_USD);
    return { eur: eur, usd: usd };
  }
  function fmtFCFA(n) { return n.toLocaleString('fr-FR').replace(/ /g, ' ') + ' FCFA'; }

  /* ---------- Données d'exemple (remplacées par n8n plus tard) ---------- */
  var SAMPLE_PROVIDERS = [
    {
      id: 'aminata-k', name: 'Aminata K.', title: 'Technicienne réseaux & cybersécurité',
      zone: 'Abidjan · Cocody', zoneCat: 'Abidjan',
      skills: ['Réseaux LAN / Wi-Fi', 'Cybersécurité', 'Pare-feu', 'Cloud & sauvegardes', 'Câblage', 'Microsoft 365'],
      rating: 4.9, reviews: 31, available: true, availType: 'Temps plein',
      dispo: 'Disponible dès le 3 nov.', rateFCFA: 15000,
      bio_fr: "Technicienne réseaux depuis 8 ans, j'installe et sécurise les réseaux de PME, cabinets et écoles à Abidjan. Câblage, Wi-Fi, pare-feu, sauvegardes : je m'occupe de tout et j'explique simplement ce que je fais. J'interviens en français ou en anglais.",
      bio_en: "Network technician for 8 years, I install and secure networks for SMEs, offices and schools in Abidjan. Cabling, Wi-Fi, firewalls, backups: I handle everything and explain it simply. I work in French or English.",
      periods: [
        { dates: '3 – 14 nov. 2026', type: 'Temps plein', status: 'Disponible', open: true },
        { dates: '17 nov. – 5 déc. 2026', type: 'Mi-temps · matins', status: 'Disponible', open: true },
        { dates: 'À partir de janv. 2027', type: 'Missions ponctuelles', status: 'Sur demande', open: false }
      ],
      reviewsList: [
        { initials: 'JT', author: 'Jean-Marc T.', meta: 'PME · Plateau · oct. 2026', text: 'Réseau du bureau refait en deux jours, travail propre et explications claires. Je recommande.' },
        { initials: 'SK', author: 'Salimata K.', meta: 'École privée · Cocody · sept. 2026', text: 'Très professionnelle et ponctuelle. Le Wi-Fi fonctionne enfin dans toutes les salles.' },
        { initials: 'DO', author: 'David O.', meta: 'Cabinet comptable · août 2026', text: 'Quick, reliable and happy to work in English. Our backups are now automatic.' }
      ]
    },
    {
      id: 'kouassi-b', name: 'Kouassi B.', title: 'Technicien maintenance & support',
      zone: 'Abidjan · Plateau', zoneCat: 'Abidjan',
      skills: ['Maintenance PC', 'Support utilisateurs', 'Windows', 'Imprimantes'],
      rating: 4.8, reviews: 24, available: false, availType: 'Missions courtes (1-3 j)',
      dispo: 'Dès le 17 nov.', rateFCFA: 12000,
      bio_fr: "Spécialiste maintenance et support de proximité. Je dépanne postes, imprimantes et logiciels pour les entreprises du Plateau. Rapide, fiable, à l'écoute.",
      bio_en: "Maintenance and on-site support specialist. I fix workstations, printers and software for businesses in Plateau. Fast, reliable, attentive.",
      periods: [
        { dates: '17 – 28 nov. 2026', type: 'Missions courtes', status: 'Disponible', open: true },
        { dates: 'Décembre 2026', type: 'Soirs & weekends', status: 'Disponible', open: true }
      ],
      reviewsList: [
        { initials: 'MB', author: 'Mariam B.', meta: 'Boutique · Plateau · oct. 2026', text: 'Intervention rapide, tous nos PC remarchent. Merci !' },
        { initials: 'AC', author: 'Arnaud C.', meta: 'Cabinet · sept. 2026', text: 'Très disponible et efficace sur nos imprimantes réseau.' }
      ]
    },
    {
      id: 'awa-t', name: 'Awa T.', title: 'Spécialiste Microsoft 365 & support',
      zone: 'Abidjan · Marcory', zoneCat: 'Abidjan',
      skills: ['Microsoft 365', 'Support utilisateurs', 'Messagerie', 'Formation'],
      rating: 4.8, reviews: 27, available: true, availType: 'Soirs & weekends',
      dispo: 'Disponible · mi-temps', rateFCFA: 18000,
      bio_fr: "J'accompagne les équipes sur Microsoft 365 : messagerie, Teams, SharePoint, bonnes pratiques. Je forme aussi les utilisateurs pour qu'ils gagnent en autonomie.",
      bio_en: "I support teams on Microsoft 365: email, Teams, SharePoint, best practices. I also train users to become autonomous.",
      periods: [
        { dates: '4 – 29 nov. 2026', type: 'Soirs & weekends', status: 'Disponible', open: true }
      ],
      reviewsList: [
        { initials: 'FG', author: 'Fatou G.', meta: 'ONG · Marcory · oct. 2026', text: 'Migration vers Microsoft 365 sans accroc. Formation très claire.' }
      ]
    },
    {
      id: 'ibrahim-s', name: 'Ibrahim S.', title: 'Technicien vidéosurveillance & câblage',
      zone: 'Abidjan · Yopougon', zoneCat: 'Abidjan',
      skills: ['Vidéosurveillance', 'Câblage', 'Réseaux'],
      rating: 4.7, reviews: 12, available: true, availType: 'Temps plein',
      dispo: 'Disponible', rateFCFA: 20000,
      bio_fr: "Installation de caméras, câblage structuré et petits réseaux. J'équipe commerces et résidences avec du matériel fiable et un suivi après pose.",
      bio_en: "CCTV installation, structured cabling and small networks. I equip shops and homes with reliable gear and after-sales follow-up.",
      periods: [
        { dates: 'Novembre 2026', type: 'Temps plein', status: 'Disponible', open: true }
      ],
      reviewsList: [
        { initials: 'KK', author: 'Koffi K.', meta: 'Commerce · Yopougon · sept. 2026', text: 'Caméras installées proprement, image nette. Bon suivi.' }
      ]
    },
    {
      id: 'yao-a', name: 'Yao A.', title: 'Technicien téléphonie IP & Wi-Fi',
      zone: 'Abidjan · Treichville', zoneCat: 'Abidjan',
      skills: ['Téléphonie IP', 'Réseaux', 'Wi-Fi'],
      rating: 4.6, reviews: 14, available: false, availType: 'Missions courtes (1-3 j)',
      dispo: 'Dès le 2 déc.', rateFCFA: 16000,
      bio_fr: "Mise en place de téléphonie IP et couverture Wi-Fi pour PME. J'optimise votre réseau pour des appels et une connexion stables.",
      bio_en: "VoIP telephony and Wi-Fi coverage for SMEs. I optimise your network for stable calls and connectivity.",
      periods: [
        { dates: 'À partir du 2 déc. 2026', type: 'Missions courtes', status: 'Disponible', open: true }
      ],
      reviewsList: [
        { initials: 'RN', author: 'Rose N.', meta: 'PME · Treichville · août 2026', text: 'Téléphonie IP installée, plus aucune coupure. Très pro.' }
      ]
    },
    {
      id: 'mariam-d', name: 'Mariam D.', title: 'Développeuse web',
      zone: 'Abidjan · Cocody', zoneCat: 'Abidjan',
      skills: ['Développement web', 'WordPress', 'SEO'],
      rating: 5.0, reviews: 9, available: true, availType: 'Missions courtes (1-3 j)',
      dispo: 'Disponible · missions courtes', rateFCFA: 25000,
      bio_fr: "Je crée et dépanne des sites web (WordPress et sur-mesure) pour TPE et indépendants. Sites rapides, soignés et bien référencés.",
      bio_en: "I build and fix websites (WordPress and custom) for small businesses and freelancers. Fast, polished and well-ranked sites.",
      periods: [
        { dates: 'Novembre 2026', type: 'Missions courtes', status: 'Disponible', open: true }
      ],
      reviewsList: [
        { initials: 'BT', author: 'Brou T.', meta: 'Indépendant · Cocody · oct. 2026', text: 'Site livré en une semaine, exactement ce que je voulais. Parfait.' }
      ]
    }
  ];

  /* ---------- Source des données : webhook n8n (repli sur démo) ---------- */
  var PROVIDERS_ENDPOINT = 'https://n8n.akwabaia.com/webhook/connect-providers';

  function fetchProviders() {
    return fetch(PROVIDERS_ENDPOINT)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        var list = Array.isArray(data) ? data : (data && data.providers) || [];
        if (!list.length) throw new Error('vide');
        return list;
      })
      .catch(function (e) {
        // Repli : si le webhook ne répond pas (ou aucun prestataire), on montre la démo
        if (typeof console !== 'undefined') console.warn('Annuaire : repli sur les données de démo —', e.message);
        return SAMPLE_PROVIDERS;
      });
  }

  /* ---------- i18n ---------- */
  var I18N = {
    nav_how: ['Comment ça marche', 'How it works'],
    nav_directory: ['Annuaire', 'Directory'],
    nav_become: ['Devenir prestataire', 'Become a provider'],
    cta_need: ['Exprimer un besoin', 'Post a need'],
    hero_kicker: ['Mise en relation IT · Afrique de l\'Ouest', 'IT matchmaking · West Africa'],
    hero_title_a: ['Le bon technicien IT, en toute', 'The right IT technician, with full'],
    hero_title_b: ['confiance', 'confidence'],
    hero_sub: ['Des prestataires vérifiés et notés par leurs clients. Tous les échanges passent par AkwabaIA : vos coordonnées restent protégées.',
               'Providers verified and rated by their clients. Every exchange goes through AkwabaIA: your contact details stay protected.'],
    door1_tag: ['Prestataire IT', 'IT provider'],
    door1_title: ['Je suis technicien IT', 'I\'m an IT technician'],
    door1_desc: ['Créez votre profil gratuitement et recevez des demandes de missions près de chez vous.',
                 'Create your profile for free and receive assignment requests near you.'],
    door1_b1: ['Inscription gratuite', 'Free registration'],
    door1_b2: ['Votre numéro n\'est jamais affiché', 'Your number is never shown'],
    door1_cta: ['Créer mon profil', 'Create my profile'],
    door2_tag: ['Entreprise · PME', 'Business · SME'],
    door2_title: ['Je cherche un prestataire', 'I\'m looking for a provider'],
    door2_desc: ['Décrivez votre besoin : nous vous mettons en relation avec un professionnel vérifié et disponible.',
                 'Describe your need: we connect you with a verified, available professional.'],
    door2_b1: ['Profils vérifiés et notés', 'Verified and rated profiles'],
    door2_b2: ['Mise en relation par AkwabaIA', 'Connection through AkwabaIA'],
    door2_cta: ['Exprimer un besoin', 'Post a need'],
    door2_link: ['Parcourir l\'annuaire →', 'Browse the directory →'],
    how_title: ['Comment ça marche', 'How it works'],
    how_sub: ['Trois étapes, sans frais pour démarrer.', 'Three steps, free to get started.'],
    how_1_t: ['Décrivez votre besoin', 'Describe your need'],
    how_1_d: ['Un formulaire simple, en 2 minutes. Ou créez votre profil si vous êtes technicien.',
              'A simple 2-minute form. Or create your profile if you\'re a technician.'],
    how_2_t: ['Nous vérifions et sélectionnons', 'We verify and select'],
    how_2_d: ['AkwabaIA contrôle les profils et vous propose des pros disponibles près de chez vous.',
              'AkwabaIA checks profiles and proposes available pros near you.'],
    how_3_t: ['Échangez en toute sécurité', 'Connect securely'],
    how_3_d: ['Le contact passe par AkwabaIA. Personne ne voit vos coordonnées sans votre accord.',
              'Contact goes through AkwabaIA. No one sees your details without your consent.'],
    why_title: ['Pourquoi passer par AkwabaIA', 'Why go through AkwabaIA'],
    why_1_t: ['Contacts protégés', 'Protected contacts'],
    why_1_d: ['Aucun numéro ni email affiché. Les échanges passent par nous.', 'No number or email shown. Exchanges go through us.'],
    why_2_t: ['Profils vérifiés', 'Verified profiles'],
    why_2_d: ['Identité et compétences contrôlées avant toute publication.', 'Identity and skills checked before any listing.'],
    why_3_t: ['Avis fiables', 'Trustworthy reviews'],
    why_3_d: ['Seuls les clients réellement mis en relation peuvent noter.', 'Only genuinely connected clients can leave a review.'],
    why_4_t: ['Bilingue', 'Bilingual'],
    why_4_d: ['Le service et les profils, en français comme en anglais.', 'The service and profiles, in French and English.'],
    dir_title: ['Annuaire des prestataires', 'Provider directory'],
    dir_sub: ['Tous les profils sont vérifiés par AkwabaIA.', 'All profiles are verified by AkwabaIA.'],
    f_skill: ['Compétence', 'Skill'], f_all: ['Toutes', 'All'],
    f_zone: ['Zone', 'Area'], f_all_f: ['Toutes', 'All'],
    f_type: ['Type de dispo', 'Availability'], f_all_types: ['Tous types', 'All types'],
    f_sort: ['Trier', 'Sort'], f_sort_rating: ['Mieux notés', 'Top rated'], f_sort_reviews: ['Plus d\'avis', 'Most reviews'],
    dir_count: ['prestataires vérifiés', 'verified providers'],
    dir_notice: ['Les coordonnées ne sont jamais affichées. Contactez un prestataire via AkwabaIA depuis son profil.',
                 'Contact details are never shown. Contact a provider through AkwabaIA from their profile.'],
    dir_empty: ['Aucun prestataire ne correspond à ces filtres.', 'No provider matches these filters.'],
    card_view: ['Voir le profil', 'View profile'], card_reviews: ['avis', 'reviews'],
    p_back: ['← Retour à l\'annuaire', '← Back to directory'],
    p_verified: ['Profil vérifié', 'Verified profile'],
    p_reviews: ['avis', 'reviews'],
    p_skills: ['Compétences', 'Skills'],
    p_rate_title: ['Tarif & disponibilités', 'Rate & availability'],
    p_from: ['À partir de', 'From'],
    p_per: ['/ intervention', '/ job'],
    p_rate_note: ['Tarif indicatif. Devis précis selon votre mission.', 'Indicative rate. Precise quote based on your mission.'],
    p_about: ['Présentation', 'About'],
    p_reviews_title: ['Avis clients', 'Client reviews'],
    p_contact: ['Contacter via AkwabaIA', 'Contact via AkwabaIA'],
    p_g1: ['Identité et compétences vérifiées', 'Identity and skills verified'],
    p_g2: ['Avis de clients réels', 'Reviews from real clients'],
    p_g3: ['Gratuit et sans engagement', 'Free and no commitment'],
    p_secure_short: ['Contact sécurisé · coordonnées jamais partagées', 'Secure contact · details never shared'],
    p_secure_long: ['Votre demande est transmise par AkwabaIA. Les coordonnées restent protégées.',
                    'Your request is relayed by AkwabaIA. Contact details stay protected.'],
    ins_tag: ['Inscription prestataire', 'Provider registration'],
    ins_title: ['Rejoignez le vivier AkwabaIA Connect', 'Join the AkwabaIA Connect network'],
    ins_sub: ['Créez votre profil gratuitement. Nous le vérifions, puis les entreprises peuvent vous contacter via AkwabaIA.',
              'Create your profile for free. We verify it, then businesses can contact you via AkwabaIA.'],
    ins_s1_t: ['Vous remplissez ce formulaire', 'You fill in this form'], ins_s1_d: ['Environ 5 minutes.', 'About 5 minutes.'],
    ins_s2_t: ['Nous vérifions votre profil', 'We verify your profile'], ins_s2_d: ['Identité et compétences.', 'Identity and skills.'],
    ins_s3_t: ['Vous recevez des demandes', 'You receive requests'], ins_s3_d: ['Transmises par AkwabaIA.', 'Relayed by AkwabaIA.'],
    ins_notice: ['Votre téléphone et votre email ne sont jamais affichés sur votre profil.',
                 'Your phone and email are never shown on your profile.'],
    bes_tag: ['Entreprise · PME', 'Business · SME'],
    bes_title: ['Exprimez votre besoin IT', 'Describe your IT need'],
    bes_sub: ['Décrivez la mission en 2 minutes. AkwabaIA vous propose des prestataires vérifiés et disponibles.',
              'Describe the mission in 2 minutes. AkwabaIA proposes verified, available providers.'],
    bes_b1: ['Gratuit et sans engagement', 'Free and no commitment'],
    bes_b2: ['Uniquement des profils vérifiés', 'Only verified profiles'],
    bes_b3: ['Accompagnement en français ou en anglais', 'Support in French or English'],
    bes_notice: ['Vos coordonnées servent uniquement à AkwabaIA pour vous recontacter.',
                 'Your details are used only by AkwabaIA to get back to you.']
  };

  function getLang() {
    try { return localStorage.getItem('akwaba_lang') || 'fr'; } catch (e) { return 'fr'; }
  }
  function setLang(l) {
    try { localStorage.setItem('akwaba_lang', l); } catch (e) {}
    applyLang(l);
  }
  function t(key) {
    var e = I18N[key]; if (!e) return key;
    return getLang() === 'en' ? e[1] : e[0];
  }
  function applyLang(l) {
    document.documentElement.lang = l;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (I18N[k]) el.textContent = (l === 'en' ? I18N[k][1] : I18N[k][0]);
    });
    document.querySelectorAll('#langToggle button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === l);
    });
    // Re-render dynamic content if present
    if (global.__rerender) global.__rerender();
  }

  /* ---------- Header (menu + langue) ---------- */
  function initHeader() {
    var burger = document.getElementById('burger');
    var nav = document.getElementById('mainNav');
    if (burger && nav) burger.addEventListener('click', function () { nav.classList.toggle('open'); });
    var toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
      });
    }
    applyLang(getLang());
  }

  /* ---------- Rendu : carte annuaire ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]); }); }

  function providerCard(p) {
    var hasRating = (typeof p.rating === 'number' && p.rating > 0);
    var ratingHtml = hasRating
      ? '<span class="stars">★★★★★</span><b style="color:var(--navy)">' + p.rating.toFixed(1).replace('.', ',') + '</b><span style="color:var(--muted)">(' + p.reviews + ' ' + t('card_reviews') + ')</span>'
      : '<span style="color:var(--muted)">' + (getLang() === 'en' ? 'New profile' : 'Nouveau profil') + '</span>';
    var skillTags = p.skills.slice(0, 3).map(function (s) { return '<span class="tag">' + esc(s) + '</span>'; }).join('');
    var dispoPill = p.available
      ? '<span class="pill pill-green"><span class="dot"></span>' + esc(p.dispo) + '</span>'
      : '<span class="pill pill-amber"><span class="dot"></span>' + esc(p.dispo) + '</span>';
    return '' +
      '<a href="profil.html?id=' + encodeURIComponent(p.id) + '" style="background:#fff;border:1px solid var(--line);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:14px;text-decoration:none;color:inherit;box-shadow:0 1px 2px rgba(15,27,45,.04)">' +
        '<div style="display:flex;gap:14px;align-items:flex-start">' +
          '<div style="width:68px;height:68px;flex:none;border-radius:14px;background:repeating-linear-gradient(135deg,#DDE3EA 0 6px,#E9EDF2 6px 12px)"></div>' +
          '<div style="min-width:0;display:flex;flex-direction:column;gap:6px">' +
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
              '<span style="font-family:var(--font-title);font-weight:600;font-size:17px;color:var(--navy)">' + esc(p.name) + '</span>' +
              '<span class="badge badge-verified"><span class="check">✓</span>' + (getLang()==='en'?'Verified':'Vérifié') + '</span>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:6px;font-size:14px">' + ratingHtml + '</div>' +
            '<div style="font-size:14px;color:var(--muted)">' + esc(p.zone) + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' + skillTags + '</div>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid var(--fill);padding-top:12px;flex-wrap:wrap">' +
          dispoPill +
          '<span class="btn btn-outline" style="min-height:44px;padding:0 16px;font-size:14px">' + t('card_view') + '</span>' +
        '</div>' +
      '</a>';
  }

  function initDirectory() {
    initHeader();
    var grid = document.getElementById('grid');
    var countEl = document.getElementById('count');
    var emptyEl = document.getElementById('empty');
    var fSkill = document.getElementById('fSkill'),
        fZone = document.getElementById('fZone'),
        fType = document.getElementById('fType'),
        fSort = document.getElementById('fSort');

    fetchProviders().then(function (all) {
      function render() {
        var skill = fSkill.value, zone = fZone.value, type = fType.value, sort = fSort.value;
        var list = all.filter(function (p) {
          if (skill && p.skills.indexOf(skill) === -1 && !p.skills.some(function(s){return s.indexOf(skill)>-1;})) return false;
          if (zone && p.zoneCat !== zone) return false;
          if (type && p.availType !== type) return false;
          return true;
        });
        list.sort(function (a, b) { return sort === 'reviews' ? b.reviews - a.reviews : b.rating - a.rating; });
        grid.innerHTML = list.map(providerCard).join('');
        countEl.textContent = list.length;
        emptyEl.style.display = list.length ? 'none' : 'block';
      }
      [fSkill, fZone, fType, fSort].forEach(function (el) { el.addEventListener('change', render); });
      global.__rerender = render;
      render();
    });
  }

  /* ---------- Rendu : page profil ---------- */
  function initProfile() {
    initHeader();
    var id = new URLSearchParams(location.search).get('id');
    fetchProviders().then(function (all) {
      var p = all.filter(function (x) { return x.id === id; })[0] || all[0];
      global.__rerender = function () { paintProfile(p); };
      paintProfile(p);
    });
  }

  function paintProfile(p) {
    var en = getLang() === 'en';
    var hasRating = (typeof p.rating === 'number' && p.rating > 0);
    var ratingStr = hasRating ? p.rating.toFixed(1).replace('.', ',') : '—';
    var hasRate = (typeof p.rateFCFA === 'number' && p.rateFCFA > 0);
    var rateMain = hasRate ? fmtFCFA(p.rateFCFA) : (en ? 'On request' : 'Sur demande');
    var convStr = '';
    if (hasRate) {
      var conv = convFCFA(p.rateFCFA);
      convStr = '≈ ' + conv.eur + ' € · ≈ ' + conv.usd + ' $ (approx.)';
    }

    function set(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; }
    set('pName', p.name);
    set('pTitle', p.title);
    set('pRating', ratingStr); set('pRating2', ratingStr);
    set('pReviews', hasRating ? p.reviews : 0); set('pReviews2', hasRating ? p.reviews : 0);
    set('pZone', p.zone);
    set('pRate', rateMain); set('pRateAside', rateMain);
    set('pRateConv', convStr);
    set('pBio', (en ? p.bio_en : p.bio_fr) || (en ? 'No description yet.' : 'Pas encore de présentation.'));
    document.getElementById('pLangTag').textContent = en ? 'EN' : 'FR';
    set('pDispoAside', p.dispo);
    set('pSecure', t('p_secure_long'));
    document.title = p.name + ' — AkwabaIA Connect';

    // Pills haut
    document.getElementById('pTopPills').innerHTML =
      '<span class="pill pill-green"><span class="dot"></span>' + esc(p.dispo) + '</span>' +
      '<span class="pill pill-gray">' + (en ? 'Covers Greater Abidjan' : 'Se déplace dans le Grand Abidjan') + '</span>';

    // Compétences
    document.getElementById('pSkills').innerHTML = p.skills.map(function (s) {
      return '<span class="tag" style="font-size:14px;padding:9px 12px">' + esc(s) + '</span>';
    }).join('');

    // Périodes
    var periods = p.periods || [];
    document.getElementById('pPeriods').innerHTML = periods.length ? periods.map(function (pr) {
      var badge = pr.open
        ? '<span class="pill pill-green"><span class="dot"></span>' + esc(pr.status) + '</span>'
        : '<span class="pill pill-gray">' + esc(pr.status) + '</span>';
      return '<div style="display:flex;flex-wrap:wrap;gap:6px 16px;justify-content:space-between;align-items:center;padding:14px 0;border-top:1px solid var(--fill)">' +
        '<div style="display:flex;flex-direction:column;gap:3px"><span style="font-family:var(--font-title);font-weight:600;font-size:16px;color:var(--navy)">' + esc(pr.dates) + '</span><span style="font-size:14px;color:var(--muted)">' + esc(pr.type) + '</span></div>' +
        badge + '</div>';
    }).join('') : '<p style="margin:0;color:var(--muted);font-size:15px">' + (en ? 'Contact via AkwabaIA for availability.' : 'Contactez via AkwabaIA pour connaître les disponibilités.') + '</p>';

    // Avis
    var reviewsList = p.reviewsList || [];
    document.getElementById('pReviewList').innerHTML = reviewsList.length ? reviewsList.map(function (r) {
      return '<div style="padding:16px 0;border-top:1px solid var(--fill);display:flex;gap:12px">' +
        '<span style="width:40px;height:40px;flex:none;border-radius:50%;background:var(--fill-blue);color:var(--navy);font-family:var(--font-title);font-weight:600;font-size:14px;line-height:40px;text-align:center">' + esc(r.initials) + '</span>' +
        '<div style="min-width:0;display:flex;flex-direction:column;gap:4px">' +
          '<div style="display:flex;flex-wrap:wrap;gap:4px 10px;align-items:baseline"><b style="font-size:15px;color:var(--navy)">' + esc(r.author) + '</b><span style="font-size:13px;color:var(--muted)">' + esc(r.meta) + '</span></div>' +
          '<span class="stars" style="font-size:14px">★★★★★</span>' +
          '<p style="margin:2px 0 0;font-size:15px;line-height:1.55;color:var(--ink)">' + esc(r.text) + '</p>' +
        '</div></div>';
    }).join('') : '<p style="margin:8px 0 0;color:var(--muted);font-size:15px">' + (en ? 'No reviews yet.' : 'Pas encore d\'avis.') + '</p>';

    // Boutons contact -> page besoin, en passant le prestataire (futur lead)
    var href = 'besoin.html?presta=' + encodeURIComponent(p.id);
    var ca = document.getElementById('pContactAside'); if (ca) ca.href = href;
    var cm = document.getElementById('pContactMobile'); if (cm) cm.href = href;

    // Aside visible seulement sur desktop
    var aside = document.getElementById('pAside');
    var mobileBar = document.getElementById('pMobileBar');
    function responsive() {
      var desk = window.innerWidth >= 860;
      if (aside) aside.style.display = desk ? 'flex' : 'none';
      if (mobileBar) mobileBar.style.display = desk ? 'none' : 'flex';
    }
    responsive();
    window.addEventListener('resize', responsive);
  }

  /* ---------- Init auto pour les pages simples (accueil, formulaires) ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    // Les pages annuaire/profil appellent leur init dédié ; les autres n'ont que le header.
    if (!document.getElementById('grid') && !document.getElementById('pName')) initHeader();
  });

  global.AkwabaConnect = { initDirectory: initDirectory, initProfile: initProfile, setLang: setLang };

})(window);
