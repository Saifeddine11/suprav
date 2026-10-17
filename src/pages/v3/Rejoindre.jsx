import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageV3 from './PageV3.jsx'
import PageHero, { Swash, SwashR } from './PageHero.jsx'
import { Li, Btn, SecHead, Bi } from './ui.jsx'
import { MAIL, waText } from './consts.js'
import { ICON } from '../home-v3/data/icons.js'
import './css/rejoindre.css'

/*
 * Rejoindre l'agence : candidatures spontanées (casting ou compétence) avec CV, book ou photo en pièce jointe.
 * Envoi multipart vers /api/candidature.php (Hostinger) ou /api/candidature (Vercel) ; repli e-mail et WhatsApp.
 */

const API = '/api/candidature.php'
const MAX_FILE = 3 * 1024 * 1024
const MSG_MAX = 1500

const DOMAINS = {
  casting: ['Comédien ou comédienne', 'Mannequin', 'Créateur ou créatrice de contenu UGC', 'Voix off', 'Autre talent face caméra'],
  competence: ['Vidéo : cadrage et tournage', 'Montage et motion design', 'Design graphique et direction artistique', 'Développement web', 'Publicité en ligne (media buying)', 'Social media et community management', 'IA et automatisation', 'Stage ou alternance', 'Autre compétence'],
}
const TYPE_LABEL = { casting: 'Casting', competence: 'Compétence' }

const NAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+){0,5}$/
const CITY_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+){0,4}$/
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"']+@[^\s@<>()[\]\\,;:"']+\.[^\s@<>()[\]\\,;:"']{2,}$/i
const URL_IN_TEXT = /(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|ma|fr|info|biz|ru|cn)\b)/i

const SEO = {
  title: 'Rejoindre Supra v3 : recrutement et casting à Marrakech',
  description: 'Vidéaste, monteur, designer, développeur, media buyer ou talent face caméra : envoyez votre CV ou votre book à Supra v3, agence de communication à Marrakech.',
  path: '/rejoindre',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.suprav3.com/' },
      { '@type': 'ListItem', position: 2, name: "Rejoindre l'agence", item: 'https://www.suprav3.com/rejoindre' },
    ],
  },
}

const PROFILES = [
  { k: 'video', t: 'Cadreur ou vidéaste', d: 'Tournage de reels, de publicités et de portraits de marque, du repérage à la dernière prise.', tag: 'Compétence' },
  { k: 'spark', t: 'Monteur ou motion designer', d: 'Rythme, sous-titres, habillage et déclinaisons pour Instagram, TikTok et Snapchat.', tag: 'Compétence' },
  { k: 'palette', t: 'Graphiste ou directeur artistique', d: 'Logos, chartes, visuels de campagne et direction des tournages.', tag: 'Compétence' },
  { k: 'globe', t: 'Développeur web', d: 'Sites vitrines et e-commerce rapides, propres et bien référencés.', tag: 'Compétence' },
  { k: 'target', t: 'Media buyer', d: 'Campagnes Meta, TikTok et Snapchat, suivies sur un objectif chiffré.', tag: 'Compétence' },
  { k: 'chat', t: 'Social media manager', d: 'Calendriers éditoriaux, communautés et réponses aux messages des marques.', tag: 'Compétence' },
  { k: 'bot', t: 'IA et automatisation', d: 'Agents WhatsApp, workflows et outils internes branchés sur les vrais besoins des clients.', tag: 'Compétence' },
  { k: 'brief', t: 'Stage ou alternance', d: 'Étudiants en communication, audiovisuel, design ou développement.', tag: 'Compétence' },
  { k: 'camera', t: 'Talent face caméra', d: 'Comédiens, mannequins, créateurs UGC et voix off pour nos vidéos publicitaires.', tag: 'Casting', a: true },
]

const STEPS = [
  { t: 'Vous envoyez', d: 'Le formulaire ci-dessous, avec votre CV, votre book ou une photo récente.' },
  { t: 'On lit chaque candidature', d: "Elle arrive directement chez l'équipe, qui la lit en entier." },
  { t: 'On vous appelle', d: 'Si votre profil correspond à un projet, on vous contacte par téléphone ou WhatsApp.' },
  { t: 'Essai ou casting', d: 'Un test sur un brief réel pour une compétence, un passage devant la caméra pour un casting.' },
]

const fmtSize = (n) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} Ko` : `${(n / 1024 / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mo`)

/* Type réel du fichier, lu dans ses premiers octets (pas seulement l'extension). */
async function sniff(file) {
  try {
    const b = new Uint8Array(await file.slice(0, 12).arrayBuffer())
    const s = (i, str) => [...str].every((c, j) => b[i + j] === c.charCodeAt(0))
    if (s(0, '%PDF')) return 'pdf'
    if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg'
    if (b[0] === 0x89 && s(1, 'PNG')) return 'png'
    if (s(0, 'RIFF') && s(8, 'WEBP')) return 'webp'
  } catch { /* lecture impossible : le serveur tranchera */ return 'unknown' }
  return ''
}

function validate(v, file) {
  const e = {}
  const digits = v.phone.replace(/\D/g, '')
  if (!v.domain) e.domain = 'Choisissez un domaine.'
  if (!NAME_RE.test(v.name.trim()) || v.name.trim().length < 2 || v.name.trim().length > 80) e.name = 'Indiquez votre prénom et votre nom (lettres uniquement).'
  if (!EMAIL_RE.test(v.email.trim()) || v.email.trim().length > 120) e.email = 'Indiquez une adresse e-mail valide.'
  if (digits.length < 8 || digits.length > 15 || !/^\+?[0-9()[\]\s.-]{8,24}$/.test(v.phone.trim())) e.phone = 'Indiquez un numéro WhatsApp valide.'
  if (!CITY_RE.test(v.city.trim()) || v.city.trim().length > 60) e.city = 'Indiquez votre ville.'
  if (v.portfolio.trim()) {
    let ok = false
    try { const u = new URL(v.portfolio.trim()); ok = /^https?:$/.test(u.protocol) && u.hostname.includes('.') } catch { ok = false }
    if (!ok || v.portfolio.trim().length > 300) e.portfolio = 'Collez un lien complet qui commence par https://'
  }
  if (v.message.length > MSG_MAX) e.message = `${MSG_MAX} caractères maximum.`
  else if (URL_IN_TEXT.test(v.message)) e.message = 'Mettez vos liens dans le champ portfolio, pas dans le message.'
  if (!file) e.cv = v.type === 'casting' ? 'Ajoutez une photo récente ou votre book.' : 'Ajoutez votre CV.'
  if (!v.consent) e.consent = 'Cochez cette case pour que nous puissions traiter votre candidature.'
  return e
}

/* Petite icône statique (les icônes .li ne se dessinent qu'au premier affichage). */
function Ic({ k, s = 1.8 }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON[k]} /></svg>
}

function Clap() {
  return (
    <div className="rj-clap glass" aria-hidden="true">
      <div className="rj-clap-sticks">
        <span className="rj-clap-top"><i /></span>
        <span className="rj-clap-bar"><i /></span>
      </div>
      <dl className="rj-clap-board">
        <div><dt>Production</dt><dd>Supra v3</dd></div>
        <div><dt>Scène</dt><dd>Votre candidature</dd></div>
        <div><dt>Prise</dt><dd>01</dd></div>
        <div><dt>Lieu</dt><dd>Marrakech</dd></div>
      </dl>
      <div className="rj-clap-foot"><span className="rj-rec">REC</span><span>Casting · Compétence</span></div>
    </div>
  )
}

function ApplyForm({ form, setForm }) {
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [drag, setDrag] = useState(false)
  const [state, setState] = useState('idle') /* idle | sending | done | fail */
  const [failMsg, setFailMsg] = useState('')
  const startedAt = useRef(0)
  const fileInput = useRef(null)
  const formRef = useRef(null)
  const doneRef = useRef(null)
  useEffect(() => { startedAt.current = Date.now() }, [])
  useEffect(() => {
    if (state !== 'done' || !doneRef.current) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    doneRef.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    doneRef.current.querySelector('h3')?.focus({ preventScroll: true })
  }, [state])

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: val }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }
  const setType = (t) => setForm((f) => ({ ...f, type: t, domain: DOMAINS[t].includes(f.domain) ? f.domain : '' }))

  const pick = async (f) => {
    if (!f) return
    let err = ''
    if (f.size > MAX_FILE) err = `Fichier trop lourd (${(Math.ceil(f.size / 104857.6) / 10).toLocaleString('fr-FR')} Mo) : 3 Mo maximum. Compressez-le ou envoyez une version allégée.`
    else {
      const kind = await sniff(f)
      if (!kind) err = 'Format non accepté. Envoyez un PDF, un JPG, un PNG ou un WebP.'
    }
    if (err) { setErrors((x) => ({ ...x, cv: err })); setFile(null); if (fileInput.current) fileInput.current.value = ''; return }
    setFile(f); setErrors((x) => ({ ...x, cv: undefined }))
  }
  const removeFile = () => { setFile(null); if (fileInput.current) { fileInput.current.value = ''; fileInput.current.focus() } }

  const first = form.name.trim().split(' ')[0]
  const subject = `Candidature Supra v3 — ${TYPE_LABEL[form.type]} — ${form.name.trim() || 'Nom'}`
  const recap = [`${TYPE_LABEL[form.type]} : ${form.domain || 'à préciser'}`, `Nom : ${form.name.trim()}`, `Ville : ${form.city.trim()}`, `Téléphone : ${form.phone.trim()}`, form.portfolio.trim() ? `Portfolio : ${form.portfolio.trim()}` : '', form.message.trim() ? `Message : ${form.message.trim()}` : ''].filter(Boolean)
  const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Bonjour Supra v3,\n\n${recap.join('\n')}\n\n(Pensez à joindre votre ${form.type === 'casting' ? 'photo ou votre book' : 'CV'} à cet e-mail.)`)}`
  const wa = waText(`Bonjour Supra v3, je souhaite postuler. ${recap.slice(0, 3).join(' · ')}.`)

  const submit = async (e) => {
    e.preventDefault()
    if (state === 'sending') return
    const errs = validate(form, file)
    setErrors(errs)
    const bad = Object.keys(errs).find((k) => errs[k])
    if (bad) {
      const el = formRef.current?.querySelector(bad === 'cv' ? '#rj-cv' : `[name="${bad}"]`)
      if (el) el.focus()
      return
    }
    if (form.website) { setState('done'); return }
    setState('sending'); setFailMsg('')
    const fd = new FormData()
    ;['type', 'domain', 'name', 'email', 'phone', 'city', 'portfolio', 'message'].forEach((k) => fd.append(k, String(form[k]).trim()))
    fd.append('consent', form.consent ? 'oui' : '')
    fd.append('website', form.website)
    fd.append('startedAt', String(startedAt.current))
    fd.append('cv', file, file.name)
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), 45000)
    try {
      const r = await fetch(API, { method: 'POST', body: fd, headers: { Accept: 'application/json' }, signal: ac.signal })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.ok === true) { setState('done'); return }
      if (j.errors && typeof j.errors === 'object' && Object.keys(j.errors).length) {
        setErrors(j.errors); setState('idle')
        const k = Object.keys(j.errors)[0]
        const el = formRef.current?.querySelector(k === 'cv' ? '#rj-cv' : `[name="${k}"]`)
        if (el) el.focus()
        return
      }
      setFailMsg(j.message || '')
      setState('fail')
    } catch {
      setState('fail')
    } finally {
      clearTimeout(timer)
    }
  }

  if (state === 'done') {
    return (
      <div className="rj-done" role="status" ref={doneRef}>
        <span className="rj-ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7" /></svg></span>
        <h3 tabIndex={-1}>Candidature reçue{first ? `, ${first}` : ''} !</h3>
        <p>Merci. Elle est arrivée chez l&apos;équipe, qui la lira en entier. Si votre profil correspond à un projet, on vous contacte par téléphone ou WhatsApp.</p>
        <ul className="rj-sum">
          <li>{TYPE_LABEL[form.type]}</li>
          {form.domain ? <li>{form.domain}</li> : null}
          {file ? <li>{file.name}</li> : null}
        </ul>
        <div className="rj-done-x">
          <Btn to="/realisations" tone="dk" size="sm">Voir nos réalisations</Btn>
          <Link className="rj-link" to="/">Retour à l&apos;accueil</Link>
        </div>
      </div>
    )
  }

  const err = (k) => (errors[k] ? <span className="rj-err" id={`rj-e-${k}`}>{errors[k]}</span> : null)
  const inv = (k) => (errors[k] ? { 'aria-invalid': 'true', 'aria-describedby': `rj-e-${k}` } : {})

  return (
    <form className="rj-form" ref={formRef} onSubmit={submit} noValidate>
      <fieldset className="rj-type">
        <legend>Vous postulez pour</legend>
        {['casting', 'competence'].map((t) => (
          <label key={t} className={`rj-tp${form.type === t ? ' on' : ''}`}>
            <input type="radio" name="type" value={t} checked={form.type === t} onChange={() => setType(t)} />
            <span className="rj-tp-ic"><Ic k={t === 'casting' ? 'camera' : 'brief'} /></span>
            <span className="rj-tp-t"><b>{TYPE_LABEL[t]}</b><small>{t === 'casting' ? 'Photo ou book' : 'CV et portfolio'}</small></span>
          </label>
        ))}
      </fieldset>

      <div className="rj-grid">
        <label className="fld rj-full"><span className="rj-l">Domaine</span>
          <select name="domain" value={form.domain} onChange={set('domain')} {...inv('domain')}>
            <option value="">{form.type === 'casting' ? 'Choisissez votre profil' : 'Choisissez votre domaine'}</option>
            {DOMAINS[form.type].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {err('domain')}
        </label>
        <label className="fld"><span className="rj-l">Prénom et nom</span>
          <input name="name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Ex. Salma Bennani" maxLength={80} {...inv('name')} />
          {err('name')}
        </label>
        <label className="fld"><span className="rj-l">Ville</span>
          <input name="city" autoComplete="address-level2" value={form.city} onChange={set('city')} placeholder="Ex. Marrakech" maxLength={60} {...inv('city')} />
          {err('city')}
        </label>
        <label className="fld"><span className="rj-l">E-mail</span>
          <input name="email" type="email" autoComplete="email" inputMode="email" value={form.email} onChange={set('email')} placeholder="vous@exemple.com" maxLength={120} {...inv('email')} />
          {err('email')}
        </label>
        <label className="fld"><span className="rj-l">Téléphone WhatsApp</span>
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set('phone')} placeholder="+212 6 00 00 00 00" maxLength={24} {...inv('phone')} />
          {err('phone')}
        </label>
        <label className="fld rj-full"><span className="rj-l">Lien portfolio, book ou Instagram <span className="opt">(facultatif)</span></span>
          <input name="portfolio" type="url" inputMode="url" value={form.portfolio} onChange={set('portfolio')} placeholder="https://" maxLength={300} {...inv('portfolio')} />
          {err('portfolio')}
        </label>
        <label className="fld rj-full"><span className="rj-l">Quelques mots sur vous <span className="opt">(facultatif)</span></span>
          <textarea name="message" value={form.message} onChange={set('message')} rows={4} maxLength={MSG_MAX} placeholder={form.type === 'casting' ? 'Votre âge de jeu, vos langues, vos disponibilités…' : 'Ce que vous aimez faire, vos outils, vos disponibilités…'} {...inv('message')} />
          <span className="rj-count" aria-hidden="true">{form.message.length} / {MSG_MAX}</span>
          {err('message')}
        </label>
      </div>

      <div className="rj-up">
        <span className="rj-up-l" id="rj-up-l">{form.type === 'casting' ? 'Photo récente ou book' : 'CV'} <span className="opt">(PDF, JPG, PNG ou WebP · 3 Mo max)</span></span>
        {file ? (
          <div className="rj-file">
            <span className="rj-file-ic">{/\.pdf$/i.test(file.name) ? 'PDF' : 'IMG'}</span>
            <span className="rj-file-n"><b>{file.name}</b><small>{fmtSize(file.size)} · prêt à l&apos;envoi</small></span>
            <button type="button" className="rj-file-x" onClick={removeFile} aria-label={`Retirer ${file.name}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
          </div>
        ) : null}
        <label
          className={`rj-drop${drag ? ' over' : ''}${file ? ' has' : ''}${errors.cv ? ' bad' : ''}`}
          onDragEnter={(e) => { e.preventDefault(); setDrag(true) }}
          onDragOver={(e) => { e.preventDefault(); if (!drag) setDrag(true) }}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDrag(false) }}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]) }}
        >
          <input id="rj-cv" ref={fileInput} className="rj-file-in" type="file" name="cv" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" onChange={(e) => pick(e.target.files?.[0])} aria-labelledby="rj-up-l" {...inv('cv')} />
          <span className="rj-drop-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15.5V4M7.5 8.5 12 4l4.5 4.5M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" /></svg></span>
          <span className="rj-drop-t">{file ? 'Remplacer le fichier' : <>Glissez votre fichier ici ou <u>parcourez vos fichiers</u></>}</span>
        </label>
        {err('cv')}
      </div>

      <label className={`rj-consent${errors.consent ? ' bad' : ''}`}>
        <input type="checkbox" name="consent" checked={form.consent} onChange={set('consent')} {...inv('consent')} />
        <span className="rj-box" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg></span>
        <span>J&apos;accepte que Supra v3 utilise ces informations uniquement pour étudier ma candidature et les conserve 12 mois maximum (loi 09-08). Je peux demander leur suppression à {MAIL}.</span>
      </label>
      {err('consent')}

      <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} aria-hidden="true" />

      {errors.form || errors.type ? <p className="rj-gen" role="alert">{errors.form || errors.type}</p> : null}

      {state === 'fail' ? (
        <div className="rj-fail" role="alert">
          <b>L&apos;envoi n&apos;a pas abouti.</b>
          <p>{failMsg || 'Votre candidature n\'est pas perdue : envoyez-la par e-mail ou par WhatsApp en un clic.'} Pensez à joindre votre {form.type === 'casting' ? 'photo ou votre book' : 'CV'} : nous ne pouvons pas l&apos;ajouter à votre place.</p>
          <div className="rj-fail-x">
            <Btn href={mailto} tone="dk" size="sm" icon={<Ic k="mail" />}>Envoyer par e-mail</Btn>
            <Btn href={wa} tone="ac" size="sm" icon={<Bi k="whatsapp" />}>WhatsApp</Btn>
          </div>
        </div>
      ) : null}

      <div className="rj-go">
        <button className="vbtn b-ac" type="submit" disabled={state === 'sending'} aria-busy={state === 'sending'}>
          <span className="ic">{state === 'sending' ? <span className="rj-spin" aria-hidden="true" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>}</span>
          <span>{state === 'sending' ? 'Envoi en cours…' : state === 'fail' ? 'Réessayer l\'envoi' : 'Envoyer ma candidature'}</span>
        </button>
        <p className="rj-go-n">Vos informations servent uniquement au recrutement.</p>
      </div>
      <p className="rj-sr" aria-live="polite">{state === 'sending' ? 'Envoi de votre candidature en cours.' : ''}</p>
    </form>
  )
}

export default function Rejoindre() {
  const [form, setForm] = useState({ type: 'competence', domain: '', name: '', email: '', phone: '', city: '', portfolio: '', message: '', consent: false, website: '' })
  const choose = (t) => () => setForm((f) => ({ ...f, type: t, domain: DOMAINS[t].includes(f.domain) ? f.domain : '' }))

  return (
    <PageV3 seo={SEO} cta={false} className="rj">
      <PageHero
        crumbs={[{ label: "Rejoindre l'agence" }]}
        kicker="Recrutement et casting · Marrakech"
        title={<>Rejoignez <Swash>l&apos;équipe</Swash> Supra v3.</>}
        lede="Vidéastes, monteurs, designers, développeurs, media buyers ou talents face caméra : envoyez votre CV ou votre book. Chaque candidature est lue par l'équipe."
        aside={<Clap />}
      >
        <Btn href="#candidature" onClick={choose('competence')}>Envoyer mon CV</Btn>
        <Btn href="#candidature" tone="dk" icon={<Ic k="camera" />} onClick={choose('casting')}>Postuler au casting</Btn>
      </PageHero>

      <section className="sec light wrap" id="portes">
        <div className="c">
          <SecHead
            center
            badge="Candidature spontanée"
            label="Deux façons d'entrer"
            title={<>Casting ou <span className="nw"><SwashR>compétence</SwashR> :</span> choisissez votre porte.</>}
            lede="Nous n'affichons pas d'offres datées : toutes les candidatures sont spontanées, et toutes sont lues."
          />
          <div className="rj-doors">
            <article className="rj-door rj-cast" data-r={0} data-hov>
              <div className="rj-door-top"><span className="rj-door-ib"><Li k="camera" /></span><span className="rj-door-n">Porte 01</span></div>
              <h3>Casting</h3>
              <p>Comédiens, mannequins, créateurs UGC, voix off : vous prêtez votre visage ou votre voix à nos vidéos publicitaires.</p>
              <ul className="checks"><li>Une photo récente ou votre book</li><li>Votre ville et vos langues</li><li>Vos réseaux, si vous en avez</li></ul>
              <a className="vbtn b-ac rj-door-go" href="#candidature" onClick={choose('casting')}><span className="ic"><Ic k="camera" /></span><span>Postuler au casting</span></a>
              <span className="rj-door-w" aria-hidden="true">Action !</span>
            </article>
            <article className="rj-door rj-comp" data-r={120} data-hov>
              <div className="rj-door-top"><span className="rj-door-ib"><Li k="brief" /></span><span className="rj-door-n">Porte 02</span></div>
              <h3>Compétence</h3>
              <p>Vidéo, design, web, publicité, social media, IA ou un stage : vous voulez travailler sur les projets de nos clients avec l&apos;équipe.</p>
              <ul className="checks"><li>Votre CV en PDF</li><li>Un lien vers vos travaux</li><li>Quelques mots sur ce que vous aimez faire</li></ul>
              <a className="vbtn b-dk rj-door-go" href="#candidature" onClick={choose('competence')}><span className="ic"><Ic k="arrow" s={2.2} /></span><span>Envoyer mon CV</span></a>
              <span className="rj-door-w" aria-hidden="true">Brief</span>
            </article>
          </div>
        </div>
      </section>

      <section className="sec dark wrap" id="profils">
        <div className="c">
          <SecHead
            badge="Profils"
            label="Ceux qu'on rencontre volontiers"
            title={<>Les talents dont nos projets ont <SwashR>besoin</SwashR>.</>}
            lede="Vidéo, publicité, sites web, identité, IA : voici les métiers qui font tourner l'agence au quotidien."
          />
          <div className="sgrid rj-prof">
            {PROFILES.map((p, i) => (
              <article className="scd" key={p.t} data-r={(i % 3) * 90}>
                <span className={`chip${p.a ? ' a' : ''} rj-tag`}>{p.tag}</span>
                <span className="ib"><Li k={p.k} s={1.8} /></span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </article>
            ))}
          </div>
          <p className="rj-note" data-r>Ce ne sont pas des postes ouverts à date, mais les profils dont nos projets ont besoin. Votre métier n&apos;est pas dans la liste ? Écrivez-nous quand même.</p>
        </div>
      </section>

      <section className="sec light wrap" id="etapes">
        <div className="c">
          <SecHead
            center
            badge="Étapes"
            label="Comment ça se passe"
            title={<>Simple, de l&apos;envoi à la <SwashR>première prise</SwashR>.</>}
          />
          <ol className="rj-steps" data-r>
            <span className="rj-line" aria-hidden="true"><i /></span>
            {STEPS.map((s, i) => (
              <li key={s.t} className="rj-step" style={{ '--i': i }}>
                <span className="rj-node">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec mist wrap" id="candidature">
        <div className="c rj-apply">
          <div className="rj-apply-l" data-r>
            <span className="nb"><b>Candidature</b>2 minutes</span>
            <h2 className="h2">Déposez votre <span className="nw"><SwashR>candidature</SwashR>.</span></h2>
            <p className="lede">Un seul formulaire pour le casting et les compétences. Votre fichier nous parvient en pièce jointe, avec vos coordonnées.</p>
            <ul className="checks"><li>PDF, JPG, PNG ou WebP, 3 Mo maximum</li><li>Un lien vers vos travaux, si vous en avez</li><li>Vos données ne servent qu&apos;au recrutement</li></ul>
            <p className="rj-alt">Un souci avec le formulaire ? Écrivez à <a href={`mailto:${MAIL}?subject=${encodeURIComponent('Candidature Supra v3')}`}>{MAIL}</a> en joignant votre fichier.</p>
          </div>
          <div className="rj-card" data-r={120}>
            <ApplyForm form={form} setForm={setForm} />
          </div>
        </div>
      </section>

      <section className="sec tight light wrap" id="contact">
        <div className="c">
          <div className="band-cta" data-r>
            <div>
              <h2>Vous cherchez une agence, pas un poste ?</h2>
              <p>Répondez à 4 questions en 30 secondes : on vous renvoie un plan d&apos;action pour votre marque.</p>
            </div>
            <Btn to="/contact">Parler de votre projet</Btn>
          </div>
        </div>
      </section>
    </PageV3>
  )
}
