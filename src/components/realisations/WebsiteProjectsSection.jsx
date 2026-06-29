import FocusCards from '../ui/FocusCards.jsx'
import ExpandableGrid from '../ui/ExpandableGrid.jsx'
import AnimatedText from '../animations/AnimatedText.jsx'
import { WEBSITE_FOCUS_ITEMS } from './realisationsShared.jsx'

const INITIAL_VISIBLE = 4

export default function WebsiteProjectsSection({ solo = true }) {
  return (
    <section
      className={`website-projects-section${solo ? ' website-projects-section--solo' : ''}`}
      aria-label="Sites web réalisés"
    >
      <div className="website-projects-section__grid-bg" aria-hidden="true" />
      <div className="website-projects-section__inner">
        <div className="website-projects-section__head">
          <p>Sites web</p>
          <AnimatedText
            as="h2"
            lines={[[{ text: 'Projets ' }, { text: 'en ligne' }]]}
            animateBy="words"
            direction="top"
            delay={100}
            stepDuration={0.35}
            threshold={0.15}
            rootMargin="-50px"
          />
          <p className="website-projects-section__intro">
            Sites vitrines, e-commerce et expériences digitales : chaque projet met en avant
            l&apos;offre, la preuve et un parcours court vers le contact. Lien public lorsque le site
            est en ligne.
          </p>
        </div>
        <ExpandableGrid items={WEBSITE_FOCUS_ITEMS} initialVisible={INITIAL_VISIBLE}>
          {(visibleItems) => <FocusCards items={visibleItems} />}
        </ExpandableGrid>
      </div>
    </section>
  )
}
