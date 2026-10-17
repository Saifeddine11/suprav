/* Apparitions au défilement ([data-r], traits [data-sw]), icônes qui se dessinent (.li) et listes cochées (.checks). */
export default function initReveals(ctx) {
  const { root, IO, on, R } = ctx
  /* reveals, swashes, case cards */
  const io = 'IntersectionObserver' in window ? IO(es => es.forEach(e => {
    if (!e.isIntersecting) return; const t = e.target; t.classList.add('in');
    t.querySelectorAll('[data-sw]').forEach(s => s.classList.add('on')); if (t.matches('[data-sw]')) t.classList.add('on');
    io.unobserve(t);
  }), { rootMargin: '0px 0px -10% 0px' }) : null;
  root.querySelectorAll('[data-r]').forEach(el => {
    if (R || !io) { el.querySelectorAll('[data-sw]').forEach(s => s.classList.add('on')); return; }
    if (el.getBoundingClientRect().top > innerHeight * .9) { el.style.transitionDelay = (+el.dataset.r || 0) + 'ms'; el.classList.add('pre'); }
    io.observe(el);
  });
  root.querySelectorAll('.case .card').forEach(el => { if (R || !io) el.classList.add('in'); else io.observe(el); });

  /* icons: draw on sight, replay on hover; check lists pop */
  const drawIO = 'IntersectionObserver' in window && !R ? IO(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('dr'); drawIO.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' }) : null;
  const watchIcons = root => root.querySelectorAll('.li').forEach((s, i) => { s.style.setProperty('--ld', (i % 4) * 90 + 'ms'); if (drawIO) drawIO.observe(s); else s.classList.add('dr'); });
  watchIcons(root);
  root.querySelectorAll('.bc,.scd,.pt,.row,.stp,[data-hov]').forEach(c => on(c, 'pointerenter', () => c.querySelectorAll('.li').forEach(s => { s.classList.remove('dr'); void s.getBoundingClientRect(); s.style.setProperty('--ld', '0ms'); s.classList.add('dr'); })));
  root.querySelectorAll('.checks').forEach(l => { [...l.children].forEach((li, i) => li.style.setProperty('--i', i)); if (drawIO) IO((es, o) => es.forEach(e => { if (e.isIntersecting) { l.classList.add('go'); o.disconnect(); } }), { threshold: .4 }).observe(l); else l.classList.add('go'); });
}
