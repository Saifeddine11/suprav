import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { videoAriaLabel } from '../../utils/videoReelUtils.js'
import useFinePointer from '../../hooks/useFinePointer.js'

const VideoReelModal = lazy(() => import('./VideoReelModal.jsx'))
import './VideoReelsGrid.css'

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  })

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [breakpoint])

  return isMobile
}

function VideoReelCard({ item, onOpen }) {
  const videoRef = useRef(null)
  const finePointer = useFinePointer()
  const [hovered, setHovered] = useState(false)
  const videoUrl = item.videoSrc || item.video
  const canPlayInModal = Boolean(videoUrl)
  const showPlay = canPlayInModal || Boolean(item.poster)
  const showPreviewVideo = Boolean(videoUrl && finePointer && hovered)

  useEffect(() => {
    const el = videoRef.current
    if (!el || !showPreviewVideo) return
    const play = el.play()
    if (play?.catch) play.catch(() => {})
    return () => {
      el.pause()
    }
  }, [showPreviewVideo])

  const openModal = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (canPlayInModal || item.poster) onOpen(item)
    },
    [canPlayInModal, item, onOpen],
  )

  return (
    <li className="video-reels-grid__item">
      <div
        className="video-reel-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {showPreviewVideo ? (
          <video
            ref={videoRef}
            className="video-reel-card__media"
            src={videoUrl}
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
            className="video-reel-card__media"
            src={item.poster}
            alt=""
            width={360}
            height={640}
            loading="lazy"
            decoding="async"
          />
        ) : null}

        <span className="video-reel-card__shade" aria-hidden="true" />

        {showPlay ? (
          <button
            type="button"
            className="video-reel-card__play"
            onClick={openModal}
            aria-label={videoAriaLabel(item)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.14v14.72a1 1 0 0 0 1.52.85l11.02-7.36a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
            </svg>
          </button>
        ) : (
          <Link to="/contact" className="video-reel-card__contact-cta">
            Nous contacter
          </Link>
        )}

        <span className="video-reel-card__brand">Supra v3</span>
      </div>
    </li>
  )
}

/** Galerie verticale 9:16 — réalisations vidéo (/realisations) */
export default function VideoReelsGrid({ items }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [showAllVideos, setShowAllVideos] = useState(false)
  const isMobile = useIsMobile(640)
  const collapsedCount = isMobile ? 4 : 8
  const hasMore = items.length > collapsedCount
  const visibleItems = showAllVideos || !hasMore ? items : items.slice(0, collapsedCount)

  const openModal = useCallback((item) => {
    const index = visibleItems.findIndex((videoItem) => videoItem.id === item.id)
    if (index >= 0) setActiveIndex(index)
  }, [visibleItems])

  const closeModal = useCallback(() => {
    setActiveIndex(null)
  }, [])

  const goToNext = useCallback(() => {
    if (!visibleItems.length) return
    setActiveIndex((current) => {
      if (current === null) return 0
      return (current + 1) % visibleItems.length
    })
  }, [visibleItems])

  const goToPrev = useCallback(() => {
    if (!visibleItems.length) return
    setActiveIndex((current) => {
      if (current === null) return 0
      return (current - 1 + visibleItems.length) % visibleItems.length
    })
  }, [visibleItems])

  useEffect(() => {
    if (!hasMore) setShowAllVideos(false)
  }, [hasMore])

  useEffect(() => {
    if (activeIndex === null) return
    if (visibleItems.length === 0) {
      setActiveIndex(null)
      return
    }
    if (activeIndex > visibleItems.length - 1) {
      setActiveIndex(visibleItems.length - 1)
    }
  }, [activeIndex, visibleItems])

  return (
    <>
      <ul id="video-reels-gallery" className="video-reels-grid" role="list" aria-label="Galerie vidéos">
        {visibleItems.map((item) => (
          <VideoReelCard key={item.id} item={item} onOpen={openModal} />
        ))}
      </ul>
      {hasMore ? (
        <div className="video-reels-grid__toggle-wrap">
          <button
            type="button"
            className="video-reels-grid__toggle"
            onClick={() => setShowAllVideos((open) => !open)}
            aria-expanded={showAllVideos}
            aria-controls="video-reels-gallery"
          >
            {showAllVideos ? 'Voir moins' : 'Voir plus'}
          </button>
        </div>
      ) : null}
      {activeIndex !== null ? (
        <Suspense fallback={null}>
          <VideoReelModal
            item={visibleItems[activeIndex]}
            items={visibleItems}
            activeIndex={activeIndex}
            onNext={goToNext}
            onPrev={goToPrev}
            onClose={closeModal}
          />
        </Suspense>
      ) : null}
    </>
  )
}
