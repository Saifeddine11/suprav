import { useRef, useState } from 'react'
import { FORM_ANCHOR, SERVICES } from '../../data/landingContent.js'
import useFinePointer from '../../hooks/useFinePointer.js'
import { Reveal } from './LandingPrimitives.jsx'
import { openPanelScene, trackLandingEvent, useScrollScene } from './landingMotion.js'

/**
 * « Ils peuvent tout prendre en charge » : quatre blocs, pas une liste de prestations.
 * Le bloc survolé ou focalisé s’allume, les autres s’effacent un peu ;
 * chaque lien ouvre le parcours projet avec la bonne priorité.
 */
export default function LandingServices({ onStart }) {
  const rootRef = useRef(null)
  const finePointer = useFinePointer()
  const [activeId, setActiveId] = useState(null)

  useScrollScene(rootRef, openPanelScene)

  const stateOf = (id) => {
    if (activeId === null) return 'idle'
    return activeId === id ? 'active' : 'quiet'
  }

  return (
    <section className="lp-block lp-services" ref={rootRef} aria-labelledby="lp-services-title">
      <div className="lp-panel lp-services__panel">
        <Reveal>
          <h2 className="lp-title lp-title--on-dark" id="lp-services-title">{SERVICES.title}</h2>
        </Reveal>

        <ul className="lp-services__grid">
          {SERVICES.blocks.map((block, index) => (
            <Reveal as="li" key={block.id} className="lp-services__cell" delay={index * 0.1} amount={0.25}>
              <article
                className={`lp-services__item lp-services__item--${stateOf(block.id)}`}
                onMouseEnter={() => finePointer && setActiveId(block.id)}
                onMouseLeave={() => finePointer && setActiveId(null)}
                onFocus={() => setActiveId(block.id)}
                onBlur={() => setActiveId(null)}
              >
                <span className="lp-services__num" aria-hidden="true">{block.num}</span>
                <h3 className="lp-services__title">{block.title}</h3>
                <p className="lp-services__text">{block.text}</p>
                <a
                  className="lp-services__link"
                  href={`#${FORM_ANCHOR}`}
                  aria-label={`${SERVICES.link} — ${block.title}`}
                  onClick={() => {
                    trackLandingEvent('cta_click', { cta_place: 'services', cta_label: block.title })
                    onStart?.(block.goal)
                  }}
                >
                  {SERVICES.link}
                  <span aria-hidden="true"> →</span>
                </a>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
