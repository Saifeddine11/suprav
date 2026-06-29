import { useState } from 'react'
import { useScroll, useMotionValueEvent } from 'motion/react'
import { TopNavbar } from '../TopNavbar.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import '../seo-pages.css'

/**
 * Layout partagé pour les pages secondaires (réalisations, contact, légal).
 */
export default function PageLayout({ children }) {
  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (current) => {
    setScrolled(current > 50)
  })

  return (
    <div className="app">
      <TopNavbar />

      <main className="page-content">
        <SiteHeader scrolled={scrolled} navOpen={navOpen} setNavOpen={setNavOpen} />

        <div className="seo-layout__content">
          {children}
        </div>

        <SiteFooter />
      </main>

    </div>
  )
}
