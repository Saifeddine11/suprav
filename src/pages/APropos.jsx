import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const seo = {
  title: 'À Propos de Supra v3 — Agence de communication Marrakech',
  description: 'Découvrez l\'équipe Supra v3, agence de communication 360° à Marrakech. Branding, sites web, contenus, IA. Notre histoire, nos valeurs, notre méthode.',
  path: '/a-propos',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'À Propos de Supra v3',
    url: 'https://suprav3.com/a-propos',
    description: 'Agence de communication 360° à Marrakech fondée pour accompagner les marques ambitieuses.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Supra v3',
      url: 'https://suprav3.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressCountry: 'MA' },
    },
  },
}

export default function APropos() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[{ label: 'Accueil', path: '/' }, { label: 'À Propos' }]}
      title="À Propos de Supra v3"
      subtitle="Une agence de communication 360° fondée à Marrakech"
      intro="Supra v3 accompagne les marques ambitieuses à Marrakech avec une équipe complète qui relie stratégie, design, contenus, sites web, applications et automatisation IA. Nous construisons une image claire, une présence digitale crédible et des outils concrets pour transformer l'attention en clients."
      services={[
        { title: 'Notre mission', desc: 'Construire des marques mémorables et des présences digitales qui travaillent pour vous — pas des livrables qui vieillissent dans un tiroir.' },
        { title: 'Notre méthode', desc: 'Comprendre → Structurer → Créer → Déployer → Optimiser. Cinq étapes, aucune approximation, tout mesuré.' },
        { title: 'Notre équipe', desc: 'Stratèges, designers, développeurs, producteurs de contenus. Tout en interne. Pas de sous-traitance, pas de perte de qualité.' },
        { title: 'Notre territoire', desc: 'Notre atelier est à Marrakech. Nos clients sont à Casablanca, Rabat et à l\'international. Les cadrages se font en visio ou en présentiel.' },
      ]}
    />
  )
}
