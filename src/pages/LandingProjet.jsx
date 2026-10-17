import { useEffect, useMemo, useRef } from 'react'
import PageSEO from '../components/PageSEO.jsx'
import LandingOpening from '../components/landing/LandingOpening.jsx'
import LandingActions from '../components/landing/LandingActions.jsx'
import LandingAdBadges from '../components/landing/LandingAdBadges.jsx'
import LandingFooter from '../components/landing/LandingFooter.jsx'
import LandingGrowth from '../components/landing/LandingGrowth.jsx'
import LandingSystem from '../components/landing/LandingSystem.jsx'
import ProjectFinder from '../components/landing/ProjectFinder.jsx'
import {
  LandingMotionContext,
  ScrollTrigger,
  trackLandingView,
  useLandingEnvironment,
} from '../components/landing/landingMotion.js'
import { LANDING_PATH, LANDING_SCHEMA, LANDING_SEO } from '../data/landingContent.js'
import { LANDING_VIDEO_ITEMS } from '../data/videoProjects.js'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import '../styles/landing.css'

/**
 * Landing page de conversion, dans cet ordre : identité, bandeau vidéo, deux actions,
 * le système complet, le parcours projet, puis un pied de page propre à la campagne
 * (PageLayout reçoit `footer: null`) : WhatsApp, appel, mentions légales, sans menu du site.
 * Page de campagne : non indexée et hors sitemap tant qu’elle ne remplace pas la page d’accueil.
 *
 * `videoSection` : le bandeau vidéo de la page d’accueil, fourni par AppRoutes (même composant,
 * avec la liste de la landing, LANDING_VIDEO_ITEMS). Il reste hors de `.lp` pour qu’aucun style
 * de la landing ne le touche ; `--lp-reels-count` donne au CSS le nombre de vidéos de la boucle.
 */
export default function LandingProjet({ videoSection = null }) {
  const environment = useLandingEnvironment(LANDING_PATH)
  const reduced = usePrefersReducedMotion()
  const viewTrackedRef = useRef(false)

  const motionSettings = useMemo(() => ({
    animate: !reduced && !environment.staticRender,
    intro: !environment.prerendered,
    accents: !reduced,
    frozen: environment.staticRender,
    lite: environment.lite,
  }), [reduced, environment])

  useEffect(() => {
    // StrictMode rejoue les effets en développement : la référence garde un seul ViewContent par affichage.
    if (viewTrackedRef.current) return
    viewTrackedRef.current = true
    trackLandingView(LANDING_PATH)
  }, [])

  useEffect(() => {
    // Les polices et les images déplacent les sections : on recale les scènes liées au scroll.
    // Mode « safe » : si la page défile déjà (clic sur un CTA), la mesure attend la fin du scroll.
    let cancelled = false
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh(true)
    }
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    // Arrivée directe sur une ancre (ex. /votre-projet#parler-de-votre-projet).
    const hash = decodeURIComponent(window.location.hash.slice(1))
    const frame = hash
      ? window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView())
      : 0

    return () => {
      cancelled = true
      window.removeEventListener('load', refresh)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <LandingMotionContext.Provider value={motionSettings}>
      <PageSEO {...LANDING_SEO} path={LANDING_PATH} schema={LANDING_SCHEMA} noindex />
      <div className="lp lp--top">
        <LandingOpening />
      </div>
      {videoSection ? (
        <div className="lp-reels" style={{ '--lp-reels-count': LANDING_VIDEO_ITEMS.length }}>
          {videoSection}
          <LandingAdBadges />
        </div>
      ) : null}
      <article className="lp" aria-label="Parler de votre projet avec Supra v3">
        <LandingActions />
        <LandingSystem />
        <LandingGrowth />
        <ProjectFinder />
      </article>
      <LandingFooter />
    </LandingMotionContext.Provider>
  )
}
