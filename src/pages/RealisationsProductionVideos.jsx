import SeoPageTemplate from '../components/SeoPageTemplate.jsx'
import VideoProductionSection from '../components/realisations/VideoProductionSection.jsx'
import { RealisationsFinalCta, WHATSAPP } from '../components/realisations/realisationsShared.jsx'
import { SEO_PAGES } from '../data/seoPages.js'
import '../App.css'

const seo = {
  ...SEO_PAGES.videos,
  path: '/realisations/production-videos',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Production vidéo Marrakech — Supra v3',
    url: 'https://www.suprav3.com/realisations/production-videos',
    description: SEO_PAGES.videos.description,
    publisher: {
      '@type': 'Organization',
      name: 'Supra v3',
      url: 'https://www.suprav3.com',
    },
  },
}

export default function RealisationsProductionVideos() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[
        { label: 'Accueil', path: '/' },
        { label: 'Réalisations', path: '/realisations' },
        { label: 'Production vidéos' },
      ]}
      title="Production vidéo Marrakech"
      subtitle="Production vidéos — reels, publicités et contenus de marque"
      intro="Reels Instagram, vidéos publicitaires Meta Ads, films immobiliers, contenus beauté, restauration et social media : découvrez comment Supra v3 produit des vidéos pensées pour capter l'attention et renforcer l'image de marque."
      primaryCta={{ href: '/contact', label: 'Parler de votre projet →' }}
      secondaryCta={{ href: WHATSAPP, label: 'WhatsApp', external: true }}
      internalLinks={[
        { label: 'Services', path: '/services', desc: 'Stratégie, production vidéo, social media et diffusion.' },
        { label: 'Sites web', path: '/realisations/websites', desc: 'Vitrines et e-commerce réalisés à Marrakech.' },
        { label: 'Contact', path: '/contact', desc: 'Cadrer un tournage ou une série de contenus.' },
      ]}
      showBookingCta={false}
    >
      <VideoProductionSection />
      <RealisationsFinalCta />
    </SeoPageTemplate>
  )
}
