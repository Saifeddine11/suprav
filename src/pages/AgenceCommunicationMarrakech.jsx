import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const seo = {
  title: 'Agence de Communication Marrakech — Supra v. | Branding, Web & IA',
  description: 'Supra v. est l\'agence de communication 360° à Marrakech : branding, création de sites web, contenus photo/vidéo, publicité digitale et automatisation IA. Une équipe, de la stratégie au code.',
  path: '/agence-communication-marrakech',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Supra v. — Agence de communication Marrakech',
    url: 'https://suprav3.com/agence-communication-marrakech',
    description: 'Agence de communication 360° à Marrakech spécialisée en branding, création de sites web, marketing digital et automatisation IA.',
    areaServed: { '@type': 'City', name: 'Marrakech' },
    address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressCountry: 'MA' },
    telephone: '+33744208673',
    priceRange: '$$',
  },
}

export default function AgenceCommunicationMarrakech() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[{ label: 'Accueil', path: '/' }, { label: 'Agence de communication Marrakech' }]}
      title="Agence de communication Marrakech"
      subtitle="Communication 360° — Branding, Sites web, Contenus & Intelligence Artificielle"
      intro="Supra v. est l'agence de communication à Marrakech qui accompagne les marques ambitieuses de la stratégie jusqu'au code. Branding, création de sites web, production de contenus, publicité digitale, community management et automatisation IA — tout en interne, sans sous-traitance, depuis Marrakech."
      services={[
        { title: 'Stratégie de marque & branding', desc: 'Positionnement, naming, identité visuelle, direction artistique. Un territoire de marque que vos concurrents ne peuvent pas copier.' },
        { title: 'Création de site web Marrakech', desc: 'Sites vitrines, e-commerce et plateformes sur-mesure. Rapides, référencés et orientés conversion dès la première ligne de code.' },
        { title: 'Production de contenus', desc: 'Photo, vidéo, films de marque, contenus verticaux pour Instagram, TikTok et Meta. Direction artistique incluse.' },
        { title: 'Publicité digitale & Meta Ads', desc: 'Campagnes Meta, TikTok et Snapchat Ads. Un dirham dépensé doit rapporter un dirham mesurable.' },
        { title: 'Community management Marrakech', desc: 'Ligne éditoriale, calendrier, publications, animation. Une présence qui parle la même langue que votre marque.' },
        { title: 'Automatisation IA Marrakech', desc: 'Workflows n8n, agents conversationnels, intégrations API. L\'IA au service de vos opérations, pas de la démonstration.' },
      ]}
      faq={[
        { q: 'Combien coûte une agence de communication à Marrakech ?', a: 'Nos projets démarrent à 12 000 MAD pour un branding et 15 000 MAD pour un site vitrine. Nous remettons un devis détaillé sous 48h.' },
        { q: 'Quelle est la différence entre une agence de communication et une agence web ?', a: 'Une agence de communication couvre la stratégie, l\'identité, les contenus, le digital et la pub. Une agence web se limite souvent à la technique. Supra v. fait les deux.' },
        { q: 'Travaillez-vous uniquement avec des clients à Marrakech ?', a: 'Non. Notre atelier est à Marrakech mais nous accompagnons des clients à Casablanca, Rabat et à l\'international.' },
        { q: 'Quel est votre délai moyen pour un projet de communication ?', a: 'Branding : 2 à 4 semaines. Site web : 3 à 6 semaines. Campagne pub : en ligne en 5 jours. Projets IA : 4 à 12 semaines.' },
      ]}
    />
  )
}
