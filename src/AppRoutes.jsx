import { lazy, Suspense, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import App, { MediaCloudsSection } from './App.jsx'
import PageLayout from './layouts/PageLayout.jsx'
import { LANDING_VIDEO_ITEMS, shuffleVideoItems } from './data/videoProjects.js'
import { trackPageView } from './utils/analytics.js'

const Services = lazy(() => import('./pages/Services.jsx'))
const RealisationsHub = lazy(() => import('./pages/RealisationsHub.jsx'))
const RealisationsWebsites = lazy(() => import('./pages/RealisationsWebsites.jsx'))
const RealisationsProductionVideos = lazy(() => import('./pages/RealisationsProductionVideos.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const LandingProjet = lazy(() => import('./pages/LandingProjet.jsx'))
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

/*
 * Bandeau vidéo de la page d’accueil, même composant que dans App.jsx ; seule la liste diffère
 * (LANDING_VIDEO_ITEMS : uniquement les vidéos du dossier « Landing page videos »).
 * Créé ici (bundle principal) puis passé à la landing : l’importer depuis la page,
 * chargée à la demande, scinderait le CSS de la page d’accueil en deux fichiers.
 * Ordre aléatoire à chaque chargement du site (cf. shuffleVideoItems).
 */
const homeVideoSection = <MediaCloudsSection items={shuffleVideoItems(LANDING_VIDEO_ITEMS)} showHeader={false} />

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
      <Route path="/" element={<App />} />
      <Route path="/services" element={wrap(Services)} />
      <Route path="/realisations" element={wrap(RealisationsHub)} />
      <Route path="/realisations/websites" element={wrap(RealisationsWebsites)} />
      <Route path="/realisations/production-videos" element={wrap(RealisationsProductionVideos)} />
      <Route path="/contact" element={wrap(Contact)} />
      <Route path="/votre-projet" element={wrap(LandingProjet, { videoSection: homeVideoSection }, { footer: null, topNavbar: false, mobileNav: false })} />
      <Route path="/blog" element={wrap(Blog)} />
      <Route path="/blog/:slug" element={wrap(BlogPost)} />
      <Route path="/mentions-legales" element={wrap(MentionsLegales)} />
      <Route path="*" element={wrap(NotFound)} />
    </Routes>
    </>
  )
}
