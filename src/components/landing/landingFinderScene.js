import { gsap, openPanelScene } from './landingMotion.js'

/**
 * Scène du formulaire : ouverture du bloc à l’approche, puis une parallaxe très douce
 * de la lumière orange (GSAP sur l’enveloppe des halos ; leur dérive propre reste en CSS).
 * Grand écran uniquement.
 */
export function finderScene(root, context) {
  openPanelScene(root, context)

  const drift = root.querySelector('.lp-finder__drift')
  if (!context.desktop || !drift) return

  gsap.fromTo(
    drift,
    { yPercent: -4 },
    {
      yPercent: 4,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  )
}
