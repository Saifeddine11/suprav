import { lazy, Suspense, useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useSpring } from 'motion/react'
import { SHOWREEL, WORK_ANCHOR } from '../../data/landingContent.js'
import useFinePointer from '../../hooks/useFinePointer.js'
import { MaskLines, Reveal } from './LandingPrimitives.jsx'
import {
  EASE,
  ScrollTrigger,
  gsap,
  openPanelScene,
  trackLandingEvent,
  useLandingMotion,
  useScrollScene,
} from './landingMotion.js'

const VideoReelModal = lazy(() => import('../ui/VideoReelModal.jsx'))

const PROJECTS = SHOWREEL.projects
const VIDEOS = PROJECTS.map((project) => project.video)
const pad = (value) => String(value).padStart(2, '0')

/*
 * Grand écran : le bloc s’épingle et le rail avance à l’horizontale avec le scroll (GSAP sur
 * la piste). Ailleurs, ou sans animation : les cartes s’empilent en grille, sans épinglage.
 */
function showreelScene(root, context) {
  openPanelScene(root, context)
  if (!context.desktop) return undefined

  const viewport = root.querySelector('.lp-show__viewport')
  const track = root.querySelector('.lp-show__track')
  const fill = root.querySelector('.lp-show__bar-fill')
  if (!viewport || !track) return undefined

  root.dataset.pinned = 'true'
  const travel = () => Math.max(0, track.scrollWidth - viewport.clientWidth)
  const reserve = () => root.style.setProperty('--lp-show-travel', `${travel()}px`)
  reserve()
  ScrollTrigger.addEventListener('refreshInit', reserve)

  const range = { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.6 }
  const slide = gsap.to(track, {
    x: () => -travel(),
    ease: 'none',
    scrollTrigger: { ...range, invalidateOnRefresh: true },
  })
  if (fill) gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: range })

  /* Clavier : une carte hors champ qui reçoit le focus est ramenée au centre par le scroll. */
  const onFocusIn = (event) => {
    const item = event.target.closest('.lp-show__item')
    const trigger = slide.scrollTrigger
    const distance = travel()
    if (!item || !trigger || !distance) return

    const offset = item.getBoundingClientRect().left - track.getBoundingClientRect().left
    const wanted = offset - (viewport.clientWidth - item.offsetWidth) / 2
    const ratio = Math.min(1, Math.max(0, wanted / distance))
    trigger.scroll(trigger.start + (trigger.end - trigger.start) * ratio)
  }
  track.addEventListener('focusin', onFocusIn)

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', reserve)
    track.removeEventListener('focusin', onFocusIn)
    delete root.dataset.pinned
    root.style.removeProperty('--lp-show-travel')
  }
}

const itemVariants = { hidden: {}, shown: {} }

const mediaVariants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  shown: (delay) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.2, ease: EASE, delay },
  }),
}

const zoomVariants = {
  hidden: { scale: 1.2, filter: 'blur(14px)' },
  shown: (delay) => ({
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.7, ease: EASE, delay },
  }),
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v14.72a1 1 0 0 0 1.52.85l11.02-7.36a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
    </svg>
  )
}

function ShowreelCard({ project, index, onOpen }) {
  const { animate } = useLandingMotion()
  const finePointer = useFinePointer()
  const videoRef = useRef(null)
  const [active, setActive] = useState(false)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const driftX = useSpring(pointerX, { stiffness: 110, damping: 20, mass: 0.4 })
  const driftY = useSpring(pointerY, { stiffness: 110, damping: 20, mass: 0.4 })

  /* Aperçu muet au survol ou au focus, souris uniquement — comme le bandeau de la page d’accueil. */
  const preview = finePointer && active
  const delay = (index % 3) * 0.09

  useEffect(() => {
    const video = videoRef.current
    if (!video || !preview) return undefined
    const playing = video.play()
    if (playing?.catch) playing.catch(() => {})
    return () => video.pause()
  }, [preview])

  const follow = (event) => {
    if (!finePointer || !animate) return
    const box = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - box.left) / box.width - 0.5) * -16)
    pointerY.set(((event.clientY - box.top) / box.height - 0.5) * -16)
  }

  const rest = () => {
    setActive(false)
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <motion.li
      className="lp-show__item"
      variants={itemVariants}
      initial={animate ? 'hidden' : false}
      whileInView="shown"
      viewport={{ once: true, amount: 0.25 }}
    >
      <button
        type="button"
        className="lp-show__card"
        aria-label={`${SHOWREEL.play} — ${project.name}, ${project.services}`}
        onClick={() => onOpen(project)}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={rest}
        onPointerMove={follow}
        onFocus={() => setActive(true)}
        onBlur={rest}
      >
        <motion.span className="lp-show__media" variants={mediaVariants} custom={delay}>
          <motion.span className="lp-show__zoom" variants={zoomVariants} custom={delay}>
            <motion.span className="lp-show__drift" style={{ x: driftX, y: driftY }}>
              {preview ? (
                <video
                  ref={videoRef}
                  src={project.video.videoSrc}
                  poster={project.image}
                  muted
                  loop
                  playsInline
                  preload="none"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              ) : (
                <img src={project.image} alt="" width={720} height={1280} loading="lazy" decoding="async" />
              )}
            </motion.span>
          </motion.span>
        </motion.span>

        <span className="lp-show__shade" aria-hidden="true" />
        <span className="lp-show__index" aria-hidden="true">
          {pad(index + 1)} / {pad(PROJECTS.length)}
        </span>
        <span className="lp-show__meta">
          <span className="lp-show__text">
            <span className="lp-show__name">{project.name}</span>
            <span className="lp-show__kind">{project.services}</span>
          </span>
          <span className="lp-show__play" aria-hidden="true">
            <PlayIcon />
            {SHOWREEL.playShort}
          </span>
        </span>
      </button>
    </motion.li>
  )
}

/** Le travail, tout de suite : un showreel de vidéos réelles, grandes, nommées, jouables. */
export default function LandingShowreel() {
  const rootRef = useRef(null)
  const finePointer = useFinePointer()
  const [activeId, setActiveId] = useState(null)
  const activeIndex = VIDEOS.findIndex((video) => video.id === activeId)

  useScrollScene(rootRef, showreelScene)

  const open = (project) => {
    trackLandingEvent('select_content', { content_type: 'video', item_id: project.id })
    setActiveId(project.video.id)
  }
  const step = (delta) => setActiveId(VIDEOS[(activeIndex + delta + VIDEOS.length) % VIDEOS.length].id)

  return (
    <section className="lp-show" id={WORK_ANCHOR} ref={rootRef} aria-labelledby="lp-show-title">
      <div className="lp-show__sticky">
        <div className="lp-panel lp-show__panel">
          <div className="lp-show__viewport">
            <div className="lp-show__track">
              <header className="lp-show__head">
                <Reveal as="p" className="lp-eyebrow lp-show__label">
                  <span lang="en">{SHOWREEL.label}</span>
                </Reveal>
                <MaskLines id="lp-show-title" className="lp-title lp-title--on-dark" lines={SHOWREEL.title} />
                <Reveal as="p" className="lp-show__hint" delay={0.15}>
                  {finePointer ? SHOWREEL.hint.pointer : SHOWREEL.hint.touch}
                </Reveal>
              </header>

              <ul className="lp-show__list" role="list">
                {PROJECTS.map((project, index) => (
                  <ShowreelCard key={project.id} project={project} index={index} onOpen={open} />
                ))}
              </ul>
            </div>
          </div>

          <div className="lp-show__foot" aria-hidden="true">
            <span>{SHOWREEL.scroll}</span>
            <span className="lp-show__bar">
              <span className="lp-show__bar-fill" />
            </span>
            <span>{pad(PROJECTS.length)} projets</span>
          </div>
        </div>
      </div>

      {activeIndex >= 0 ? (
        <Suspense fallback={null}>
          <VideoReelModal
            item={VIDEOS[activeIndex]}
            items={VIDEOS}
            activeIndex={activeIndex}
            onNext={() => step(1)}
            onPrev={() => step(-1)}
            onClose={() => setActiveId(null)}
          />
        </Suspense>
      ) : null}
    </section>
  )
}
