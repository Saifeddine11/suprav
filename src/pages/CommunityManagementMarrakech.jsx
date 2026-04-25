import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Community management à Marrakech",
  "description": "Supra v. gère vos réseaux sociaux à Marrakech : stratégie éditoriale, création de contenu, animation de communauté et reporting mensuel.",
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
  "url": "https://suprav3.com/community-management-marrakech",
  "serviceType": "Community management"
}

export default function CommunityManagementMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Community Management Marrakech — Réseaux Sociaux | Supra v.",
        description: "Confiez vos réseaux sociaux à Supra v. à Marrakech : Instagram, Facebook, LinkedIn, TikTok. Stratégie, contenu et animation de communauté. Devis gratuit.",
        path: "/community-management-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Community Management Marrakech" }
      ]}
      title="Community management à Marrakech"
      subtitle="Des réseaux sociaux actifs et engagés qui renforcent votre notoriété locale"
      intro="Le community management Marrakech consiste à créer, animer et modérer votre présence sur les réseaux sociaux pour construire une communauté engagée autour de votre marque. Supra v. prend en charge la gestion complète de vos pages Instagram, Facebook, LinkedIn et TikTok à Marrakech — de la stratégie éditoriale à la publication quotidienne, en passant par les réponses aux commentaires et messages privés. Notre équipe crée des contenus en français, arabe et anglais adaptés aux spécificités du marché marocain et aux tendances de chaque plateforme."
      services={[
        {
          title: "Stratégie éditoriale & calendrier de contenu",
          desc: "Définition des thèmes, formats et fréquences de publication adaptés à votre secteur et votre audience à Marrakech. Planning éditorial mensuel soumis à validation, avec identification des temps forts (événements locaux, fêtes, actualités sectorielles)."
        },
        {
          title: "Création de contenu visuel & rédaction",
          desc: "Visuels professionnels, reels, stories et carrousels créés par notre équipe design et production. Rédaction des légendes optimisées pour l'engagement avec hashtags stratégiques ciblés Marrakech et Maroc."
        },
        {
          title: "Animation & modération de communauté",
          desc: "Réponses aux commentaires et messages en moins de 2h en semaine, gestion des avis négatifs, interactions avec votre communauté et avec les comptes influents de votre secteur à Marrakech."
        },
        {
          title: "Reporting mensuel & optimisation",
          desc: "Rapport mensuel détaillé : croissance des abonnés, taux d'engagement, portée organique, posts les plus performants et recommandations d'ajustements. Nous pilotons votre présence sociale par les données."
        }
      ]}
      faq={[
        {
          q: "Combien coûte le community management à Marrakech ?",
          a: "Nos forfaits community management démarrent à 3 000 MAD/mois pour 2 publications par semaine sur 2 réseaux sociaux. Un forfait intensif (5 posts/semaine, stories quotidiennes, 3 réseaux) est disponible à partir de 6 500 MAD/mois. Création publicitaire et campagnes payantes en supplément."
        },
        {
          q: "Créez-vous le contenu visuel ou avons-nous besoin d'un photographe ?",
          a: "Nous créons tous les visuels avec vos ressources existantes (photos fournies, banques d'images, éléments graphiques de votre charte). Pour les entreprises souhaitant un contenu photo/vidéo original, nous proposons des shootings mensuels en complément de la gestion des réseaux sociaux."
        },
        {
          q: "Gérez-vous les réseaux sociaux en arabe pour le marché marocain ?",
          a: "Oui, notre équipe produit du contenu en français, arabe dialectal (darija) et arabe standard selon votre audience et votre positionnement. Nous adaptons le ton et le registre à chaque plateforme et à chaque segment de votre communauté à Marrakech."
        }
      ]}
    />
  )
}
