import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import PageSEO from '../../components/PageSEO.jsx'
import './home-v3.css'
import initHomeV3 from './initHomeV3.js'
import V3Nav from './sections/V3Nav.jsx'
import Hero from './sections/Hero.jsx'
import LogoBand from './sections/LogoBand.jsx'
import Realisations from './sections/Realisations.jsx'
import Chiffres from './sections/Chiffres.jsx'
import Vision from './sections/Vision.jsx'
import Presence from './sections/Presence.jsx'
import Systeme from './sections/Systeme.jsx'
import Ecosysteme from './sections/Ecosysteme.jsx'
import Jeu from './sections/Jeu.jsx'
import Comparatif from './sections/Comparatif.jsx'
import Methode from './sections/Methode.jsx'
import Avis from './sections/Avis.jsx'
import Secteurs from './sections/Secteurs.jsx'
import Tarifs from './sections/Tarifs.jsx'
import Faq from './sections/Faq.jsx'
import FinalCta from './sections/FinalCta.jsx'
import V3Footer from './sections/V3Footer.jsx'
import V3Dock from './sections/V3Dock.jsx'

/**
 * Page d'accueil v3 (refonte octobre 2026).
 * Le balisage est statique ; les animations et interactions sont branchées
 * une seule fois au montage par initHomeV3, qui renvoie son propre nettoyage.
 * Ordre des sections pensé pour la conversion : accroche, preuves, conviction,
 * différenciation, offre, jeu, confiance, adéquation, méthode, prix, objections, contact.
 */
export default function HomeV3() {
  const root = useRef(null)
  const { hash } = useLocation()
  const nav = useNavigationType()

  useEffect(() => {
    if (nav !== 'POP' && !hash) window.scrollTo({ top: 0, behavior: 'instant' })
    return initHomeV3(root.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- montage unique : le balisage est statique
  }, [])

  return (
    <div className="v3" ref={root}>
      <PageSEO title="Agence de communication 360° à Marrakech | Supra v3" description="Supra v3, agence de communication 360° à Marrakech, accompagne les marques en stratégie, branding, sites web, contenus, marketing digital et IA." path="/" />
      <V3Nav />
      <main>
        {/* Accroche */}
        <Hero />
        <LogoBand />
        {/* Preuves */}
        <Realisations />
        <Chiffres />
        {/* Conviction et différence, puis l'offre */}
        <Vision />
        <Comparatif />
        <Systeme />
        <Ecosysteme />
        {/* Le résultat, en jeu : attraper les clients qui passent */}
        <Jeu />
        {/* La confiance qui le prouve */}
        <Avis />
        <Presence />
        {/* Pour qui, comment, combien */}
        <Secteurs />
        <Methode />
        <Tarifs />
        {/* Objections, puis passage à l'action */}
        <Faq />
        <FinalCta />
      </main>
      <V3Footer />
      <V3Dock />
    </div>
  )
}
