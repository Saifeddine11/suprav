import { useCallback, useEffect, useState } from 'react'
import BrowserMockup from './BrowserMockup.jsx'
import './FocusCards.css'

function useFinePointer() {
  const [finePointer, setFinePointer] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFinePointer(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return finePointer
}

function ProjectMedia({ item }) {
  return (
    <>
      <div className="focus-cards__media-inner focus-cards__media-inner--browser">
        <BrowserMockup
          className="browser-mockup--card"
          image={item.poster}
          title={item.title}
          domain={item.domain}
          url={item.publicUrl}
          alt={`Capture du site ${item.title}`}
        />
      </div>

      <div className="focus-cards__overlay" aria-hidden="true">
        <span className="focus-cards__accent-line" />
        <span className="focus-cards__overlay-title">{item.title}</span>
        <span className="focus-cards__overlay-cta">
          {item.publicUrl ? `Voir le site ${item.title}` : `Contacter — ${item.title}`}
          <span aria-hidden="true"> ↗</span>
        </span>
      </div>

      <span className="website-project-card__brand">Supra v3</span>
    </>
  )
}

/**
 * Grille FocusCards pour les projets web — focus au survol / clavier sur desktop.
 */
export default function FocusCards({ items }) {
  const finePointer = useFinePointer()
  const [activeIndex, setActiveIndex] = useState(null)

  const getState = useCallback(
    (index) => {
      if (!finePointer || activeIndex === null) return 'idle'
      return activeIndex === index ? 'focused' : 'dimmed'
    },
    [activeIndex, finePointer],
  )

  const activate = (index) => {
    if (finePointer) setActiveIndex(index)
  }

  const deactivate = () => {
    if (finePointer) setActiveIndex(null)
  }

  return (
    <div className="focus-cards website-projects-grid">
      {items.map((item, index) => {
        const state = getState(index)
        const isExternal = Boolean(item.publicUrl)
        const href = item.publicUrl || '/contact'
        const ctaLabel = isExternal
          ? `Voir le site ${item.title}`
          : `Contacter Supra v3 — ${item.title}`

        return (
          <article
            key={item.id}
            className={`focus-cards__item website-project-card focus-cards__item--${state}`}
            onMouseEnter={() => activate(index)}
            onMouseLeave={deactivate}
            onFocusCapture={() => setActiveIndex(index)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setActiveIndex(null)
              }
            }}
          >
            <a
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer noopener' : undefined}
              className="website-project-card__media website-project-card__media--browser"
              aria-label={
                isExternal
                  ? `Voir le site ${item.title}`
                  : `Contacter Supra v3 au sujet de ${item.title}`
              }
            >
              <ProjectMedia item={item} />
            </a>
            <div className="website-project-card__bottom focus-cards__bottom">
              <div className="focus-cards__copy">
                <div className="focus-cards__copy-meta">
                  <span className="focus-cards__number" aria-hidden="true">
                    {item.number}
                  </span>
                  {item.sector ? (
                    <p className="focus-cards__sector">{item.sector}</p>
                  ) : null}
                </div>
                <p className="focus-cards__card-title">{item.title}</p>
                {item.description ? (
                  <p className="focus-cards__description">{item.description}</p>
                ) : null}
                {item.tag ? <span className="focus-cards__tag">{item.tag}</span> : null}
              </div>
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer noopener' : undefined}
                className="focus-cards__cta"
              >
                {ctaLabel}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        )
      })}
    </div>
  )
}
