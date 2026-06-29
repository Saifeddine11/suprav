import SeoPageTemplate from '../components/SeoPageTemplate.jsx'
import WebsiteProjectsSection from '../components/realisations/WebsiteProjectsSection.jsx'
import { RealisationsFinalCta, WHATSAPP } from '../components/realisations/realisationsShared.jsx'
import { SEO_PAGES } from '../data/seoPages.js'
import '../App.css'

const seo = {
  ...SEO_PAGES.websites,
  path: '/realisations/websites',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Création site web Marrakech — Supra v3',
    url: 'https://www.suprav3.com/realisations/websites',
    description: SEO_PAGES.websites.description,
    publisher: {
      '@type': 'Organization',
      name: 'Supra v3',
      url: 'https://www.suprav3.com',
    },
  },
}

export default function RealisationsWebsites() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[
        { label: 'Accueil', path: '/' },
        { label: 'Réalisations', path: '/realisations' },
        { label: 'Sites web' },
      ]}
      title="Création site web Marrakech"
      subtitle="Sites web — vitrines, e-commerce et expériences digitales"
      intro="Découvrez des sites vitrines, boutiques en ligne et expériences digitales réalisés par Supra v3 pour Emara Estates, Hachkar, By Merrachi, Africa Beauty, Gatsby Barber, Verde Paris et d'autres marques. Chaque projet clarifie l'offre, renforce la crédibilité et facilite la prise de contact."
      primaryCta={{ href: '/contact', label: 'Parler de votre projet →' }}
      secondaryCta={{ href: WHATSAPP, label: 'WhatsApp', external: true }}
      internalLinks={[
        { label: 'Services', path: '/services', desc: 'Stratégie, branding, web, vidéo et marketing digital.' },
        { label: 'Production vidéo', path: '/realisations/production-videos', desc: 'Reels, films de marque et contenus sociaux.' },
        { label: 'Contact', path: '/contact', desc: 'Demander un diagnostic pour votre site.' },
      ]}
      showBookingCta={false}
    >
      <WebsiteProjectsSection />
      <RealisationsFinalCta />
    </SeoPageTemplate>
  )
}
