import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'
import { EASING, VIEWPORT_SETTINGS } from '../../animationConstants.js'
import AnimatedText from '../animations/AnimatedText.jsx'
import TargetingGlobeFallback from './TargetingGlobeFallback.jsx'
import '../../styles/targeting-section.css'

const TargetingGlobeVisual = lazy(() => import('./TargetingGlobeVisual.jsx'))

const revealViewport = VIEWPORT_SETTINGS

const copyStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.04,
    },
  },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.65, ease: EASING },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASING },
  },
}

const globeReveal = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 16,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASING, delay: 0.12 },
  },
}

function GlobeFallbackShell() {
  return (
    <div className="targeting-section__visual-shell targeting-section__visual-float" aria-hidden="true">
      <TargetingGlobeFallback className="targeting-section__visual-fallback" />
      <div className="targeting-globe__vignette" />
    </div>
  )
}

export default function TargetingSection() {
  return (
    <section className="targeting-section section" id="ciblage" aria-labelledby="targeting-section-title">
      <div className="targeting-section__glow" aria-hidden="true" />
      <div className="container">
        <div className="targeting-section__grid">
          <motion.div
            className="targeting-section__copy"
            variants={copyStagger}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <motion.p variants={fadeIn} className="targeting-section__eyebrow">
              Ciblage &amp; diffusion
            </motion.p>
            <AnimatedText
              as="h2"
              id="targeting-section-title"
              className="targeting-section__title"
              lines={[
                [{ text: 'Moins de visibilité inutile.' }],
                [
                  { text: 'Plus de ' },
                  { text: 'clients qualifiés', className: 'targeting-section__title-accent' },
                  { text: ' pour votre marque.' },
                ],
              ]}
              lineClassName="targeting-section__title-line"
              animateBy="words"
              direction="top"
              delay={100}
              stepDuration={0.35}
              threshold={0.15}
              rootMargin="-50px"
            />
            <motion.p variants={fadeUp} className="targeting-section__subtitle">
              Stratégie, contenu et campagnes digitales pour toucher les audiences les plus susceptibles
              de comprendre, croire et acheter votre offre.
            </motion.p>
            <motion.p variants={fadeUp} className="targeting-section__support">
              Clients locaux, investisseurs, voyageurs ou marchés internationaux : on adapte le message,
              le canal et le timing à votre audience idéale.
            </motion.p>
            <motion.div variants={fadeUp} className="targeting-section__actions">
              <a href="/contact" className="btn btn--primary targeting-section__cta">
                Identifier mon audience idéale
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="/realisations" className="btn btn--secondary targeting-section__cta-secondary">
                Voir nos réalisations
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="targeting-section__visual"
            variants={globeReveal}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <div className="targeting-section__visual-float">
              <Suspense fallback={<GlobeFallbackShell />}>
                <TargetingGlobeVisual />
              </Suspense>
            </div>
            <motion.p
              className="targeting-section__visual-caption"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
            >
              Marrakech · audiences locales &amp; internationales
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
