/*
 * Carrousel de vidéos (« media clouds ») de la landing /votre-projet.
 * Sorti de l'ancienne page d'accueil (App.jsx) ; garde ses styles d'origine (App.css).
 */
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars -- utilisé en JSX (motion.article)
import { motion } from 'motion/react'
import '../../App.css'
import { HOVER_TRANSITION } from '../../animationConstants.js'
import useFinePointer from '../../hooks/useFinePointer.js'
import { trackEvent } from '../../utils/analytics.js'

const VideoReelModal = lazy(() => import('../ui/VideoReelModal.jsx'))

function MediaVideoCard({ item, onOpen }) {
  const videoRef = useRef(null)
  const finePointer = useFinePointer()
  const [hovered, setHovered] = useState(false)
  const videoSrc = item.videoSrc || item.video
  const showPreviewVideo = Boolean(videoSrc && finePointer && hovered)

  useEffect(() => {
    const el = videoRef.current
    if (!el || !showPreviewVideo) return
    const play = el.play()
    if (play?.catch) play.catch(() => {})
    return () => {
      el.pause()
    }
  }, [showPreviewVideo])

  const openModal = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onOpen(item)
  }

  return (
    <motion.article
      className="media-clouds__item"
      whileHover={{
        y: -6,
        scale: 1.01,
        boxShadow: "0 20px 60px rgba(17, 17, 17, 0.12), 0 8px 24px rgba(17, 17, 17, 0.08)"
      }}
      transition={HOVER_TRANSITION}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        className="media-clouds__card-trigger"
        onClick={openModal}
        aria-label={item.ariaLabel || 'Lire la vidéo'}
      >
        {showPreviewVideo ? (
          <video
            ref={videoRef}
            className="video-card"
            src={videoSrc}
            poster={item.poster || undefined}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            aria-hidden="true"
          />
        ) : item.poster ? (
          <img
            className="video-card"
            src={item.poster}
            alt=""
            width={360}
            height={640}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        {item.stat ? (
          <span className="media-clouds__stat">
            <strong>{item.stat.value}</strong> {item.stat.label}
          </span>
        ) : null}
        <span className="media-clouds__play" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v14.72a1 1 0 0 0 1.52.85l11.02-7.36a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
          </svg>
        </span>
      </button>
    </motion.article>
  )
}

export default function MediaCloudsSection({ items, showHeader = true, className = '' }) {
  const sectionRef = useRef(null)
  const [shouldLoadVideos, setShouldLoadVideos] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    if (shouldLoadVideos) return undefined

    const section = sectionRef.current
    if (!section) return undefined

    const rootMargin =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
        ? '120px 0px'
        : '200px 0px'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoadVideos(true)
        observer.disconnect()
      },
      { rootMargin }
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [shouldLoadVideos])

  return (
    <section
      className={['media-clouds', 'section', !showHeader && 'media-clouds--hero', className]
        .filter(Boolean)
        .join(' ')}
      id="works"
      ref={sectionRef}
    >

      <div className="media-clouds__frame">
        <div className="media-clouds__viewport">
          <div className="media-clouds__track">
            {shouldLoadVideos &&
              items.concat(items).map((item, index) => (
                <MediaVideoCard
                  key={`${item.id}-${index}`}
                  item={item}
                  onOpen={() => {
                    setActiveIndex(index % items.length)
                    trackEvent('select_content', { content_type: 'video', item_id: item.id })
                  }}
                />
              ))}
          </div>
        </div>
      </div>
      {activeIndex !== null ? (
        <Suspense fallback={null}>
          <VideoReelModal
            item={items[activeIndex]}
            items={items}
            activeIndex={activeIndex}
            onNext={() => setActiveIndex((current) => (current + 1) % items.length)}
            onPrev={() => setActiveIndex((current) => (current - 1 + items.length) % items.length)}
            onClose={() => setActiveIndex(null)}
          />
        </Suspense>
      ) : null}
    </section>
  )
}
