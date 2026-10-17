import { Link, NavLink } from 'react-router-dom'

/* Pages de l'agence, puis sections de l'accueil (« /#… » : défilement doux si l'on est déjà sur l'accueil). */
const LINKS = [
  { to: '/realisations', label: 'Réalisations' },
  { to: '/#systeme', label: 'Services' },
  { to: '/agence', label: 'Agence' },
  { to: '/#tarifs', label: 'Tarifs' },
  { to: '/blog', label: 'Blog' },
]
const MORE = [
  { to: '/rejoindre', label: "Rejoindre l'agence" },
  { to: '/contact', label: 'Contact' },
]
const item = (l) => (l.to.includes('#')
  ? <Link key={l.to} to={l.to}>{l.label}</Link>
  : <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)

export default function V3Nav() {
  return (
    <header className="vnav" id="nav">
      <div className="bar">
        <Link className="logo a-logo" to="/" data-top aria-label="Supra v3, accueil" />
        <nav className="links" aria-label="Navigation principale">
          {LINKS.map(item)}
        </nav>
        <div className="nr">
          <Link className="vbtn b-ac b-sm" to="/contact"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span><span className="lbl">Réserver un appel</span></Link>
          <button className="mbtn" id="mbtn" aria-expanded="false" aria-controls="mnav" aria-label="Ouvrir le menu"><span><i /><i /></span></button>
        </div>
      </div>
      <nav className="mnav" id="mnav" hidden aria-label="Menu mobile">
        {LINKS.map(item)}{MORE.map(item)}
      </nav>
    </header>
  )
}
