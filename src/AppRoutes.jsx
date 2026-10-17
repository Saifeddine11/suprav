import { lazy, Suspense, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import HomeV3 from './pages/home-v3/HomeV3.jsx'
import PageLayout from './layouts/PageLayout.jsx'
import { trackPageView } from './utils/analytics.js'

// Ancienne page d'accueil, conservée pour revenir en arrière si besoin :
// remplacer <HomeV3 /> par <App /> ci-dessous et réimporter './App.jsx'.

const Services = lazy(() => import('./pages/Services.jsx'))
const RealisationsHub = lazy(() => import('./pages/RealisationsHub.jsx'))
const RealisationsWebsites = lazy(() => import('./pages/RealisationsWebsites.jsx'))
const RealisationsProductionVideos = lazy(() => import('./pages/RealisationsProductionVideos.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const LandingProjetRoute = lazy(() => import('./pages/LandingProjetRoute.jsx'))
const MentionsLegales = lazy(() => import('./pages/MentionsLegales.jsx'))
const Blog = lazy(() => import('./pages/Blog.jsx'))
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

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
      <Route path="/realisations" element={wrap(RealisationsHub)} />
      <Route path="/realisations/websites" element={wrap(RealisationsWebsites)} />
      <Route path="/realisations/production-videos" element={wrap(RealisationsProductionVideos)} />
      <Route path="/contact" element={wrap(Contact)} />
      <Route path="/votre-projet" element={wrap(LandingProjetRoute, undefined, { footer: null, topNavbar: false, mobileNav: false })} />
      <Route path="/blog" element={wrap(Blog)} />
      <Route path="/blog/:slug" element={wrap(BlogPost)} />
      <Route path="/mentions-legales" element={wrap(MentionsLegales)} />
      <Route path="*" element={wrap(NotFound)} />
    </Routes>
    </>
  )
}
