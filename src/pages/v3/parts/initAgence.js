/*
 * Comportements de /agence : manifeste qui s'allume mot à mot,
 * repères qui comptent, heures locales des villes, lien liste ↔ carte, halo sous le pointeur des pôles.
 */
import { startClocks, countUp } from './v3fx.js'

export default function initAgence(ctx) {
  const { root, $id, on, IO, rAF, onWin, R, clamp } = ctx

  /* manifeste : les mots s'allument au défilement */
  const say = $id('agsay')
  const words = say ? [...say.querySelectorAll('.wd')] : []
  let queued = false
  const frame = () => {
    queued = false
    const vh = innerHeight
    if (words.length) {
      const r = say.getBoundingClientRect()
      const p = R ? 1 : clamp((vh * .82 - r.top) / (r.height + vh * .3))
      const n = Math.round(p * words.length)
      words.forEach((w, i) => w.classList.toggle('on', i < n))
    }
  }
  const ask = () => { if (!queued) { queued = true; rAF(frame) } }
  onWin('scroll', ask, { passive: true }); onWin('resize', ask)
  frame()

  countUp(ctx, $id('agkpi'))
  startClocks(ctx, root.querySelectorAll('[data-tz]'))

  /* survol d'une ville dans la liste : son point s'allume sur la carte */
  const map = $id('agmap')
  root.querySelectorAll('#agcities li[data-c]').forEach((li) => {
    const pin = map && map.querySelector(`[data-c="${li.dataset.c}"]`)
    const set = (v) => { li.classList.toggle('hl', v); if (pin) pin.classList.toggle('hl', v) }
    on(li, 'pointerenter', () => set(true)); on(li, 'pointerleave', () => set(false))
    on(li, 'focus', () => set(true)); on(li, 'blur', () => set(false))
  })

  /* halo orange qui suit le pointeur sur les cartes des pôles */
  root.querySelectorAll('.ag-pole').forEach((c) => on(c, 'pointermove', (e) => {
    const r = c.getBoundingClientRect()
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px')
  }))

  if (!('IntersectionObserver' in window)) return
  /* cartes membres : apparition en cascade */
  root.querySelectorAll('.ag-mems').forEach((ul) => {
    [...ul.children].forEach((li, i) => li.style.setProperty('--i', i))
    IO((es, o) => es.forEach((e) => { if (e.isIntersecting) { ul.classList.add('go'); o.disconnect() } }), { threshold: .2 }).observe(ul)
  })
}
