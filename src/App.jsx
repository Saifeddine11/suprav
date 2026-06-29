import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react'
import './App.css'
import './TopNavbar.css'
import { TopNavbar } from './TopNavbar.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import { ParallaxBackground } from './useParallax.jsx'
import { DURATION, EASING, STAGGER, ANIMATE_VARIANTS, TRANSITION_PROPS, VIEWPORT_SETTINGS, HOVER_TRANSITION } from './animationConstants.js'
import { HOMEPAGE_VIDEO_ITEMS } from './data/videoProjects.js'
import { SEO_PAGES } from './data/seoPages.js'
import { partnerImage } from './data/partnerAssets.js'
import useFinePointer from './hooks/useFinePointer.js'
const VideoReelModal = lazy(() => import('./components/ui/VideoReelModal.jsx'))
import HomeWebsiteShowcase from './components/home/HomeWebsiteShowcase.jsx'
import TargetingSection from './components/home/TargetingSection.jsx'
import AnimatedText from './components/animations/AnimatedText.jsx'
import { PHONE_DISPLAY, PHONE_TEL } from './data/contactChannels.js'

const LOGO_SRC = '/logo.webp'
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
const CONTACT_API_ENDPOINT = '/api/contact.php'
const IS_LOCAL_FORM_PREVIEW = import.meta.env.DEV
const CONTACT_RECAP_STORAGE_KEY = 'suprav-contact-recap'
const CONTACT_RECAP_TTL_MS = 48 * 60 * 60 * 1000
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''
const MIN_FORM_TIME_MS = 0
const INITIAL_CONTACT_VALUES = {
  name: '',
  email: '',
  phone: '',
  message: '',
  website: '',
}
const ERROR_MESSAGES = {
  requiredName: 'Veuillez indiquer votre nom complet.',
  invalidName: 'Veuillez indiquer votre nom complet.',
  requiredEmail: 'Merci de saisir votre adresse email.',
  invalidEmail: 'Merci de saisir une adresse email valide.',
  requiredPhone: 'Merci d’indiquer votre numéro de téléphone.',
  invalidPhone: 'Merci d’indiquer un numéro de téléphone valide.',
  requiredMessage: 'Pouvez-vous nous en dire un peu plus sur votre projet ?',
  invalidMessage: 'Merci de détailler légèrement votre demande pour que nous puissions mieux vous accompagner.',
  nameContainsEmail: 'Veuillez indiquer uniquement votre nom complet dans ce champ.',
  nameContainsPhone: 'Veuillez indiquer uniquement votre nom complet dans ce champ.',
  emailContainsPhone: 'Merci de vérifier votre adresse email.',
  phoneContainsEmail: 'Merci de vérifier votre numéro de téléphone.',
  honeypot: 'Certaines informations semblent incorrectes, merci de vérifier vos champs.',
  tooFast: 'Merci de prendre un instant pour vérifier vos informations avant l’envoi.',
  turnstile: 'Merci de confirmer le formulaire avant l’envoi.',
}
const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"']+@[^\s@<>()[\]\\,;:"']+\.[^\s@<>()[\]\\,;:"']{2,}$/i
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+){0,5}$/
const URL_PATTERN = /(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|ma|fr|info|biz|ru|cn)\b)/i
const SPAM_PATTERN = /\b(?:casino|crypto|bitcoin|forex|loan|viagra|porn|seo backlinks?|whatsapp marketing|telegram)\b/i

const cleanTextInput = (value) => String(value ?? '')
  .split('')
  .filter((char) => {
    const code = char.charCodeAt(0)
    return code > 31 && code !== 127
  })
  .join('')
  .replace(/\s+/g, ' ')
  .trim()

const normalizeForCompare = (value) => cleanTextInput(value).toLowerCase()
const phoneDigits = (value) => String(value ?? '').replace(/\D/g, '')

const sanitizeRecap = (recap) => {
  if (!recap || typeof recap !== 'object') return null

  const expiresAtTime = new Date(recap.expiresAt || 0).getTime()
  if (!Number.isFinite(expiresAtTime) || expiresAtTime <= Date.now()) return null

  return {
    name: cleanTextInput(recap.name),
    date: cleanTextInput(recap.date),
    time: cleanTextInput(recap.time),
    message: cleanTextInput(recap.message),
    sentAt: cleanTextInput(recap.sentAt),
    expiresAt: cleanTextInput(recap.expiresAt),
  }
}

const buildContactRecap = ({ name, date, time, message }) => {
  const now = new Date()
  return {
    name: cleanTextInput(name),
    date: cleanTextInput(date),
    time: cleanTextInput(time),
    message: cleanTextInput(message),
    sentAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CONTACT_RECAP_TTL_MS).toISOString(),
  }
}

const readLocalContactRecap = () => {
  if (typeof window === 'undefined') return null

  try {
    const stored = window.localStorage.getItem(CONTACT_RECAP_STORAGE_KEY)
    const recap = sanitizeRecap(stored ? JSON.parse(stored) : null)
    if (!recap) window.localStorage.removeItem(CONTACT_RECAP_STORAGE_KEY)
    return recap
  } catch {
    window.localStorage.removeItem(CONTACT_RECAP_STORAGE_KEY)
    return null
  }
}

const writeLocalContactRecap = (recap) => {
  if (typeof window === 'undefined') return

  const sanitized = sanitizeRecap(recap)
  if (!sanitized) return
  window.localStorage.setItem(CONTACT_RECAP_STORAGE_KEY, JSON.stringify(sanitized))
}

const isLikelyPhone = (value) => {
  const raw = cleanTextInput(value)
  const digits = phoneDigits(raw)
  if (!/^\+?[0-9()[\]\s.-]{8,24}$/.test(raw)) return false
  if (digits.length < 8 || digits.length > 15) return false
  if (/^(\d)\1{7,}$/.test(digits)) return false
  if (/(?:0123456789|1234567890|9876543210|0987654321)/.test(digits)) return false
  return true
}

const validateContactForm = (values, options = {}) => {
  const requireTurnstile = options.requireTurnstile ?? true
  const turnstileToken = String(options.turnstileToken ?? '')
  const normalized = {
    name: cleanTextInput(values.name),
    email: cleanTextInput(values.email).toLowerCase(),
    phone: cleanTextInput(values.phone),
    message: cleanTextInput(values.message),
    website: cleanTextInput(values.website),
  }
  const errors = {}
  const digits = phoneDigits(normalized.phone)
  const comparableEmail = normalizeForCompare(normalized.email)
  const comparableName = normalizeForCompare(normalized.name)
  const comparablePhone = normalizeForCompare(normalized.phone)

  if (!normalized.name) errors.name = ERROR_MESSAGES.requiredName
  else if (
    normalized.name.length < 2
    || normalized.name.length > 80
    || !NAME_PATTERN.test(normalized.name)
    || EMAIL_PATTERN.test(normalized.name)
    || URL_PATTERN.test(normalized.name)
    || /\d/.test(normalized.name)
  ) errors.name = ERROR_MESSAGES.invalidName

  if (!normalized.email) errors.email = ERROR_MESSAGES.requiredEmail
  else if (normalized.email.length > 120 || !EMAIL_PATTERN.test(normalized.email)) errors.email = ERROR_MESSAGES.invalidEmail

  if (!normalized.phone) errors.phone = ERROR_MESSAGES.requiredPhone
  else if (!isLikelyPhone(normalized.phone)) errors.phone = ERROR_MESSAGES.invalidPhone

  if (!normalized.message) errors.message = ERROR_MESSAGES.requiredMessage
  else if (
    normalized.message.length < 30
    || normalized.message.length > 2000
    || URL_PATTERN.test(normalized.message)
    || SPAM_PATTERN.test(normalized.message)
    || /(.)\1{9,}/i.test(normalized.message)
  ) errors.message = ERROR_MESSAGES.invalidMessage

  if (comparableEmail && comparableName.includes(comparableEmail)) errors.name = ERROR_MESSAGES.nameContainsEmail
  if (digits.length >= 6 && phoneDigits(normalized.name).includes(digits)) errors.name = ERROR_MESSAGES.nameContainsPhone
  if (digits.length >= 6 && phoneDigits(normalized.email).includes(digits)) errors.email = ERROR_MESSAGES.emailContainsPhone
  if (comparableEmail && comparablePhone.includes(comparableEmail)) errors.phone = ERROR_MESSAGES.phoneContainsEmail
  if (requireTurnstile && !turnstileToken) errors.turnstile = ERROR_MESSAGES.turnstile

  return {
    errors,
    sanitized: normalized,
    isValid: Object.keys(errors).length === 0,
  }
}

/* ============================================================
   UNIFIED MOTION VARIANTS (réutilisés partout)
   ============================================================ */
const stagger = ANIMATE_VARIANTS.staggerContainer
const fadeUpChild = ANIMATE_VARIANTS.fadeUp
const revealViewport = VIEWPORT_SETTINGS

function HoverButtonLink({ href, className = '', children }) {
  const buttonRef = useRef(null)
  const lastAddedRef = useRef(0)
  const [isListening, setIsListening] = useState(false)
  const [circles, setCircles] = useState([])

  const createCircle = useCallback((x, y) => {
    const buttonWidth = buttonRef.current?.offsetWidth || 1
    const xPos = x / buttonWidth
    const color = `linear-gradient(to right, var(--circle-start) ${xPos * 100}%, var(--circle-end) ${xPos * 100}%)`
    setCircles((current) => [
      ...current,
      { id: `${Date.now()}-${Math.random()}`, x, y, color, fadeState: null },
    ])
  }, [])

  const handlePointerMove = useCallback((event) => {
    if (!isListening) return
    const currentTime = Date.now()
    if (currentTime - lastAddedRef.current <= 100) return

    lastAddedRef.current = currentTime
    const rect = event.currentTarget.getBoundingClientRect()
    createCircle(event.clientX - rect.left, event.clientY - rect.top)
  }, [createCircle, isListening])

  useEffect(() => {
    const timers = circles
      .filter((circle) => !circle.fadeState)
      .flatMap((circle) => [
        window.setTimeout(() => {
          setCircles((current) => current.map((item) => (
            item.id === circle.id ? { ...item, fadeState: 'in' } : item
          )))
        }, 0),
        window.setTimeout(() => {
          setCircles((current) => current.map((item) => (
            item.id === circle.id ? { ...item, fadeState: 'out' } : item
          )))
        }, 1000),
        window.setTimeout(() => {
          setCircles((current) => current.filter((item) => item.id !== circle.id))
        }, 2200),
      ])

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [circles])

  return (
    <a
      ref={buttonRef}
      href={href}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsListening(true)}
      onPointerLeave={() => setIsListening(false)}
    >
      {circles.map(({ id, x, y, color, fadeState }) => (
        <span
          key={id}
          className={`hover-button-circle ${fadeState ? `is-${fadeState}` : ''}`}
          style={{ left: x, top: y, background: color }}
          aria-hidden="true"
        />
      ))}
      <span className="hover-button-label">{children}</span>
    </a>
  )
}

function BlurredStaggerHeading({ lines }) {
  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
      },
    },
  }

  const letterAnimation = {
    hidden: {
      opacity: 0,
      y: 8,
      filter: 'blur(4px)',
    },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.34,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const label = lines
    .map((line) => line.parts.map((part) => part.text).join(''))
    .join(' ')

  return (
    <motion.h2
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
      aria-label={label}
    >
      {lines.map((line, lineIndex) => (
        <span className="collaborators-copy__line" aria-hidden="true" key={lineIndex}>
          {line.parts.map((part, partIndex) => {
            const Wrapper = part.em ? 'em' : 'span'

            return (
              <Wrapper
                className={part.zoom ? 'collaborators-zoom-word' : undefined}
                key={`${part.text}-${partIndex}`}
              >
                {part.text.split('').map((char, charIndex) => (
                  <motion.span
                    className="blurred-stagger-char"
                    variants={letterAnimation}
                    key={`${char}-${charIndex}`}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </Wrapper>
            )
          })}
        </span>
      ))}
    </motion.h2>
  )
}

const serviceCardVariants = {
  offscreen: {
    y: 300,
    opacity: 0.24,
    scale: 0.96,
  },
  onscreen: {
    y: 50,
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      bounce: 0.34,
      duration: 0.82,
    },
  },
}

/* ============================================================
   DATA
   ============================================================ */
const SERVICES = [
  {
    num: '01',
    title: 'Stratégie de marque & branding',
    contactCta: 'Discuter stratégie de marque →',
    learnCta: 'Services — stratégie & branding →',
    desc: "On définit qui vous êtes vraiment avant de produire quoi que ce soit : positionnement, promesse, langage, identité visuelle. Vous repartez avec un nom (si besoin), un logo, une charte complète et un brand book qui sert de référence à toute votre équipe. C'est l'étape que la plupart des entreprises sautent — et c'est exactement pour ça que leur communication se dilue six mois plus tard. Nous, on commence par là.",
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
    contactCta: 'Parler création de site web →',
    learnCta: 'Services — sites web →',
    desc: "Sites vitrines, one pages, e-commerce, sites corporate. Codés sur-mesure, jamais sur template, pensés pour charger sous deux secondes et être référencés sur Google dès la première ligne de code. Chaque parcours est conçu pour amener le visiteur à faire ce que vous voulez : appeler, remplir, acheter, prendre rendez-vous. La plupart des sites d'agences à Marrakech sont des cartes de visite passives — les nôtres travaillent.",
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
    contactCta: 'Parler production de contenus →',
    learnCta: 'Services — production vidéo →',
    desc: "Photo, vidéo, films de marque, contenus verticaux pour Instagram, TikTok et Reels, captations d'événements, motion design. On vient avec notre matériel, notre équipe et notre direction artistique. L'objectif : que vous arrêtiez d'utiliser des photos de stock fades qui cassent la perception de votre marque. Le contenu est ce que vos prospects voient en premier — il doit être à hauteur de ce que vous facturez.",
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
    contactCta: 'Discuter publicité digitale →',
    learnCta: 'Services — Meta Ads →',
    desc: "Création des visuels, ciblage précis, optimisation continue sur Meta, TikTok et Snapchat. La règle qu'on s'impose : un dirham dépensé doit rapporter un dirham mesurable. Pas de pub \"de notoriété\" floue qui consomme votre budget sans qu'on sache où il va. Chaque campagne a un objectif chiffré et un tableau de bord que vous lisez en trente secondes.",
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
    contactCta: 'Discuter social media →',
    learnCta: 'Services — réseaux sociaux →',
    desc: "Ligne éditoriale, calendrier mensuel, création des publications, animation au quotidien. Service récurrent, pas projet ponctuel. L'objectif : que votre Instagram, votre LinkedIn ou votre TikTok parlent exactement la même langue que votre marque, sans rupture de ton. Pour beaucoup de PME marrakchies, c'est ce qui fait basculer la perception de \"petit acteur local\" à \"marque sérieuse à suivre\".",
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
    contactCta: 'Parler application sur-mesure →',
    learnCta: 'Services — applications →',
    desc: "Apps iOS, Android et PWA. Cadrage, wireframes, design, développement, mise en production sur les stores, maintenance. Notre obsession : du code propre, une architecture pensée pour durer trois ans minimum, et une interface tellement claire que vos utilisateurs n'ont pas besoin de tutoriel. Typiquement déployé pour des restaurants, des hôtels ou des entreprises avec un besoin métier spécifique.",
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
    contactCta: 'Parler plateforme SaaS →',
    learnCta: 'Services — SaaS →',
    desc: "Quand un processus marche bien chez vous mais vit encore dans un Excel partagé, on le transforme en plateforme web propre : dashboards en temps réel, espace client, outil interne qui remplace cinq logiciels mal connectés. Si vous avez un bon processus, on en fait un produit digital qui travaille pour vous 24h/24. Et si vous voulez un jour le commercialiser comme un vrai SaaS, on sait aussi le construire dans cette logique-là.",
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
    contactCta: 'Discuter automatisation IA →',
    learnCta: 'Services — agents IA →',
    desc: "On connecte vos outils pour que les tâches répétitives se fassent toutes seules, et on construit des agents IA qui répondent à vos prospects, qualifient vos leads ou traitent vos emails 24h/24. Un agent bien fait gère 80 % des demandes basiques sans intervention humaine. Notre règle : l'IA doit servir vos opérations, pas faire de la démonstration. On ne déploie un agent que s'il vous fait gagner cinq heures par semaine — mesurées.",
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
    a: "Le coût dépend de la portée du projet : site vitrine, e-commerce ou application sur-mesure. Nous remettons un devis détaillé et gratuit sous 48 heures après un appel de cadrage. Demandez votre devis gratuit pour obtenir une estimation précise.",
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

const BOOKING_TIME_SLOTS = ['10h - 12h', '11h - 13h', '14h - 16h', '16h - 18h', '17h - 21h']
const BOOKING_AVAILABILITY = {
  firstDaysSingleSlotChance: 0.05,
  nearThreeSlotChance: 0.8,
  nearRestrictedChance: 0.5,
  laterOpenChance: 0.99,
  laterThreeSlotChance: 0.65,
}

const toLocalDateKey = (date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

const startOfLocalDay = (date) => {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

const getDayDifference = (date, todayDate = new Date()) => {
  const target = startOfLocalDay(date)
  const todayStart = startOfLocalDay(todayDate)
  return Math.round((target.getTime() - todayStart.getTime()) / 86400000)
}

// Deterministic hash-based random: stable for the same seed, unlike Math.random().
const seededRandom = (seed) => {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 1000000) / 1000000
}

const pickDeterministicSlots = (seed, count, possibleSlots = BOOKING_TIME_SLOTS) => (
  [...possibleSlots]
    .map((slot) => ({ slot, score: seededRandom(`${seed}:${slot}`) }))
    .sort((first, second) => first.score - second.score)
    .slice(0, count)
    .map(({ slot }) => slot)
)

function getAvailableTimeSlotsForDate(date, todayDate = new Date()) {
  const dayDifference = getDayDifference(date, todayDate)
  const todayKey = toLocalDateKey(startOfLocalDay(todayDate))
  const dateKey = toLocalDateKey(date)

  if (dayDifference < 0) return []

  if (dayDifference === 0) return []

  if (dayDifference <= 2) {
    const hasFirstDaysAvailability = seededRandom(`${todayKey}:${dateKey}:first-days-slot`) < BOOKING_AVAILABILITY.firstDaysSingleSlotChance
    if (!hasFirstDaysAvailability) return []

    return pickDeterministicSlots(`${todayKey}:${dateKey}:first-days-slot`, 1)
  }

  if (dayDifference <= 4) {
    const nearScore = seededRandom(`${todayKey}:${dateKey}:near-availability`)
    if (nearScore < BOOKING_AVAILABILITY.nearThreeSlotChance) {
      return pickDeterministicSlots(`${todayKey}:${dateKey}:near-three-slots`, 3)
    }

    const hasRestrictedAvailability = seededRandom(`${todayKey}:${dateKey}:near-restricted`) < BOOKING_AVAILABILITY.nearRestrictedChance
    if (!hasRestrictedAvailability) return []

    return pickDeterministicSlots(`${todayKey}:${dateKey}:near-restricted-slot`, 1)
  }

  const hasLaterAvailability = seededRandom(`${todayKey}:${dateKey}:later-open`) < BOOKING_AVAILABILITY.laterOpenChance
  if (!hasLaterAvailability) return []

  const slotCount = seededRandom(`${dateKey}:later-slot-count`) < BOOKING_AVAILABILITY.laterThreeSlotChance ? 3 : 2
  return pickDeterministicSlots(`${dateKey}:later-slots`, slotCount)
}

const findFirstAvailableBookingDate = (todayDate = new Date(), lookAheadDays = 45) => {
  const todayStart = startOfLocalDay(todayDate)

  for (let offset = 0; offset <= lookAheadDays; offset += 1) {
    const date = new Date(todayStart)
    date.setDate(todayStart.getDate() + offset)

    if (getAvailableTimeSlotsForDate(date, todayStart).length > 0) return date
  }

  return todayStart
}

const getMillisecondsUntilNextDay = (date = new Date()) => {
  const tomorrow = new Date(date)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 1, 0)

  return Math.max(tomorrow.getTime() - date.getTime(), 1000)
}

const DESKTOP_COLLABORATOR_SLOTS = [4, 5, 6, 7, 8, 0, 1, 2, 3, 9, 10, 11]

const COLLABORATORS = [
  { name: 'Partner 3', role: 'Collaborateur', image: partnerImage(3) },
  { name: 'Partner 5', role: 'Collaborateur', image: partnerImage(5) },
  { name: 'Partner 12', role: 'Collaborateur', image: partnerImage(12) },
  { name: 'Partner 2', role: 'Collaborateur', image: partnerImage(2) },
  { name: 'Partner 1', role: 'Collaborateur', image: partnerImage(1) },
  { name: 'Partner 4', role: 'Collaborateur', image: partnerImage(4) },
  { name: 'Partner 6', role: 'Collaborateur', image: partnerImage(6) },
  { name: 'Partner 7', role: 'Collaborateur', image: partnerImage(7) },
  { name: 'Partner 8', role: 'Collaborateur', image: partnerImage(8) },
  { name: 'Partner 9', role: 'Collaborateur', image: partnerImage(9) },
  { name: 'Partner 10', role: 'Collaborateur', image: partnerImage(10) },
  { name: 'Partner 11', role: 'Collaborateur', image: partnerImage(11) },
]

const BELOW_WHEEL_COLLABORATOR = { name: 'Trips Experts', image: partnerImage(13) }

/* ============================================================
   SECTION COMPONENTS
   ============================================================ */

function CollaboratorsSection() {
  const visibleCollaborators = COLLABORATORS
  const ref = useRef(null)
  const [isDesktopWheel, setIsDesktopWheel] = useState(() => (
    typeof window === 'undefined' ? true : window.matchMedia('(min-width: 769px)').matches
  ))
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 64,
    damping: 24,
    mass: 0.55,
  })
  const wheelRotationRange = isDesktopWheel ? 42 : 86
  const wheelRotate = useTransform(smoothProgress, [0, 1], [-wheelRotationRange, wheelRotationRange])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 769px)')
    const updateDesktopWheel = () => setIsDesktopWheel(mediaQuery.matches)

    updateDesktopWheel()
    mediaQuery.addEventListener('change', updateDesktopWheel)

    return () => mediaQuery.removeEventListener('change', updateDesktopWheel)
  }, [])

  return (
    <section className="collaborators-section" id="collaborateurs" ref={ref}>
      <div className="collaborators-section__inner">
        <div className="collaborators-wheel-frame" aria-hidden="true">
          <motion.div className="collaborators-wheel" style={{ rotate: wheelRotate }}>
            {visibleCollaborators.map((person, index) => {
              const slotIndex = isDesktopWheel ? DESKTOP_COLLABORATOR_SLOTS[index] : index
              const angle = Math.PI - (Math.PI * slotIndex) / (visibleCollaborators.length - 1)
              const left = 50 + 41.85 * Math.cos(angle)
              const top = 94 - 70.2 * Math.sin(angle)

              return (
                <div
                  className="collaborator-orbit-item"
                  key={person.name}
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <span className="collaborator-avatar">
                    <img src={person.image} alt={`${person.name} — partenaire Supra v3`} loading="lazy" />
                  </span>
                </div>
              )
            })}
          </motion.div>
          {isDesktopWheel && (
            <span className="collaborators-below-logo">
              <img src={BELOW_WHEEL_COLLABORATOR.image} alt={`${BELOW_WHEEL_COLLABORATOR.name} — partenaire Supra v3`} loading="lazy" />
            </span>
          )}
        </div>

        <motion.div
          className="collaborators-copy"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          <BlurredStaggerHeading
            lines={[
              { parts: [{ text: 'On accompagne peu' }] },
              { parts: [{ text: 'de marques,' }] },
              { parts: [{ text: 'mais on les accompagne ' }, { text: 'loin.', em: true, zoom: true }] },
            ]}
          />
          <motion.a variants={fadeUpChild} href="#contact" className="collab-call-pill magnetic-btn">
            <span className="collab-call-pill__avatar">
              <img src="/favicon.svg" alt="" aria-hidden="true" />
            </span>
            <span>
              <strong>Réserver un appel gratuit</strong>
              <small><span aria-hidden="true" /> Disponible</small>
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

function ServiceScrollCard({ service }) {
  return (
    <motion.div
      className="service-scroll-card-container"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
    >
      <div className="service-scroll-card-splash" />
      <motion.article
        className="svc-card service-scroll-card"
        variants={serviceCardVariants}
        whileHover={{
          scale: 1.01,
          boxShadow:
            '0 20px 60px rgba(17, 17, 17, 0.12), 0 8px 24px rgba(17, 17, 17, 0.08)',
        }}
        transition={HOVER_TRANSITION}
      >
        <div className="svc-card__top">
          <span className="svc-card__num">{service.num}</span>
          <div className="svc-card__icon">{service.icon}</div>
        </div>
        <p className="svc-card__title">{service.title}</p>
        <p className="svc-card__desc">{service.desc}</p>
        <div className="svc-card__bottom">
          <div className="svc-card__kw">{service.kw}</div>
          <div className="svc-card__actions">
            <a href="/contact" className="svc-card__devis">{service.contactCta}</a>
            <a href="/services" className="svc-card__learn">{service.learnCta}</a>
          </div>
        </div>
      </motion.article>
    </motion.div>
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
            <AnimatedText
              as="h2"
              className="section-head__title"
              lines={[
                [
                  { text: 'Nos services de communication, création web et ' },
                  { text: 'intelligence artificielle', className: 'text-accent' },
                  { text: '.' },
                ],
              ]}
              animateBy="words"
              direction="top"
              delay={100}
              stepDuration={0.35}
              threshold={0.15}
              rootMargin="-50px"
            />
            <motion.p variants={fadeUpChild} className="section-head__lead">
              De la stratégie de marque au produit digital finalisé. Supra v3 couvre toute la chaîne, sans sous-traiter, depuis Marrakech.
            </motion.p>
          </motion.div>

          <div className="services-scroll-stack">
            {SERVICES.map((s) => (
              <ServiceScrollCard key={s.num} service={s} />
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
              <p className="methode-stage-copy__title">{active.title}</p>
              <p>{active.desc}</p>
              <div className="methode-stage-tags">{active.tags}</div>
              <a href="/contact" className="methode-stage-button">Planifier un échange sur votre projet</a>
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
              <p className="seg-card__title">{seg.title}</p>
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
                  <span className="faq-item__title">{item.q}</span>
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

function ContactRecapCard({ recap, isLocalPreview }) {
  if (!recap) return null

  return (
    <motion.div
      className="cta-form__recap"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <span className="cta-form__recap-label">Votre demande a été envoyée</span>
      <p className="cta-form__recap-message">
        Votre demande est bien reçue. On vous contacte immédiatement pour confirmer votre rendez-vous.
      </p>
      <dl>
        <div>
          <dt>Nom</dt>
          <dd>{recap.name}</dd>
        </div>
        <div>
          <dt>Rendez-vous</dt>
          <dd>{recap.date} · {recap.time}</dd>
        </div>
      </dl>
      {isLocalPreview && (
        <small>Test local uniquement. Aucun email n’est envoyé depuis localhost.</small>
      )}
    </motion.div>
  )
}

function CtaSection() {
  const [formStatus, setFormStatus] = useState('idle')
  const [contactValues, setContactValues] = useState(INITIAL_CONTACT_VALUES)
  const [contactErrors, setContactErrors] = useState({})
  const [contactRecap, setContactRecap] = useState(() => (
    IS_LOCAL_FORM_PREVIEW ? readLocalContactRecap() : null
  ))
  const [touchedFields, setTouchedFields] = useState({})
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now())
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const turnstileRef = useRef(null)
  const turnstileWidgetRef = useRef(null)
  const messageTextareaRef = useRef(null)
  const [today, setToday] = useState(() => startOfLocalDay(new Date()))
  const initialBookingDate = useMemo(() => findFirstAvailableBookingDate(today), [today])
  const [bookingStep, setBookingStep] = useState('date')
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(initialBookingDate)
  const selectedAvailableSlots = useMemo(() => (
    getAvailableTimeSlotsForDate(selectedDate, today)
  ), [selectedDate, today])
  const [selectedTime, setSelectedTime] = useState(() => (
    getAvailableTimeSlotsForDate(initialBookingDate, today)[0] ?? ''
  ))
  const effectiveSelectedTime = selectedAvailableSlots.includes(selectedTime)
    ? selectedTime
    : selectedAvailableSlots[0] ?? ''
  const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(calendarMonth)
  const selectedDateLabel = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(selectedDate)
  const selectedDateParts = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
  }).formatToParts(selectedDate)
  const selectedDateShortLabel = `${selectedDateParts.find((part) => part.type === 'weekday')?.value ?? ''} ${selectedDateParts.find((part) => part.type === 'day')?.value ?? ''}`.replace('.', '').trim()
  const calendarDays = Array.from(
    { length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate() },
    (_, index) => new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index + 1)
  )
  const calendarOffset = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay()
  const weekdays = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']

  useEffect(() => {
    if (IS_LOCAL_FORM_PREVIEW) return undefined

    let cancelled = false

    fetch(CONTACT_API_ENDPOINT, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (cancelled) return
        const recap = sanitizeRecap(payload?.recap)
        if (recap) {
          setContactRecap(recap)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setToday(startOfLocalDay(new Date()))
    }, getMillisecondsUntilNextDay())

    return () => window.clearTimeout(timer)
  }, [today])

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return undefined

    if (window.turnstile) {
      queueMicrotask(() => setTurnstileReady(true))
      return undefined
    }

    const existingScript = document.querySelector('script[data-turnstile-script="true"]')
    const script = existingScript || document.createElement('script')
    const handleLoad = () => setTurnstileReady(true)
    script.addEventListener('load', handleLoad)

    if (!existingScript) {
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.dataset.turnstileScript = 'true'
      document.head.appendChild(script)
    }

    return () => {
      script.removeEventListener('load', handleLoad)
    }
  }, [])

  useEffect(() => {
    if (bookingStep !== 'details') {
      if (turnstileWidgetRef.current !== null && window.turnstile?.remove) {
        window.turnstile.remove(turnstileWidgetRef.current)
      }
      turnstileWidgetRef.current = null
      return
    }
    if (!TURNSTILE_SITE_KEY || !turnstileReady || !turnstileRef.current || turnstileWidgetRef.current !== null) return

    turnstileWidgetRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: 'dark',
      callback: (token) => {
        setTurnstileToken(token)
        setContactErrors((current) => {
          const next = { ...current }
          delete next.turnstile
          return next
        })
      },
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => setTurnstileToken(''),
    })
  }, [bookingStep, turnstileReady])

  useEffect(() => {
    const textarea = messageTextareaRef.current
    if (!textarea || bookingStep !== 'details') return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [bookingStep, contactValues.message])

  const resetTurnstile = () => {
    setTurnstileToken('')
    if (turnstileWidgetRef.current !== null && window.turnstile) {
      window.turnstile.reset(turnstileWidgetRef.current)
    }
  }

  const handleContactChange = (event) => {
    const { name, value } = event.target
    setFormStatus('idle')
    const next = { ...contactValues, [name]: value }
    const result = validateContactForm(next, {
      requireTurnstile: false,
      startedAt: formStartedAt - MIN_FORM_TIME_MS,
    })
    setContactValues(next)
    setContactErrors((currentErrors) => {
      const updatedErrors = { ...currentErrors }
      if (result.errors[name]) updatedErrors[name] = result.errors[name]
      else delete updatedErrors[name]
      return updatedErrors
    })
  }

  const handleContactBlur = (event) => {
    const { name } = event.target
    setTouchedFields((current) => ({ ...current, [name]: true }))
    const result = validateContactForm(contactValues, {
      requireTurnstile: false,
      startedAt: formStartedAt - MIN_FORM_TIME_MS,
    })
    setContactErrors((current) => {
      const next = { ...current }
      if (result.errors[name]) next[name] = result.errors[name]
      else delete next[name]
      return next
    })
  }

  const changeCalendarMonth = (amount) => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  }

  const isSameDay = (first, second) => (
    first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate()
  )

  const formatDateValue = (date) => (
    new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!effectiveSelectedTime) {
      setBookingStep('date')
      return
    }

    const validation = validateContactForm(contactValues, {
      requireTurnstile: Boolean(TURNSTILE_SITE_KEY && turnstileWidgetRef.current !== null),
      startedAt: formStartedAt,
      turnstileToken,
    })
    if (!validation.isValid) {
      setTouchedFields({ name: true, email: true, phone: true, message: true, turnstile: true })
      setContactErrors(validation.errors)
      setFormStatus('blocked')
      return
    }

    setFormStatus('sending')
    try {
      const pendingRecap = buildContactRecap({
        name: validation.sanitized.name,
        date: formatDateValue(selectedDate),
        time: effectiveSelectedTime,
        message: validation.sanitized.message,
      })

      if (IS_LOCAL_FORM_PREVIEW) {
        await new Promise((resolve) => window.setTimeout(resolve, 300))
        setContactRecap(pendingRecap)
        writeLocalContactRecap(pendingRecap)
        setContactValues(INITIAL_CONTACT_VALUES)
        setTouchedFields({})
        setContactErrors({})
        setFormStartedAt(Date.now())
        setFormStatus('sent')
        resetTurnstile()
        return
      }

      const response = await fetch(CONTACT_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...validation.sanitized,
          date: formatDateValue(selectedDate),
          time: effectiveSelectedTime,
          startedAt: formStartedAt,
          turnstileToken,
        }),
      })
      const isJsonResponse = response.headers.get('content-type')?.includes('application/json')
      const payload = isJsonResponse ? await response.json().catch(() => ({})) : {}

      if (!response.ok || !payload.ok) {
        if (payload.errors && typeof payload.errors === 'object') {
          setContactErrors(payload.errors)
        } else {
          setContactErrors({ form: payload.message || 'Le serveur du formulaire ne répond pas correctement. Merci de vérifier api/contact.' })
        }
        setTouchedFields({ name: true, email: true, phone: true, message: true, turnstile: true })
        setFormStatus('blocked')
        resetTurnstile()
        return
      }

      const recap = sanitizeRecap(payload.recap) || pendingRecap
      setContactRecap(recap)
      setContactValues(INITIAL_CONTACT_VALUES)
      setTouchedFields({})
      setContactErrors({})
      setFormStartedAt(Date.now())
      setFormStatus('sent')
      resetTurnstile()
    } catch {
      setContactErrors({ form: 'Votre message n’a pas pu être envoyé pour le moment. Merci de réessayer dans quelques instants.' })
      setFormStatus('blocked')
      resetTurnstile()
    }
  }

  const isSubmitDisabled = formStatus === 'sending'

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
          <motion.div className="cta-final__panel" variants={fadeUpChild}>
            <div className="cta-final__ambient" aria-hidden="true" />

            <motion.div className="cta-contact-copy" variants={stagger}>
              <motion.div className="cta-contact-copy__head" variants={fadeUpChild}>
                <span className="cta-form__pill">Contact</span>
                <AnimatedText
                  as="h2"
                  className=""
                  text="Démarrons votre projet."
                  animateBy="words"
                  direction="top"
                  delay={100}
                  stepDuration={0.35}
                  threshold={0.15}
                  rootMargin="-50px"
                />
                <p>Construisons une marque, un site ou un outil digital qui travaille vraiment pour vous.</p>
              </motion.div>

              <motion.div className="cta-contact-copy__details" variants={fadeUpChild}>
                <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
                <a href="/contact">contact@suprav3.com</a>
              </motion.div>

              <motion.div className="cta-social-proof" variants={fadeUpChild} aria-label="Note clients 4.9 sur 5">
                <div className="cta-social-proof__avatars" aria-hidden="true">
                  <span><img src={partnerImage(3)} alt="Client accompagné par Supra v3" width={40} height={40} loading="lazy" decoding="async" /></span>
                  <span><img src={partnerImage(5)} alt="Marque accompagnée par Supra v3" width={40} height={40} loading="lazy" decoding="async" /></span>
                  <span><img src={partnerImage(12)} alt="Projet réalisé avec Supra v3" width={40} height={40} loading="lazy" decoding="async" /></span>
                  <span>+</span>
                </div>
                <p><strong>4.9 / 5</strong> clients accompagnés</p>
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              {contactRecap ? (
                <motion.div
                  key="recap-step"
                  className="cta-form cta-form--recap-only"
                  initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -24, filter: 'blur(8px)' }}
                  transition={{ duration: 0.45, ease: EASING }}
                >
                  <ContactRecapCard recap={contactRecap} isLocalPreview={IS_LOCAL_FORM_PREVIEW} />
                </motion.div>
              ) : bookingStep === 'date' ? (
                <motion.div
                  key="date-step"
                  className="cta-form cta-booking"
                  initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -24, filter: 'blur(8px)' }}
                  transition={{ duration: 0.45, ease: EASING }}
                >
                  <span className="cta-booking__eyebrow">Prendre rendez-vous</span>
                  <div className="cta-booking__top">
                    <p className="cta-booking__month">{monthLabel}</p>
                    <div className="cta-booking__month-controls">
                      <button type="button" onClick={() => changeCalendarMonth(-1)} aria-label="Mois précédent">‹</button>
                      <button type="button" onClick={() => changeCalendarMonth(1)} aria-label="Mois suivant">›</button>
                    </div>
                  </div>

                  <div className="cta-calendar" aria-label="Choisir une date">
                    {weekdays.map((day) => (
                      <span key={day} className="cta-calendar__weekday">{day}</span>
                    ))}
                    {Array.from({ length: calendarOffset }).map((_, index) => (
                      <span key={`blank-${index}`} className="cta-calendar__blank" />
                    ))}
                    {calendarDays.map((date) => {
                      const daySlots = getAvailableTimeSlotsForDate(date, today)
                      const disabled = date < today
                      const selected = isSameDay(date, selectedDate)
                      const available = daySlots.length > 0
                      return (
                        <button
                          type="button"
                          key={date.toISOString()}
                          className={`cta-calendar__day ${available ? 'is-available' : 'is-fully-booked'} ${selected ? 'is-selected' : ''}`}
                          disabled={disabled}
                          aria-label={`${formatDateValue(date)} · ${available ? `${daySlots.length} créneau${daySlots.length > 1 ? 'x' : ''} disponible${daySlots.length > 1 ? 's' : ''}` : 'Complet'}`}
                          onClick={() => {
                            setSelectedDate(date)
                            setSelectedTime(daySlots[0] ?? '')
                            setBookingStep('date')
                          }}
                        >
                          {date.getDate()}
                        </button>
                      )
                    })}
                  </div>

                  <div className="cta-booking__schedule">
                    <strong>{selectedDateShortLabel}</strong>
                    <span>{selectedAvailableSlots.length > 0 ? `${selectedAvailableSlots.length} créneau${selectedAvailableSlots.length > 1 ? 'x' : ''} disponible${selectedAvailableSlots.length > 1 ? 's' : ''}` : 'Complet'}</span>
                  </div>

                  <div className="cta-booking__time-slots" aria-label="Choisir un créneau">
                    {selectedAvailableSlots.length > 0 ? (
                      selectedAvailableSlots.map((time) => (
                        <motion.button
                          type="button"
                          key={time}
                          className={`cta-booking__time-slot ${effectiveSelectedTime === time ? 'is-selected' : ''}`}
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setSelectedTime(time)
                            setFormStartedAt(Date.now())
                            setFormStatus('idle')
                            setBookingStep('details')
                          }}
                        >
                          {time}
                        </motion.button>
                      ))
                    ) : (
                      <div className="cta-booking__fully-booked" role="status">
                        Complet
                      </div>
                    )}
                  </div>
                  <a
                    className="cta-booking__emergency"
                    href="https://wa.me/212728521896?text=Bonjour%2C%20je%20viens%20de%20votre%20site%20web%20et%20j%27ai%20besoin%20d%27un%20appel%20d%27urgence%20pour%20mon%20projet."
                    target="_blank"
                    rel="noreferrer"
                  >
                    Appel d'urgence
                  </a>
                </motion.div>
              ) : (
                <motion.form
                  key="details-step"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
                  transition={{ duration: 0.45, ease: EASING }}
                  className="cta-form"
                  onSubmit={handleSubmit}
                >
                  <input type="hidden" name="date" value={formatDateValue(selectedDate)} />
                  <input type="hidden" name="time" value={effectiveSelectedTime} />
                  <input type="hidden" name="startedAt" value={formStartedAt} />
                  <label className="cta-honeypot" aria-hidden="true">
                    <span>Site web</span>
                    <input
                      name="website"
                      type="text"
                      tabIndex="-1"
                      autoComplete="off"
                      value={contactValues.website}
                      onChange={handleContactChange}
                    />
                  </label>

                  <motion.div className="cta-form__selected-date" variants={fadeUpChild}>
                    <button type="button" onClick={() => setBookingStep('date')}>Changer</button>
                    <span>{selectedDateLabel} · {effectiveSelectedTime || 'Complet'}</span>
                  </motion.div>

                  <motion.label className="cta-field" variants={fadeUpChild}>
                    <span>Nom</span>
                    <input
                      name="name"
                      type="text"
                      placeholder="Jane Smith"
                      autoComplete="name"
                      minLength="2"
                      maxLength="80"
                      required
                      value={contactValues.name}
                      onChange={handleContactChange}
                      onBlur={handleContactBlur}
                      aria-invalid={Boolean(touchedFields.name && contactErrors.name)}
                      aria-describedby="contact-name-error"
                    />
                    {touchedFields.name && contactErrors.name && (
                      <small id="contact-name-error" className="cta-field__error">{contactErrors.name}</small>
                    )}
                  </motion.label>

                  <motion.label className="cta-field" variants={fadeUpChild}>
                    <span>Email</span>
                    <input
                      name="email"
                      type="email"
                      placeholder="vous@email.com"
                      autoComplete="email"
                      inputMode="email"
                      maxLength="120"
                      required
                      value={contactValues.email}
                      onChange={handleContactChange}
                      onBlur={handleContactBlur}
                      aria-invalid={Boolean(touchedFields.email && contactErrors.email)}
                      aria-describedby="contact-email-error"
                    />
                    {touchedFields.email && contactErrors.email && (
                      <small id="contact-email-error" className="cta-field__error">{contactErrors.email}</small>
                    )}
                  </motion.label>

                  <motion.label className="cta-field" variants={fadeUpChild}>
                    <span>Numéro</span>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+212 728-521896"
                      autoComplete="tel"
                      inputMode="tel"
                      minLength="8"
                      maxLength="24"
                      required
                      value={contactValues.phone}
                      onChange={handleContactChange}
                      onBlur={handleContactBlur}
                      aria-invalid={Boolean(touchedFields.phone && contactErrors.phone)}
                      aria-describedby="contact-phone-error"
                    />
                    {touchedFields.phone && contactErrors.phone && (
                      <small id="contact-phone-error" className="cta-field__error">{contactErrors.phone}</small>
                    )}
                  </motion.label>

                  <motion.label className="cta-field cta-field--wide" variants={fadeUpChild}>
                    <span>Message</span>
                    <textarea
                      ref={messageTextareaRef}
                      name="message"
                      placeholder="Décrivez votre projet en quelques phrases"
                      rows="5"
                      minLength="30"
                      maxLength="2000"
                      required
                      value={contactValues.message}
                      onChange={handleContactChange}
                      onBlur={handleContactBlur}
                      aria-invalid={Boolean(touchedFields.message && contactErrors.message)}
                      aria-describedby="contact-message-error"
                    />
                    {touchedFields.message && contactErrors.message && (
                      <small id="contact-message-error" className="cta-field__error">{contactErrors.message}</small>
                    )}
                  </motion.label>

                  {TURNSTILE_SITE_KEY && (
                    <motion.div className="cta-turnstile" variants={fadeUpChild}>
                      <div ref={turnstileRef} />
                      {touchedFields.turnstile && contactErrors.turnstile && (
                        <small className="cta-field__error">{contactErrors.turnstile}</small>
                      )}
                    </motion.div>
                  )}

                  <motion.div className="cta-form__bottom" variants={fadeUpChild}>
                    <motion.button
                      type="submit"
                      className="cta-form__submit"
                      disabled={isSubmitDisabled}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {formStatus === 'sending' ? 'Envoi...' : 'Envoyer'}
                      <span className="cta-form__submit-icon" aria-hidden="true">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </motion.button>
                  </motion.div>

                  <AnimatePresence>
                    {formStatus === 'sent' && !contactRecap && (
                      <motion.p
                        className="cta-form__status cta-form__status--success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {IS_LOCAL_FORM_PREVIEW
                          ? 'Test local validé. Aucun email n’est envoyé depuis localhost.'
                          : 'Message envoyé. Nous revenons vers vous rapidement.'}
                      </motion.p>
                    )}
                    {contactErrors.form && (
                      <motion.p
                        className="cta-form__status cta-form__status--error"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {contactErrors.form}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function MediaVideoCard({ item, onOpen }) {
  const videoRef = useRef(null)
  const finePointer = useFinePointer()
  const [hovered, setHovered] = useState(false)
  const videoSrc = item.videoSrc || item.video
  const showPreviewVideo = Boolean(videoSrc && finePointer && hovered)

  useEffect(() => {
    const el = videoRef.current
    if (!el || !showPreviewVideo) return
    const play = el.play()
    if (play?.catch) play.catch(() => {})
    return () => {
      el.pause()
    }
  }, [showPreviewVideo])

  const openModal = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onOpen(item)
  }

  return (
    <motion.article
      className="media-clouds__item"
      whileHover={{
        y: -6,
        scale: 1.01,
        boxShadow: "0 20px 60px rgba(17, 17, 17, 0.12), 0 8px 24px rgba(17, 17, 17, 0.08)"
      }}
      transition={HOVER_TRANSITION}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        className="media-clouds__card-trigger"
        onClick={openModal}
        aria-label={item.ariaLabel || 'Lire la vidéo'}
      >
        {showPreviewVideo ? (
          <video
            ref={videoRef}
            className="video-card"
            src={videoSrc}
            poster={item.poster || undefined}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            aria-hidden="true"
          />
        ) : item.poster ? (
          <img
            className="video-card"
            src={item.poster}
            alt=""
            width={360}
            height={640}
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <span className="media-clouds__play" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v14.72a1 1 0 0 0 1.52.85l11.02-7.36a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
          </svg>
        </span>
      </button>
    </motion.article>
  )
}

function MediaCloudsSection({ items }) {
  const sectionRef = useRef(null)
  const [shouldLoadVideos, setShouldLoadVideos] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    if (shouldLoadVideos) return undefined

    const section = sectionRef.current
    if (!section) return undefined

    const rootMargin =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
        ? '120px 0px'
        : '200px 0px'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoadVideos(true)
        observer.disconnect()
      },
      { rootMargin }
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [shouldLoadVideos])

  return (
    <section className="media-clouds section" id="works" ref={sectionRef}>
      <motion.div
        className="media-clouds__header"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.p variants={fadeUpChild} className="label">01 — Production vidéo</motion.p>
        <motion.h2 variants={fadeUpChild} className="heading-2">
          Production vidéo pour marques ambitieuses
        </motion.h2>
        <motion.p variants={fadeUpChild} className="media-clouds__lead">
          Des vidéos pensées pour capter l&apos;attention, raconter votre marque et transformer vos
          contenus en vrais leviers de visibilité.
        </motion.p>
        <motion.p variants={fadeUpChild} style={{ marginTop: 20 }}>
          <a href="/realisations" className="btn btn--secondary">
            Découvrir nos réalisations vidéo →
          </a>
        </motion.p>
      </motion.div>

      <div className="media-clouds__frame">
        <div className="media-clouds__viewport">
          <div className="media-clouds__track">
            {shouldLoadVideos &&
              items.concat(items).map((item, index) => (
                <MediaVideoCard
                  key={`${item.id}-${index}`}
                  item={item}
                  onOpen={() => setActiveIndex(index % items.length)}
                />
              ))}
          </div>
        </div>
      </div>
      {activeIndex !== null ? (
        <Suspense fallback={null}>
          <VideoReelModal
            item={items[activeIndex]}
            items={items}
            activeIndex={activeIndex}
            onNext={() => setActiveIndex((current) => (current + 1) % items.length)}
            onPrev={() => setActiveIndex((current) => (current - 1 + items.length) % items.length)}
            onClose={() => setActiveIndex(null)}
          />
        </Suspense>
      ) : null}
    </section>
  )
}

function StorySection() {
  const sectionRef = useRef(null)
  const [isMobile, setIsMobile] = useState(() => (
    typeof window === 'undefined' ? false : window.matchMedia('(max-width: 768px)').matches
  ))
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    mass: 0.35,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const updateMobile = () => setIsMobile(mediaQuery.matches)

    updateMobile()
    mediaQuery.addEventListener('change', updateMobile)

    return () => mediaQuery.removeEventListener('change', updateMobile)
  }, [])

  const growPhase = useTransform(progress, (latest) => easeInOutCubic(clamp((latest - 0.08) / 0.72, 0, 1)))
  const introPhase = useTransform(progress, (latest) => clamp(latest / 0.18, 0, 1))
  const footerPhase = useTransform(progress, (latest) => easeOutCubic(clamp((latest - 0.78) / 0.16, 0, 1)))
  const labelFade = useTransform(progress, (latest) => 1 - easeOutCubic(clamp((latest - 0.26) / 0.28, 0, 1)))
  const captionOpacity = useTransform(progress, (latest) => {
    const captionPhase = easeOutCubic(clamp((latest - 0.22) / 0.22, 0, 1))
    const footer = easeOutCubic(clamp((latest - 0.78) / 0.16, 0, 1))
    return mix(0, 1, captionPhase) * (1 - footer * 0.35)
  })
  const captionTranslate = useTransform(progress, (latest) => {
    const captionPhase = easeOutCubic(clamp((latest - 0.22) / 0.22, 0, 1))
    return `translate(-50%, ${mix(18, 0, captionPhase)}px)`
  })
  const storyClipPath = useTransform(growPhase, (latest) => {
    const clipStartX = mix(isMobile ? 32 : 42, 0, latest)
    const clipEndX = mix(isMobile ? 68 : 58, 100, latest)
    const clipStartY = mix(isMobile ? 31 : 16, 0, latest)
    const clipEndY = mix(isMobile ? 69 : 84, 100, latest)
    const radius = mix(50, 0, latest)

    return `inset(${clipStartY}% ${100 - clipEndX}% ${100 - clipEndY}% ${clipStartX}% round ${radius}px)`
  })
  const storyBackgroundSize = useTransform(progress, (latest) => (
    `${isMobile ? 260 : mix(170, 100, clamp(latest / 0.9, 0, 1))}%`
  ))
  const storyRadius = useTransform(growPhase, (latest) => `${mix(50, 0, latest)}px`)
  const storyShadeOpacity = useTransform(growPhase, (latest) => mix(0.38, 0, latest))
  const storyIntroOpacity = useTransform(progress, (latest) => 1 - easeOutCubic(clamp((latest - 0.15) / 0.1, 0, 1)))
  const storyPhotoOpacity = useTransform(progress, (latest) => easeOutCubic(clamp((latest - 0.15) / 0.1, 0, 1)))
  const leftCopyRight = useTransform([introPhase, growPhase], ([intro, grow]) => {
    const copyGap = mix(18, isMobile ? 28 : 36, intro)
    const sideAnchor = mix(isMobile ? 66 : 90, isMobile ? 148 : 290, grow) + copyGap
    const sideDrift = mix(0, isMobile ? 8 : 18, grow)

    return `calc(50% + ${sideAnchor - sideDrift}px)`
  })
  const rightCopyLeft = leftCopyRight
  const copyTransform = useTransform(footerPhase, (footer) => (
    `translateY(calc(-50% + ${mix(0, -18, footer)}px))`
  ))

  return (
    <section className="story-shell lstory-shel" ref={sectionRef} id="about">
      <div className="story-shell__sticky">
        <div className="story-scene">
          <motion.div
            className="story-copy story-copy--left"
            style={{
              right: leftCopyRight,
              opacity: labelFade,
              transform: copyTransform,
            }}
          >
            Nous sommes
          </motion.div>

          <motion.div
            className="story-card"
            style={{
              clipPath: storyClipPath,
              borderRadius: storyRadius,
            }}
          >
            <motion.div
              className="story-card__photo"
              style={{
                backgroundImage: `url(${nousImage})`,
                backgroundSize: storyBackgroundSize,
                opacity: storyPhotoOpacity,
              }}
            />
            <motion.div className="story-card__shade" style={{ opacity: storyShadeOpacity }} />
            <div className="story-card__veil" />
            <motion.div
              className="story-card__caption"
              style={{
                opacity: captionOpacity,
                transform: captionTranslate,
              }}
            >
              Pas qu'une
              <br />
              agence.
            </motion.div>
            <motion.div className="story-card__intro" style={{ opacity: storyIntroOpacity }}>
              <img src="/favicon.svg" alt="" aria-hidden="true" />
            </motion.div>
          </motion.div>

          <motion.div
            className="story-copy story-copy--right"
            style={{
              left: rightCopyLeft,
              opacity: labelFade,
              transform: copyTransform,
            }}
          >
            Supra<span className="story-copy__mark">v3</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const HOME_SEO = {
  ...SEO_PAGES.home,
  canonical: 'https://www.suprav3.com/',
}

function setMetaContent(selector, content) {
  const element = document.head.querySelector(selector)
  if (element) element.setAttribute('content', content)
}

/* ============================================================
   MAIN APP
   ============================================================ */
function App() {
  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const scrolledRef = useRef(false)
  const navOpenRef = useRef(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    document.title = HOME_SEO.title
    setMetaContent('meta[name="description"]', HOME_SEO.description)
    setMetaContent('meta[property="og:title"]', HOME_SEO.title)
    setMetaContent('meta[property="og:description"]', HOME_SEO.description)
    setMetaContent('meta[name="twitter:title"]', HOME_SEO.title)
    setMetaContent('meta[name="twitter:description"]', HOME_SEO.description)

    const canonical = document.head.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', HOME_SEO.canonical)
  }, [])

  useEffect(() => {
    navOpenRef.current = navOpen
  }, [navOpen])

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setNavOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0
    const nextScrolled = current > 50

    if (current > previous && current > 120 && navOpenRef.current) {
      setNavOpen(false)
    }

    if (scrolledRef.current !== nextScrolled) {
      scrolledRef.current = nextScrolled
      setScrolled(nextScrolled)
    }
  })

  const homepageVideos = HOMEPAGE_VIDEO_ITEMS

  return (
    <div className="app">
      <TopNavbar />

      <main className="page-content">
        <SiteHeader
          scrolled={scrolled}
          navOpen={navOpen}
          setNavOpen={setNavOpen}
        />
        {/* ========== HERO ========== */}
        <section className="hero">
          <div className="hero__background" aria-hidden="true" />

          <div className="trust-bar">
            <div className="trust-bar__inner">
              <div className="trust-bar__avatars" aria-hidden="true">
                <div className="trust-bar__avatar">
                  <img src={partnerImage(3)} alt="Client accompagné par Supra v3" width={32} height={32} decoding="async" />
                </div>
                <div className="trust-bar__avatar">
                  <img src={partnerImage(5)} alt="Marque accompagnée par Supra v3" width={32} height={32} decoding="async" />
                </div>
                <div className="trust-bar__avatar">
                  <img src={partnerImage(12)} alt="Projet réalisé avec Supra v3" width={32} height={32} decoding="async" />
                </div>
              </div>
              <p className="trust-bar__text">
                Marrakech · Disponible pour de nouveaux projets
              </p>
            </div>
          </div>

          <AnimatedText
            as="h1"
            className="heading-hero hero__title"
            lineClassName="hero__title-line"
            lines={[
              [
                { text: 'Agence' },
                { text: 'de' },
                { text: 'communication' },
                { text: '360°', className: 'text-accent hero__number' },
              ],
              [
                { text: 'à' },
                { text: 'Marrakech' },
                { text: 'pour', className: 'hero__title-muted' },
                { text: 'faire' },
                { text: 'grandir' },
              ],
              [
                { text: 'votre', className: 'hero__title-muted' },
                { text: 'marque', className: 'text-accent' },
              ],
            ]}
            animateBy="words"
            direction="top"
            delay={90}
            stepDuration={0.35}
            instant
          />

          <AnimatedText
            as="p"
            className="text-body hero__subtitle"
            text="Supra v3 aide les marques ambitieuses à Marrakech à construire une image forte, un site performant et une communication qui génère des demandes concrètes — branding, contenus, web, marketing digital et automatisation IA."
            animateBy="words"
            direction="top"
            delay={80}
            stepDuration={0.32}
            instant
          />

          <div className="hero__cta">
            <a href="/services" className="btn btn--primary">
              Découvrir nos services
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <HoverButtonLink href="/contact" className="btn btn--secondary hero-hover-button">
              Demander un diagnostic
            </HoverButtonLink>
          </div>
        </section>

        {/* Bandeau vitrine sites web (remplace l’ancien ticker secteurs noir) */}
        <HomeWebsiteShowcase />

        {/* ========== COLLABORATEURS ========== */}
        <CollaboratorsSection />

        {/* ========== RÉALISATIONS (existant) ========== */}
        <MediaCloudsSection items={homepageVideos} />

        {/* ========== NEW SECTIONS ========== */}
        <ServicesSection />
        <TargetingSection />
        <MethodeSection />

        {/* ========== STORY (après Process / Méthode) ========== */}
        <StorySection />

        <SegmentsSection />
        <FaqSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </div>
  )
}

export default App
