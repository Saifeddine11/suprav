// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import { OPENING } from '../../data/landingContent.js'
import { HandNote, MaskLines, Scribble } from './LandingPrimitives.jsx'
import { DURATION, EASE, useLandingMotion } from './landingMotion.js'

/**
 * Ouverture : l’identité avant tout — surtitre, deux lignes de titre qui ne font qu’une
 * affirmation, sous-titre. Le bandeau vidéo de la page d’accueil suit immédiatement.
 * Le manuscrit reste un accent (trait sous un mot, annotation vers les vidéos).
 */
export default function LandingOpening() {
  const { animate, intro } = useLandingMotion()
  const play = animate && intro

  const enter = (delay, y = 16) => ({
    initial: play ? { opacity: 0, y } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.base, delay, ease: EASE },
  })

  return (
    <section className="lp-open" aria-labelledby="lp-open-title">
      <div className="lp-open__inner">
        <motion.p className="lp-eyebrow lp-open__eyebrow" {...enter(0.05, 10)}>
          {OPENING.eyebrow}
        </motion.p>

        <MaskLines
          as="h1"
          id="lp-open-title"
          className="lp-open__title"
          lines={[
            <span key="first">
              <span className="lp-open__row lp-open__row--soft">{OPENING.title[0][0]}</span>{' '}
              <span className="lp-open__row">{OPENING.title[0][1]}</span>
            </span>,
            <span key="second">
              <span className="lp-open__row lp-open__row--soft">{OPENING.title[1][0]}</span>{' '}
              <span className="lp-open__row">
                <Scribble delay={1.2}>
                  <span className="lp-accent">{OPENING.highlight}</span>
                </Scribble>
              </span>
            </span>,
          ]}
          delay={0.14}
          immediate
          play={intro}
        />

        <motion.p className="lp-open__lead" {...enter(0.62)}>
          {OPENING.lead}
        </motion.p>

        <HandNote arrow="down" className="lp-open__note" delay={1.5}>
          {OPENING.note}
        </HandNote>
      </div>
    </section>
  )
}
