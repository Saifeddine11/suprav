import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import PageSEO from './PageSEO.jsx'
import Breadcrumb from './Breadcrumb.jsx'
import BookingCTA from './BookingCTA.jsx'

import { ANIMATE_VARIANTS, VIEWPORT_SETTINGS, EASING } from '../animationConstants.js'

const DEFAULT_WHATSAPP =
  'https://wa.me/33744208673?text=' +
  encodeURIComponent(
    'Bonjour Supra v3, je souhaite discuter d\'un projet pour mon entreprise.\nType de projet :\nBudget estimé :\nDélai souhaité :'
  )

/* ─────────────────────────────────────────
   Reprend exactement le système d'animation de la page d'accueil
───────────────────────────────────────── */
const stagger = ANIMATE_VARIANTS.staggerContainer
const fadeUp  = ANIMATE_VARIANTS.fadeUp
const viewport = VIEWPORT_SETTINGS

/* Variante spring pour les cartes (même style que serviceCardVariants dans App.jsx) */
const cardVariant = {
  hidden: { opacity: 0, y: 56, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', bounce: 0.28, duration: 0.75, delay: i * 0.1 },
  }),
}

/* ─────────────────────────────────────────
   Icônes SVG (même taille que .svc-card__icon dans App.css)
───────────────────────────────────────── */
const ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20M6 6.5h.01M9 6.5h.01M12 6.5h.01"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11l18-8v18l-18-8v-2z"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 16h.01M16 16h.01"/></svg>,
]

/* ─────────────────────────────────────────
   Composant principal
───────────────────────────────────────── */
export default function SeoPageTemplate({
  seo,
  breadcrumb,
  title,
  subtitle,         // affiché comme eyebrow orange (label)
  intro,
  services = [],
  faq = [],
  stats,            // optionnel : [{ value: '50+', label: 'Projets livrés' }]
  sectionNum = '—', // numéro de section pour les labels
  richContent = [], // [{ heading, body, bullets?, sub? }]
  servicesHeadline = null, // React node ; défaut = titre générique Marrakech
  primaryCta = { href: '/devis-gratuit', label: 'Demander un diagnostic →' },
  secondaryCta = { href: DEFAULT_WHATSAPP, label: 'WhatsApp', external: true },
  internalLinks = [], // [{ label, path, desc? }]
  children = null,
  showBookingCta = true,
}) {
  const [openFaq, setOpenFaq] = useState(-1)
  const { pathname } = useLocation()

  return (
    <>
      <PageSEO {...seo} path={pathname} />

      <article className="seo-page">

        {/* ══════════════════════════
            HERO
        ══════════════════════════ */}
        <header className="seo-hero">
          {/* Gradient de fond (orange top-right, comme la home) */}
          <div className="seo-hero__bg" aria-hidden="true" />

          <div className="container">
            <motion.div
              className="seo-hero__inner"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {/* Breadcrumb */}
              <motion.div variants={fadeUp}>
                <Breadcrumb items={breadcrumb} />
              </motion.div>

              {/* Eyebrow */}
              <motion.p className="label seo-hero__eyebrow" variants={fadeUp}>
                {subtitle || 'Supra v3 — Marrakech'}
              </motion.p>

              {/* H1 */}
              <motion.h1 className="seo-hero__title" variants={fadeUp}>
                {title}
              </motion.h1>

              {/* Intro */}
              <motion.p className="seo-hero__body" variants={fadeUp}>
                {intro}
              </motion.p>

              {/* CTAs */}
              <motion.div className="seo-hero__actions" variants={fadeUp}>
                <motion.a
                  href={primaryCta.href}
                  className="btn btn--primary"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {primaryCta.label}
                </motion.a>
                <motion.a
                  href={secondaryCta.href}
                  className="btn btn--secondary"
                  target={secondaryCta.external !== false ? '_blank' : undefined}
                  rel={secondaryCta.external !== false ? 'noreferrer noopener' : undefined}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </motion.a>
              </motion.div>

              {/* Stats (optionnel) */}
              {stats && stats.length > 0 && (
                <motion.div className="seo-hero__stats" variants={fadeUp}>
                  {stats.map((s, i) => (
                    <div key={i} className="seo-hero__stat">
                      <span className="seo-hero__stat-value">{s.value}</span>
                      <span className="seo-hero__stat-label">{s.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </header>

        {/* ══════════════════════════
            SERVICES
        ══════════════════════════ */}
        {services.length > 0 && (
          <section className="seo-services">
            <div className="container">

              {/* Section header */}
              <motion.div
                className="seo-section-head"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={stagger}
              >
                <motion.p className="label" variants={fadeUp}>
                  {sectionNum} — Nos prestations
                </motion.p>
                <motion.h2 className="seo-section-head__title" variants={fadeUp}>
                  {servicesHeadline ?? (
                    <>
                      Ce que nous réalisons<br />
                      pour vous à <span className="text-accent">Marrakech.</span>
                    </>
                  )}
                </motion.h2>
              </motion.div>

              {/* Grille de cartes */}
              <motion.div
                className="seo-services__grid"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {services.map((s, i) => (
                  <motion.div
                    key={i}
                    className="seo-svc-card"
                    variants={cardVariant}
                    custom={i}
                    whileHover={{ y: -5, borderColor: 'rgba(17,17,17,0.9)' }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  >
                    <div className="seo-svc-card__top">
                      <span className="seo-svc-card__num">0{i + 1}</span>
                      <div className="seo-svc-card__icon">
                        {s.icon || ICONS[i % ICONS.length]}
                      </div>
                    </div>
                    <h2 className="seo-svc-card__title">{s.title}</h2>
                    <p className="seo-svc-card__desc">{s.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* ══════════════════════════
            RICH CONTENT — long-form SEO
        ══════════════════════════ */}
        {richContent.length > 0 && (
          <section className="seo-rich">
            <div className="container seo-rich__container">
              <motion.div
                className="seo-rich__body"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={stagger}
              >
                {richContent.map((block, i) => (
                  <motion.div key={i} className="seo-rich__block" variants={fadeUp}>
                    <h2 className="seo-rich__h2">{block.heading}</h2>
                    {Array.isArray(block.body)
                      ? block.body.map((p, j) => <p key={j} className="seo-rich__p">{p}</p>)
                      : <p className="seo-rich__p">{block.body}</p>
                    }
                    {block.bullets && block.bullets.length > 0 && (
                      <ul className="seo-rich__list">
                        {block.bullets.map((b, k) => <li key={k}>{b}</li>)}
                      </ul>
                    )}
                    {block.sub && block.sub.map((s, m) => (
                      <div key={m} className="seo-rich__sub">
                        <h3 className="seo-rich__h3">{s.heading}</h3>
                        {Array.isArray(s.body)
                          ? s.body.map((p, n) => <p key={n} className="seo-rich__p">{p}</p>)
                          : <p className="seo-rich__p">{s.body}</p>
                        }
                      </div>
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {children}

        {internalLinks.length > 0 && (
          <section className="seo-related">
            <div className="container">
              <motion.div
                className="seo-section-head"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={stagger}
              >
                <motion.p className="label" variants={fadeUp}>— Aller plus loin</motion.p>
                <motion.h2 className="seo-section-head__title" variants={fadeUp}>
                  Pages utiles <span className="text-accent">pour la suite.</span>
                </motion.h2>
              </motion.div>
              <motion.ul
                className="seo-related__list"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={stagger}
              >
                {internalLinks.map((link, i) => (
                  <motion.li key={link.path} variants={fadeUp}>
                    <Link to={link.path} className="seo-related__card">
                      <span className="seo-related__label">{link.label}</span>
                      {link.desc && <span className="seo-related__desc">{link.desc}</span>}
                      <span className="seo-related__arrow" aria-hidden="true">→</span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </section>
        )}

        {/* ══════════════════════════
            FAQ — exact même markup que la home
        ══════════════════════════ */}
        {faq.length > 0 && (
          <section className="seo-faq">
            <div className="container seo-faq__container">

              <motion.div
                className="seo-section-head"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={stagger}
              >
                <motion.p className="label" variants={fadeUp}>— Questions fréquentes</motion.p>
                <motion.h2 className="seo-section-head__title" variants={fadeUp}>
                  Les questions qu'on nous pose{' '}
                  <span className="text-accent">avant de démarrer.</span>
                </motion.h2>
              </motion.div>

              <motion.ul
                className="seo-faq-list"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={stagger}
              >
                {faq.map((item, i) => {
                  const isOpen = openFaq === i
                  return (
                    <motion.li
                      key={i}
                      className={`seo-faq-item${isOpen ? ' is-open' : ''}`}
                      variants={fadeUp}
                    >
                      <button
                        type="button"
                        className="seo-faq-item__q"
                        onClick={() => setOpenFaq(isOpen ? -1 : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-a-${i}`}
                      >
                        <span className="seo-faq-item__num">0{i + 1}</span>
                        <h3 className="seo-faq-item__title">{item.q}</h3>
                        <motion.span
                          className={`seo-faq-item__toggle${isOpen ? ' is-open' : ''}`}
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.3, ease: EASING }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`faq-a-${i}`}
                            key="content"
                            className="seo-faq-item__a-wrap"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <p className="seo-faq-item__a">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  )
                })}
              </motion.ul>
            </div>
          </section>
        )}

        {/* ══════════════════════════
            CTA FINAL — panel sombre avec calendrier
        ══════════════════════════ */}
        {showBookingCta && <BookingCTA />}

      </article>
    </>
  )
}
