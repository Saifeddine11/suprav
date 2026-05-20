import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Création de logo à Marrakech",
  "description": "Supra v3 crée votre logo professionnel à Marrakech : original, mémorable et déclinable sur tous vos supports de communication.",
  "provider": {
    "@type": "Organization",
    "name": "Supra v3",
    "url": "https://suprav3.com",
    "telephone": "+33744208673",
    "email": "contact@suprav3.com"
  },
  "areaServed": {
    "@type": "City",
    "name": "Marrakech"
  },
  "url": "https://suprav3.com/creation-logo-marrakech",
  "serviceType": "Création de logo"
}

export default function CreationLogoMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Création Logo Marrakech — Logo Professionnel & Unique | Supra v3",
        description: "Créez un logo professionnel à Marrakech avec Supra v3 : propositions créatives, fichiers HD tous formats, guide d'utilisation. Estimation personnalisée après cadrage.",
        path: "/creation-logo-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Création Logo Marrakech" }
      ]}
      title="Création de logo à Marrakech"
      subtitle="Un logo professionnel qui incarne votre marque et marque les esprits"
      intro="La création logo Marrakech est souvent la première mission graphique d'une entreprise, et pourtant l'une des plus stratégiques : votre logo sera sur vos cartes de visite, votre site web, vos véhicules et vos réseaux sociaux pendant des années. Supra v3 applique une méthode rigoureuse qui part de la compréhension de votre secteur d'activité, de vos concurrents à Marrakech et de vos clients cibles pour créer un logo original, mémorable et parfaitement adapté à tous vos supports. Nous livrons tous les formats professionnels nécessaires dès la première livraison."
      services={[
        {
          title: "Brief créatif & moodboard",
          desc: "Avant de créer quoi que ce soit, nous réalisons un brief approfondi : secteur, cibles, valeurs, inspirations et concurrents. Un moodboard vous est soumis pour validation avant le lancement de la phase créative."
        },
        {
          title: "3 propositions créatives distinctes",
          desc: "Nos designers proposent 3 directions graphiques différentes — symbolique, typographique ou combinée — adaptées à votre secteur à Marrakech. Vous choisissez la direction qui vous correspond et nous l'affinons ensemble."
        },
        {
          title: "Livraison tous formats professionnels",
          desc: "SVG vectoriel, PDF, PNG fond transparent, versions couleur, noir & blanc et monochrome. Votre logo est prêt pour l'impression, le web, les réseaux sociaux et la broderie/sérigraphie. Aucun fichier supplémentaire à demander."
        },
        {
          title: "Guide d'utilisation du logo",
          desc: "Document synthétique précisant les usages autorisés et déconseillés de votre logo, les zones de protection, les tailles minimales et les codes couleurs (Pantone, CMJN, RVB, Hexadécimal)."
        }
      ]}
      faq={[
        {
          q: "Combien coûte la création d'un logo à Marrakech ?",
          a: "Le périmètre dépend du nombre de propositions, du brand book et des supports inclus. Nous pouvons packager logo + site pour une nouvelle entreprise — proposition après diagnostic, sans grille affichée en ligne."
        },
        {
          q: "Serai-je propriétaire des droits sur mon logo ?",
          a: "Oui, à la livraison finale et après règlement complet, vous devenez l'unique propriétaire des droits patrimoniaux sur votre logo. Nous vous remettons les fichiers sources originaux (Illustrator, Figma) en plus des exports finaux."
        },
        {
          q: "Combien de temps faut-il pour créer un logo ?",
          a: "De la validation du brief à la livraison des fichiers finaux, comptez 1 à 2 semaines selon la rapidité de vos retours. Le délai est allongé si vous souhaitez décliner le logo dans un brand book complet ou l'intégrer à un projet de site web."
        }
      ]}
    />
  )
}
