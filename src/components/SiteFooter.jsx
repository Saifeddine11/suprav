import { lazy, Suspense } from 'react'
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '../data/contactChannels.js'
import { OFFICE_ADDRESS_LINE1, OFFICE_ADDRESS_LINE2, OFFICE_NAME } from '../data/officeLocation.js'
import '../styles/map-location.css'

const MapLibreLocation = lazy(() => import('./MapLibreLocation.jsx'))

const LOGO_SRC = '/logo.webp'

function MapFallback() {
  return (
    <div className="map-location map-location--fallback" aria-hidden="true">
      <div className="map-location__placeholder">
        <span className="map-location__placeholder-pin" />
        <span className="map-location__placeholder-label">Marrakech</span>
      </div>
    </div>
  )
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <a href="/" className="site-footer__logo" aria-label="Supra v3 - Accueil">
              <img src={LOGO_SRC} alt="Supra v3" width={120} height={36} decoding="async" />
            </a>
            <p className="site-footer__tagline">
              Agence de communication 360° à Marrakech. Branding, sites web, applications et
              agents IA. Une équipe, de la stratégie au code.
            </p>
          </div>

          <div className="site-footer__col">
            <p className="site-footer__col-title">Navigation</p>
            <a href="/">Accueil</a>
            <a href="/services">Services</a>
            <a href="/realisations">Réalisations</a>
            <a href="/realisations/websites">Sites web</a>
            <a href="/realisations/production-videos">Production vidéos</a>
            <a href="/contact">Contact</a>
            <a href="/blog">Blog</a>
            <a href="/mentions-legales">Mentions légales</a>
          </div>

          <div className="site-footer__col site-footer__col--contact">
            <p className="site-footer__col-title">Contact</p>
            <address className="site-footer__address">
              <strong>{OFFICE_NAME}</strong>
              <span>{OFFICE_ADDRESS_LINE1}</span>
              <span>{OFFICE_ADDRESS_LINE2}</span>
            </address>
            <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
            <a href="mailto:contact@suprav3.com">contact@suprav3.com</a>
            <a href={WHATSAPP_URL}>WhatsApp</a>
          </div>

          <div className="site-footer__map">
            <p className="site-footer__col-title">Localisation</p>
            <Suspense fallback={<MapFallback />}>
              <MapLibreLocation />
            </Suspense>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© 2026 Supra v3 — Agence de communication 360</span>
        </div>
      </div>
    </footer>
  )
}
