import { Fragment } from 'react'
import { Link } from 'react-router-dom'

/* Haut de page intérieure : voiles WebGL comme l'accueil, fil d'Ariane, surtitre SEO, titre et accroche. */
export default function PageHero({ crumbs = [], kicker, title, lede, children, aside, size = '' }) {
  return (
    <section className={`phero dark ${size}`.trim()} id="top">
      <div className="aur" aria-hidden="true">
        <canvas className="mesh" id="mesh" />
        <div className="vig" />
        <div className="grain" />
      </div>
      <div className="wrap">
        <div className={`c ph-in${aside ? ' has-aside' : ''}`}>
          <div className="ph-main">
            <nav className="crumbs ia" aria-label="Fil d'Ariane" style={{ '--d': '0ms' }}>
              <Link to="/">Accueil</Link>
              {crumbs.map((c, i) => (
                <Fragment key={c.label}>
                  <span aria-hidden="true">/</span>
                  {c.to && i < crumbs.length - 1 ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                </Fragment>
              ))}
            </nav>
            <h1 className="h1 ph-t">
              {kicker ? <span className="kick ia" style={{ '--d': '60ms' }}>{kicker}</span> : null}
              <span className="ph-tt ia" style={{ '--d': '140ms' }}>{title}</span>
            </h1>
            {lede ? <p className="lede ia" style={{ '--d': '260ms' }}>{lede}</p> : null}
            {children ? <div className="ph-x ia" style={{ '--d': '360ms' }}>{children}</div> : null}
          </div>
          {aside ? <div className="ph-aside ia" style={{ '--d': '300ms' }}>{aside}</div> : null}
        </div>
      </div>
    </section>
  )
}

/* Trait dessiné à la main sous un mot (comme sur l'accueil). */
export function Swash({ children }) {
  return (
    <span className="sw">{children}<svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true"><path d="M3 15 C70 5 160 3 297 10" /><path d="M24 21 C110 13 200 12 288 16" /></svg></span>
  )
}

/* Swash déclenché à l'apparition de la section (dans un bloc [data-r]). */
export function SwashR({ children }) {
  return (
    <span className="sw" data-sw>{children}<svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true"><path d="M3 15 C70 5 160 3 297 10" /><path d="M24 21 C110 13 200 12 288 16" /></svg></span>
  )
}
