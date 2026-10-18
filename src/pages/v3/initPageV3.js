/*
 * Comportements communs des pages intérieures v3 : menu, voiles WebGL du haut de page,
 * apparitions, quiz de contact et barre de contact. `extra(ctx)` branche ceux propres à la page.
 */
import createCtx from '../home-v3/core/ctx.js'
import initMenu from '../home-v3/core/menu.js'
import initVeil from '../home-v3/core/veil.js'
import initReveals from '../home-v3/core/reveals.js'
import initQuiz from '../home-v3/core/quiz.js'
import initDock from '../home-v3/core/dock.js'

export default function initPageV3(root, extra) {
  if (!root) return () => {}
  const ctx = createCtx(root)
  const { $id, later, R } = ctx
  if (!R) root.classList.add('anim')

  initMenu(ctx)
  const hero = root.querySelector('.phero')
  initVeil(ctx, $id('mesh'), hero)
  /* trait et surligneur du titre, après l'entrée du texte */
  if (hero) later(() => hero.querySelectorAll('.sw, .mk').forEach((el) => el.classList.add('on')), R ? 0 : 750)
  initReveals(ctx)
  initQuiz(ctx)
  initDock(ctx)
  let cleanup
  if (extra) cleanup = extra(ctx)

  return () => {
    if (typeof cleanup === 'function') cleanup()
    ctx.dispose()
    root.classList.remove('anim')
  }
}
