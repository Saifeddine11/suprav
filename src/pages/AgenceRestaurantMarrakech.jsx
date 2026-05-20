import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Agence communication restaurant Marrakech — Supra v3',
  description:
    'Supra v3 accompagne les restaurants à Marrakech avec branding, photos, vidéos, réseaux sociaux, site web, menus digitaux et visibilité locale.',
  provider: {
    '@type': 'Organization',
    name: 'Supra v3',
    url: 'https://suprav3.com',
    telephone: '+33744208673',
    email: 'contact@suprav3.com',
  },
  areaServed: { '@type': 'City', name: 'Marrakech' },
  url: 'https://suprav3.com/agence-communication-restaurant-marrakech',
  serviceType: 'Communication restauration',
}

export default function AgenceRestaurantMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: 'Agence communication restaurant Marrakech | Branding, réseaux sociaux & site web',
        description:
          'Supra v3 accompagne les restaurants à Marrakech avec branding, photos, vidéos, réseaux sociaux, site web, menus digitaux et visibilité locale.',
        path: '/agence-communication-restaurant-marrakech',
        schema,
      }}
      breadcrumb={[
        { label: 'Accueil', path: '/' },
        { label: 'Secteurs', path: '/services' },
        { label: 'Communication restaurant' },
      ]}
      title="Agence de communication pour restaurants à Marrakech"
      subtitle="Restauration — image, contenu & réservations"
      intro="À Marrakech, la concurrence est forte entre la Médina, Guéliz et Hivernage. Supra v3 aide les restaurants à soigner leur image, être visibles sur Google et les réseaux, et transformer l’attention en réservations — sans reprendre le discours générique de la homepage."
      primaryCta={{ href: '/devis-gratuit', label: 'Booster mon restaurant →' }}
      secondaryCta={{
        href: 'https://wa.me/33744208673?text=' + encodeURIComponent('Bonjour Supra v3, je souhaite parler de la communication de mon restaurant à Marrakech.'),
        label: 'Parler de mon établissement',
        external: true,
      }}
      services={[
        {
          title: 'Identité visuelle & menu',
          desc: 'Logo, charte, menu print et digital cohérents. Une image qui reflète votre cuisine et votre niveau de gamme.',
        },
        {
          title: 'Photo & vidéo food',
          desc: 'Plats, salle, ambiance : contenus pour site, Google Business et Reels. Le visuel est souvent le premier critère de choix.',
        },
        {
          title: 'Réseaux sociaux',
          desc: 'Instagram, TikTok : ligne éditoriale, publications régulières, coulisses et événements pour garder votre salle dans l’esprit des clients.',
        },
        {
          title: 'Site web & menu digital',
          desc: 'Site avec menu en ligne, réservation ou lien WhatsApp. QR code table, compatible Google et TripAdvisor.',
        },
        {
          title: 'Google Business & avis',
          desc: 'Fiche optimisée, photos, posts et stratégie d’avis pour apparaître sur « restaurant Marrakech » et les recherches de quartier.',
        },
        {
          title: 'Campagnes Ads locales',
          desc: 'Meta Ads géolocalisées pour remplir les midis/soirs creux ou lancer une nouvelle carte — avec suivi des réservations.',
        },
      ]}
      servicesHeadline={
        <>
          Ce que nous faisons <span className="text-accent">pour les restaurants.</span>
        </>
      }
      richContent={[
        {
          heading: 'Les défis des restaurants à Marrakech',
          bullets: [
            'Concurrence forte entre établissements',
            'Besoin d’une image visuelle irréprochable',
            'Visibilité Google et Maps décisive pour touristes et locaux',
            'Réseaux sociaux exigeants en régularité',
            'Réservations et avis clients à structurer',
          ],
        },
        {
          heading: 'Méthode Supra v3 pour la restauration',
          body: [
            'Nous commençons par un diagnostic : positionnement, fiche Google, site, réseaux et saisonnalité (Ramadan, haute saison). Ensuite nous priorisons les leviers à impact rapide — souvent Google Business et les visuels — avant d’étendre au site et aux campagnes.',
          ],
        },
        {
          heading: 'Exemples de contenus produits',
          bullets: [
            'Shooting plats et ambiance',
            'Reels cuisine et coulisses',
            'Posts événements et menus saisonniers',
            'Landing page pour ouverture ou nouvelle carte',
          ],
        },
      ]}
      faq={[
        {
          q: 'Quel levier digital prioriser en premier ?',
          a: 'En général Google Business Profile optimisé + avis récents, complété par des photos professionnelles. C’est ce que consultent les touristes avant de réserver. Les réseaux sociaux renforcent la désirabilité ; le site structure l’offre et la réservation.',
        },
        {
          q: 'Proposez-vous un accompagnement pour les ouvertures ?',
          a: 'Oui : identité, shooting initial, fiche Google, site ou page de lancement et calendrier social pour les premières semaines. Le périmètre et le planning sont définis après diagnostic — sans forfait affiché en ligne.',
        },
        {
          q: 'Gérez-vous Ramadan et la haute saison ?',
          a: 'Nous intégrons le calendrier local (Ramadan, fêtes, festivals, saison touristique) dans la ligne éditoriale et les campagnes pour anticiper les pics et les périodes plus calmes.',
        },
      ]}
      internalLinks={[
        { label: 'SEO local Marrakech', path: '/blog/seo-local-guide-marrakech', desc: 'Guide visibilité Google.' },
        { label: 'Création site web', path: '/creation-site-web-marrakech', desc: 'Site restaurant & menu digital.' },
        { label: 'Marketing digital', path: '/marketing-digital-marrakech', desc: 'Ads et stratégie digitale.' },
        { label: 'Contact', path: '/contact', desc: 'Demander un diagnostic local.' },
      ]}
    />
  )
}
