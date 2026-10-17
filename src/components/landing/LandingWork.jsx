import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'
import { WORK, WORK_ANCHOR } from '../../data/landingContent.js'
import { MaskLines, PrimaryCta, Reveal } from './LandingPrimitives.jsx'
import { EASE, trackLandingEvent, useLandingMotion } from './landingMotion.js'

const VideoReelModal = lazy(() => import('../ui/VideoReelModal.jsx'))

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v14.72a1 1 0 0 0 1.52.85l11.02-7.36a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
    </svg>
  )
}

function ProjectBody({ project }) {
  const isVideo = project.kind === 'video'

  return (
    <>
      <span className="lp-work__media">
        <img
          src={project.image}
          alt=""
          width={isVideo ? 720 : 1600}
          height={isVideo ? 1280 : 1000}
          loading="lazy"
          decoding="async"
        />
        {isVideo ? <span className="lp-work__play"><PlayIcon /></span> : null}
      </span>
      <span className="lp-work__meta">
        <span className="lp-work__name">{project.name}</span>
        <span className="lp-work__services">{project.services}</span>
        <span className="lp-work__cta">
          {WORK.projectCta}
          <span className="lp-work__cta-arrow" aria-hidden="true"> →</span>
        </span>
      </span>
    </>
  )
}

/** « Leur travail est bon » : une grille filtrable, alimentée par les données des projets. */
export default function LandingWork() {
  const { animate } = useLandingMotion()
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(false)
  const [activeVideoId, setActiveVideoId] = useState(null)

  const projects = filter === 'all' ? WORK.projects : WORK.projects.filter((project) => project.category === filter)
  const videos = projects.filter((project) => project.kind === 'video').map((project) => project.video)
  const activeIndex = videos.findIndex((video) => video.id === activeVideoId)
  const stepVideo = (delta) => {
    const next = videos[(activeIndex + delta + videos.length) % videos.length]
    setActiveVideoId(next.id)
  }

  const selectFilter = (id) => {
    setFilter(id)
    setExpanded(false)
    trackLandingEvent('portfolio_filter', { filter: id })
  }

  const trackProject = (project) => trackLandingEvent('select_content', {
    content_type: 'project',
    item_id: project.id,
  })

  return (
    <section className="lp-section lp-work" id={WORK_ANCHOR} aria-labelledby="lp-work-title">
      <div className="lp-container">
        <div className="lp-work__head">
          <MaskLines id="lp-work-title" className="lp-title" lines={WORK.title} />
          <Reveal className="lp-work__intro" delay={0.15}>
            {WORK.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>

        <Reveal className="lp-work__filters" role="group" aria-label="Filtrer les projets" y={12}>
          {WORK.filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`lp-chip${filter === item.id ? ' is-active' : ''}`}
              aria-pressed={filter === item.id}
              onClick={() => selectFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </Reveal>

        <ul className={`lp-work__grid${expanded ? ' is-expanded' : ''}`}>
          <AnimatePresence mode="popLayout" initial={false}>
            {projects.map((project) => (
              <motion.li
                key={project.id}
                className={`lp-work__item lp-work__item--${project.kind}`}
                layout={animate}
                initial={animate ? { opacity: 0, scale: 0.96 } : false}
                animate={{ opacity: 1, scale: 1 }}
                exit={animate ? { opacity: 0, scale: 0.96 } : undefined}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {project.kind === 'video' ? (
                  <button
                    type="button"
                    className="lp-work__card"
                    aria-label={`${WORK.projectCta} ${project.name} — ${project.services} (vidéo)`}
                    onClick={() => {
                      trackProject(project)
                      setActiveVideoId(project.video.id)
                    }}
                  >
                    <ProjectBody project={project} />
                  </button>
                ) : project.href ? (
                  <a
                    className="lp-work__card"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${WORK.projectCta} ${project.name} — ${project.services} (nouvel onglet)`}
                    onClick={() => trackProject(project)}
                  >
                    <ProjectBody project={project} />
                  </a>
                ) : (
                  <Link
                    className="lp-work__card"
                    to="/realisations/websites"
                    aria-label={`${WORK.projectCta} ${project.name} — ${project.services}`}
                    onClick={() => trackProject(project)}
                  >
                    <ProjectBody project={project} />
                  </Link>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {!expanded && projects.length > 6 ? (
          <button type="button" className="lp-work__more lp-btn lp-btn--line" onClick={() => setExpanded(true)}>
            {WORK.more}
          </button>
        ) : null}

        <Reveal className="lp-work__actions" amount={0.6}>
          <PrimaryCta place="portfolio" />
          <Link className="lp-link" to={WORK.all.href}>
            {WORK.all.label}
            <span aria-hidden="true"> →</span>
          </Link>
        </Reveal>
      </div>

      {activeIndex >= 0 ? (
        <Suspense fallback={null}>
          <VideoReelModal
            item={videos[activeIndex]}
            items={videos}
            activeIndex={activeIndex}
            onNext={() => stepVideo(1)}
            onPrev={() => stepVideo(-1)}
            onClose={() => setActiveVideoId(null)}
          />
        </Suspense>
      ) : null}
    </section>
  )
}
