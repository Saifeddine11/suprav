import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Agence communication immobilier Marrakech — Supra v.",
  "description": "Supra v. est l'agence de communication spécialisée dans le secteur immobilier à Marrakech : site web, visites virtuelles, publicité digitale et branding pour promoteurs et agences.",
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
  "url": "https://suprav3.com/agence-communication-immobilier-marrakech",
  "serviceType": "Communication immobilier"
}

export default function AgenceImmobilierMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Agence Communication Immobilier Marrakech — Visibilité & Leads | Supra v.",
        description: "Supra v., agence de communication spécialisée immobilier à Marrakech : site web promoteur, visites virtuelles 3D, Meta Ads et SEO pour vendre plus vite.",
        path: "/agence-communication-immobilier-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Communication Immobilier Marrakech" }
      ]}
      title="Communication immobilier à Marrakech"
      subtitle="Vendez vos biens plus vite avec une stratégie digitale immobilière sur-mesure"
      intro="L'agence communication immobilier Marrakech Supra v. accompagne les promoteurs immobiliers, agences et gestionnaires de biens dans leur stratégie digitale pour générer des leads qualifiés et accélérer les ventes et locations à Marrakech. Le marché immobilier marocain est de plus en plus digital : vos acheteurs potentiels, qu'ils soient locaux ou MRE, commencent leur recherche en ligne, consultent des visites virtuelles et comparent les offres avant même de contacter une agence. Nous créons des outils digitaux immobiliers qui captivent ces prospects dès leur première recherche et les convertissent en contacts qualifiés."
      services={[
        {
          title: "Sites web & portails immobiliers sur-mesure",
          desc: "Création de sites web promoteur avec catalogue de programmes immobiliers, plans interactifs, galeries photos professionnelles et formulaires de lead generation optimisés. Connectés à votre CRM immobilier pour un suivi des leads en temps réel."
        },
        {
          title: "Visites virtuelles 3D & rendus architecturaux",
          desc: "Production de visites virtuelles 360°, rendus 3D photo-réalistes et vidéos de présentation de vos projets immobiliers à Marrakech. Présentez vos biens en VEFA avec une qualité visuelle qui rassure les acheteurs et accélère la décision d'achat."
        },
        {
          title: "Campagnes Meta Ads & Google ciblées MRE",
          desc: "Ciblage des acheteurs marocains résidant en France, Belgique, Espagne et Canada via des campagnes Meta Ads et Google Ads ultra-ciblées. Le marché MRE représente une part significative des transactions immobilières à Marrakech : nous savons comment l'atteindre efficacement."
        },
        {
          title: "SEO immobilier local",
          desc: "Positionnement sur les requêtes clés : 'appartement à vendre Marrakech Guéliz', 'villa Marrakech Palmeraie', 'investissement immobilier Marrakech'. Contenu SEO, fiches programme et optimisation Google Business pour les agences ayant pignon sur rue."
        }
      ]}
      faq={[
        {
          q: "Comment générer plus de leads pour mon agence immobilière à Marrakech ?",
          a: "La combinaison la plus efficace pour une agence immobilière à Marrakech est : site web optimisé avec formulaires de lead capture + campagnes Meta Ads ciblées (géolocalisation, centres d'intérêt immobilier) + Google Business Profile optimisé + contenu SEO sur les quartiers cibles. Nous créons ce dispositif complet en 4 à 6 semaines."
        },
        {
          q: "Les visites virtuelles augmentent-elles vraiment les ventes ?",
          a: "Oui, les données du marché immobilier digital montrent que les annonces avec visite virtuelle génèrent 3 fois plus de demandes de contact et réduisent le nombre de visites physiques inutiles. Pour les acheteurs MRE à l'étranger, la visite virtuelle est souvent déterminante dans la décision d'achat à distance."
        },
        {
          q: "Travaillez-vous avec les promoteurs en VEFA à Marrakech ?",
          a: "Oui, nous avons une expérience spécifique en communication de projets VEFA (Vente en l'état futur d'achèvement). Nous créons les contenus visuels à partir des plans architecturaux, prodisons des rendus 3D et développons les sites de programme avant même la première pierre posée."
        }
      ]}
    />
  )
}
