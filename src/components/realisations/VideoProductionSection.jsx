import { VIDEO_PROJECTS } from '../../data/videoProjects.js'
import AnimatedText from '../animations/AnimatedText.jsx'
import VideoReelsGrid from '../ui/VideoReelsGrid.jsx'

export default function VideoProductionSection() {
  return (
    <section
      className="website-projects-section website-projects-section--videos"
      aria-label="Vidéos et contenus produits"
    >
      <div className="website-projects-section__grid-bg" aria-hidden="true" />
      <div className="website-projects-section__inner">
        <div className="website-projects-section__head">
          <p>Production vidéo</p>
          <AnimatedText
            as="h2"
            text="Production vidéo pour marques ambitieuses"
            animateBy="words"
            direction="top"
            delay={100}
            stepDuration={0.35}
            threshold={0.15}
            rootMargin="-50px"
          />
          <p className="website-projects-section__intro">
            Reels, publicités Meta, films immobilier ou contenus beauté : des vidéos pensées pour
            capter l&apos;attention sur Instagram, TikTok et les campagnes payantes.
          </p>
        </div>
        <VideoReelsGrid items={VIDEO_PROJECTS} />
      </div>
    </section>
  )
}
