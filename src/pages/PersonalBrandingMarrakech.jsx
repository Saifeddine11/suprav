import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Personal branding à Marrakech",
  "description": "Supra v. construit votre marque personnelle à Marrakech : stratégie de personal branding, identité visuelle, LinkedIn et content strategy pour entrepreneurs et experts.",
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
  "url": "https://suprav3.com/personal-branding-marrakech",
  "serviceType": "Personal branding"
}

export default function PersonalBrandingMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Personal Branding Marrakech — Construisez votre Autorité | Supra v.",
        description: "Développez votre personal branding à Marrakech avec Supra v. : stratégie LinkedIn, site personnel, identité visuelle et content strategy pour entrepreneurs et experts.",
        path: "/personal-branding-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Personal Branding Marrakech" }
      ]}
      title="Personal branding à Marrakech"
      subtitle="Devenez la référence de votre secteur grâce à une marque personnelle forte"
      intro="Le personal branding Marrakech est la stratégie qu'adoptent les entrepreneurs, consultants, coaches et dirigeants qui souhaitent être reconnus comme des experts de référence dans leur domaine — localement à Marrakech et au-delà. Dans un monde où vos prospects vous googlelisent avant de vous rappeler, votre réputation en ligne est votre premier commercial. Supra v. accompagne les personnalités professionnelles de Marrakech dans la construction de leur marque personnelle : de la définition de leur positionnement unique à la production de contenus qui renforcent leur autorité et génèrent des opportunités d'affaires concrètes."
      services={[
        {
          title: "Stratégie & positionnement personal brand",
          desc: "Atelier de 3h pour définir votre positionnement unique, votre audience cible, votre message principal et votre histoire professionnelle. Nous identifions ce qui vous différencie des autres experts de votre secteur à Marrakech et construisons une stratégie de contenu cohérente avec vos objectifs."
        },
        {
          title: "Identité visuelle personnelle",
          desc: "Création ou modernisation de votre identité visuelle personnelle : photo professionnelle (direction artistique et mise en scène), logo personnel ou monogramme, palette de couleurs, typographies et templates visuels pour vos posts LinkedIn et Instagram."
        },
        {
          title: "Optimisation LinkedIn & stratégie de contenu",
          desc: "Optimisation complète de votre profil LinkedIn (titre, résumé, expériences, mots-clés) et stratégie de publication pour développer votre réseau et votre influence dans votre secteur. Nous rédigeons vos posts et articles LinkedIn si vous souhaitez déléguer la création de contenu."
        },
        {
          title: "Site web personnel & portfolio",
          desc: "Création de votre site web personnel : biographie, domaines d'expertise, témoignages clients, conférences et articles. Un site personnel bien référencé sur votre nom renforce votre crédibilité auprès de vos prospects et partenaires à Marrakech et à l'international."
        }
      ]}
      faq={[
        {
          q: "Le personal branding est-il réservé aux coachs et conférenciers ?",
          a: "Non, tout professionnel qui dépend de sa réputation personnelle pour générer des affaires bénéficie du personal branding : consultants, avocats, médecins, architectes, agents immobiliers, dirigeants de PME à Marrakech. Dès lors que vos clients choisissent une personne plutôt qu'une entreprise, votre image personnelle compte."
        },
        {
          q: "Combien de temps faut-il pour construire une marque personnelle forte ?",
          a: "Les premiers résultats visibles (augmentation des followers LinkedIn, premières invitations à des conférences ou interviews) apparaissent généralement après 3 à 4 mois de publication régulière et cohérente. Une marque personnelle forte se construit sur 12 à 24 mois de travail constant. Nous vous accompagnons sur la durée."
        },
        {
          q: "Combien coûte un accompagnement personal branding à Marrakech ?",
          a: "Notre accompagnement personal branding démarre avec un atelier stratégie (1 500 MAD) qui peut être suivi d'une mission complète (identité visuelle + LinkedIn + site web) à partir de 8 000 MAD. Des forfaits mensuels de production de contenu LinkedIn sont disponibles à partir de 2 500 MAD/mois."
        }
      ]}
    />
  )
}
