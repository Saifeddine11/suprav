import { useState } from 'react'
import { useScroll, useMotionValueEvent, motion } from 'motion/react'
import { TopNavbar } from '../TopNavbar.jsx'
import logoImage from '../../media/logo.webp'

/**
 * Layout partagé pour toutes les pages SEO (hors home et works).
 * Reprend exactement les mêmes classes CSS que App.jsx — aucune animation modifiée.
 */
export default function PageLayout({ children }) {
  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (current) => {
    setScrolled(current > 50)
  })

  return (
    <div className="app">
      <TopNavbar />

      <main className="page-content">
        {/* ── NAV (identique à SiteHeader dans App.jsx) ── */}
        <header className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
          <div className={`site-header__bar ${scrolled ? 'site-header__bar--scrolled' : ''}`}>
            <nav className="nav" aria-label="Navigation principale">
              <a href="/" className="nav__logo" aria-label="Supra v3 - Accueil">
                <img src={logoImage} alt="Supra v3" />
              </a>
              <ul className="nav__links">
                <li><a href="/#works" className="nav__link">Réalisations</a></li>
                <li><a href="/#services" className="nav__link">Services</a></li>
                <li><a href="/#about" className="nav__link">L'agence</a></li>
                <li><a href="/#faq" className="nav__link">FAQ</a></li>
              </ul>
              <span className="nav__separator" aria-hidden="true" />
              <a href="/#contact" className="btn btn--primary nav__cta">
                Parlons de votre projet →
              </a>
              <button
                type="button"
                className={`nav__hamburger ${navOpen ? 'is-open' : ''}`}
                aria-expanded={navOpen}
                aria-controls="mobile-nav"
                aria-label={navOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                onClick={() => setNavOpen((o) => !o)}
              >
                <span className="nav__hamburger-line nav__hamburger-line--top" />
                <span className="nav__hamburger-line nav__hamburger-line--bottom" />
              </button>
            </nav>
          </div>
          <div
            id="mobile-nav"
            className={`nav__mobile-panel ${navOpen ? 'is-open' : ''}`}
            aria-hidden={!navOpen}
          >
            <ul className="nav__mobile-links">
              <li><a href="/#works" onClick={() => setNavOpen(false)}>Réalisations</a></li>
              <li><a href="/#services" onClick={() => setNavOpen(false)}>Services</a></li>
              <li><a href="/#about" onClick={() => setNavOpen(false)}>L'agence</a></li>
              <li><a href="/#faq" onClick={() => setNavOpen(false)}>FAQ</a></li>
            </ul>
            <span className="nav__mobile-separator" aria-hidden="true" />
            <a href="/#contact" className="btn btn--primary nav__mobile-cta" onClick={() => setNavOpen(false)}>
              Parlons de votre projet →
            </a>
          </div>
        </header>

        {/* ── CONTENU PAGE ── */}
        <div className="seo-layout__content">
          {children}
        </div>

        {/* ── FOOTER (identique à SiteFooter dans App.jsx) ── */}
        <footer className="site-footer">
          <div className="container">
            <div className="site-footer__grid">
              <div className="site-footer__brand">
                <a href="/" className="site-footer__logo" aria-label="Supra v3 - Accueil">
                  <img src={logoImage} alt="Supra v3" />
                </a>
                <p className="site-footer__tagline">
                  Agence de communication 360° à Marrakech. Branding, sites web, applications et agents IA. Une équipe, de la stratégie au code.
                </p>
              </div>
              <div className="site-footer__col">
                <h4 className="site-footer__col-title">Navigation</h4>
                <a href="/#works">Réalisations</a>
                <a href="/#services">Services</a>
                <a href="/#about">L'agence</a>
                <a href="/#faq">FAQ</a>
              </div>
              <div className="site-footer__col">
                <h4 className="site-footer__col-title">Services</h4>
                <a href="/creation-site-web-marrakech">Création site web</a>
                <a href="/branding-marrakech">Branding & identité</a>
                <a href="/automatisation-ia">Automatisation IA</a>
                <a href="/agence-communication-marrakech">Agence communication</a>
              </div>
              <div className="site-footer__col">
                <h4 className="site-footer__col-title">Contact</h4>
                <a href="mailto:contact&#64;suprav3&#46;com">contact&#64;suprav3.com</a>
                <a href="https://wa.me/33744208673">WhatsApp</a>
                <p>Marrakech, Maroc</p>
              </div>
            </div>
            <div className="site-footer__bottom">
              <span>© 2026 Supra v3 — Agence de communication 360</span>
              <span>Conçu &amp; codé en interne</span>
            </div>
          </div>
        </footer>
      </main>

      {/* ── WHATSAPP FAB ── */}
      <motion.a
        href="https://wa.me/33744208673"
        className="whatsapp-fab"
        aria-label="Contacter Supra v sur WhatsApp"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </motion.a>
    </div>
  )
}
