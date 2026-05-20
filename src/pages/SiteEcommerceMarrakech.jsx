import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Création de site e-commerce à Marrakech",
  "description": "Supra v3 développe des boutiques en ligne performantes pour les commerçants et entrepreneurs de Marrakech souhaitant vendre sur internet.",
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
  "url": "https://suprav3.com/site-ecommerce-marrakech",
  "serviceType": "Création de site e-commerce"
}

export default function SiteEcommerceMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Création Site E-commerce Marrakech — Boutique en ligne | Supra v3",
        description: "Lancez votre boutique en ligne à Marrakech avec Supra v3 Paiement CMI, catalogue produits, SEO e-commerce. Devis gratuit sous 24h.",
        path: "/site-ecommerce-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Site E-commerce Marrakech" }
      ]}
      title="Création de site e-commerce à Marrakech"
      subtitle="Vendez vos produits 24h/24 avec une boutique en ligne optimisée"
      intro="Le site e-commerce Marrakech est devenu un passage obligé pour les entreprises souhaitant développer leurs ventes en ligne au Maroc et à l'international. Supra v3 conçoit des boutiques en ligne robustes, sécurisées et optimisées pour la conversion, avec intégration des moyens de paiement locaux (CMI, CIH Pay) et des solutions de livraison adaptées au marché marocain. Chaque détail est pensé pour maximiser votre chiffre d'affaires en ligne."
      services={[
        {
          title: "Boutique WooCommerce ou Shopify sur-mesure",
          desc: "Nous développons votre boutique sur la plateforme la plus adaptée à votre activité. WooCommerce pour une flexibilité totale, Shopify pour une gestion simplifiée. Catalogue produits illimité, filtres avancés et fiches produits optimisées SEO."
        },
        {
          title: "Intégration paiement CMI & sécurité SSL",
          desc: "Nous intégrons les solutions de paiement en ligne reconnues au Maroc (CMI, CIH Pay) avec certificat SSL inclus. Vos clients paient en toute sécurité et vous recevez vos fonds directement."
        },
        {
          title: "SEO e-commerce & Google Shopping",
          desc: "Optimisation des fiches produits, catégories, maillage interne et soumission à Google Merchant Center. Votre boutique en ligne Marrakech apparaît dans les résultats de recherche et Google Shopping."
        },
        {
          title: "Tableau de bord & gestion des commandes",
          desc: "Interface d'administration intuitive pour gérer vos stocks, commandes, factures et statistiques de vente. Formation incluse pour que vous soyez autonome dès le lancement."
        }
      ]}
      faq={[
        {
          q: "Quel budget prévoir pour un site e-commerce à Marrakech ?",
          a: "Le budget dépend du catalogue, des paiements, de la logistique et des intégrations. Chaque boutique est cadrée avant proposition : demandez un diagnostic pour une estimation personnalisée."
        },
        {
          q: "Puis-je gérer ma boutique moi-même après livraison ?",
          a: "Absolument. Nous formons chaque client à la gestion de sa boutique en ligne : ajout de produits, suivi des commandes, gestion des stocks et analyse des statistiques. Une documentation vidéo est fournie en complément."
        },
        {
          q: "Comment attirer des visiteurs sur ma boutique en ligne ?",
          a: "Nous proposons des services complémentaires au e-commerce : référencement SEO, campagnes Meta Ads et Google Ads, et community management. Une stratégie marketing complète dès le lancement maximise votre retour sur investissement."
        }
      ]}
    />
  )
}
