import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Création de site vitrine à Marrakech",
  "description": "Supra v3 conçoit des sites vitrines professionnels et performants pour les entreprises de Marrakech et du Maroc.",
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
  "url": "https://suprav3.com/site-vitrine-marrakech",
  "serviceType": "Création de site vitrine"
}

export default function SiteVitrineMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Création Site Vitrine Marrakech — Sur-mesure & SEO | Supra v3",
        description: "Agence spécialisée en création de site vitrine à Marrakech. Design moderne, optimisation SEO et livraison rapide. Devis gratuit en 24h.",
        path: "/site-vitrine-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Site Vitrine Marrakech" }
      ]}
      title="Création de site vitrine à Marrakech"
      subtitle="Un site professionnel qui reflète votre image et attire vos clients"
      intro="Votre site vitrine Marrakech est la première impression que donnez à vos prospects en ligne : il doit être impeccable. Chez Supra v3, nous créons des sites vitrines sur-mesure qui allient design soigné, rapidité de chargement et optimisation SEO pour vous positionner en tête des recherches locales à Marrakech. Chaque projet est pensé pour convertir vos visiteurs en clients réels."
      services={[
        {
          title: "Design sur-mesure & identité visuelle",
          desc: "Nous créons un design unique qui respecte votre charte graphique et capte l'attention dès les premières secondes. Chaque élément est pensé pour votre cible et votre secteur d'activité à Marrakech."
        },
        {
          title: "Optimisation SEO on-page",
          desc: "Balises title, meta descriptions, structure Hn, vitesse de chargement optimisée : votre site vitrine est conçu dès le départ pour se positionner sur Google Maroc et attirer un trafic qualifié."
        },
        {
          title: "Responsive & performance mobile",
          desc: "Plus de 70 % des recherches se font sur mobile au Maroc. Votre site vitrine est parfaitement adapté à tous les écrans et chargé en moins de 2 secondes pour éviter la perte de visiteurs."
        },
        {
          title: "Formulaires de contact & intégrations",
          desc: "Formulaires de contact, chat WhatsApp, Google Maps, réseaux sociaux : nous intégrons tous les outils nécessaires pour que vos prospects vous contactent facilement depuis votre site."
        }
      ]}
      faq={[
        {
          q: "Combien coûte un site vitrine à Marrakech ?",
          a: "Le budget dépend du nombre de pages, du niveau de design, du contenu et du SEO inclus. Nous remettons une estimation personnalisée après cadrage — sans grille tarifaire publique sur le site."
        },
        {
          q: "Combien de temps faut-il pour créer un site vitrine ?",
          a: "Un site vitrine standard est livré en 2 à 4 semaines selon la complexité du projet et la rapidité de validation de votre côté. Nous travaillons avec un process structuré : brief, maquette, développement, tests et mise en ligne."
        },
        {
          q: "Le site vitrine sera-t-il visible sur Google ?",
          a: "Oui, chaque site vitrine que nous livrons est optimisé SEO dès la conception : balises, structure, vitesse, sitemap XML et soumission à Google Search Console. Nous proposons également des forfaits de référencement mensuel pour accélérer votre montée en position."
        }
      ]}
    />
  )
}
