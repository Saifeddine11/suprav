import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { FORM_ANCHOR, PRIMARY_CTA } from '../../data/landingContent.js'
import { DURATION, EASE, trackLandingEvent, useLandingMotion } from './landingMotion.js'

const REVEAL_TAGS = {
  div: motion.div,
  p: motion.p,
  li: motion.li,
  header: motion.header,
}

const HEADING_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  p: motion.p,
}

/** Révélation calme au scroll : opacité + léger déplacement, une seule fois. */
export function Reveal({ as = 'div', delay = 0, y = 26, amount = 0.3, className, children, ...rest }) {
  const { animate } = useLandingMotion()
  const Tag = REVEAL_TAGS[as] || motion.div

  return (
    <Tag
      className={className}
      initial={animate ? { opacity: 0, y } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: DURATION.base, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

const maskContainer = {
  hidden: {},
  visible: (delay = 0) => ({
    transition: { staggerChildren: 0.09, delayChildren: delay },
  }),
}

const maskLine = {
  hidden: { y: '108%' },
  visible: { y: '0%', transition: { duration: DURATION.slow, ease: EASE } },
}

/** Titre révélé ligne par ligne derrière un masque. Le texte reste lisible par les lecteurs d'écran. */
export function MaskLines({ as = 'h2', lines, className, id, delay = 0, immediate = false, play = true }) {
  const { animate } = useLandingMotion()
  const Tag = HEADING_TAGS[as] || motion.h2
  const trigger = immediate
    ? { animate: 'visible' }
    : { whileInView: 'visible', viewport: { once: true, amount: 0.6 } }

  return (
    <Tag
      id={id}
      className={className}
      variants={maskContainer}
      custom={delay}
      initial={animate && play ? 'hidden' : false}
      {...trigger}
    >
      {lines.map((line, index) => (
        <span className="lp-mask" key={index}>
          <motion.span className="lp-mask__line" variants={maskLine}>
            {line}
          </motion.span>
          {index < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}

export function ArrowIcon() {
  return (
    <svg
      className="lp-arrow"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

/** Action principale de la page — toujours vers le parcours projet. `place` sert au suivi des clics. */
export function PrimaryCta({ children = PRIMARY_CTA, href = `#${FORM_ANCHOR}`, place = 'page', className = '', ...rest }) {
  const { animate } = useLandingMotion()

  return (
    <motion.a
      href={href}
      className={`lp-btn lp-btn--accent ${className}`.trim()}
      onClick={() => trackLandingEvent('cta_click', { cta_place: place, cta_label: String(children) })}
      whileHover={animate ? { scale: 1.025 } : undefined}
      whileTap={animate ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.35, ease: EASE }}
      {...rest}
    >
      <span>{children}</span>
      <ArrowIcon />
    </motion.a>
  )
}

function useHandwritingReady() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const done = () => {
      if (!cancelled) setReady(true)
    }
    const canWait = Boolean(document.fonts?.load)
    const timer = window.setTimeout(done, canWait ? 1800 : 0)
    if (canWait) document.fonts.load('500 1em "Caveat"').then(done, done)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  return ready
}

const NOTE_CLIP_HIDDEN = 'inset(-30% 100% -30% -4%)'
const NOTE_CLIP_SHOWN = 'inset(-30% -4% -30% -4%)'

const NOTE_ARROWS = {
  /* part du texte, revient vers la gauche en plongeant */
  back: {
    viewBox: '0 0 120 64',
    stroke: 'M112 8 C 96 46, 52 58, 10 40',
    head: 'M26 28 L 9 40 L 28 50',
  },
  /* part du texte et remonte vers le bouton placé au-dessus */
  up: {
    viewBox: '0 0 64 72',
    stroke: 'M50 68 C 20 60, 8 36, 22 8',
    head: 'M8 20 L 22 7 L 34 23',
  },
  /* part du texte et descend vers ce qui suit */
  down: {
    viewBox: '0 0 56 64',
    stroke: 'M12 4 C 4 26, 18 46, 38 56',
    head: 'M22 58 L 40 57 L 37 40',
  },
}

/**
 * Annotation manuscrite — accent uniquement, jamais d'information essentielle.
 * Le texte s'écrit de gauche à droite, puis la flèche se trace.
 */
export function HandNote({ children, className = '', arrow = 'back', delay = 0 }) {
  const { accents, frozen } = useLandingMotion()
  const fontReady = useHandwritingReady()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const start = accents && !frozen && fontReady && inView
  const shape = NOTE_ARROWS[arrow] || NOTE_ARROWS.back
  const drawDelay = delay + 0.95

  return (
    <span className={`lp-note lp-note--${arrow} ${className}`.trim()} ref={ref}>
      <motion.span
        className="lp-note__text"
        initial={accents ? { clipPath: NOTE_CLIP_HIDDEN } : false}
        animate={start ? { clipPath: NOTE_CLIP_SHOWN } : undefined}
        transition={{ duration: 1.1, ease: [0.45, 0, 0.2, 1], delay }}
      >
        {children}
      </motion.span>
      <svg className="lp-note__arrow" viewBox={shape.viewBox} fill="none" aria-hidden="true">
        <motion.path
          d={shape.stroke}
          initial={accents ? { pathLength: 0, opacity: 0 } : false}
          animate={start ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{
            pathLength: { duration: 0.7, ease: 'easeInOut', delay: drawDelay },
            opacity: { duration: 0.01, delay: drawDelay },
          }}
        />
        <motion.path
          d={shape.head}
          initial={accents ? { pathLength: 0, opacity: 0 } : false}
          animate={start ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{
            pathLength: { duration: 0.3, ease: 'easeOut', delay: drawDelay + 0.6 },
            opacity: { duration: 0.01, delay: drawDelay + 0.6 },
          }}
        />
      </svg>
    </span>
  )
}

/** Trait manuscrit sous un mot — se trace une fois visible. */
export function Scribble({ children, delay = 0 }) {
  const { accents, frozen } = useLandingMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const start = accents && !frozen && inView

  return (
    <span className="lp-scribble" ref={ref}>
      {children}
      <svg className="lp-scribble__stroke" viewBox="0 0 200 16" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d="M4 10 C 46 3, 92 13, 132 7 S 182 5, 196 9"
          initial={accents ? { pathLength: 0, opacity: 0 } : false}
          animate={start ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{
            pathLength: { duration: 0.8, ease: 'easeInOut', delay },
            opacity: { duration: 0.01, delay },
          }}
        />
      </svg>
    </span>
  )
}
