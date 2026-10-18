import { useState } from 'react'
import { useScroll, useMotionValueEvent } from 'motion/react'
import { TopNavbar } from '../TopNavbar.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import '../seo-pages.css'
import '../styles/site-chrome.css'

/**
 * Layout partagé pour les pages secondaires (réalisations, contact, légal).
 * `footer` : pied de page à afficher ; `null` pour une page qui fournit le sien (landing).
 * `topNavbar` / `mobileNav` : badge « Disponible » fixé en haut et barre de navigation
 * mobile fixée en bas ; `false` les retire ainsi que l’espace qui leur est réservé (landing).
 */
export default function PageLayout({
  children,
  footer = <SiteFooter />,
  topNavbar = true,
  mobileNav = true,
}) {
  const [scrolled, setScrolled] = useState(false)
  const [, setNavOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (current) => {
    setScrolled(current > 50)
  })

  return (
    <div className={`app${mobileNav ? '' : ' app--no-mobile-nav'}`}>
      {topNavbar ? <TopNavbar /> : null}

      <main className={`page-content${topNavbar ? '' : ' page-content--no-badge'}`}>
        <SiteHeader scrolled={scrolled} setNavOpen={setNavOpen} mobileNav={mobileNav} />

        <div className="seo-layout__content">
          {children}
        </div>

        {footer}
      </main>

    </div>
  )
}
