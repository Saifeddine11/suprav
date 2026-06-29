import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import PageLayout from './layouts/PageLayout.jsx'

const Services = lazy(() => import('./pages/Services.jsx'))
const RealisationsHub = lazy(() => import('./pages/RealisationsHub.jsx'))
const RealisationsWebsites = lazy(() => import('./pages/RealisationsWebsites.jsx'))
const RealisationsProductionVideos = lazy(() => import('./pages/RealisationsProductionVideos.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const MentionsLegales = lazy(() => import('./pages/MentionsLegales.jsx'))
const Blog = lazy(() => import('./pages/Blog.jsx'))
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const wrap = (Component) => (
  <PageLayout>
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  </PageLayout>
)

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/services" element={wrap(Services)} />
      <Route path="/realisations" element={wrap(RealisationsHub)} />
      <Route path="/realisations/websites" element={wrap(RealisationsWebsites)} />
      <Route path="/realisations/production-videos" element={wrap(RealisationsProductionVideos)} />
      <Route path="/contact" element={wrap(Contact)} />
      <Route path="/blog" element={wrap(Blog)} />
      <Route path="/blog/:slug" element={wrap(BlogPost)} />
      <Route path="/mentions-legales" element={wrap(MentionsLegales)} />
      <Route path="*" element={wrap(NotFound)} />
    </Routes>
  )
}
