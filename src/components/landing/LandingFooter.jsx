import { Link } from 'react-router-dom'
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  SOCIAL_LINKS,
  whatsappUrlWithMessage,
} from '../../data/contactChannels.js'
import { FOOTER, FORM_ANCHOR } from '../../data/landingContent.js'
import { IconInstagram, IconSnapchat, IconTikTok } from '../SocialIcons.jsx'
import { Reveal } from './LandingPrimitives.jsx'
import { trackContactIntent, trackLandingEvent } from './landingMotion.js'

const LOGO_SRC = '/logo.webp'
const SOCIAL_ICONS = { instagram: IconInstagram, tiktok: IconTikTok, snapchat: IconSnapchat }

function WhatsAppIcon() {
  return (
    <svg className="lp-footer__glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.37 1 2.54.12.17 1.73 2.64 4.2 3.71.59.25 1.05.41 1.4.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="lp-footer__glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 3.5h3.2l1.6 4.1-2 1.4a11.5 11.5 0 0 0 5.7 5.7l1.4-2 4.1 1.6v3.2a1.7 1.7 0 0 1-1.8 1.7C9.9 18.8 5.2 14.1 4.8 5.3A1.7 1.7 0 0 1 5.5 3.5Z" />
    </svg>
  )
}

/**
 * Pied de page de la landing, pensé pour un trafic publicitaire (Meta Ads, mobile en premier) :
 * une seule intention, pas de menu du site. WhatsApp en action principale, l’appel en seconde,
 * le formulaire en rappel ; chaque clic est tracé (GA4 + pixel Meta s’il est présent).
 * Les mentions légales et la phrase sur les données restent, la régie les exige.
 */
export default function LandingFooter() {
  const whatsappHref = whatsappUrlWithMessage(FOOTER.whatsapp.message)
  const year = new Date().getFullYear()

  return (
    <footer className="lp lp-footer" aria-label="Nous contacter">
      <div className="lp-container">
        <Reveal className="lp-footer__panel" amount={0.25}>
          <div className="lp-footer__copy">
            <p className="lp-eyebrow">{FOOTER.eyebrow}</p>
            <h2 className="lp-footer__title">{FOOTER.title}</h2>
            <p className="lp-lead">{FOOTER.text}</p>
          </div>

          <div className="lp-footer__actions">
            <a
              className="lp-btn lp-btn--accent lp-footer__btn"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactIntent('whatsapp', 'footer')}
            >
              <WhatsAppIcon />
              <span>{FOOTER.whatsapp.label}</span>
            </a>
            <a
              className="lp-btn lp-btn--line lp-footer__btn"
              href={PHONE_TEL}
              onClick={() => trackContactIntent('phone', 'footer')}
            >
              <PhoneIcon />
              <span>{FOOTER.call} {PHONE_DISPLAY}</span>
            </a>
            <a
              className="lp-link lp-footer__form-link"
              href={`#${FORM_ANCHOR}`}
              onClick={() => trackLandingEvent('cta_click', { cta_place: 'footer', cta_label: FOOTER.form })}
            >
              {FOOTER.form}
            </a>
          </div>

          <ul className="lp-footer__assurances" aria-label="Nos engagements">
            {FOOTER.assurances.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>

        <div className="lp-footer__bottom">
          <div className="lp-footer__brand">
            <img src={LOGO_SRC} alt="Supra v3" width={96} height={29} loading="lazy" decoding="async" />
            <p className="lp-footer__privacy">{FOOTER.privacy}</p>
          </div>

          <div className="lp-footer__meta">
            <span className="lp-footer__copyright">© {year} {FOOTER.copyright}</span>
            <Link
              className="lp-footer__legal"
              to={FOOTER.legal.href}
              onClick={() => trackLandingEvent('cta_click', { cta_place: 'footer', cta_label: FOOTER.legal.label })}
            >
              {FOOTER.legal.label}
            </Link>
            <ul className="lp-footer__social" aria-label="Réseaux sociaux">
              {SOCIAL_LINKS.map((item) => {
                const Icon = SOCIAL_ICONS[item.id]
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      onClick={() => trackLandingEvent('social_click', { network: item.id, cta_place: 'footer' })}
                    >
                      {Icon ? <Icon /> : null}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
