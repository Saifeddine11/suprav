import { useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { videoAriaLabel, videoDisplayTitle } from '../../utils/videoReelUtils.js'
import './VideoReelsGrid.css'

function NavArrow({ direction, onClick }) {
  const isPrev = direction === 'prev'
  return (
    <button
      type="button"
      className={`video-reel-modal__nav video-reel-modal__nav--${direction}`}
      onClick={onClick}
      aria-label={isPrev ? 'Vidéo précédente' : 'Vidéo suivante'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={isPrev ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

/** Lightbox vidéo 9:16 — partagée homepage + /realisations/production-videos */
export default function VideoReelModal({ item, items, activeIndex, onNext, onPrev, onClose }) {
  const videoRef = useRef(null)
  const panelRef = useRef(null)
  const modalItems = useMemo(
    () => (Array.isArray(items) && items.length > 0 ? items : (item ? [item] : [])),
    [item, items],
  )
  const safeIndex = useMemo(() => {
    if (!modalItems.length) return -1
    if (typeof activeIndex === 'number' && Number.isFinite(activeIndex)) {
      return ((activeIndex % modalItems.length) + modalItems.length) % modalItems.length
    }
    if (!item) return 0
    const matchedIndex = modalItems.findIndex((entry) => entry.id === item.id)
    return matchedIndex >= 0 ? matchedIndex : 0
  }, [activeIndex, item, modalItems])
  const activeItem = safeIndex >= 0 ? modalItems[safeIndex] : item
  if (!activeItem) return null

  const canNavigate = modalItems.length > 1
  const titleId = `video-reel-modal-title-${activeItem.id}`
  const displayTitle = videoDisplayTitle(activeItem)
  const videoSrc = activeItem.videoSrc || activeItem.video

  const handlePrev = useCallback((event) => {
    event.stopPropagation()
    if (canNavigate) onPrev?.()
  }, [canNavigate, onPrev])

  const handleNext = useCallback((event) => {
    event.stopPropagation()
    if (canNavigate) onNext?.()
  }, [canNavigate, onNext])

  useEffect(() => {
    document.body.classList.add('video-reel-modal-open')
    return () => document.body.classList.remove('video-reel-modal-open')
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && canNavigate) {
        event.preventDefault()
        onPrev?.()
      }
      if (event.key === 'ArrowRight' && canNavigate) {
        event.preventDefault()
        onNext?.()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canNavigate, onClose, onNext, onPrev])

  useEffect(() => {
    panelRef.current?.focus()
    const el = videoRef.current
    if (!el) return
    el.muted = false
    el.defaultMuted = false
    el.volume = 1
    const play = el.play()
    if (play?.catch) play.catch(() => {})
    return () => {
      el.pause()
      el.currentTime = 0
    }
  }, [activeItem, videoSrc])

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <div
      className="video-reel-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
    >
      <div
        className="video-reel-modal__shell"
        onClick={(event) => event.stopPropagation()}
      >
        {canNavigate ? (
          <>
            <NavArrow direction="prev" onClick={handlePrev} />
            <NavArrow direction="next" onClick={handleNext} />
          </>
        ) : null}

        <div
          ref={panelRef}
          className="video-reel-modal__panel"
          tabIndex={-1}
        >
          <button
            type="button"
            className="video-reel-modal__close"
            onClick={onClose}
            aria-label="Fermer la vidéo"
          >
            <span aria-hidden="true">×</span>
          </button>

          <header className="video-reel-modal__header">
            <p className="video-reel-modal__eyebrow">Production vidéo</p>
            <h2 id={titleId} className="video-reel-modal__title" title={displayTitle}>
              {displayTitle}
            </h2>
          </header>

          {videoSrc ? (
            <div className="video-reel-modal__player">
              <video
                ref={videoRef}
                className="video-reel-modal__video"
                src={videoSrc}
                poster={activeItem.poster || undefined}
                controls
                autoPlay
                playsInline
                preload="auto"
                aria-label={videoAriaLabel(activeItem, 'Lecture')}
              />
            </div>
          ) : activeItem.poster ? (
            <div className="video-reel-modal__fallback">
              <img src={activeItem.poster} alt="" className="video-reel-modal__poster" />
              <p className="video-reel-modal__message">Vidéo disponible sur demande</p>
              <Link to="/contact" className="video-reel-modal__contact" onClick={onClose}>
                Nous contacter
              </Link>
            </div>
          ) : null}

          {canNavigate ? (
            <div className="video-reel-modal__nav-bar" aria-label="Navigation entre les vidéos">
              <NavArrow direction="prev" onClick={handlePrev} />
              <NavArrow direction="next" onClick={handleNext} />
            </div>
          ) : null}

          {activeItem.publicUrl ? (
            <a
              href={activeItem.publicUrl}
              className="video-reel-modal__external"
              target="_blank"
              rel="noreferrer noopener"
            >
              Voir la vidéo en ligne ↗
            </a>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  )
}
