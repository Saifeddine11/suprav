/* Petits éléments partagés des pages intérieures v3 (icônes, boutons, en-têtes de section). */
import { Link } from 'react-router-dom'
import { ICON, BRAND } from '../home-v3/data/icons.js'
import { waText } from './consts.js'


/* Icône au trait qui se dessine à l'apparition (classe .li, voir core/reveals.js). */
export function Li({ k, s = 1.7, className = '' }) {
  return (
    <svg className={`li ${className}`.trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path pathLength="1" d={ICON[k]} />
    </svg>
  )
}

/* Logo de plateforme (Simple Icons). */
export function Bi({ k, className = '' }) {
  return <svg className={`bi ${className}`.trim()} viewBox="0 0 24 24" aria-hidden="true"><path d={BRAND[k].d} /></svg>
}

export function ArrowIc() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

/* Bouton pilule de l'accueil : flèche dans un rond à gauche. `to` = lien interne, `href` = externe. */
export function Btn({ to, href, tone = 'ac', size = '', icon, children, ...rest }) {
  const cls = `vbtn b-${tone}${size ? ' b-' + size : ''}`
  const ic = <span className="ic">{icon || <ArrowIc />}</span>
  if (to) return <Link className={cls} to={to} {...rest}>{ic}<span>{children}</span></Link>
  return <a className={cls} href={href} {...(href && href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})} {...rest}>{ic}<span>{children}</span></a>
}

export function WaBtn({ text = 'Bonjour Supra v3, je souhaite parler d\'un projet.', tone = 'dk', size = '', children = 'Écrire sur WhatsApp' }) {
  return <Btn href={waText(text)} tone={tone} size={size} icon={<Bi k="whatsapp" />}>{children}</Btn>
}

/* En-tête de section : badge, titre, accroche ; `center` pour centrer. */
export function SecHead({ badge, label, title, lede, center = false, children }) {
  const nb = badge ? <span className="nb"><b>{badge}</b>{label}</span> : null
  const h = <h2 className="h2">{title}</h2>
  const p = lede ? <p className="lede">{lede}</p> : null
  if (center) return <div className="shead" data-r>{nb}{h}{p}{children}</div>
  return <div className="chead" data-r><div className="l">{nb}{h}{p}</div>{children}</div>
}
