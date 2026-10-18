/* Comportements de /contact : heure du studio, boutons « Copier ». */
import { startClocks } from './v3fx.js'

export default function initContact(ctx) {
  const { root, on, later } = ctx
  startClocks(ctx, root.querySelectorAll('[data-tz]'))

  root.querySelectorAll('.ct-copy[data-copy]').forEach((b) => on(b, 'click', async () => {
    const txt = b.dataset.copy, lab = b.querySelector('span')
    let ok = false
    try { await navigator.clipboard.writeText(txt); ok = true } catch {
      const ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select()
      try { ok = document.execCommand('copy') } catch { ok = false }
      ta.remove()
    }
    b.classList.toggle('ok', ok)
    if (lab) lab.textContent = ok ? 'Copié' : 'Sélectionnez le texte'
    later(() => { b.classList.remove('ok'); if (lab) lab.textContent = 'Copier' }, 2200)
  }))
}
