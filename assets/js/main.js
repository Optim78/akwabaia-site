/* =========================================================
   AkwabaIA - Le Bon IT · Script principal (sans dépendance)
   ========================================================= */

/* ---------- CONFIGURATION ----------
   Adresse du webhook n8n qui reçoit les formulaires (devis + contact).
   À remplacer par l'URL de production du workflow n8n.
   Tant qu'elle est vide, les formulaires basculent sur WhatsApp. */
const CONFIG = {
  N8N_WEBHOOK_URL: '',                 // ex. 'https://akwabaia.duckdns.org/webhook/site-akwabaia'
  WHATSAPP_NUMBER: '2250778627460'
};

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initCurrency();
  initFilters();
  initCarousels();
  document.querySelectorAll('form[data-form]').forEach(initForm);
});

/* ---------- Menu mobile ---------- */
function initMenu() {
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
}

/* ---------- Sélecteur de devise FCFA / $ ----------
   Chaque prix porte data-fcfa et data-usd. Le choix est mémorisé. */
function initCurrency() {
  const buttons = document.querySelectorAll('[data-currency]');
  if (!buttons.length) return;
  let current = 'fcfa';
  try { current = localStorage.getItem('akw-currency') || 'fcfa'; } catch (e) { /* stockage indisponible */ }

  const apply = (cur) => {
    document.querySelectorAll('.price[data-fcfa]').forEach((el) => {
      el.textContent = cur === 'usd' ? el.dataset.usd : el.dataset.fcfa;
    });
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.currency === cur)));
    try { localStorage.setItem('akw-currency', cur); } catch (e) { /* ignoré */ }
  };
  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.currency)));
  apply(current);
}

/* ---------- Filtres de la page Réalisations ---------- */
function initFilters() {
  const filters = document.querySelectorAll('.filter');
  if (!filters.length) return;
  filters.forEach((btn) => btn.addEventListener('click', () => {
    const target = btn.dataset.filter;
    filters.forEach((f) => f.setAttribute('aria-pressed', String(f === btn)));
    document.querySelectorAll('.work-group').forEach((g) => {
      g.hidden = target !== 'tout' && g.dataset.group !== target;
    });
  }));
}

/* ---------- Formulaires (devis, contact) ----------
   1. Validation des champs obligatoires
   2. Envoi au webhook n8n (JSON)
   3. En cas d'échec ou sans webhook : ouverture de WhatsApp avec le message prérempli */
function initForm(form) {
  const status = form.querySelector('.form-status');

  // Efface l'erreur dès que l'utilisateur corrige le champ
  form.addEventListener('input', (e) => {
    const field = e.target.closest('.field');
    if (field) field.classList.remove('has-error');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.querySelector('.hp input')?.value) return; // robot détecté

    // Validation
    let firstError = null;
    form.querySelectorAll('[required]').forEach((input) => {
      const ok = input.type === 'email' ? /^\S+@\S+\.\S+$/.test(input.value.trim()) : input.value.trim() !== '';
      const field = input.closest('.field');
      if (!ok && field) { field.classList.add('has-error'); firstError = firstError || input; }
    });
    // Email facultatif mais vérifié s'il est rempli
    const email = form.querySelector('input[type="email"]:not([required])');
    if (email && email.value.trim() && !/^\S+@\S+\.\S+$/.test(email.value.trim())) {
      email.closest('.field').classList.add('has-error'); firstError = firstError || email;
    }
    if (firstError) { firstError.focus(); return; }

    // Données du formulaire
    const data = Object.fromEntries(new FormData(form).entries());
    delete data.website;
    data.formulaire = form.dataset.form;
    data.page = location.pathname;
    data.date = new Date().toISOString();

    const button = form.querySelector('button[type="submit"]');
    const label = button.innerHTML;
    button.disabled = true;
    button.textContent = 'Envoi en cours…';

    let sent = false;
    if (CONFIG.N8N_WEBHOOK_URL) {
      try {
        const res = await fetch(CONFIG.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        sent = res.ok;
      } catch (err) { sent = false; }
    }

    button.disabled = false;
    button.innerHTML = label;

    if (sent) {
      status.className = 'form-status ok';
      status.textContent = 'Merci ! Votre demande est bien envoyée. Réponse sous 24 h sur WhatsApp.';
      form.reset();
    } else {
      // Solution de secours : message WhatsApp prérempli
      status.className = 'form-status ok';
      status.textContent = 'Nous ouvrons WhatsApp avec votre demande préremplie : il ne vous reste qu\'à l\'envoyer.';
      const lines = Object.entries(data)
        .filter(([k, v]) => v && !['page', 'date', 'formulaire'].includes(k))
        .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)} : ${v}`);
      const text = `Bonjour AkwabaIA, voici ma demande (${data.formulaire}) :\n${lines.join('\n')}`;
      window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    }
    status.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/* ---------- Carrousels de captures ----------
   Boutons précédent / suivant + défilement automatique toutes les 4 s
   (mis en pause au survol, désactivé si l'utilisateur limite les animations). */
function initCarousels() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.carousel').forEach((c) => {
    const track = c.querySelector('.carousel__track');
    const go = (dir) => {
      const w = track.clientWidth;
      const atEnd = track.scrollLeft + w >= track.scrollWidth - 5;
      const atStart = track.scrollLeft <= 5;
      if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
      else if (dir < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      else track.scrollBy({ left: dir * w, behavior: 'smooth' });
    };
    c.querySelector('.prev').addEventListener('click', () => go(-1));
    c.querySelector('.next').addEventListener('click', () => go(1));
    if (reduce) return;
    let timer = setInterval(() => go(1), 4000);
    c.addEventListener('mouseenter', () => clearInterval(timer));
    c.addEventListener('mouseleave', () => { timer = setInterval(() => go(1), 4000); });
  });
}
