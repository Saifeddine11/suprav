import { lazy, Suspense, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import HomeV3 from './pages/home-v3/HomeV3.jsx'
import PageLayout from './layouts/PageLayout.jsx'
import { trackPageView } from './utils/analytics.js'

// Ancienne page d'accueil, conservée pour revenir en arrière si besoin :
// remplacer <HomeV3 /> par <App /> ci-dessous et réimporter './App.jsx'.

const Services = lazy(() => import('./pages/Services.jsx'))
const LandingProjetRoute = lazy(() => import('./pages/LandingProjetRoute.jsx'))
const MentionsLegales = lazy(() => import('./pages/MentionsLegales.jsx'))
// Pages intérieures v3 (même direction artistique que l'accueil)
const RealisationsV3 = lazy(() => import('./pages/v3/Realisations.jsx'))
const ContactV3 = lazy(() => import('./pages/v3/Contact.jsx'))
const AgenceV3 = lazy(() => import('./pages/v3/Agence.jsx'))
const RejoindreV3 = lazy(() => import('./pages/v3/Rejoindre.jsx'))
const BlogV3 = lazy(() => import('./pages/v3/Blog.jsx'))
const BlogArticleV3 = lazy(() => import('./pages/v3/BlogArticle.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

/* Pages v3 : elles portent leur propre navigation et pied de page (pas de PageLayout). */
const V3_WAIT = <div style={{ minHeight: '100vh', background: '#0A0A0A' }} />
const v3 = (Component, props, key) => (
  <Suspense key={key} fallback={V3_WAIT}>
    <Component {...props} />
  </Suspense>
)

const wrap = (Component, props, layout) => (
  <PageLayout {...layout}>
    <Suspense fallback={null}>
      <Component {...props} />
    </Suspense>
  </PageLayout>
)

/** PageView Meta à chaque changement de route ; le premier chargement est déjà envoyé par index.html. */
function PageViewTracker() {
  const { pathname } = useLocation()
  const lastPath = useRef(pathname)

  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    trackPageView()
  }, [pathname])

  return null
}

export default function AppRoutes() {
  return (
    <>
    <PageViewTracker />
    <Routes>
      <Route path="/" element={<HomeV3 />} />
      <Route path="/services" element={wrap(Services)} />
      <Route path="/realisations" element={v3(RealisationsV3, undefined, 'rz-all')} />
      <Route path="/realisations/websites" element={v3(RealisationsV3, { only: 'sites' }, 'rz-sites')} />
      <Route path="/realisations/production-videos" element={v3(RealisationsV3, { only: 'videos' }, 'rz-videos')} />
      <Route path="/contact" element={v3(ContactV3)} />
      <Route path="/agence" element={v3(AgenceV3)} />
      <Route path="/rejoindre" element={v3(RejoindreV3)} />
      <Route path="/votre-projet" element={wrap(LandingProjetRoute, undefined, { footer: null, topNavbar: false, mobileNav: false })} />
      <Route path="/blog" element={v3(BlogV3)} />
      <Route path="/blog/:slug" element={v3(BlogArticleV3)} />
      <Route path="/mentions-legales" element={wrap(MentionsLegales)} />
      <Route path="*" element={wrap(NotFound)} />
    </Routes>
    </>
  )
}
