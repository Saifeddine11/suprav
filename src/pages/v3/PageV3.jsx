import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import PageSEO from '../../components/PageSEO.jsx'
import '../home-v3/home-v3.css'
import './pages-v3.css'
import initPageV3 from './initPageV3.js'
import V3Nav from '../home-v3/sections/V3Nav.jsx'
import V3Footer from '../home-v3/sections/V3Footer.jsx'
import V3Dock from '../home-v3/sections/V3Dock.jsx'
import FinalCta from '../home-v3/sections/FinalCta.jsx'

/**
 * Gabarit des pages intérieures v3 : même navigation, même pied de page, mêmes animations que l'accueil.
 * `seo` : props de PageSEO ; `init(ctx)` : comportements propres à la page ; `cta` : quiz de contact en bas de page.
 */
export default function PageV3({ seo, init, cta = true, className = '', children }) {
  const root = useRef(null)
  const { hash } = useLocation()
  const nav = useNavigationType()

  useEffect(() => {
    if (nav !== 'POP' && !hash) window.scrollTo({ top: 0, behavior: 'instant' })
    return initPageV3(root.current, init)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- montage unique : le balisage est statique
  }, [])

  return (
    <div className={`v3 pg ${className}`.trim()} ref={root}>
      {seo ? <PageSEO {...seo} /> : null}
      <V3Nav />
      <main>
        {children}
        {cta ? <FinalCta /> : null}
      </main>
      <V3Footer />
      <V3Dock />
    </div>
  )
}
