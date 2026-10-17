import { Link } from 'react-router-dom'
import { ACTIONS } from '../../data/landingContent.js'
import { ArrowIcon, HandNote, PrimaryCta, Reveal } from './LandingPrimitives.jsx'
import { trackLandingEvent } from './landingMotion.js'

/**
 * Deux actions, juste après les vidéos : la principale (orange) descend au parcours projet,
 * la secondaire, plus légère, ouvre toutes les réalisations.
 */
export default function LandingActions() {
  return (
    <section className="lp-actions" aria-label="Passer à l’action">
      <div className="lp-container lp-actions__inner">
        <Reveal className="lp-actions__buttons" amount={0.6}>
          <PrimaryCta place="after-work">{ACTIONS.primary}</PrimaryCta>
          <Link
            className="lp-btn lp-btn--line"
            to={ACTIONS.secondary.href}
            onClick={() => trackLandingEvent('cta_click', {
              cta_place: 'after-work',
              cta_label: ACTIONS.secondary.label,
            })}
          >
            <span>{ACTIONS.secondary.label}</span>
            <ArrowIcon />
          </Link>
        </Reveal>

        <HandNote arrow="up" className="lp-actions__note" delay={0.35}>
          {ACTIONS.note}
        </HandNote>
      </div>
    </section>
  )
}
