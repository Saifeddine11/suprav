import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Agence communication restaurant Marrakech — Supra v.",
  "description": "Supra v. gère la communication digitale des restaurants à Marrakech : site web, menu en ligne, Instagram, Google Business et campagnes publicitaires pour attirer plus de clients.",
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
  "url": "https://suprav3.com/agence-communication-restaurant-marrakech",
  "serviceType": "Communication restauration"
}

export default function AgenceRestaurantMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Agence Communication Restaurant Marrakech — Plus de Couverts | Supra v.",
        description: "Supra v., agence de communication pour restaurants à Marrakech : Instagram food, Google Business, site menu et publicité digitale pour remplir votre salle chaque soir.",
        path: "/agence-communication-restaurant-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Communication Restaurant Marrakech" }
      ]}
      title="Communication restaurant à Marrakech — Supra v."
      subtitle="Remplissez votre salle chaque soir avec une stratégie digitale adaptée à la restauration"
      intro="L'agence communication restaurant Marrakech Supra v. aide les restaurateurs, cafés et traiteurs de Marrakech à attirer plus de clients grâce à une présence digitale soignée et des stratégies publicitaires ciblées. Dans une ville aussi compétitive que Marrakech pour la restauration — entre la médina, Guéliz et Hivernage — la différence entre un restaurant complet et un restaurant vide se joue souvent en ligne, avant même l'arrivée du client. Nous créons des contenus visuels qui font saliver, des pages Google Business optimisées qui apparaissent quand les touristes cherchent, et des campagnes publicitaires qui remplissent les tables."
      services={[
        {
          title: "Photographie & vidéo food & ambiance",
          desc: "Shooting photo professionnel de vos plats, de votre salle et de l'ambiance de votre restaurant à Marrakech. Vidéos pour Instagram Reels et TikTok. Des visuels appétissants sont le premier argument de vente d'un restaurant — ils génèrent des réservations avant même la lecture de la carte."
        },
        {
          title: "Instagram & TikTok food marketing",
          desc: "Gestion de vos comptes Instagram et TikTok avec une stratégie de contenu food : plats du jour, coulisses de cuisine, ambiance, événements spéciaux et interactions avec votre communauté. Les restaurants avec un Instagram actif à Marrakech attirent 40 % de clients en plus selon nos données."
        },
        {
          title: "Google Business & avis restaurants",
          desc: "Optimisation complète de votre fiche Google Business : catégorie, horaires, menu en ligne, photos professionnelles et stratégie de collecte d'avis Google. Apparaître en tête des résultats 'restaurant Marrakech' génère des dizaines d'appels et de réservations supplémentaires par semaine."
        },
        {
          title: "Site web avec menu & réservation en ligne",
          desc: "Site web restaurant avec menu digital (QR code table inclus), système de réservation en ligne et présentation de votre établissement. Compatible Google Business et TripAdvisor pour une cohérence parfaite de votre présence en ligne à Marrakech."
        }
      ]}
      faq={[
        {
          q: "Quel est le levier digital le plus efficace pour un restaurant à Marrakech ?",
          a: "Pour un restaurant à Marrakech, Google Business Profile optimisé + avis Google est de loin le levier le plus efficace et le plus rapide. Les touristes cherchent 'restaurant Marrakech' sur Google Maps : apparaître avec 4,5 étoiles et de belles photos génère des réservations immédiates. C'est notre recommandation numéro 1 pour tout nouveau client restaurateur."
        },
        {
          q: "Proposez-vous des forfaits pour les restaurants qui démarrent ?",
          a: "Oui, nous avons un forfait lancement pour les nouveaux restaurants à Marrakech qui inclut : création/optimisation Google Business, shooting photo initial (2h), création du profil Instagram et 1 mois de community management. Ce forfait de démarrage est proposé à 4 500 MAD tout inclus."
        },
        {
          q: "Pouvez-vous gérer notre communication pendant le Ramadan et les saisons touristiques ?",
          a: "Absolument. Nous anticipons les temps forts du calendrier touristique et culturel marocain (Ramadan, Aïd, haute saison estivale, Marrakech du Rire, FIFM) dans votre planning éditorial. Des campagnes publicitaires boostées sont planifiées avant chaque période clé pour maximiser votre fréquentation."
        }
      ]}
    />
  )
}
