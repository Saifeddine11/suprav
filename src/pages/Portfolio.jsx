import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const seo = {
  title: 'Portfolio — Réalisations Supra v. Marrakech | Branding, sites web & IA',
  description: 'Découvrez les réalisations de Supra v. : identités de marque, films de marque, sites web et agents IA pour des entreprises à Marrakech et au Maroc.',
  path: '/portfolio',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Portfolio Supra v.',
    url: 'https://suprav3.com/portfolio',
    description: 'Réalisations de branding, sites web, contenus et automatisation IA à Marrakech.',
  },
}

export default function Portfolio() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[{ label: 'Accueil', path: '/' }, { label: 'Portfolio' }]}
      title="Nos Réalisations"
      subtitle="Du brief au résultat — projets livrés à Marrakech"
      intro="On ne montre pas les projets où on a juste fait un logo. On montre les projets où la communication a eu un impact mesurable sur le business du client : plus de leads, plus de ventes, plus de visibilité."
      services={[
        { title: 'Branding & identité visuelle', desc: 'Positionnement, naming, logo, charte graphique et brand book pour des marques immobilières, hôtelières et retail.' },
        { title: 'Sites web & e-commerce', desc: 'Sites vitrines, one-pages, e-commerce et plateformes sur-mesure pour des entreprises à Marrakech et au-delà.' },
        { title: 'Films de marque & contenus sociaux', desc: 'Films 60s, capsules verticales, shooting photo et direction artistique pour Instagram, TikTok et Meta.' },
        { title: 'Automatisation IA & applications', desc: 'Agents WhatsApp, workflows n8n, dashboards et applications métier qui économisent des heures par semaine.' },
      ]}
    />
  )
}
