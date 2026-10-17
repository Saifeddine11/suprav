import { useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import { BUILD, FORM_ANCHOR } from '../../data/landingContent.js'
import useFinePointer from '../../hooks/useFinePointer.js'
import { MaskLines, Reveal } from './LandingPrimitives.jsx'
import { EASE, openPanelScene, trackLandingEvent, useLandingMotion, useScrollScene } from './landingMotion.js'

const listVariants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
}

const lineVariants = {
  hidden: { opacity: 0, x: -12 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
}

/**
 * Ce que Supra V3 construit : trois chantiers, pas un catalogue de prestations.
 * Chaque chantier dévoile son détail ligne par ligne ; celui qui est survolé ou focalisé
 * s’allume, les autres s’effacent un peu. Le lien ouvre le parcours avec la bonne priorité.
 */
export default function LandingBuild({ onStart }) {
  const rootRef = useRef(null)
  const { animate } = useLandingMotion()
  const finePointer = useFinePointer()
  const [activeId, setActiveId] = useState(null)

  useScrollScene(rootRef, openPanelScene)

  const stateOf = (id) => {
    if (activeId === null) return 'idle'
    return activeId === id ? 'active' : 'quiet'
  }

  return (
    <section className="lp-block lp-build" ref={rootRef} aria-labelledby="lp-build-title">
      <div className="lp-panel lp-build__panel">
        <MaskLines
          id="lp-build-title"
          className="lp-title lp-title--on-dark"
          lines={[
            BUILD.title[0],
            <span key="end">
              {BUILD.title[1]} <span className="lp-accent">{BUILD.highlight}</span>
            </span>,
          ]}
        />

        <ul className="lp-build__grid">
          {BUILD.chapters.map((chapter, index) => (
            <Reveal as="li" key={chapter.id} className="lp-build__cell" delay={index * 0.12} amount={0.12}>
              <article
                className={`lp-build__chapter lp-build__chapter--${stateOf(chapter.id)}`}
                onMouseEnter={() => finePointer && setActiveId(chapter.id)}
                onMouseLeave={() => finePointer && setActiveId(null)}
                onFocus={() => setActiveId(chapter.id)}
                onBlur={() => setActiveId(null)}
              >
                <div className="lp-build__top">
                  <span className="lp-build__num" aria-hidden="true">{chapter.num}</span>
                  <span className="lp-build__kicker">{chapter.kicker}</span>
                </div>

                <h3 className="lp-build__title">{chapter.title}</h3>
                <p className="lp-build__text">{chapter.text}</p>

                <motion.ul
                  className="lp-build__list"
                  variants={listVariants}
                  initial={animate ? 'hidden' : false}
                  whileInView="shown"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {chapter.items.map((item) => (
                    <motion.li key={item} variants={lineVariants}>
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>

                <a
                  className="lp-build__link"
                  href={`#${FORM_ANCHOR}`}
                  aria-label={`${BUILD.link} — ${chapter.title}`}
                  onClick={() => {
                    trackLandingEvent('cta_click', { cta_place: 'build', cta_label: chapter.kicker })
                    onStart?.(chapter.goal)
                  }}
                >
                  {BUILD.link}
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
