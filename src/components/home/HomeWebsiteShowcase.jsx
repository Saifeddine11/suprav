import { useEffect, useRef, useState } from 'react'
import { WEBSITE_PROJECTS, websitePosterAlt } from '../../data/websiteProjects.js'
import AnimatedText from '../animations/AnimatedText.jsx'
import BrowserMockup from '../ui/BrowserMockup.jsx'
import '../../styles/home-website-showcase.css'

const STRIP_ITEMS = [
  { slug: 'emara-estates' },
  { slug: 'hachkar' },
  { slug: 'by-merrachi' },
  { slug: 'africa-beauty' },
  { slug: 'gatsby-barber' },
  { slug: 'verde-paris' },
]

function projectBySlug(slug) {
  return WEBSITE_PROJECTS.find((project) => project.slug === slug)
}

function ShowcaseCard({ entry }) {
  const project = projectBySlug(entry.slug)
  if (!project?.poster) return null

  return (
    <div className="home-website-showcase__card">
      <BrowserMockup
        image={project.poster}
        title={project.name}
        url={project.publicUrl}
        alt={websitePosterAlt(project.name)}
        aspectRatio="16 / 10"
        className="home-website-showcase__mockup"
      />
    </div>
  )
}

/** Bandeau visuel projets web — défilement auto + swipe horizontal (comme les vidéos) */
export default function HomeWebsiteShowcase() {
  const viewportRef = useRef(null)
  const [isOffscreen, setIsOffscreen] = useState(false)
  const [isNearViewport, setIsNearViewport] = useState(false)

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

  const trackItems = [...cards, ...cards]

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
