import { useEffect, useRef, useState } from 'react'
import { WEBSITE_PROJECTS, websitePosterAlt } from '../../data/websiteProjects.js'
import AnimatedText from '../animations/AnimatedText.jsx'
import '../../styles/home-website-showcase.css'

const STRIP_ITEMS = [
  { slug: 'emara-estates', size: 'lg' },
  { slug: 'hachkar', size: 'md' },
  { slug: 'by-merrachi', size: 'md' },
  { slug: 'africa-beauty', size: 'md' },
  { slug: 'gatsby-barber', size: 'md' },
  { slug: 'verde-paris', size: 'lg' },
]

function projectBySlug(slug) {
  return WEBSITE_PROJECTS.find((project) => project.slug === slug)
}

function ShowcaseCard({ entry }) {
  const project = projectBySlug(entry.slug)
  if (!project?.poster) return null

  return (
    <div className={`home-website-showcase__card home-website-showcase__card--${entry.size}`}>
      <img
        src={project.poster}
        alt={websitePosterAlt(project.name)}
        width={480}
        height={300}
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    </div>
  )
}

/** Bandeau visuel projets web — une seule bande horizontale sous le hero */
export default function HomeWebsiteShowcase() {
  const [loopTrack, setLoopTrack] = useState(false)
  const viewportRef = useRef(null)
  const [isOffscreen, setIsOffscreen] = useState(false)
  const [isNearViewport, setIsNearViewport] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 769px)')
    const update = () => setLoopTrack(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting)
        setIsOffscreen(!entry.isIntersecting)
      },
      { rootMargin: '80px 0px', threshold: 0 },
    )
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  const cards = STRIP_ITEMS.map((entry) => ({
    entry,
    project: projectBySlug(entry.slug),
  })).filter(({ project }) => project?.poster)

  const trackItems = loopTrack ? [...cards, ...cards] : cards

  return (
    <section className="home-website-showcase" aria-label="Aperçu de projets web Supra v3">
      <p className="home-website-showcase__sr-only">
        Aperçu de sites web réalisés par Supra v3 : immobilier, mode, beauté, barber et restauration.
      </p>

      <AnimatedText
        as="h2"
        className="home-website-showcase__heading"
        text="Sites web réalisés"
        animateBy="words"
        direction="top"
        delay={100}
        stepDuration={0.35}
        threshold={0.15}
        rootMargin="-50px"
      />

      <div
        ref={viewportRef}
        className={`home-website-showcase__viewport${isOffscreen ? ' is-offscreen' : ''}`}
      >
        <div className="home-website-showcase__track">
          {isNearViewport &&
            trackItems.map(({ entry }, index) => (
              <ShowcaseCard key={`${entry.slug}-${index}`} entry={entry} />
            ))}
        </div>
      </div>

      <div className="home-website-showcase__cta-wrap">
        <a href="/realisations/websites" className="btn btn--secondary home-website-showcase__cta">
          Explorer nos sites web réalisés →
        </a>
      </div>
    </section>
  )
}
