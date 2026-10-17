import { useRef } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react'
import BrowserMockup from '../ui/BrowserMockup.jsx'
import { HERO, SECONDARY_CTA, WORK_ANCHOR } from '../../data/landingContent.js'
import { HandNote, MaskLines, PrimaryCta } from './LandingPrimitives.jsx'
import { DURATION, EASE, gsap, useLandingMotion, useScrollScene } from './landingMotion.js'

/* Léger décalage des visuels au scroll (GSAP) sur des enveloppes dédiées ; l’entrée (Framer) vit sur leurs enfants. */
function heroScene(root, { desktop }) {
  if (!desktop) return

  const scrollTrigger = { trigger: root, start: 'top top', end: 'bottom top', scrub: true }
  root.querySelectorAll('[data-drift]').forEach((piece) => {
    gsap.to(piece, { yPercent: Number(piece.dataset.drift), ease: 'none', scrollTrigger })
  })
}

const { site, siteAlt, reels } = HERO.visuals

export default function LandingHero() {
  const rootRef = useRef(null)
  const { animate, intro } = useLandingMotion()
  const play = animate && intro

  useScrollScene(rootRef, heroScene)

  const enter = (delay, y = 18) => ({
    initial: play ? { opacity: 0, y } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.base, delay, ease: EASE },
  })
  const arrive = (delay) => ({
    initial: play ? { opacity: 0, y: 36, scale: 0.97 } : false,
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: DURATION.slow, delay, ease: EASE },
  })

  return (
    <section className="lp-hero" ref={rootRef} aria-labelledby="lp-hero-title">
      <div className="lp-panel lp-hero__panel">
        <div className="lp-hero__glow" aria-hidden="true" />

        <div className="lp-hero__copy">
          <motion.p className="lp-eyebrow lp-eyebrow--on-dark" {...enter(0.05, 10)}>
            {HERO.eyebrow}
          </motion.p>

          <MaskLines
            as="h1"
            id="lp-hero-title"
            className="lp-hero__title"
            lines={[HERO.title, <span className="lp-accent" key="highlight">{HERO.highlight}</span>]}
            delay={0.12}
            immediate
            play={intro}
          />

          <motion.p className="lp-hero__lead" {...enter(0.55)}>
            {HERO.lead}
          </motion.p>

          <motion.div className="lp-hero__actions" {...enter(0.72)}>
            <PrimaryCta place="hero">{HERO.cta}</PrimaryCta>
            <a className="lp-link lp-link--on-dark" href={`#${WORK_ANCHOR}`}>
              {SECONDARY_CTA}
              <span aria-hidden="true"> →</span>
            </a>
          </motion.div>

          <HandNote arrow="up" className="lp-hero__note" delay={1.4}>
            {HERO.note}
          </HandNote>

          <motion.ul className="lp-hero__trust" aria-label="Nos domaines" {...enter(0.9, 10)}>
            {HERO.trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </motion.ul>
        </div>

        <div className="lp-hero__stage">
          <div className="lp-hero__piece lp-hero__piece--site" data-drift="-5">
            <motion.div {...arrive(0.35)}>
              <BrowserMockup
                image={site.image}
                title={site.name}
                domain={site.domain}
                url={site.href}
                alt={`Site ${site.name} réalisé par Supra v3`}
              />
            </motion.div>
          </div>

          <div className="lp-hero__piece lp-hero__piece--site-alt" data-drift="-16">
            <motion.figure className="lp-hero__card" {...arrive(0.62)}>
              <img
                src={siteAlt.image}
                alt={`Site ${siteAlt.name} réalisé par Supra v3`}
                width={1600}
                height={1000}
                decoding="async"
              />
              <figcaption>{siteAlt.name}</figcaption>
            </motion.figure>
          </div>

          {reels.map((reel, index) => (
            <div
              key={reel.id}
              className={`lp-hero__piece lp-hero__piece--reel-${index === 0 ? 'a' : 'b'}`}
              data-drift={index === 0 ? '-26' : '10'}
            >
              <motion.figure className="lp-hero__reel" {...arrive(0.5 + index * 0.24)}>
                <img
                  src={reel.image}
                  alt={`${reel.services} — ${reel.name}`}
                  width={720}
                  height={1280}
                  decoding="async"
                />
                <figcaption>{reel.name}</figcaption>
              </motion.figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
