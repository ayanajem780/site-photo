// ===== GALERIE D'ALBUMS EN VOLETS =====
// Ordinateur : survoler un volet l'ouvre, cliquer ouvre l'album.
// Téléphone : 1er toucher ouvre le volet, 2e toucher ouvre l'album.
document.querySelectorAll('[data-galerie]').forEach(function (galerie) {
  const volets = [...galerie.querySelectorAll('.volet')];
  const n = volets.length;
  galerie.style.setProperty('--grow', n <= 4 ? 8 : n <= 6 ? 9 : 12);
  const survol = window.matchMedia('(hover: hover) and (pointer: fine)');
  function ouvrir(v) {
    volets.forEach(x => x.classList.toggle('actif', x === v));
  }
  if (!volets.some(v => v.classList.contains('actif'))) ouvrir(volets[0]);
  volets.forEach(function (v) {
    v.addEventListener('mouseenter', () => { if (survol.matches) ouvrir(v); });
    // Clavier (touche Tab) : ouvre le volet sélectionné
    v.addEventListener('focus', () => { if (v.matches(':focus-visible')) ouvrir(v); });
    v.addEventListener('click', function (e) {
      if (!v.classList.contains('actif')) { e.preventDefault(); ouvrir(v); }
    });
  });
});

// ===== UN SEUL ALBUM À LA FOIS (pages Airbnb, Portraits, Produits) =====
// Plus de défilement à travers tous les albums : on garde seulement le menu
// (boutons Connect, Dalila…). Cliquer un bouton ou un volet affiche cet album.
(function () {
  const lieux = [...document.querySelectorAll('.lieu')];
  if (lieux.length < 2 || !document.querySelector('.lieu-choix')) return;
  document.body.classList.add('un-album');
  const volets = [...document.querySelectorAll('.galerie .volet')];

  function afficher(id, allerAuMenu) {
    const cible = lieux.find(l => l.id === id) || lieux[0];
    lieux.forEach(l => { l.hidden = l !== cible; });
    document.querySelectorAll('.lieu-choix a, .nav-lieux a').forEach(a =>
      a.classList.toggle('actif', a.getAttribute('href') === '#' + cible.id));
    volets.forEach(v => v.classList.toggle('actif', v.getAttribute('href') === '#' + cible.id));
    if (allerAuMenu) cible.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (cible.getBoundingClientRect().top < 0) cible.scrollIntoView({ block: 'start' });
    history.replaceState(null, '', '#' + cible.id);
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;            // 1er toucher sur un volet : il s'ouvre seulement
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!lieux.some(l => l.id === id)) return;
    e.preventDefault();
    afficher(id, a.classList.contains('volet'));
  });

  // Visionneuse : flèches ← → limitées aux photos de l'album affiché
  if (typeof montrer === 'function' && typeof vignettes !== 'undefined') {
    const montrerOrigine = montrer;
    window.montrer = function (i) {
      const n = vignettes.length, sens = i < actuel ? -1 : 1;
      let j = (i + n) % n, essais = 0;
      while (vignettes[j].closest('.lieu').hidden && essais++ < n) j = (j + sens + n) % n;
      montrerOrigine(j);
    };
  }

  afficher(location.hash.slice(1), false);
})();
