import { useCallback, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TUBELIGHT_NAV_ICONS, TubelightMobileNav, TubelightNavItem } from './TubelightNav.jsx'
import '../styles/tubelight-nav.css'

const LOGO_SRC = '/logo.webp'

/**
 * Header principal — navigation tubelight flottante (desktop) + barre basse (mobile).
 */
export default function SiteHeader({ scrolled, navOpen, setNavOpen, className = '' }) {
  const { pathname } = useLocation()
  const [realisationsOpen, setRealisationsOpen] = useState(false)
  const closeTimerRef = useRef(null)

  const isHomeActive = pathname === '/'
  const isServicesActive = pathname.startsWith('/services')
  const isRealisationsActive = pathname === '/realisations' || pathname.startsWith('/realisations/')
  const isWebsitesActive = pathname.startsWith('/realisations/websites')
  const isVideosActive = pathname.startsWith('/realisations/production-videos')
  const isBlogActive = pathname === '/blog' || pathname.startsWith('/blog/')
  const isContactActive = pathname.startsWith('/contact')

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const openRealisationsMenu = useCallback(() => {
    clearCloseTimer()
    setRealisationsOpen(true)
  }, [clearCloseTimer])

  const scheduleCloseRealisationsMenu = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setRealisationsOpen(false)
      closeTimerRef.current = null
    }, 160)
  }, [clearCloseTimer])

  const closeMenus = () => {
    setNavOpen(false)
    setRealisationsOpen(false)
    clearCloseTimer()
  }

  const mobileItems = [
    { key: 'home', to: '/', label: 'Accueil', isActive: isHomeActive, icon: TUBELIGHT_NAV_ICONS.home },
    {
      key: 'realisations',
      to: '/realisations',
      label: 'Réalisations',
      isActive: isRealisationsActive,
      icon: TUBELIGHT_NAV_ICONS.realisations,
    },
    { key: 'services', to: '/services', label: 'Services', isActive: isServicesActive, icon: TUBELIGHT_NAV_ICONS.services },
    { key: 'blog', to: '/blog', label: 'Blog', isActive: isBlogActive, icon: TUBELIGHT_NAV_ICONS.blog },
    { key: 'contact', to: '/contact', label: 'Contact', isActive: isContactActive, icon: TUBELIGHT_NAV_ICONS.contact },
  ]

  return (
    <header className={`site-nav ${className} ${scrolled ? 'site-nav--scrolled' : ''}`}>
      <div className={`site-header__bar ${scrolled ? 'site-header__bar--scrolled' : ''}`}>
        <nav className="nav nav--tubelight" aria-label="Navigation principale">
          <Link to="/" className="nav__logo" aria-label="Supra v3 - Accueil">
            <img src={LOGO_SRC} alt="Supra v3" width={120} height={36} fetchPriority="high" decoding="async" />
          </Link>

          <Link to="/contact" className="nav__audit-mobile" aria-label="Demander un audit gratuit">
            Audit gratuit
          </Link>

          <div className="nav__tubelight-desktop">
            <div className="tubelight-nav__pill">
              <TubelightNavItem
                to="/"
                label="Accueil"
                isActive={isHomeActive}
                layoutId="tubelight-lamp-desktop"
              />
              <TubelightNavItem
                to="/services"
                label="Services"
                isActive={isServicesActive}
                layoutId="tubelight-lamp-desktop"
              />

              <div
                className="tubelight-nav__dropdown"
                onMouseEnter={openRealisationsMenu}
                onMouseLeave={scheduleCloseRealisationsMenu}
              >
                <div className="tubelight-nav__dropdown-row">
                  <TubelightNavItem
                    to="/realisations"
                    label="Réalisations"
                    isActive={isRealisationsActive}
                    layoutId="tubelight-lamp-desktop"
                    className="tubelight-nav__item--realisations"
                    onClick={closeMenus}
                  />
                  <button
                    type="button"
                    className="tubelight-nav__dropdown-toggle"
                    aria-expanded={realisationsOpen}
                    aria-haspopup="true"
                    aria-label="Afficher le sous-menu Réalisations"
                    onClick={() => setRealisationsOpen((open) => !open)}
                    onFocus={openRealisationsMenu}
                  >
                    <span aria-hidden="true" />
                  </button>
                </div>
                <ul
                  className={`tubelight-nav__submenu ${realisationsOpen ? 'is-open' : ''}`}
                  role="menu"
                  aria-label="Sous-menu Réalisations"
                  onMouseEnter={openRealisationsMenu}
                  onMouseLeave={scheduleCloseRealisationsMenu}
                >
                  <li role="none">
                    <Link
                      to="/realisations/websites"
                      className={`tubelight-nav__sublink ${isWebsitesActive ? 'tubelight-nav__sublink--active' : ''}`}
                      role="menuitem"
                      onClick={closeMenus}
                    >
                      Sites web
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      to="/realisations/production-videos"
                      className={`tubelight-nav__sublink ${isVideosActive ? 'tubelight-nav__sublink--active' : ''}`}
                      role="menuitem"
                      onClick={closeMenus}
                    >
                      Production vidéos
                    </Link>
                  </li>
                </ul>
              </div>

              <TubelightNavItem
                to="/blog"
                label="Blog"
                isActive={isBlogActive}
                layoutId="tubelight-lamp-desktop"
              />
              <TubelightNavItem
                to="/contact"
                label="Contact"
                isActive={isContactActive}
                layoutId="tubelight-lamp-desktop"
              />
            </div>
          </div>

          <Link to="/contact" className="btn btn--primary nav__cta">
            Parlons de votre projet →
          </Link>
        </nav>
      </div>

      <TubelightMobileNav items={mobileItems} onNavigate={closeMenus} />
    </header>
  )
}
