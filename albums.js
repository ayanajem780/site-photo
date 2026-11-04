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
