import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Supra v3 — Agence Web Marrakech",
  "description": "Supra v3 est une agence web à Marrakech spécialisée en création de sites web, développement d'applications et stratégie digitale pour les entreprises marocaines.",
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
  "url": "https://suprav3.com/agence-web-marrakech",
  "serviceType": "Agence web",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services web Marrakech"
  }
}

export default function AgenceWebMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Agence Web Marrakech — Création Sites & Applications | Supra v3",
        description: "Supra v3, agence web à Marrakech : création de sites web, applications mobiles, SEO et marketing digital. Experts du digital pour les entreprises marocaines.",
        path: "/agence-web-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Agence Web Marrakech" }
      ]}
      title="Agence web à Marrakech — Supra v3"
      subtitle="Votre partenaire digital pour créer, développer et dominer le web"
      intro="Supra v3 est une agence web Marrakech 360° qui accompagne les TPE, PME et startups marocaines dans leur transformation digitale. De la création de site web sur-mesure au développement d'applications mobiles, en passant par le référencement SEO et les campagnes publicitaires, notre équipe maîtrise l'ensemble des leviers du marketing digital pour propulser votre visibilité à Marrakech et au-delà. Nous combinons créativité, expertise technique et connaissance du marché local pour des résultats concrets et mesurables."
      services={[
        {
          title: "Création de sites web professionnels",
          desc: "Sites vitrines, e-commerce, landing pages et portails : nous développons des sites web performants, optimisés SEO et adaptés à votre secteur d'activité à Marrakech."
        },
        {
          title: "Développement d'applications mobiles",
          desc: "Applications iOS et Android sur-mesure pour votre entreprise. Interface intuitive, fonctionnalités métier et accompagnement de la conception à la publication sur les stores."
        },
        {
          title: "Stratégie SEO & référencement naturel",
          desc: "Audit SEO, optimisation technique, création de contenu et netlinking : notre agence web Marrakech vous positionne en première page de Google sur vos mots-clés stratégiques."
        },
        {
          title: "Marketing digital & publicité en ligne",
          desc: "Campagnes Meta Ads, Google Ads, community management et email marketing. Nous créons et gérons vos campagnes pour maximiser votre ROI et attirer des clients qualifiés à Marrakech."
        }
      ]}
      faq={[
        {
          q: "Pourquoi choisir une agence web à Marrakech plutôt qu'une agence internationale ?",
          a: "Une agence web locale comme Supra v3 connaît les spécificités du marché marocain : comportements des consommateurs, périodes clés (Ramadan, saison touristique), moyens de paiement locaux et référencement sur Google.ma. Nous parlons votre langue et sommes disponibles en présentiel pour vos réunions."
        },
        {
          q: "Quels types d'entreprises accompagnez-vous à Marrakech ?",
          a: "Nous travaillons avec des hôtels, restaurants, agences immobilières, commerces de détail, cabinets médicaux, startups et grandes entreprises. Chaque projet est traité avec la même attention, quelle que soit sa taille."
        },
        {
          q: "Comment démarrer un projet avec votre agence web à Marrakech ?",
          a: "Contactez-nous par téléphone (+33744208673), email (contact@suprav3.com) ou via notre formulaire en ligne. Nous planifions un appel découverte gratuit de 30 minutes pour comprendre votre projet et vous envoyer une proposition détaillée sous 48h."
        }
      ]}
    />
  )
}
