import { Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import PageLayout from './layouts/PageLayout.jsx'

// ── Pages de conversion ──────────────────────────────────────
import APropos from './pages/APropos.jsx'
import Contact from './pages/Contact.jsx'
import Portfolio from './pages/Portfolio.jsx'
import DevisGratuit from './pages/DevisGratuit.jsx'

// ── Page pilier #1 ───────────────────────────────────────────
import AgenceCommunicationMarrakech from './pages/AgenceCommunicationMarrakech.jsx'

// ── Cluster Tech ─────────────────────────────────────────────
import CreationSiteWebMarrakech from './pages/CreationSiteWebMarrakech.jsx'
import SiteVitrineMarrakech from './pages/SiteVitrineMarrakech.jsx'
import SiteEcommerceMarrakech from './pages/SiteEcommerceMarrakech.jsx'
import AgenceWebMarrakech from './pages/AgenceWebMarrakech.jsx'
import RefonteSiteWeb from './pages/RefonteSiteWeb.jsx'
import ApplicationMobileMarrakech from './pages/ApplicationMobileMarrakech.jsx'
import ApplicationSaas from './pages/ApplicationSaas.jsx'

// ── Cluster Communication ────────────────────────────────────
import BrandingMarrakech from './pages/BrandingMarrakech.jsx'
import CreationLogoMarrakech from './pages/CreationLogoMarrakech.jsx'
import CharteGraphique from './pages/CharteGraphique.jsx'
import ProductionContenu from './pages/ProductionContenu.jsx'
import PubliciteMarrakech from './pages/PubliciteMarrakech.jsx'
import CommunityManagementMarrakech from './pages/CommunityManagementMarrakech.jsx'

// ── Cluster SEO + IA ─────────────────────────────────────────
import ReferencementSeoMarrakech from './pages/ReferencementSeoMarrakech.jsx'
import AuditSeo from './pages/AuditSeo.jsx'
import SeoLocalMarrakech from './pages/SeoLocalMarrakech.jsx'
import RedactionWebSeo from './pages/RedactionWebSeo.jsx'
import MarketingDigitalMarrakech from './pages/MarketingDigitalMarrakech.jsx'
import AutomatisationIa from './pages/AutomatisationIa.jsx'
import ChatbotIaMarrakech from './pages/ChatbotIaMarrakech.jsx'

// ── Cluster Sectoriel ────────────────────────────────────────
import AgenceImmobilierMarrakech from './pages/AgenceImmobilierMarrakech.jsx'
import AgenceHotelMarrakech from './pages/AgenceHotelMarrakech.jsx'
import AgenceRestaurantMarrakech from './pages/AgenceRestaurantMarrakech.jsx'
import PersonalBrandingMarrakech from './pages/PersonalBrandingMarrakech.jsx'

// ── Blog ─────────────────────────────────────────────────────
import Blog from './pages/Blog.jsx'
import ArticlePrixSiteWeb from './pages/ArticlePrixSiteWeb.jsx'
import ArticleChoisirAgence from './pages/ArticleChoisirAgence.jsx'
import ArticleSeoLocal from './pages/ArticleSeoLocal.jsx'
import ArticleIaCommunication from './pages/ArticleIaCommunication.jsx'

// ── Autres ───────────────────────────────────────────────────
import Services from './pages/Services.jsx'
import MentionsLegales from './pages/MentionsLegales.jsx'

const wrap = (Component) => (
  <PageLayout>
    <Component />
  </PageLayout>
)

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Home + Works → App.jsx gère en interne ── */}
      <Route path="/" element={<App />} />
      <Route path="/works" element={<App />} />

      {/* ── Conversion ── */}
      <Route path="/a-propos"      element={wrap(APropos)} />
      <Route path="/contact"       element={wrap(Contact)} />
      <Route path="/portfolio"     element={wrap(Portfolio)} />
      <Route path="/devis-gratuit" element={wrap(DevisGratuit)} />

      {/* ── Pilier #1 ── */}
      <Route path="/agence-communication-marrakech" element={wrap(AgenceCommunicationMarrakech)} />

      {/* ── Cluster Tech ── */}
      <Route path="/creation-site-web-marrakech"  element={wrap(CreationSiteWebMarrakech)} />
      <Route path="/site-vitrine-marrakech"        element={wrap(SiteVitrineMarrakech)} />
      <Route path="/site-ecommerce-marrakech"      element={wrap(SiteEcommerceMarrakech)} />
      <Route path="/agence-web-marrakech"          element={wrap(AgenceWebMarrakech)} />
      <Route path="/refonte-site-web"              element={wrap(RefonteSiteWeb)} />
      <Route path="/application-mobile-marrakech"  element={wrap(ApplicationMobileMarrakech)} />
      <Route path="/application-saas"              element={wrap(ApplicationSaas)} />

      {/* ── Cluster Communication ── */}
      <Route path="/branding-marrakech"                 element={wrap(BrandingMarrakech)} />
      <Route path="/creation-logo-marrakech"            element={wrap(CreationLogoMarrakech)} />
      <Route path="/charte-graphique"                   element={wrap(CharteGraphique)} />
      <Route path="/production-contenu"                 element={wrap(ProductionContenu)} />
      <Route path="/publicite-marrakech"                element={wrap(PubliciteMarrakech)} />
      <Route path="/community-management-marrakech"     element={wrap(CommunityManagementMarrakech)} />

      {/* ── Cluster SEO + IA ── */}
      <Route path="/referencement-seo-marrakech"  element={wrap(ReferencementSeoMarrakech)} />
      <Route path="/audit-seo"                    element={wrap(AuditSeo)} />
      <Route path="/seo-local-marrakech"          element={wrap(SeoLocalMarrakech)} />
      <Route path="/redaction-web-seo"            element={wrap(RedactionWebSeo)} />
      <Route path="/marketing-digital-marrakech"  element={wrap(MarketingDigitalMarrakech)} />
      <Route path="/automatisation-ia"            element={wrap(AutomatisationIa)} />
      <Route path="/chatbot-ia-marrakech"         element={wrap(ChatbotIaMarrakech)} />

      {/* ── Cluster Sectoriel ── */}
      <Route path="/agence-communication-immobilier-marrakech"  element={wrap(AgenceImmobilierMarrakech)} />
      <Route path="/agence-communication-hotel-marrakech"       element={wrap(AgenceHotelMarrakech)} />
      <Route path="/agence-communication-restaurant-marrakech"  element={wrap(AgenceRestaurantMarrakech)} />
      <Route path="/personal-branding-marrakech"                element={wrap(PersonalBrandingMarrakech)} />

      {/* ── Blog ── */}
      <Route path="/blog"                                      element={wrap(Blog)} />
      <Route path="/blog/combien-coute-site-web-marrakech"     element={wrap(ArticlePrixSiteWeb)} />
      <Route path="/blog/comment-choisir-agence-communication" element={wrap(ArticleChoisirAgence)} />
      <Route path="/blog/seo-local-guide-marrakech"            element={wrap(ArticleSeoLocal)} />
      <Route path="/blog/ia-communication-entreprise"          element={wrap(ArticleIaCommunication)} />

      {/* ── Autres ── */}
      <Route path="/services"         element={wrap(Services)} />
      <Route path="/mentions-legales" element={wrap(MentionsLegales)} />
    </Routes>
  )
}
