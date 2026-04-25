import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Combien coûte un site web à Marrakech en 2026 ?",
  "description": "Guide complet des prix pour la création d'un site web à Marrakech : site vitrine, e-commerce, application web. Fourchettes de prix réelles et conseils pour bien budgéter.",
  "datePublished": "2026-04-25",
  "author": {
    "@type": "Organization",
    "name": "Supra v."
  },
  "publisher": {
    "@type": "Organization",
    "name": "Supra v.",
    "url": "https://suprav3.com"
  },
  "url": "https://suprav3.com/blog/combien-coute-site-web-marrakech",
  "inLanguage": "fr",
  "about": {
    "@type": "Thing",
    "name": "Prix création site web Marrakech"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://suprav3.com/blog/combien-coute-site-web-marrakech"
  }
}

export default function ArticlePrixSiteWeb() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Combien coûte un site web à Marrakech en 2026 ? | Supra v.",
        description: "Prix réels d'un site web à Marrakech en 2026 : site vitrine (4 000–12 000 MAD), e-commerce (8 000–30 000 MAD), application web. Guide complet par Supra v.",
        path: "/blog/combien-coute-site-web-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Blog", path: "/blog" },
        { label: "Combien coûte un site web à Marrakech ?" }
      ]}
      title="Combien coûte un site web à Marrakech en 2026 ?"
      subtitle="Fourchettes de prix réelles, facteurs qui influencent le coût et conseils pour bien budgéter votre projet web"
      intro="La question « combien coûte un site web à Marrakech » est l'une des plus fréquentes que nous recevons chez Supra v. La réponse honnête est : cela dépend. Mais contrairement à ce que vous entendrez de certains freelances ou agences, il est tout à fait possible de donner des fourchettes de prix réalistes pour chaque type de projet web — à condition d'être transparent sur ce qui est inclus. Dans cet article, nous décortiquons les coûts de création d'un site web à Marrakech en 2026 pour les trois types de projets les plus courants : le site vitrine, le site e-commerce et l'application web sur-mesure."
      services={[
        {
          title: "Site vitrine : 4 000 à 12 000 MAD",
          desc: "Un site vitrine professionnel à Marrakech comprend en général 5 à 10 pages, un design sur-mesure ou semi-personnalisé, une optimisation SEO de base et un formulaire de contact. La fourchette basse (4 000 MAD) correspond à un site sur template WordPress avec peu de personnalisation. La fourchette haute (12 000 MAD) inclut un design entièrement sur-mesure, des animations, du contenu rédigé et une optimisation SEO approfondie."
        },
        {
          title: "Site e-commerce : 8 000 à 30 000 MAD",
          desc: "Le coût d'une boutique en ligne à Marrakech varie selon le nombre de produits, les intégrations (CMI, livraison, ERP) et la complexité de l'expérience d'achat. Un e-commerce simple sur WooCommerce ou Shopify avec 20 à 50 produits démarre à 8 000 MAD. Un projet avec catalogue étendu, configurateur de produits ou multi-devises peut facilement dépasser 25 000 MAD."
        },
        {
          title: "Application web SaaS : 25 000 MAD et plus",
          desc: "Le développement d'une application web (SaaS, marketplace, outil métier) est le projet le plus complexe et le plus variable en termes de coût. Un MVP fonctionnel démarre généralement à 25 000 MAD. Les projets avec des fonctionnalités avancées (IA, paiements récurrents, multi-tenant) peuvent atteindre 80 000 MAD et plus. Nous recommandons toujours de commencer par un MVP pour valider le marché."
        },
        {
          title: "Ce qui fait varier le prix d'un site web",
          desc: "Les principaux facteurs qui influencent le prix d'un site web à Marrakech sont : le nombre de pages et de fonctionnalités, le niveau de personnalisation du design, la rédaction des contenus (incluse ou non), l'optimisation SEO, les intégrations tierces (CRM, paiement, chat) et le délai de livraison souhaité. Méfiez-vous des devis trop bas qui cachent souvent des limitations importantes."
        }
      ]}
      faq={[
        {
          q: "Pourquoi les prix des sites web varient-ils autant à Marrakech ?",
          a: "La variation de prix s'explique par la différence de qualité, d'expertise et de ce qui est réellement inclus. Un site à 1 500 MAD sur Fiverr est généralement un template modifié sans optimisation SEO, sans support et parfois avec des problèmes de sécurité. Un site à 8 000 MAD livré par une agence comme Supra v. inclut un design sur-mesure, un contenu SEO rédigé, des tests multi-navigateurs et un support après livraison. Le prix reflète la valeur réelle livrée."
        },
        {
          q: "Faut-il payer des frais mensuels en plus du prix de création du site ?",
          a: "Oui, un site web implique des coûts récurrents : hébergement (de 500 à 2 000 MAD/an selon la performance), nom de domaine (150 à 300 MAD/an), et éventuellement une maintenance mensuelle (à partir de 500 MAD/mois pour les mises à jour et sauvegardes). Ces coûts sont souvent sous-estimés dans les budgets initiaux."
        },
        {
          q: "Peut-on payer un site web en plusieurs fois à Marrakech ?",
          a: "Chez Supra v., nous proposons systématiquement un paiement en 2 ou 3 fois : un acompte de 40 % au démarrage, un versement intermédiaire à la validation des maquettes et le solde à la livraison. Pour les projets supérieurs à 15 000 MAD, nous pouvons étudier un étalement sur 4 paiements mensuels."
        }
      ]}
    />
  )
}
