import { VIDEO_PROJECTS } from '../../../data/videoProjects.js'
import { BRAND, ICON } from '../data/icons.js'

/* Ordre du carrousel du hero et plateforme affichée sur chaque reel. */
const REELS = [
  ['scultbody-video-01', 'instagram'],
  ['ehab-ads', 'tiktok'],
  ['home-tour-bm', 'instagram'],
  ['africa-beauty-ad', 'instagram'],
  ['legacy-film-immobilier', 'tiktok'],
  ['yasmine-ads', 'tiktok'],
  ['legacy-hospitality', 'instagram'],
  ['sbr-beauty-ad', 'tiktok'],
  ['legacy-social-media', 'instagram'],
]

const bySlug = Object.fromEntries(VIDEO_PROJECTS.map((v) => [v.slug, v]))

function LineIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON[name]} />
    </svg>
  )
}

function AppIcon({ slug }) {
  return (
    <span className={`ap ap-${slug}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={BRAND[slug].d} /></svg>
    </span>
  )
}

export default function HeroReels() {
  return (
    <div className="reels ia" id="reels" style={{ '--d': '940ms' }} role="region" aria-label="Vidéos réalisées par Supra v3, faites glisser pour parcourir">
      <div className="rtrack">
        {REELS.map(([slug, platform], i) => {
          const v = bySlug[slug]
          if (!v) return null
          return (
            <div className="reel" style={{ '--i': i }} role="img" aria-label={v.ariaLabel} key={slug}>
              <div className="rv" style={{ backgroundImage: `url(${v.poster})` }} />
              <video className="rvid" muted loop playsInline preload="none" data-src={v.videoSrc} poster={v.poster} aria-hidden="true" tabIndex={-1} />
              <div className="rui" aria-hidden="true">
                <div>
                  <span className="pg"><i /></span>
                  <div className="rt">
                    <AppIcon slug={platform} />
                    <span>{BRAND[platform].title}</span>
                    <span className="snd"><LineIcon name="mute" /></span>
                  </div>
                </div>
                <div className="rbot">
                  <div className="rb"><b>{v.sector}</b><span>{v.title}</span></div>
                  <div className="ra">
                    <span className="hrt"><LineIcon name="heart" /></span>
                    <LineIcon name="chat" />
                    <LineIcon name="share" />
                  </div>
                </div>
              </div>
              <span className="play" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 4.8v14.4L19 12z" /></svg>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
