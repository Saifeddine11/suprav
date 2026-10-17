/* Petits effets partagés par /agence et /contact (rattachés au ctx de la page, nettoyés au démontage). */

/* Horloges locales : chaque élément [data-tz] affiche l'heure de son fuseau, mise à jour toutes les 20 s. */
export function startClocks(ctx, els) {
  const list = [...els]
  if (!list.length) return
  const fmt = {}
  const tick = () => list.forEach((el) => {
    const tz = el.dataset.tz
    try {
      fmt[tz] = fmt[tz] || new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: tz })
      el.textContent = fmt[tz].format(new Date())
    } catch { el.textContent = '' }
  })
  tick()
  ctx.every(tick, 20000)
}

/* Compteurs : chaque .cnt[data-to] monte de 0 à sa valeur quand le bloc apparaît (virgule décimale respectée). */
export function countUp(ctx, box) {
  if (!box) return
  const nums = [...box.querySelectorAll('.cnt[data-to]')]
  const final = () => nums.forEach((n) => { n.textContent = n.dataset.to })
  if (ctx.R || !('IntersectionObserver' in window)) { final(); return }
  const parse = (s) => ({ v: parseFloat(String(s).replace(',', '.')), d: (String(s).split(',')[1] || '').length })
  nums.forEach((n) => { n.textContent = parse(n.dataset.to).d ? '0,0' : '0' })
  ctx.onDispose(final)
  ctx.IO((es, o) => es.forEach((e) => {
    if (!e.isIntersecting) return
    o.disconnect()
    const t0 = performance.now(), dur = 1400
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), ease = 1 - Math.pow(1 - k, 3)
      nums.forEach((n) => { const { v, d } = parse(n.dataset.to); n.textContent = (v * ease).toFixed(d).replace('.', ',') })
      if (k < 1) ctx.rAF(step); else final()
    }
    ctx.rAF(step)
  }), { threshold: .35 }).observe(box)
}
