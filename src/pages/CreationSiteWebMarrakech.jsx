import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const seo = {
  title: 'Création Site Web Marrakech — Supra v. | Sites vitrines, e-commerce & sur-mesure',
  description: 'Création de site web à Marrakech par Supra v. : sites vitrines, e-commerce, one-pages. Rapides, référencés Google, mobile-first. Devis gratuit sous 48h.',
  path: '/creation-site-web-marrakech',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Création de site web à Marrakech',
    provider: { '@type': 'LocalBusiness', name: 'Supra v.', url: 'https://suprav3.com' },
    areaServed: { '@type': 'City', name: 'Marrakech' },
    description: 'Création de sites web sur-mesure à Marrakech : sites vitrines, e-commerce, one-pages. Design soigné, SEO natif, performance Lighthouse.',
  },
}

export default function CreationSiteWebMarrakech() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[{ label: 'Accueil', path: '/' }, { label: 'Services', path: '/agence-communication-marrakech' }, { label: 'Création site web Marrakech' }]}
      title="Création site web Marrakech"
      subtitle="Sites vitrines, e-commerce et plateformes sur-mesure"
      intro="Supra v. crée des sites web à Marrakech conçus pour charger sous deux secondes, se référencer naturellement sur Google et convertir les visiteurs en clients. Pas de templates. Du code propre, du design sur-mesure, une architecture pensée pour durer."
      services={[
        { title: 'Site vitrine Marrakech', desc: 'À partir de 15 000 MAD. Idéal pour les PME, restaurants, hôtels et professions libérales. Livré en 3 à 6 semaines.' },
        { title: 'Site e-commerce', desc: 'À partir de 35 000 MAD. Paiement Maroc (CMI, PayPal), gestion stock, tunnel de vente optimisé.' },
        { title: 'One-page & landing page', desc: 'À partir de 8 000 MAD. Pour les lancements de produit, campagnes pub et événements.' },
        { title: 'Refonte de site web', desc: 'Audit, migration SEO sécurisée, nouveau design. Zéro perte de trafic garanti.' },
      ]}
      faq={[
        { q: 'Combien coûte la création d\'un site web à Marrakech ?', a: 'Un site vitrine démarre à 15 000 MAD, un e-commerce à 35 000 MAD. Devis gratuit sous 48h après cadrage.' },
        { q: 'Quel est le délai de création d\'un site web ?', a: '3 à 6 semaines pour un site vitrine, 6 à 10 semaines pour un e-commerce, selon la complexité.' },
        { q: 'Proposez-vous la maintenance du site après livraison ?', a: 'Oui, des contrats mensuels couvrent l\'hébergement, les mises à jour, les corrections et le support prioritaire.' },
      ]}
    />
  )
}
