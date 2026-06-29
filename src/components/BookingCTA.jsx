/**
 * BookingCTA — Copie exacte du CTA de la page d'accueil.
 * Utilise les mêmes classes CSS (.cta-final, .cta-final__panel, .cta-booking…)
 * et importe App.css pour garantir le style identique.
 */
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import '../App.css'
import { ANIMATE_VARIANTS, VIEWPORT_SETTINGS } from '../animationConstants.js'
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '../data/contactChannels.js'
import AnimatedText from './animations/AnimatedText.jsx'

import { partnerImage } from '../data/partnerAssets.js'

const stagger  = ANIMATE_VARIANTS.staggerContainer
const fadeUp   = ANIMATE_VARIANTS.fadeUp
const viewport = VIEWPORT_SETTINGS

/* ─────────────────────────────────────────
   Helpers calendrier — même logique que App.jsx
───────────────────────────────────────── */
const BOOKING_TIME_SLOTS = ['10h - 12h', '11h - 13h', '14h - 16h', '16h - 18h', '17h - 21h']
const BOOKING_AVAILABILITY = {
  firstDaysSingleSlotChance: 0.05,
  nearThreeSlotChance:       0.8,
  nearRestrictedChance:      0.5,
  laterOpenChance:           0.99,
  laterThreeSlotChance:      0.65,
}

const toLocalDateKey = (date) => {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

const startOfLocalDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const getDayDifference = (date, todayDate = new Date()) => {
  const target     = startOfLocalDay(date)
  const todayStart = startOfLocalDay(todayDate)
  return Math.round((target.getTime() - todayStart.getTime()) / 86400000)
}

const seededRandom = (seed) => {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 1000000) / 1000000
}

const pickDeterministicSlots = (seed, count, slots = BOOKING_TIME_SLOTS) =>
  [...slots]
    .map(slot => ({ slot, score: seededRandom(`${seed}:${slot}`) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map(({ slot }) => slot)

function getAvailableTimeSlotsForDate(date, todayDate = new Date()) {
  const diff     = getDayDifference(date, todayDate)
  const todayKey = toLocalDateKey(startOfLocalDay(todayDate))
  const dateKey  = toLocalDateKey(date)

  if (diff < 0 || diff === 0) return []

  if (diff <= 2) {
    if (seededRandom(`${todayKey}:${dateKey}:first-days-slot`) >= BOOKING_AVAILABILITY.firstDaysSingleSlotChance) return []
    return pickDeterministicSlots(`${todayKey}:${dateKey}:first-days-slot`, 1)
  }

  if (diff <= 4) {
    const nearScore = seededRandom(`${todayKey}:${dateKey}:near-availability`)
    if (nearScore < BOOKING_AVAILABILITY.nearThreeSlotChance)
      return pickDeterministicSlots(`${todayKey}:${dateKey}:near-three-slots`, 3)
    if (seededRandom(`${todayKey}:${dateKey}:near-restricted`) >= BOOKING_AVAILABILITY.nearRestrictedChance) return []
    return pickDeterministicSlots(`${todayKey}:${dateKey}:near-restricted-slot`, 1)
  }

  if (seededRandom(`${todayKey}:${dateKey}:later-open`) >= BOOKING_AVAILABILITY.laterOpenChance) return []
  const slotCount = seededRandom(`${dateKey}:later-slot-count`) < BOOKING_AVAILABILITY.laterThreeSlotChance ? 3 : 2
  return pickDeterministicSlots(`${dateKey}:later-slots`, slotCount)
}

const findFirstAvailableDate = (todayDate = new Date(), look = 45) => {
  const start = startOfLocalDay(todayDate)
  for (let i = 0; i <= look; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    if (getAvailableTimeSlotsForDate(d, start).length > 0) return d
  }
  return start
}

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth()    === b.getMonth()    &&
  a.getDate()     === b.getDate()

const WEEKDAYS = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']

/* ─────────────────────────────────────────
   Composant — même JSX que la home
───────────────────────────────────────── */
export default function BookingCTA({ pageHero = false }) {
  const [today, setToday]               = useState(() => startOfLocalDay(new Date()))
  const initialDate                     = useMemo(() => findFirstAvailableDate(today), [today])
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [selectedTime, setSelectedTime] = useState('')

  useEffect(() => {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 1, 0)
    const ms = Math.max(tomorrow.getTime() - Date.now(), 1000)
    const t = window.setTimeout(() => setToday(startOfLocalDay(new Date())), ms)
    return () => clearTimeout(t)
  }, [today])

  const slots = useMemo(
    () => getAvailableTimeSlotsForDate(selectedDate, today),
    [selectedDate, today]
  )
  const effectiveTime = slots.includes(selectedTime) ? selectedTime : slots[0] ?? ''

  const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(calendarMonth)

  const selectedDateParts = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric' }).formatToParts(selectedDate)
  const selectedDateShortLabel = `${selectedDateParts.find(p => p.type === 'weekday')?.value ?? ''} ${selectedDateParts.find(p => p.type === 'day')?.value ?? ''}`.replace('.', '').trim()

  const calendarDays = Array.from(
    { length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate() },
    (_, i) => new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), i + 1)
  )
  const calendarOffset = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay()

  const changeCalendarMonth = (dir) =>
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + dir, 1))

  const buildWhatsAppUrl = () => {
    const dateStr = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(selectedDate)
    const text = encodeURIComponent(
      `Bonjour, je souhaite réserver un créneau le ${dateStr} de ${effectiveTime} pour discuter de mon projet. Je viens de votre site web.`
    )
    return `${WHATSAPP_URL}?text=${text}`
  }

  return (
    <section className={`cta-final${pageHero ? ' cta-final--page-hero' : ''}`} id="contact">
      <div className="container">
        <motion.div
          className="cta-final__inner"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div className="cta-final__panel" variants={fadeUp}>
            <div className="cta-final__ambient" aria-hidden="true" />

            {/* ── Colonne gauche ── */}
            <motion.div className="cta-contact-copy" variants={stagger}>
              <motion.div className="cta-contact-copy__head" variants={fadeUp}>
                <span className="cta-form__pill">Contact</span>
                <AnimatedText
                  as={pageHero ? 'h1' : 'h2'}
                  text="Démarrons votre projet."
                  animateBy="words"
                  direction="top"
                  delay={100}
                  stepDuration={0.35}
                  instant={pageHero}
                  threshold={0.15}
                  rootMargin="-50px"
                />
                <p>Construisons une marque, un site ou un outil digital qui travaille vraiment pour vous.</p>
              </motion.div>

              <motion.div className="cta-contact-copy__details" variants={fadeUp}>
                <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
                <a href="mailto:contact@suprav3.com">contact@suprav3.com</a>
              </motion.div>

              <motion.div className="cta-social-proof" variants={fadeUp} aria-label="Note clients 4.9 sur 5">
                <div className="cta-social-proof__avatars" aria-hidden="true">
                  <span><img src={partnerImage(3)} alt="" width={40} height={40} loading="lazy" decoding="async" aria-hidden="true" /></span>
                  <span><img src={partnerImage(5)} alt="" width={40} height={40} loading="lazy" decoding="async" aria-hidden="true" /></span>
                  <span><img src={partnerImage(12)} alt="" width={40} height={40} loading="lazy" decoding="async" aria-hidden="true" /></span>
                  <span>+</span>
                </div>
                <p><strong>4.9 / 5</strong> clients accompagnés</p>
              </motion.div>
            </motion.div>

            {/* ── Colonne droite : calendrier ── */}
            <motion.div
              className="cta-form cta-booking"
              variants={fadeUp}
            >
              <span className="cta-booking__eyebrow">Prendre rendez-vous</span>

              <div className="cta-booking__top">
                <h3>{monthLabel}</h3>
                <div className="cta-booking__month-controls">
                  <button type="button" onClick={() => changeCalendarMonth(-1)} aria-label="Mois précédent">‹</button>
                  <button type="button" onClick={() => changeCalendarMonth(1)}  aria-label="Mois suivant">›</button>
                </div>
              </div>

              <div className="cta-calendar" aria-label="Choisir une date">
                {WEEKDAYS.map(day => (
                  <span key={day} className="cta-calendar__weekday">{day}</span>
                ))}
                {Array.from({ length: calendarOffset }).map((_, i) => (
                  <span key={`blank-${i}`} className="cta-calendar__blank" />
                ))}
                {calendarDays.map((date) => {
                  const daySlots = getAvailableTimeSlotsForDate(date, today)
                  const disabled  = date < today
                  const selected  = isSameDay(date, selectedDate)
                  const available = daySlots.length > 0
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      disabled={disabled}
                      className={[
                        'cta-calendar__day',
                        available ? 'is-available' : 'is-fully-booked',
                        selected  ? 'is-selected'  : '',
                      ].filter(Boolean).join(' ')}
                      aria-label={`${date.getDate()} · ${available ? `${daySlots.length} créneau${daySlots.length > 1 ? 'x' : ''} disponible${daySlots.length > 1 ? 's' : ''}` : 'Complet'}`}
                      onClick={() => {
                        setSelectedDate(date)
                        setSelectedTime(daySlots[0] ?? '')
                      }}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>

              <div className="cta-booking__schedule">
                <strong>{selectedDateShortLabel}</strong>
                <span>
                  {slots.length > 0
                    ? `${slots.length} créneau${slots.length > 1 ? 'x' : ''} disponible${slots.length > 1 ? 's' : ''}`
                    : 'Complet'}
                </span>
              </div>

              <div className="cta-booking__time-slots" aria-label="Choisir un créneau">
                {slots.length > 0 ? (
                  slots.map(time => (
                    <motion.a
                      key={time}
                      href={buildWhatsAppUrl()}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`cta-booking__time-slot${effectiveTime === time ? ' is-selected' : ''}`}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </motion.a>
                  ))
                ) : (
                  <div className="cta-booking__fully-booked" role="status">Complet</div>
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

          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
