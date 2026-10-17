/* Barre de contact en bas d'écran : visible une fois le haut de page passé, masquée près du contact final. */
export default function initDock(ctx) {
  const { root, $id, rAF, onWin } = ctx
  const dock = $id('dock'); if (!dock) return
  const hero = root.querySelector('.vhero, .phero'), fin = $id('contact')
  let queued = false
  const upd = () => {
    queued = false
    const vh = innerHeight, hb = hero ? hero.getBoundingClientRect().bottom : -1, ft = fin ? fin.getBoundingClientRect().top : Infinity
    dock.classList.toggle('show', hb < vh * .35 && ft > vh * .7)
  }
  const ask = () => { if (!queued) { queued = true; rAF(upd) } }
  onWin('scroll', ask, { passive: true }); onWin('resize', ask)
  upd()
}
