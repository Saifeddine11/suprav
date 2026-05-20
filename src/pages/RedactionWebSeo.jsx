import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Rédaction web SEO à Marrakech",
  "description": "Supra v3 rédige des contenus web optimisés SEO en français pour les entreprises de Marrakech : articles de blog, pages de services, fiches produits et landing pages.",
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
  "url": "https://suprav3.com/redaction-web-seo",
  "serviceType": "Rédaction web SEO"
}

export default function RedactionWebSeo() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Rédaction Web SEO Marrakech — Contenu qui Classe & Convertit | Supra v3",
        description: "Rédaction web SEO professionnelle à Marrakech par Supra v3 : articles de blog, pages services et landing pages optimisés pour Google. Contenu en français expert.",
        path: "/redaction-web-seo",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Rédaction Web SEO" }
      ]}
      title="Rédaction web SEO à Marrakech"
      subtitle="Du contenu qui positionne sur Google et convainc vos lecteurs d'agir"
      intro="La rédaction web SEO Marrakech est le pilier d'une stratégie de référencement naturel efficace : Google favorise les sites qui publient régulièrement du contenu de qualité, pertinent et bien structuré. Supra v3 dispose d'une équipe de rédacteurs web francophones spécialisés dans le SEO, capables de produire des articles de blog, pages de services, fiches produits et landing pages qui répondent précisément aux questions que se posent vos clients potentiels à Marrakech. Chaque texte est optimisé pour les moteurs de recherche tout en restant fluide, engageant et convaincant pour vos lecteurs humains."
      services={[
        {
          title: "Articles de blog SEO",
          desc: "Articles longs format (800 à 2 500 mots) ciblant des mots-clés à fort potentiel pour votre secteur à Marrakech. Recherche approfondie, structure Hn optimisée, liens internes et externes, et appels à l'action intégrés. Publication directe sur votre CMS si souhaité."
        },
        {
          title: "Pages de services & pages locales",
          desc: "Rédaction de pages de services optimisées SEO pour chaque prestation et chaque zone géographique cible. Textes persuasifs qui répondent aux objections de vos prospects et les guident vers la prise de contact ou l'achat."
        },
        {
          title: "Fiches produits e-commerce",
          desc: "Descriptions produits uniques et optimisées (fini le duplicate content des fournisseurs) qui améliorent votre référencement e-commerce et augmentent votre taux de conversion. Bénéfices mis en avant, mots-clés intégrés naturellement."
        },
        {
          title: "Stratégie de contenu & calendrier éditorial",
          desc: "Recherche des mots-clés à fort potentiel pour votre secteur, construction d'un silo thématique et planification d'un calendrier éditorial sur 3 à 6 mois. Une stratégie de contenu cohérente est ce qui fait la différence entre un blog qui génère du trafic et un blog fantôme."
        }
      ]}
      faq={[
        {
          q: "Combien coûte un article de blog SEO à Marrakech ?",
          a: "Le coût dépend de la longueur, de la recherche mots-clés et du nombre d'articles mensuels. Nous proposons des forfaits éditoriaux après diagnostic — contenus livrés avec balises SEO prêtes à intégrer."
        },
        {
          q: "En combien de langues rédigez-vous vos contenus ?",
          a: "Nous rédigeons principalement en français, qui est la langue dominante pour le SEO des entreprises marocaines ciblant une clientèle internationale. Nous proposons également la rédaction en anglais pour cibler les touristes et en arabe pour les marchés locaux. Chaque langue nécessite une recherche de mots-clés spécifique."
        },
        {
          q: "Comment assurez-vous la qualité SEO de vos textes ?",
          a: "Chaque article passe par un process en 3 étapes : brief de mots-clés (densité, LSI, requêtes associées), rédaction par un expert du secteur, puis validation SEO avec Yoast ou Rank Math avant livraison. Nous livrons également un score de lisibilité et un rapport d'optimisation pour chaque texte."
        }
      ]}
    />
  )
}
