import { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react'
import './App.css'
import { ParallaxBackground, ParallaxForeground } from './useParallax.jsx'
import { DURATION, EASING, STAGGER, ANIMATE_VARIANTS, TRANSITION_PROPS, VIEWPORT_SETTINGS, HOVER_TRANSITION } from './animationConstants.js'
import vid1 from '../media/videos/vid1.mp4'
import vid2 from '../media/videos/vid2.mp4'
import vid3 from '../media/videos/vid3.mp4'
import vid4 from '../media/videos/vid4.mp4'
import vid5 from '../media/videos/vid5.mp4'
import vid6 from '../media/videos/vid6.mp4'
const nousImage = '/nous.webp'

/* ============================================================
   HELPERS
   ============================================================ */
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const mix = (start, end, amount) => start + (end - start) * amount
const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3)
const easeInOutCubic = (value) => (
  value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2
)

/* ============================================================
   UNIFIED MOTION VARIANTS (réutilisés partout)
   ============================================================ */
const stagger = ANIMATE_VARIANTS.staggerContainer
const fadeUpChild = ANIMATE_VARIANTS.fadeUp
const revealViewport = VIEWPORT_SETTINGS

/* ============================================================
   DATA
   ============================================================ */
const SERVICES = [
  {
    num: '01',
    title: 'Stratégie de marque & branding',
    desc: "Positionnement, naming, identité visuelle, direction artistique. Un territoire de marque que vos concurrents ne peuvent pas copier.",
    kw: 'stratégie de marque Marrakech',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Création de site web',
    desc: "Sites vitrines, one pages et e-commerce. Conçus pour être rapides, référencés et orientés conversion dès la première ligne de code.",
    kw: 'création site web Marrakech',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20M6 6.5h.01M9 6.5h.01M12 6.5h.01"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Production de contenus',
    desc: "Photo, vidéo, direction artistique, contenus verticaux pour Instagram, TikTok, Meta et YouTube Shorts.",
    kw: 'production vidéo Marrakech',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Publicité digitale & Meta Ads',
    desc: "Campagnes Meta, TikTok et Snapchat Ads. Création, ciblage, optimisation — un euro dépensé doit rapporter un euro lisible.",
    kw: 'agence publicité Meta Ads Marrakech',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l18-8v18l-18-8v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/>
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Social media management',
    desc: "Ligne éditoriale, calendrier, publication, animation. Une présence qui parle la même langue que votre marque.",
    kw: 'community management Marrakech',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Applications web & mobile',
    desc: "Apps iOS, Android et PWA. Interfaces soignées, code propre, architecture pensée pour durer trois ans minimum.",
    kw: 'développement application mobile Marrakech',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>
      </svg>
    ),
  },
  {
    num: '07',
    title: 'SaaS & plateformes sur-mesure',
    desc: "Dashboards, outils internes, espaces clients. Pour transformer un bon processus en produit digital qui travaille pour vous.",
    kw: 'développement SaaS Marrakech',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    num: '08',
    title: 'Automatisation & agents IA',
    desc: "Workflows n8n, intégrations API, agents conversationnels GPT et Claude. L'IA au service de vos opérations, pas de la démonstration.",
    kw: 'automatisation IA Marrakech',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 16h.01M16 16h.01"/>
      </svg>
    ),
  },
]

const METHODE = [
  { num: '01', title: 'Comprendre', desc: "Un atelier de cadrage pour lire votre marché, vos forces, vos angles morts.", tags: 'Atelier stratégique • Positionnement • Roadmap' },
  { num: '02', title: 'Structurer', desc: "Positionnement, messages essentiels, priorités, plan d'action.", tags: 'Messages clés • Architecture • Priorités' },
  { num: '03', title: 'Créer', desc: "Identité, contenus, interfaces, code. Produits livrables concrets.", tags: 'Branding • Design • Contenu' },
  { num: '04', title: 'Déployer', desc: "Mise en ligne, diffusion, campagnes, mise sous tension.", tags: 'Setup • Lancement • Campagnes' },
  { num: '05', title: 'Optimiser', desc: "Mesure, ajustements, itération. Un projet vivant, pas un livrable figé.", tags: 'Testing • Mesure • Amélioration continue' },
]

const SEGMENTS = [
  {
    tag: 'Immobilier',
    title: 'Promoteurs & marchands de biens',
    desc: "Valorisation de programmes, communication de lancement, supports de commercialisation. Pour des biens qui méritent d'être vus et choisis.",
  },
  {
    tag: 'Hospitality',
    title: 'Riads, hôtels, restaurants',
    desc: "Identité, contenus, sites avec réservation, publicité géolocalisée touriste. Pour capter 3 millions de visiteurs par an à Marrakech.",
  },
  {
    tag: 'PME & Start-ups',
    title: 'Entreprises locales ambitieuses',
    desc: "Refonte d'image, sites performants, outils métier, automatisation IA. Pour passer un cap de structure sans perdre votre ADN.",
  },
  {
    tag: 'Personal branding',
    title: 'Fondateurs, experts, dirigeants',
    desc: "Positionnement, narration, site d'autorité, présence LinkedIn. Pour que votre nom pèse autant que votre entreprise.",
  },
]

const FAQ = [
  {
    q: "Combien coûte la création d'un site web à Marrakech ?",
    a: "Nos sites vitrines démarrent autour de 15 000 MAD, les e-commerce à partir de 35 000 MAD, et les projets sur-mesure (SaaS, applications) sont chiffrés après cadrage. Nous remettons un devis détaillé sous 48 heures.",
  },
  {
    q: "Quel est le délai pour un projet de communication 360° ?",
    a: "Une refonte d'identité prend 2 à 4 semaines, un site web 3 à 6 semaines, une campagne publicitaire peut être en ligne en 5 jours. Les projets IA demandent 4 à 12 semaines selon la complexité.",
  },
  {
    q: "Travaillez-vous avec des clients hors Marrakech ?",
    a: "Oui. Notre atelier est à Marrakech mais nous accompagnons des clients à Casablanca, Rabat et à l'international. Les cadrages se font en visio ou en présentiel selon votre préférence.",
  },
  {
    q: "Qu'est-ce qu'un agent IA et pourquoi l'intégrer à mon entreprise ?",
    a: "Un agent IA est un assistant automatisé qui répond à vos prospects, qualifie vos leads ou exécute des tâches internes (facturation, support, tri d'emails). Il tourne 24 h/24 et traite en moyenne 80 % des demandes de premier niveau.",
  },
  {
    q: "Proposez-vous un accompagnement après la mise en ligne ?",
    a: "Oui, des contrats mensuels couvrent l'hébergement, les mises à jour, les ajustements de contenu et le support prioritaire. Nous proposons aussi du social media management et de la gestion de campagnes en continu.",
  },
]

const SECTORS = ['Immobilier', 'Hôtellerie', 'Restaurants', 'Retail', 'E-commerce', 'Start-ups', 'PME', 'Personal brands']

/* ============================================================
   SECTION COMPONENTS
   ============================================================ */

function SectorsMarquee() {
  return (
    <section className="sectors-bar" aria-label="Secteurs accompagnés par Supra v à Marrakech">
      <div className="sectors-bar__inner">
        <motion.div
          className="sectors-bar__track"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...SECTORS, ...SECTORS, ...SECTORS].map((s, i) => (
            <span key={i} className="sectors-bar__item">
              <span className="sectors-bar__dot" />
              {s}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ServiceScrollCard({ service }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 92%', 'center 48%'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [170, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.28, 1], [0.18, 0.75, 1])
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])

  return (
    <div className="service-scroll-card-container" ref={ref}>
      <div className="service-scroll-card-splash" />
      <motion.article
        className="svc-card service-scroll-card"
        style={{ y, opacity, scale }}
        whileHover={{ 
          y: -6, 
          scale: 1.01,
          boxShadow: "0 20px 60px rgba(17, 17, 17, 0.12), 0 8px 24px rgba(17, 17, 17, 0.08)"
        }}
        transition={HOVER_TRANSITION}
      >
        <div className="svc-card__top">
          <span className="svc-card__num">{service.num}</span>
          <div className="svc-card__icon">{service.icon}</div>
        </div>
        <h3 className="svc-card__title">{service.title}</h3>
        <p className="svc-card__desc">{service.desc}</p>
        <div className="svc-card__kw">{service.kw}</div>
      </motion.article>
    </div>
  )
}

function MethodeOrbitMarker({ method, index, activeIndex, smoothProgress }) {
  const textRotate = useTransform(smoothProgress, (latest) => 144 * latest + 45 - index * 36)

  return (
    <span
      className={`methode-orbit-marker ${activeIndex === index ? 'is-active' : ''}`}
      style={{ '--method-angle': `${-90 + index * 36}deg` }}
    >
      <motion.span style={{ rotate: textRotate }}>{method.num}</motion.span>
    </span>
  )
}

function ServicesSection() {
  return (
    <section className="section services-section" id="services">
      <ParallaxBackground className="services-section__background" speed={0.9}>
        <div className="container">
        <motion.div
          className="section-head"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          <motion.p variants={fadeUpChild} className="label">02 — Services</motion.p>
          <motion.h2 variants={fadeUpChild} className="section-head__title">
            Nos services de communication, création web et <span className="text-accent">intelligence artificielle</span>.
          </motion.h2>
          <motion.p variants={fadeUpChild} className="section-head__lead">
            De la stratégie de marque au produit digital finalisé. Supra v. couvre toute la chaîne, sans sous-traiter, depuis Marrakech.
          </motion.p>
        </motion.div>

        <div className="services-scroll-stack">
          {SERVICES.map((s) => (
            <ServiceScrollCard service={s} key={s.num} />
          ))}
        </div>
      </div>
      </ParallaxBackground>
    </section>
  )
}

function MethodeSection() {
  const ref = useRef(null)
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 22,
    mass: 0.32,
    restDelta: 0.0008,
  })
  const orbitRotate = useTransform(smoothProgress, [0, 1], [0, -144])
  const active = METHODE[activeIndex]

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const next = clamp(Math.round(latest * (METHODE.length - 1)), 0, METHODE.length - 1)
    if (next === activeIndexRef.current) return
    activeIndexRef.current = next
    setActiveIndex(next)
  })

  return (
    <section className="methode-section" id="methode" ref={ref}>
      <div className="methode-sticky">
        <div className="methode-panel">
          <div className="methode-process-label">PROCESS</div>
          <h2 className="methode-title">Une approche collaborative</h2>

          <div className="methode-stage">
            <div className="methode-active-step">
              <span>ÉTAPE</span>
              <strong>{active.num}</strong>
            </div>

            <div className="methode-orbit" aria-hidden="true">
              <motion.div className="methode-orbit-track" style={{ rotate: orbitRotate }}>
                {METHODE.map((m, i) => (
                  <MethodeOrbitMarker
                    key={m.num}
                    method={m}
                    index={i}
                    activeIndex={activeIndex}
                    smoothProgress={smoothProgress}
                  />
                ))}
              </motion.div>
            </div>

            <motion.div
              className="methode-stage-copy"
              key={active.num}
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3>{active.title}</h3>
              <p>{active.desc}</p>
              <div className="methode-stage-tags">{active.tags}</div>
              <a href="#contact" className="methode-stage-button">Parler de votre projet</a>
            </motion.div>

            <div className="methode-progress">
              <span>{active.num} / {String(METHODE.length).padStart(2, '0')}</span>
              <div className="methode-progress-dots" aria-label={`Étape ${activeIndex + 1} sur ${METHODE.length}`}>
                {METHODE.map((m, i) => (
                  <span key={m.num} className={activeIndex === i ? 'is-active' : ''} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SegmentsSection() {
  return (
    <section className="section segments-section" id="segments">
      <div className="container">
        <motion.div
          className="section-head"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          <motion.p variants={fadeUpChild} className="label">04 — Pour qui</motion.p>
          <motion.h2 variants={fadeUpChild} className="section-head__title">
            À Marrakech, nous accompagnons <span className="text-accent">quatre types de clients.</span>
          </motion.h2>
          <motion.p variants={fadeUpChild} className="section-head__lead">
            Le dénominateur commun : des projets qui méritent une image à hauteur de leur ambition.
          </motion.p>
        </motion.div>

        <motion.div
          className="segments-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          {SEGMENTS.map((seg) => (
            <motion.article
              key={seg.tag}
              className="seg-card"
              variants={fadeUpChild}
              whileHover={{ 
                y: -6, 
                scale: 1.01,
                boxShadow: "0 20px 60px rgba(17, 17, 17, 0.12), 0 8px 24px rgba(17, 17, 17, 0.08)"
              }}
              transition={HOVER_TRANSITION}
            >
              <span className="seg-card__tag">{seg.tag}</span>
              <h3 className="seg-card__title">{seg.title}</h3>
              <p className="seg-card__desc">{seg.desc}</p>
              <svg className="seg-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M8 7h9v9"/>
              </svg>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FaqSection() {
  const [open, setOpen] = useState(0)

  return (
    <section className="section faq-section" id="faq">
      <div className="container container--narrow-faq">
        <motion.div
          className="section-head"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          <motion.p variants={fadeUpChild} className="label">05 — Questions fréquentes</motion.p>
          <motion.h2 variants={fadeUpChild} className="section-head__title">
            Les questions qu'on nous pose <span className="text-accent">avant de démarrer.</span>
          </motion.h2>
        </motion.div>

        <motion.ul
          className="faq-list"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          {FAQ.map((item, i) => {
            const isOpen = open === i
            return (
              <motion.li
                key={i}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
                variants={fadeUpChild}
              >
                <button
                  type="button"
                  className="faq-item__q"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-item__num">0{i + 1}</span>
                  <h3 className="faq-item__title">{item.q}</h3>
                  <span className={`faq-item__toggle ${isOpen ? 'is-open' : ''}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="faq-item__a-wrap"
                    >
                      <p className="faq-item__a">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}

function CtaSection() {
  const [formStatus, setFormStatus] = useState('idle')

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
    const project = formData.get('project')
    const message = formData.get('message')
    const subject = encodeURIComponent(`Nouveau projet Supra v — ${name}`)
    const body = encodeURIComponent(
      `Nom: ${name}\nEmail: ${email}\nProjet: ${project}\n\nMessage:\n${message}`
    )

    setFormStatus('sent')
    window.location.href = `mailto:hello@supra-v.ma?subject=${subject}&body=${body}`
  }

  return (
    <section className="cta-final" id="contact">
      <div className="container">
        <motion.div
          className="cta-final__inner"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          <motion.form
            variants={fadeUpChild}
            className="cta-form"
            onSubmit={handleSubmit}
          >
            <div className="cta-form__fireworks" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="cta-form__head">
              <span className="cta-form__pill">Contact</span>
              <h2>Parlons de votre projet à Marrakech.</h2>
              <p>Un café à Guéliz, un appel en visio, ou un WhatsApp. La première conversation est offerte.</p>
            </div>

            <label className="cta-field">
              <span>Votre nom</span>
              <input name="name" type="text" placeholder="Nom complet" required />
            </label>

            <label className="cta-field">
              <span>Email</span>
              <input name="email" type="email" placeholder="vous@email.com" required />
            </label>

            <label className="cta-field">
              <span>Type de projet</span>
              <select name="project" defaultValue="" required>
                <option value="" disabled>Sélectionnez...</option>
                <option>Branding & site web</option>
                <option>Production contenu</option>
                <option>Application ou SaaS</option>
                <option>Automatisation IA</option>
                <option>Campagne publicitaire</option>
              </select>
            </label>

            <label className="cta-field cta-field--wide">
              <span>Votre message</span>
              <textarea name="message" placeholder="Décrivez votre projet en quelques lignes." rows="5" required />
            </label>

            <div className="cta-form__bottom">
              <motion.button
                type="submit"
                className="cta-form__submit"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                Envoyer
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
              <a href="https://wa.me/212600000000" className="cta-form__whatsapp">WhatsApp direct</a>
            </div>

            <AnimatePresence>
              {formStatus === 'sent' && (
                <motion.p
                  className="cta-form__status"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  Votre application mail s'ouvre avec le message prêt.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <a href="#" className="site-footer__logo">supra v.</a>
            <p className="site-footer__tagline">
              Agence de communication 360° à Marrakech. Branding, sites web, applications et agents IA. Une équipe, de la stratégie au code.
            </p>
          </div>

          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Navigation</h4>
            <a href="#works">Réalisations</a>
            <a href="#services">Services</a>
            <a href="#methode">Méthode</a>
            <a href="#segments">Pour qui</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Services</h4>
            <a href="#services">Stratégie de marque</a>
            <a href="#services">Création site web Marrakech</a>
            <a href="#services">Applications mobiles</a>
            <a href="#services">Automatisation IA</a>
          </div>

          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Contact</h4>
            <a href="mailto:hello@supra-v.ma">hello@supra-v.ma</a>
            <a href="https://wa.me/212600000000">WhatsApp</a>
            <p>Marrakech, Maroc</p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© 2026 Supra v. — Agence de communication Marrakech</span>
          <span>Conçu &amp; codé en interne</span>
        </div>
      </div>
    </footer>
  )
}

function WhatsappFab() {
  return (
    <motion.a
      href="https://wa.me/212600000000"
      className="whatsapp-fab"
      aria-label="Contacter Supra v sur WhatsApp"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </motion.a>
  )
}

/* ============================================================
   MAIN APP
   ============================================================ */
function App() {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [headerHidden, setHeaderHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0
    if (current > previous && current > 150) setHeaderHidden(true)
    else setHeaderHidden(false)
    
    // Set scrolled state for background changes
    setScrolled(current > 50)
  })

  useEffect(() => {
    let frameId = 0
    const updateProgress = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth
      const sectionTop = window.scrollY + rect.top
      const sectionHeight = sectionRef.current.offsetHeight
      const scrollable = Math.max(sectionHeight - viewportHeight, 1)
      const next = clamp((window.scrollY - sectionTop) / scrollable, 0, 1)
      setViewport((current) => (
        current.width === viewportWidth && current.height === viewportHeight
          ? current
          : { width: viewportWidth, height: viewportHeight }
      ))
      setProgress(next)
      frameId = 0
    }
    const onScroll = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateProgress)
    }
    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.visualViewport?.addEventListener('resize', onScroll)
    window.visualViewport?.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('scroll', onScroll)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [])

  const videos = [vid1, vid2, vid3, vid4, vid5, vid6]
  const viewportWidth = viewport.width || 430
  const viewportHeight = viewport.height || 932
  const isMobile = viewportWidth <= 768

  const introPhase = clamp(progress / 0.18, 0, 1)
  const growPhase = easeInOutCubic(clamp((progress - 0.08) / 0.72, 0, 1))
  const labelFade = 1 - easeOutCubic(clamp((progress - 0.26) / 0.28, 0, 1))
  const captionPhase = easeOutCubic(clamp((progress - 0.22) / 0.22, 0, 1))
  const footerPhase = easeOutCubic(clamp((progress - 0.78) / 0.16, 0, 1))

  const collapsedWidth = isMobile ? 38 : 72
  const collapsedHeight = isMobile ? 158 : 230
  const expandedWidth = isMobile
    ? Math.min(viewportWidth * 0.82, 360)
    : Math.min(viewportWidth * 0.92, 1480)
  const expandedHeight = isMobile
    ? Math.min(viewportHeight * 0.66, 620)
    : Math.min(viewportHeight * 0.84, 920)

  const cardWidth = mix(collapsedWidth, expandedWidth, growPhase)
  const cardHeight = mix(collapsedHeight, expandedHeight, growPhase)
  const cardRadius = mix(26, isMobile ? 30 : 40, growPhase)
  const cardTop = mix(isMobile ? 54 : 57, isMobile ? 44 : 48, footerPhase)

  const imageScale = mix(1.28, 1, growPhase)
  const imageTranslateX = mix(isMobile ? 18 : 28, 0, growPhase)
  const imageTranslateY = mix(0, isMobile ? -16 : -8, footerPhase)
  const imageOpacity = isMobile
    ? clamp((progress - 0.08) / 0.18, 0, 1)
    : mix(0.28, 1, growPhase)
  const pillOpacity = isMobile
    ? 1 - easeOutCubic(clamp((progress - 0.04) / 0.18, 0, 1))
    : 1 - easeOutCubic(clamp((progress - 0.18) / 0.28, 0, 1))

  const copyGap = mix(18, isMobile ? 28 : 36, introPhase)
  const sideAnchor = cardWidth / 2 + copyGap
  const sideDrift = mix(0, isMobile ? 8 : 18, growPhase)
  const copyYOffset = mix(0, -18, footerPhase)

  const captionOpacity = mix(0, 1, captionPhase) * (1 - footerPhase * 0.35)
  const captionTranslate = mix(18, 0, captionPhase)

  return (
    <div className="app">
      {/* ========== HEADER ========== */}
      <motion.header
        className={`site-header ${scrolled ? 'scrolled' : ''}`}
        animate={{ 
          y: headerHidden ? -140 : 0, 
          opacity: headerHidden ? 0 : 1,
          height: scrolled ? 64 : 72
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <div className="top-banner-wrapper">
          <div className="top-banner">
            <span className="top-banner__dot"></span>
            Disponible pour vos projets à Marrakech
          </div>
        </div>

        <nav className="nav">
          <a href="#" className="nav__logo">supra v.</a>
          <ul className="nav__links">
            <li><a href="#works" className="nav__link nav__link--active">Works</a></li>
            <li><a href="#services" className="nav__link">Services</a></li>
            <li><a href="#methode" className="nav__link">Méthode</a></li>
            <li><a href="#faq" className="nav__link">FAQ</a></li>
          </ul>
          <a href="#contact" className="btn btn--ghost">Contact</a>
        </nav>
      </motion.header>

      <main className="page-content">
        {/* ========== HERO ========== */}
        <motion.section 
          className="hero"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: DURATION.SLOW, delay: 0.5, ease: EASING }}
        >
          <ParallaxBackground className="hero__background" speed={0.9}>
            <motion.div
              className="trust-bar"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.NORMAL, delay: 0.3, ease: EASING }}
            >
              <div className="trust-bar__avatars">
                <div className="trust-bar__avatar">S</div>
                <div className="trust-bar__avatar">V</div>
                <div className="trust-bar__avatar">3</div>
              </div>
              <span className="trust-bar__text">Marrakech · Disponible pour de nouveaux projets</span>
            </motion.div>
          </ParallaxBackground>

          <motion.h1
            className="heading-hero hero__title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.SLOW, delay: 0.2, ease: EASING }}
          >
            Agence de communication
            <span className="text-accent hero__number"> 360° </span>
            à Marrakech pour faire grandir
            <br />
            votre <span className="text-gradient">marque</span>.
          </motion.h1>

          <motion.p
            className="text-body hero__subtitle"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.NORMAL, delay: 0.35, ease: EASING }}
          >
            Branding, contenus premium, sites web, applications et agents IA. Une seule équipe à Marrakech pour penser votre image, l'écrire, la filmer, la diffuser et la faire tourner en ligne.
          </motion.p>

          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.NORMAL, delay: 0.5, ease: EASING }}
          >
            <a href="#works" className="btn btn--primary">
              Voir nos réalisations
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#contact" className="btn btn--secondary">
              Parler de votre projet
            </a>
          </motion.div>
        </motion.section>

        {/* ========== SECTORS BAR ========== */}
        <SectorsMarquee />

        {/* ========== RÉALISATIONS (existant) ========== */}
        <section className="media-clouds section" id="works">
          <motion.div
            className="media-clouds__header"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            <motion.p variants={fadeUpChild} className="label">01 — Réalisations</motion.p>
            <motion.h2 variants={fadeUpChild} className="heading-2">
              Du brand book à la campagne, les projets qui ont tourné en 2025.
            </motion.h2>
            <motion.p variants={fadeUpChild} className="media-clouds__lead">
              Six extraits de productions récentes — identités, films de marque, contenus publicitaires diffusés sur Meta et TikTok.
            </motion.p>
          </motion.div>

          <div className="media-clouds__viewport">
            <div className="media-clouds__track">
              {videos.concat(videos).map((videoSrc, index) => (
                <motion.article 
                  className="media-clouds__item" 
                  key={`${videoSrc}-${index}`}
                  whileHover={{ 
                    y: -6, 
                    scale: 1.01,
                    boxShadow: "0 20px 60px rgba(17, 17, 17, 0.12), 0 8px 24px rgba(17, 17, 17, 0.08)"
                  }}
                  transition={HOVER_TRANSITION}
                >
                  <video
                    className="video-card"
                    src={videoSrc}
                    muted
                    loop
                    autoPlay
                    playsInline
                    aria-label="Réalisation vidéo agence de communication Marrakech"
                  />
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ========== STORY (existant) ========== */}
        <section className="story-shell lstory-shel" ref={sectionRef} id="about">
          <div className="story-shell__sticky">
            <div className="story-scene">
              <div
                className="story-copy story-copy--left"
                style={{
                  right: `calc(50% + ${sideAnchor - sideDrift}px)`,
                  opacity: labelFade,
                  transform: `translateY(calc(-50% + ${copyYOffset}px))`,
                }}
              >
                Nous sommes
              </div>

              <div
                className="story-card"
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  borderRadius: `${cardRadius}px`,
                  top: `${cardTop}%`,
                }}
              >
                <img
                  className="story-card__pill"
                  src={nousImage}
                  alt=""
                  aria-hidden="true"
                  style={{ opacity: pillOpacity }}
                />
                <img
                  className="story-card__image"
                  src={nousImage}
                  alt="L'équipe Supra v - agence de communication Marrakech"
                  style={{
                    opacity: imageOpacity,
                    transform: `scale(${imageScale}) translate(${imageTranslateX}px, ${imageTranslateY}px)`,
                  }}
                />
                <div className="story-card__veil" />
                <div
                  className="story-card__caption"
                  style={{
                    opacity: captionOpacity,
                    transform: `translate(-50%, ${captionTranslate}px)`,
                  }}
                >
                  Pas qu'une
                  <br />
                  agence.
                </div>
              </div>

              <div
                className="story-copy story-copy--right"
                style={{
                  left: `calc(50% + ${sideAnchor - sideDrift}px)`,
                  opacity: labelFade,
                  transform: `translateY(calc(-50% + ${copyYOffset}px))`,
                }}
              >
                Supra<span className="story-copy__mark">v3</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========== NEW SECTIONS ========== */}
        <ServicesSection />
        <MethodeSection />
        <SegmentsSection />
        <FaqSection />
        <CtaSection />
      </main>

      <SiteFooter />
      <WhatsappFab />
    </div>
  )
}

export default App
