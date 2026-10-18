import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'
import { FINAL_CTA, FINDER, FORM_ANCHOR } from '../../data/landingContent.js'
import { whatsappUrlWithMessage } from '../../data/contactChannels.js'
import {
  CONTACT_ERRORS,
  buildProjectMessage,
  cleanTextInput,
  sendContactRequest,
  validateContactFields,
  validateFreeText,
} from '../../utils/contactRequest.js'
import LandingFinderAmbient from './LandingFinderAmbient.jsx'
import { ArrowIcon, Reveal } from './LandingPrimitives.jsx'
import { finderScene } from './landingFinderScene.js'
import { DURATION, EASE, trackLandingEvent, useLandingMotion, useScrollScene } from './landingMotion.js'

const STEPS = FINDER.steps
const CHOICE_STEPS = STEPS.filter((step) => step.options)
const LAST_INDEX = STEPS.length - 1
const AUTO_ADVANCE_MS = 340
const CUSTOM_MAX_LENGTH = 160
const INITIAL_CONTACT = { name: '', phone: '', email: '', website: '' }
const pad = (value) => String(value).padStart(2, '0')

const CHOICE_REQUIRED = 'Choisissez une réponse pour continuer.'
const MESSAGE_REJECTED = 'Une de vos précisions ne peut pas être envoyée telle quelle. Merci de la reformuler, sans lien.'
const LOCAL_NOTE = ' En local, Vite n’exécute pas /api/contact.php : rien n’a été envoyé.'

/** Un mot à trait d’union (« pouvons-nous ») ne se coupe jamais en fin de ligne. */
const keepHyphenated = (text) => text.split(/(\S+-\S+)/).map((part, index) => (
  index % 2 ? <span className="lp-nowrap" key={part}>{part}</span> : part
))

const findOption = (step, answer) => step.options?.find((option) => option.id === answer?.optionId)

/** Étape à choix multiples : options cochées, dans l’ordre d’affichage. */
const selectedOptions = (step, answer) => (
  step.multiple ? step.options.filter((option) => answer?.optionIds?.includes(option.id)) : []
)

/** Réponse lisible d’une étape : libellés cochés, libellé de l’option, ou précision saisie pour « Autre ». */
function answerText(step, answer) {
  if (step.multiple) return selectedOptions(step, answer).map((option) => option.label).join(', ')
  const option = findOption(step, answer)
  if (!option) return ''
  if (!option.custom) return option.label
  const custom = cleanTextInput(answer.custom)
  return custom ? `${option.label} — ${custom}` : option.label
}

const buildSummary = (answers) => CHOICE_STEPS
  .map((step) => ({ id: step.id, label: step.label, value: answerText(step, answers[step.id]) }))
  .filter((item) => item.value)

const stepVariants = {
  enter: (direction) => ({ opacity: 0, x: direction * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction * -28 }),
}

export default function ProjectFinder({ ref }) {
  const rootRef = useRef(null)
  const { animate } = useLandingMotion()
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState({})
  const [contact, setContact] = useState(INITIAL_CONTACT)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [startedAt] = useState(() => Date.now())
  const advanceTimerRef = useRef(null)
  const focusQuestionRef = useRef(false)
  const focusCustomRef = useRef(false)
  const pointerPickRef = useRef(null)
  const startedRef = useRef(false)

  const step = STEPS[stepIndex]
  const isContactStep = stepIndex === LAST_INDEX
  const answer = answers[step.id]
  const selectedOption = step.multiple ? null : findOption(step, answer)
  const checkedIds = step.multiple ? (answer?.optionIds ?? []) : []
  const summary = buildSummary(answers)
  useScrollScene(rootRef, finderScene)

  useEffect(() => () => window.clearTimeout(advanceTimerRef.current), [])

  const moveTo = (nextIndex, nextDirection) => {
    window.clearTimeout(advanceTimerRef.current)
    focusQuestionRef.current = true
    setDirection(nextDirection)
    setErrors({})
    setStepIndex(nextIndex)
  }

  /* Les cartes « chantier » ouvrent le parcours avec le service déjà coché. */
  useImperativeHandle(ref, () => ({
    startWith(optionId) {
      if (status === 'sent' || status === 'sending') return
      if (!STEPS[0].options.some((option) => option.id === optionId)) return

      setAnswers((current) => ({
        ...current,
        [STEPS[0].id]: STEPS[0].multiple ? { optionIds: [optionId] } : { optionId, custom: '' },
      }))
      if (stepIndex === 0) {
        window.clearTimeout(advanceTimerRef.current)
        setDirection(1)
        setErrors({})
        setStepIndex(1)
      }
    },
  }), [status, stepIndex])

  /* Souris ou doigt posé à l’instant sur cette carte ? Sinon le choix vient du clavier. */
  const pickedByPointer = (optionId, timeStamp) => {
    const pick = pointerPickRef.current
    pointerPickRef.current = null
    return Boolean(pick) && pick.id === optionId && timeStamp - pick.at < 1500
  }

  const markStarted = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackLandingEvent('form_start', { form_name: 'parcours_projet' })
  }

  /* Choix multiple : on coche / décoche, sans avancer (on valide avec « Continuer »). */
  const toggle = (option) => {
    markStarted()
    setAnswers((current) => {
      const ids = current[step.id]?.optionIds ?? []
      const nextIds = ids.includes(option.id) ? ids.filter((id) => id !== option.id) : [...ids, option.id]
      return { ...current, [step.id]: { optionIds: nextIds } }
    })
    setErrors({})
    window.clearTimeout(advanceTimerRef.current)
  }

  const choose = (option, viaPointer) => {
    markStarted()
    setAnswers((current) => ({
      ...current,
      [step.id]: { optionId: option.id, custom: current[step.id]?.custom ?? '' },
    }))
    setErrors({})
    window.clearTimeout(advanceTimerRef.current)

    if (!viaPointer) return
    if (option.custom) {
      focusCustomRef.current = true
      return
    }
    // Un choix au pointeur fait avancer ; au clavier, on valide avec Entrée ou « Continuer ».
    const from = stepIndex
    advanceTimerRef.current = window.setTimeout(() => {
      focusQuestionRef.current = true
      setDirection(1)
      setStepIndex((current) => (current === from ? from + 1 : current))
    }, AUTO_ADVANCE_MS)
  }

  const validateChoice = () => {
    if (step.multiple) return checkedIds.length > 0 ? {} : { choice: CHOICE_REQUIRED }
    if (!selectedOption) return { choice: CHOICE_REQUIRED }
    if (selectedOption.custom) {
      const message = validateFreeText(answer.custom)
      if (message) return { custom: message }
    }
    return {}
  }

  const submit = async () => {
    const validation = validateContactFields(contact)
    const nextErrors = { ...validation.errors }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    // Champ piège rempli : ce n’est pas une personne, rien n’est envoyé.
    if (contact.website) {
      setErrors({ form: CONTACT_ERRORS.network })
      return
    }

    setErrors({})
    setStatus('sending')

    const result = await sendContactRequest({
      ...validation.sanitized,
      message: buildProjectMessage(summary),
      website: '',
      // Le parcours ne réserve pas de créneau : l’email interne l’indique clairement.
      date: 'Demande via la page projet',
      time: 'À convenir',
      startedAt,
    })

    if (result.ok) {
      focusQuestionRef.current = true
      setStatus('sent')
      trackLandingEvent('generate_lead', {
        form_name: 'parcours_projet',
        project_service: (answers.service?.optionIds ?? []).join(','),
        project_objective: answers.objective?.optionId,
      })
      return
    }

    const serverErrors = result.errors || {}
    const mapped = {}
    for (const field of ['name', 'phone', 'email']) {
      if (serverErrors[field]) mapped[field] = serverErrors[field]
    }
    if (serverErrors.message) mapped.form = MESSAGE_REJECTED
    if (Object.keys(mapped).length === 0) {
      mapped.form = `${result.message}${import.meta.env.DEV ? LOCAL_NOTE : ''}`
    }
    setErrors(mapped)
    setStatus('idle')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (status === 'sending') return

    if (isContactStep) {
      submit()
      return
    }

    const stepErrors = validateChoice()
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    moveTo(stepIndex + 1, 1)
  }

  const handleContactChange = (event) => {
    const { name, value } = event.target
    setContact((current) => ({ ...current, [name]: value }))
    if (errors[name] || errors.form) {
      setErrors((current) => {
        const next = { ...current }
        delete next[name]
        delete next.form
        return next
      })
    }
  }

  const handleContactBlur = (event) => {
    const { name } = event.target
    const fieldError = validateContactFields(contact).errors[name]
    if (!fieldError || !contact[name]) return
    setErrors((current) => ({ ...current, [name]: fieldError }))
  }

  /* Après un changement d’étape, le focus rejoint la nouvelle question (clavier, lecteurs d’écran). */
  const questionRef = useCallback((node) => {
    if (!node || !focusQuestionRef.current) return
    focusQuestionRef.current = false
    node.focus({ preventScroll: true })
  }, [])

  /* La confirmation remplace un formulaire plus haut : on la ramène à l’écran avant d’y poser le focus. */
  const doneRef = useCallback((node) => {
    if (!node || !focusQuestionRef.current) return
    focusQuestionRef.current = false
    node.closest('.lp-finder__card')?.scrollIntoView({ block: 'center', behavior: animate ? 'smooth' : 'auto' })
    node.focus({ preventScroll: true })
  }, [animate])

  const customRef = useCallback((node) => {
    if (!node || !focusCustomRef.current) return
    focusCustomRef.current = false
    node.focus({ preventScroll: true })
  }, [])

  const whatsappHref = whatsappUrlWithMessage(
    ['Bonjour, je viens de votre site et je souhaite parler de mon projet.', ...summary.map((item) => `${item.label} : ${item.value}`)].join('\n'),
  )
  const firstName = cleanTextInput(contact.name).split(' ')[0]
  const transition = animate ? { duration: DURATION.fast, ease: EASE } : { duration: 0 }

  return (
    <section className="lp-block lp-finder" id={FORM_ANCHOR} ref={rootRef} aria-labelledby="lp-finder-title">
      <div className="lp-panel lp-finder__panel">
        <LandingFinderAmbient />
        <div className="lp-finder__copy">
          <Reveal>
            <h2 className="lp-title lp-title--on-dark" id="lp-finder-title">
              {FINAL_CTA.title.map((line) => (
                <span className="lp-title__line" key={line}>
                  {keepHyphenated(line)}{' '}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal as="p" className="lp-lead lp-lead--on-dark" delay={0.1}>{FINAL_CTA.text}</Reveal>
          <Reveal as="p" className="lp-finder__small" delay={0.16}>{FINAL_CTA.small}</Reveal>

          {summary.length > 0 && status !== 'sent' ? (
            <dl className="lp-finder__recap" aria-label="Vos réponses">
              {summary.map((item) => (
                <div key={item.id}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <Reveal className="lp-glass lp-finder__card" delay={0.15} amount={0.15}>
          {status === 'sent' ? (
            <div className="lp-finder__done" role="status">
              <span className="lp-finder__done-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <h3 tabIndex={-1} ref={doneRef}>
                {firstName ? `Merci ${firstName}, c’est bien reçu.` : 'Merci, c’est bien reçu.'}
              </h3>
              <p>Votre demande nous est parvenue. Nous revenons vers vous rapidement.</p>
              <a className="lp-link lp-link--on-dark" href={whatsappHref} target="_blank" rel="noreferrer noopener">
                Poursuivre sur WhatsApp
                <span aria-hidden="true"> ↗</span>
              </a>
            </div>
          ) : (
            <form className="lp-finder__form" onSubmit={handleSubmit} noValidate aria-label={FINDER.title}>
              <p className="lp-finder__intro">{FINDER.title}</p>
              <div className="lp-finder__top">
                <p className="lp-finder__counter" aria-hidden="true">
                  <strong>{pad(stepIndex + 1)}</strong> / {pad(STEPS.length)}
                </p>
                <div
                  className="lp-finder__bar"
                  role="progressbar"
                  aria-label="Progression du parcours"
                  aria-valuemin={1}
                  aria-valuemax={STEPS.length}
                  aria-valuenow={stepIndex + 1}
                  aria-valuetext={`Étape ${stepIndex + 1} sur ${STEPS.length}`}
                >
                  <motion.span
                    className="lp-finder__bar-fill"
                    initial={false}
                    animate={{ scaleX: (stepIndex + 1) / STEPS.length }}
                    transition={animate ? { duration: 0.7, ease: EASE } : { duration: 0 }}
                  />
                </div>
              </div>
              <p className="lp-sr" aria-live="polite">Étape {stepIndex + 1} sur {STEPS.length}</p>

              <div className="lp-finder__stage">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={step.id}
                    className="lp-finder__step"
                    custom={direction}
                    variants={animate ? stepVariants : undefined}
                    initial={animate ? 'enter' : false}
                    animate="center"
                    exit={animate ? 'exit' : undefined}
                    transition={transition}
                  >
                    {isContactStep ? (
                      <div className="lp-finder__fields">
                        <h3 className="lp-finder__question" tabIndex={-1} ref={questionRef}>{keepHyphenated(step.question)}</h3>

                        <label className="lp-honeypot" aria-hidden="true">
                          <span>Site web</span>
                          <input name="website" type="text" tabIndex={-1} autoComplete="off" value={contact.website} onChange={handleContactChange} />
                        </label>

                        <label className="lp-field">
                          <span className="lp-field__label">Nom complet</span>
                          <input
                            name="name"
                            type="text"
                            autoComplete="name"
                            maxLength={80}
                            required
                            value={contact.name}
                            onChange={handleContactChange}
                            onBlur={handleContactBlur}
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={errors.name ? 'lp-finder-name-error' : undefined}
                          />
                          {errors.name ? <span className="lp-field__error" id="lp-finder-name-error" role="alert">{errors.name}</span> : null}
                        </label>

                        <label className="lp-field">
                          <span className="lp-field__label">Téléphone ou WhatsApp</span>
                          <input
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            maxLength={24}
                            required
                            value={contact.phone}
                            onChange={handleContactChange}
                            onBlur={handleContactBlur}
                            aria-invalid={Boolean(errors.phone)}
                            aria-describedby={errors.phone ? 'lp-finder-phone-error' : undefined}
                          />
                          {errors.phone ? <span className="lp-field__error" id="lp-finder-phone-error" role="alert">{errors.phone}</span> : null}
                        </label>

                        <label className="lp-field">
                          <span className="lp-field__label">Email <em className="lp-field__optional">(facultatif)</em></span>
                          <input
                            name="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            maxLength={120}
                            value={contact.email}
                            onChange={handleContactChange}
                            onBlur={handleContactBlur}
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? 'lp-finder-email-error' : undefined}
                          />
                          {errors.email ? <span className="lp-field__error" id="lp-finder-email-error" role="alert">{errors.email}</span> : null}
                        </label>
                      </div>
                    ) : (
                      <fieldset className="lp-finder__choices" aria-describedby={errors.choice ? 'lp-finder-choice-error' : undefined}>
                        <legend className="lp-finder__question" tabIndex={-1} ref={questionRef}>{keepHyphenated(step.question)}</legend>
                        {step.hint ? <p className="lp-finder__question-hint">{step.hint}</p> : null}

                        <div className="lp-finder__options">
                          {step.options.map((option) => {
                            const checked = step.multiple ? checkedIds.includes(option.id) : answer?.optionId === option.id
                            return (
                              <label
                                key={option.id}
                                className={`lp-option${step.multiple ? ' lp-option--multi' : ''}${checked ? ' is-selected' : ''}`}
                                onPointerDown={(event) => {
                                  if (!step.multiple) pointerPickRef.current = { id: option.id, at: event.timeStamp }
                                }}
                              >
                                {step.multiple ? (
                                  <input
                                    className="lp-option__input"
                                    type="checkbox"
                                    name={step.id}
                                    value={option.id}
                                    checked={checked}
                                    onChange={() => toggle(option)}
                                  />
                                ) : (
                                  <input
                                    className="lp-option__input"
                                    type="radio"
                                    name={step.id}
                                    value={option.id}
                                    checked={checked}
                                    onChange={(event) => choose(option, pickedByPointer(option.id, event.timeStamp))}
                                    onClick={(event) => {
                                      // Carte déjà choisie : un nouveau clic au pointeur fait simplement avancer.
                                      if (checked && event.detail > 0) choose(option, true)
                                    }}
                                  />
                                )}
                                <span className="lp-option__copy">
                                  <span className="lp-option__label">{option.label}</span>
                                  {option.hint ? <span className="lp-option__hint">{option.hint}</span> : null}
                                </span>
                                <span className="lp-option__mark" aria-hidden="true" />
                              </label>
                            )
                          })}
                        </div>

                        {selectedOption?.custom ? (
                          <label className="lp-field lp-finder__custom">
                            <span className="lp-field__label">{step.customLabel}</span>
                            <input
                              ref={customRef}
                              type="text"
                              name={`${step.id}-custom`}
                              placeholder={step.customPlaceholder}
                              maxLength={CUSTOM_MAX_LENGTH}
                              value={answer.custom}
                              onChange={(event) => {
                                const { value } = event.target
                                setAnswers((current) => ({ ...current, [step.id]: { ...current[step.id], custom: value } }))
                                if (errors.custom) setErrors({})
                              }}
                              aria-invalid={Boolean(errors.custom)}
                              aria-describedby={errors.custom ? 'lp-finder-custom-error' : undefined}
                            />
                            {errors.custom ? <span className="lp-field__error" id="lp-finder-custom-error" role="alert">{errors.custom}</span> : null}
                          </label>
                        ) : null}

                        {errors.choice ? <p className="lp-field__error" id="lp-finder-choice-error" role="alert">{errors.choice}</p> : null}
                      </fieldset>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {errors.form ? <p className="lp-finder__alert" role="alert">{errors.form}</p> : null}

              <div className="lp-finder__nav">
                {stepIndex > 0 ? (
                  <button
                    type="button"
                    className="lp-btn lp-btn--ghost"
                    onClick={() => moveTo(stepIndex - 1, -1)}
                    disabled={status === 'sending'}
                  >
                    <span aria-hidden="true">←</span> Retour
                  </button>
                ) : null}

                <motion.button
                  type="submit"
                  className="lp-btn lp-btn--accent"
                  disabled={status === 'sending'}
                  whileHover={animate ? { scale: 1.025 } : undefined}
                  whileTap={animate ? { scale: 0.98 } : undefined}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <span>{isContactStep ? (status === 'sending' ? 'Envoi…' : FINDER.submit) : 'Continuer'}</span>
                  <ArrowIcon />
                </motion.button>
              </div>

              <p className="lp-finder__microcopy">{FINDER.microcopy}</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
