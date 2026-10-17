/* Menu mobile et liens d'ancre : défilement doux vers une section de la page courante,
   y compris pour les liens « /#section » quand on est déjà sur la page d'accueil. */
export default function initMenu(ctx) {
  const { root, $id, on, R } = ctx
  const mbtn = $id('mbtn'), mnav = $id('mnav')
  let open = false
  const setMenu = (o) => {
    if (!mbtn || !mnav) return
    open = o; mnav.hidden = !o
    mbtn.setAttribute('aria-expanded', String(o)); mbtn.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu')
  }
  on(mbtn, 'click', () => setMenu(!open))
  on(root, 'keydown', (e) => { if (e.key === 'Escape' && open) { setMenu(false); mbtn.focus() } })
  const target = (hash) => { if (!hash || hash.length < 2) return null; try { return root.querySelector('#' + CSS.escape(decodeURIComponent(hash.slice(1)))) } catch { return null } }
  /* logo : sur la page courante, remonte en haut au lieu de recharger */
  root.querySelectorAll('a[data-top]').forEach((a) => on(a, 'click', (e) => {
    if (new URL(a.href).pathname !== location.pathname) return
    e.preventDefault(); setMenu(false)
    window.scrollTo({ top: 0, behavior: R ? 'auto' : 'smooth' })
  }))
  root.querySelectorAll('a[href*="#"]').forEach((a) => on(a, 'click', (e) => {
    const u = new URL(a.getAttribute('href'), location.href)
    if (u.pathname !== location.pathname) return
    const t = target(u.hash); if (!t) return
    e.preventDefault(); setMenu(false)
    t.scrollIntoView({ behavior: R ? 'auto' : 'smooth' })
  }))
  /* arrivée depuis une autre page sur « /#section » */
  const first = target(location.hash)
  if (first) ctx.later(() => first.scrollIntoView({ behavior: 'auto' }), 60)
  return setMenu
}
