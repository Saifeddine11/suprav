import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Services de communication, web, SEO et IA à Marrakech',
  provider: {
    '@type': 'Organization',
    name: 'Supra v3',
    url: 'https://suprav3.com',
  },
  areaServed: {
    '@type': 'City',
    name: 'Marrakech',
  },
  url: 'https://suprav3.com/services',
  inLanguage: 'fr',
}

export default function Services() {
  return (
    <SeoPageTemplate
      seo={{
        title: 'Services Communication, Web, SEO & IA Marrakech | Supra v3',
        description:
          'Découvrez les services Supra v3 à Marrakech : branding, création de sites web, SEO, publicité digitale, community management, contenus et automatisation IA.',
        path: '/services',
        schema,
      }}
      breadcrumb={[
        { label: 'Accueil', path: '/' },
        { label: 'Services' },
      ]}
      title="Services de communication, web, SEO et IA à Marrakech"
      subtitle="Une équipe unique pour construire votre marque, votre site et votre acquisition digitale"
      intro="Supra v3 accompagne les entreprises de Marrakech de la stratégie à l'exécution : identité de marque, création de site web, contenus, publicité digitale, référencement naturel, community management et automatisation IA. Chaque service peut être activé seul, mais notre force est de connecter les disciplines pour créer un système cohérent qui attire, convainc et convertit."
      services={[
        {
          title: 'Branding & identité visuelle',
          desc: 'Positionnement, naming, logo, charte graphique et direction artistique pour donner à votre marque une présence claire, reconnaissable et durable.',
        },
        {
          title: 'Création de site web Marrakech',
          desc: 'Sites vitrines, e-commerce, refontes et plateformes sur-mesure, conçus pour la vitesse, le SEO et la conversion dès le départ.',
        },
        {
          title: 'SEO & marketing digital',
          desc: 'Audit SEO, référencement local, rédaction web, campagnes Meta Ads et stratégie d’acquisition pour générer un trafic qualifié.',
        },
        {
          title: 'Contenu & réseaux sociaux',
          desc: 'Production photo, vidéo, calendrier éditorial, community management et contenus courts adaptés aux usages du marché marocain.',
        },
        {
          title: 'Automatisation IA',
          desc: 'Chatbots, workflows, intégrations CRM, automatisation des réponses et qualification des leads pour gagner du temps sans perdre la qualité de la relation.',
        },
        {
          title: 'Conseil & pilotage',
          desc: 'Accompagnement stratégique, reporting et priorisation des actions pour transformer vos investissements digitaux en décisions lisibles.',
        },
      ]}
      faq={[
        {
          q: 'Peut-on commencer par un seul service ?',
          a: 'Oui. Beaucoup de clients commencent par un site web, un audit SEO ou une identité visuelle, puis ajoutent les autres leviers au fil de leur croissance.',
        },
        {
          q: 'Travaillez-vous avec des entreprises hors Marrakech ?',
          a: 'Oui. Notre base est à Marrakech, mais nous accompagnons aussi des clients à Casablanca, Rabat, dans tout le Maroc et à l’international.',
        },
        {
          q: 'Comment obtenir un devis ?',
          a: 'Le plus simple est de passer par la page devis gratuit. Nous analysons votre besoin puis nous envoyons une proposition claire avec périmètre, délai et budget.',
        },
      ]}
    />
  )
}
