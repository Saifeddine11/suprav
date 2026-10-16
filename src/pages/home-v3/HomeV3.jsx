import { useEffect, useRef } from 'react'
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
 */
export default function HomeV3() {
  const root = useRef(null)

  useEffect(() => initHomeV3(root.current), [])

  return (
    <div className="v3" ref={root}>
      <V3Nav />
      <main>
        <Hero />
        <LogoBand />
        <Realisations />
        <Chiffres />
        <Vision />
        <Presence />
        <Systeme />
        <Ecosysteme />
        <Comparatif />
        <Methode />
        <Avis />
        <Secteurs />
        <Tarifs />
        <Faq />
        <FinalCta />
      </main>
      <V3Footer />
      <V3Dock />
    </div>
  )
}
