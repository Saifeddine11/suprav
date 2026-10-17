import { createContext, useContext, useLayoutEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EASING } from '../../animationConstants.js'

gsap.registerPlugin(ScrollTrigger)
/* Sur mobile, la barre d'adresse qui se replie ne doit pas relancer les mesures en plein scroll. */
ScrollTrigger.config({ ignoreMobileResize: true })

/* Framer Motion — la courbe du site, lente et sans rebond */
export const EASE = EASING
export const DURATION = { fast: 0.45, base: 0.9, slow: 1.2 }

/**
 * Répartition des rôles :
 * - Framer Motion : révélations de texte, grille de projets, formulaire, accordéon, micro-interactions.
 * - GSAP ScrollTrigger : ce qui suit le scroll — ouverture des blocs noirs, ligne du process,
 *   léger décalage des visuels du hero.
 * Les deux ne ciblent jamais le même élément.
 */
const SCENE_QUERIES = {
  desktop: '(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)',
  compact: '(max-width: 1023.98px), (max-height: 619.98px)',
  reduced: '(prefers-reduced-motion: reduce)',
}

/**
 * - animate : entrées Framer et scènes GSAP autorisées ;
 * - intro   : l’entrée du hero peut se jouer (pas sur un HTML déjà pré-rendu) ;
 * - accents : les traits manuscrits peuvent se tracer ;
 * - frozen  : capture statique en cours, rien ne démarre ;
 * - lite    : appareil modeste, pas d’effets liés au scroll.
 */
export const LandingMotionContext = createContext({
  animate: true,
  intro: true,
  accents: true,
  frozen: false,
  lite: false,
})

export function useLandingMotion() {
  return useContext(LandingMotionContext)
}

function detectEnvironment(path) {
  if (typeof window === 'undefined') return { staticRender: true, prerendered: false, lite: false }

  /* Capture Puppeteer (scripts/prerender.mjs) : on fige l'état final pour un HTML lisible sans JS. */
  const staticRender = navigator.webdriver === true
  /* Le HTML pré-rendu porte déjà le canonical de la page : inutile de rejouer l'intro du hero. */
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''
  const prerendered = canonical.endsWith(path)
  const lite = Boolean(navigator.connection?.saveData)
    || (navigator.hardwareConcurrency || 8) <= 2
    || (navigator.deviceMemory || 8) <= 2

  return { staticRender, prerendered, lite }
}

export function useLandingEnvironment(path) {
  const [environment] = useState(() => detectEnvironment(path))
  return environment
}

/**
 * Scène GSAP liée au scroll, nettoyée au démontage et rejouée quand le breakpoint change.
 * `setup(scope, { desktop })` doit être une fonction stable (définie hors du composant) ;
 * `desktop` vaut true sur grand écran capable, false sur mobile / appareil modeste.
 * Mouvement réduit ou capture statique : la scène n'est pas créée, le contenu reste tel quel.
 */
export function useScrollScene(scopeRef, setup) {
  const { animate, lite } = useLandingMotion()

  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!animate || !scope) return undefined

    const media = gsap.matchMedia(scope)
    media.add(SCENE_QUERIES, (context) => {
      const { desktop, reduced } = context.conditions
      if (reduced) return undefined
      return setup(scope, { desktop: Boolean(desktop) && !lite })
    })

    return () => media.revert()
  }, [scopeRef, setup, animate, lite])
}

/** Ouverture d'un bloc noir à l'approche : il s'élargit jusqu'aux bords. Grand écran uniquement. */
export function openPanelScene(root, { desktop }) {
  const panel = root.querySelector('.lp-panel')
  if (!desktop || !panel) return

  gsap.fromTo(
    panel,
    { clipPath: 'inset(6% 4% 0% 4% round 48px)' },
    {
      clipPath: 'inset(0% 0% 0% 0% round 30px)',
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top 94%', end: 'top 42%', scrub: true },
    },
  )
}

/* Suivi GA4 + pixel Meta : même module que le reste du site (src/utils/analytics.js). */
export { trackEvent as trackLandingEvent, trackContactIntent, trackLandingView } from '../../utils/analytics.js'

export { gsap, ScrollTrigger }
