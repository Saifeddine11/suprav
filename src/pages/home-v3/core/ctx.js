/*
 * Contexte commun des pages v3 : chaque minuterie, rAF, observer et écouteur est rattaché à `root`
 * et libéré par dispose() (démontage React, double montage du StrictMode compris).
 */
export default function createCtx(root) {
  let alive = true
  const intervals = [], timeouts = [], rafs = new Set(), observers = [], winListeners = [], disposers = []
  const ac = new AbortController()
  const ctx = {
    root,
    signal: ac.signal,
    R: matchMedia('(prefers-reduced-motion: reduce)').matches,
    clamp: (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)),
    $id: (id) => root.querySelector('#' + id),
    every: (fn, ms) => { const id = setInterval(fn, ms); intervals.push(id); return id },
    later: (fn, ms) => { const id = setTimeout(fn, ms); timeouts.push(id); return id },
    rAF: (fn) => { const id = requestAnimationFrame((t) => { rafs.delete(id); if (alive) fn(t) }); rafs.add(id); return id },
    IO: (cb, opts) => { const o = new IntersectionObserver(cb, opts); observers.push(o); return o },
    RO: (cb) => { const o = new ResizeObserver(cb); observers.push(o); return o },
    onWin: (type, fn, opts) => { window.addEventListener(type, fn, opts); winListeners.push([type, fn, opts]) },
    /* écouteur sur un élément de la page, retiré au démontage */
    on: (el, type, fn, opts) => { if (el) el.addEventListener(type, fn, { ...(typeof opts === 'object' ? opts : { capture: !!opts }), signal: ac.signal }) },
    onDispose: (fn) => { disposers.push(fn) },
    dispose() {
      alive = false
      ac.abort()
      intervals.forEach(clearInterval)
      timeouts.forEach(clearTimeout)
      rafs.forEach(cancelAnimationFrame)
      observers.forEach((o) => o.disconnect())
      winListeners.forEach(([type, fn, opts]) => window.removeEventListener(type, fn, opts))
      disposers.forEach((fn) => fn())
    },
  }
  return ctx
}
