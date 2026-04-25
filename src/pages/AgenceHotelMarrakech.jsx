import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Agence communication hôtel Marrakech — Supra v.",
  "description": "Supra v. est spécialisée en communication digitale pour les hôtels et riads à Marrakech : site web, booking direct, SEO hôtelier, réseaux sociaux et photographie.",
  "provider": {
    "@type": "Organization",
    "name": "Supra v.",
    "url": "https://suprav3.com",
    "telephone": "+33744208673",
    "email": "contact@suprav3.com"
  },
  "areaServed": {
    "@type": "City",
    "name": "Marrakech"
  },
  "url": "https://suprav3.com/agence-communication-hotel-marrakech",
  "serviceType": "Communication hôtelière"
}

export default function AgenceHotelMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Agence Communication Hôtel Marrakech — Plus de Réservations Directes | Supra v.",
        description: "Supra v., agence spécialisée en communication hôtelière à Marrakech : site de réservation directe, Instagram, SEO et campagnes pour réduire les commissions OTA.",
        path: "/agence-communication-hotel-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Communication Hôtel Marrakech" }
      ]}
      title="Communication hôtelière à Marrakech — Supra v."
      subtitle="Réduisez vos commissions OTA et boostez vos réservations directes"
      intro="L'agence communication hôtel Marrakech Supra v. accompagne les hôtels, riads et maisons d'hôtes de Marrakech dans leur stratégie digitale pour attirer plus de voyageurs, augmenter leur taux d'occupation et réduire leur dépendance aux plateformes de réservation (Booking.com, Airbnb, Expedia) qui prélèvent entre 15 et 25 % de commission. Notre expertise du secteur hôtelier marocain nous permet de créer des outils digitaux qui valorisent l'expérience unique de votre établissement et convertissent les voyageurs en réservations directes, bien plus rentables pour votre activité à Marrakech."
      services={[
        {
          title: "Site web hôtelier avec moteur de réservation",
          desc: "Site web hôtelier professionnel avec intégration d'un moteur de réservation (Amenitiz, Cloudbeds, SiteMinder) permettant à vos clients de réserver directement sans commissions. Design immersif qui met en valeur l'expérience unique de votre hôtel ou riad à Marrakech."
        },
        {
          title: "Photographie & vidéo hôtelière",
          desc: "Shooting photo professionnel de vos chambres, espaces communs, piscine, jardins et plats du restaurant. Vidéo de présentation pour votre site et Instagram. Des visuels de qualité sont le premier facteur de décision des voyageurs en ligne — ils peuvent doubler votre taux de conversion."
        },
        {
          title: "Instagram & content marketing hôtelier",
          desc: "Stratégie Instagram et TikTok pour attirer les voyageurs en amont de leur séjour. Contenus lifestyle qui racontent l'histoire de votre établissement, mettent en scène l'expérience Marrakech et fidélisent votre communauté de voyageurs. Partenariats influenceurs voyage inclus."
        },
        {
          title: "SEO hôtelier & visibilité Google",
          desc: "Optimisation de votre fiche Google Business Profile hôtelière, stratégie de collecte d'avis TripAdvisor et Google, et référencement naturel sur les requêtes clés : 'riad Marrakech médina', 'hôtel piscine Marrakech', 'boutique hotel Guéliz'. Visibilité durable sans commissions."
        }
      ]}
      faq={[
        {
          q: "Comment réduire la dépendance à Booking.com pour mon hôtel à Marrakech ?",
          a: "La stratégie la plus efficace combine 3 leviers : un site avec moteur de réservation performant (avec parité tarifaire et avantages réservation directe), du SEO pour capter les recherches directes, et des campagnes email de fidélisation pour inciter vos anciens clients à réserver directement la prochaine fois. En 6 mois, nos clients hôteliers augmentent leurs réservations directes de 30 à 50 %."
        },
        {
          q: "Travaillez-vous avec les petits riads comme avec les grands hôtels ?",
          a: "Oui, nous proposons des forfaits adaptés à toutes les tailles d'établissements : d'un riad de 5 suites jusqu'à un hôtel de 100 chambres. Les besoins en communication sont différents mais notre méthodologie s'adapte. Nous avons travaillé avec des riads de la médina et des resorts en Palmeraie à Marrakech."
        },
        {
          q: "Gérez-vous aussi la réponse aux avis TripAdvisor et Booking.com ?",
          a: "Oui, dans le cadre de nos forfaits de community management hôtelier, nous répondons à tous les avis (positifs et négatifs) sur TripAdvisor, Booking.com, Google et Airbnb. Une réponse professionnelle aux avis négatifs est essentielle pour maintenir votre réputation en ligne à Marrakech."
        }
      ]}
    />
  )
}
