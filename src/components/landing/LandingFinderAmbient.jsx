import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useLandingMotion } from './landingMotion.js'

/**
 * Lumière orange derrière le formulaire : trois halos de l’orange Supra qui dérivent lentement.
 * Décor pur — aucun texte, aucune interaction, rien ne passe devant les champs.
 * Les halos ne bougent que lorsque la section est à l’écran, et jamais en mouvement réduit,
 * sur appareil modeste ou pendant la capture statique.
 */
export default function LandingFinderAmbient() {
  const ref = useRef(null)
  const { animate, lite } = useLandingMotion()
  const inView = useInView(ref, { margin: '120px 0px' })
  const live = animate && !lite && inView

  return (
    <div
      className="lp-finder__ambient"
      ref={ref}
      data-live={live ? 'true' : undefined}
      data-lite={lite ? 'true' : undefined}
      aria-hidden="true"
    >
      {/* Déformation liquide : appliquée une fois à chaque halo, jamais recalculée pendant le mouvement. */}
      <svg className="lp-finder__defs" width="0" height="0" focusable="false">
        <filter id="lp-finder-liquid" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="2" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="110" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="lp-finder__drift">
        <span className="lp-finder__light lp-finder__light--a" />
        <span className="lp-finder__light lp-finder__light--b" />
        <span className="lp-finder__light lp-finder__light--c" />
      </div>

      <span className="lp-finder__veil" />
    </div>
  )
}
