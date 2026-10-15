import { Link } from 'react-router-dom'

export default function V3Nav() {
  return (
    <header className="vnav" id="nav">
      <div className="bar">
        <a className="logo a-logo" href="#top" aria-label="Supra v3, retour en haut" />
        <nav className="links" aria-label="Navigation principale">
          <a href="#realisations">Réalisations</a><a href="#systeme">Services</a><a href="#methode">Méthode</a><a href="#tarifs">Tarifs</a><a href="#faq">FAQ</a>
        </nav>
        <div className="nr">
          <Link className="vbtn b-ac b-sm" to="/contact"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span><span className="lbl">Réserver un appel</span></Link>
          <button className="mbtn" id="mbtn" aria-expanded="false" aria-controls="mnav" aria-label="Ouvrir le menu"><span><i /><i /></span></button>
        </div>
      </div>
      <nav className="mnav" id="mnav" hidden aria-label="Menu mobile">
        <a href="#realisations">Réalisations</a><a href="#systeme">Services</a><a href="#methode">Méthode</a><a href="#tarifs">Tarifs</a><a href="#faq">FAQ</a><a href="#contact">Contact</a>
      </nav>
    </header>
  )
}
