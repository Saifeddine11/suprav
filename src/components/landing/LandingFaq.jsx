import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'
import { LANDING_FAQ } from '../../data/landingContent.js'
import { Reveal } from './LandingPrimitives.jsx'
import { EASE, useLandingMotion } from './landingMotion.js'

export default function LandingFaq() {
  const { animate } = useLandingMotion()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="lp-section lp-faq" aria-labelledby="lp-faq-title">
      <div className="lp-container lp-faq__grid">
        <Reveal>
          <h2 className="lp-title" id="lp-faq-title">{LANDING_FAQ.title}</h2>
        </Reveal>

        <ul className="lp-faq__list">
          {LANDING_FAQ.items.map((item, index) => {
            const isOpen = openIndex === index
            const panelId = `lp-faq-panel-${index}`
            const buttonId = `lp-faq-button-${index}`

            return (
              <li key={item.q} className={`lp-faq__item${isOpen ? ' is-open' : ''}`}>
                <h3 className="lp-faq__question">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span>{item.q}</span>
                    <span className="lp-faq__toggle" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="panel"
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="lp-faq__panel"
                      initial={animate ? { height: 0, opacity: 0 } : false}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={animate ? { height: 0, opacity: 0 } : undefined}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
