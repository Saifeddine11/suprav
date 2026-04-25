import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Développement SaaS à Marrakech",
  "description": "Supra v. développe des applications SaaS sur-mesure pour les startups et entreprises de Marrakech souhaitant lancer un produit digital scalable.",
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
  "url": "https://suprav3.com/application-saas",
  "serviceType": "Développement SaaS"
}

export default function ApplicationSaas() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Développement SaaS Marrakech — Application Web Sur-mesure | Supra v.",
        description: "Lancez votre SaaS à Marrakech avec Supra v. : architecture scalable, authentification multi-tenant, abonnements et tableau de bord. Devis gratuit.",
        path: "/application-saas",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Application SaaS" }
      ]}
      title="Développement d'application SaaS à Marrakech"
      subtitle="Transformez votre idée en produit digital scalable et rentable"
      intro="Le développement SaaS Marrakech est au cœur de la transformation digitale des entreprises modernes : au lieu d'un logiciel installé localement, votre produit est accessible depuis n'importe où, se met à jour automatiquement et génère des revenus récurrents via des abonnements. Supra v. accompagne les entrepreneurs et porteurs de projets à Marrakech dans la conception et le développement de plateformes SaaS robustes — de l'architecture technique à l'interface utilisateur — pour un lancement rapide et une scalabilité maîtrisée. Nous avons déjà accompagné des startups marocaines de l'idée jusqu'à des milliers d'utilisateurs actifs."
      services={[
        {
          title: "Architecture cloud & scalabilité",
          desc: "Conception d'une architecture multi-tenant sur AWS ou Vercel, base de données optimisée (PostgreSQL, MongoDB), API REST ou GraphQL. Votre SaaS est conçu pour tenir la charge dès les premières croissances."
        },
        {
          title: "Authentification & gestion des abonnements",
          desc: "Système d'inscription, connexion sécurisée (OAuth, JWT), gestion des rôles et intégration de la facturation récurrente (Stripe). Tableau de bord admin pour suivre vos abonnés et votre MRR en temps réel."
        },
        {
          title: "Dashboard & expérience utilisateur",
          desc: "Interface d'administration intuitive pour vos clients finaux, avec visualisation de données (charts, KPIs), notifications in-app et système de support intégré. Une UX soignée réduit le churn et améliore la rétention."
        },
        {
          title: "MVP rapide & itérations agiles",
          desc: "Nous lançons un MVP fonctionnel en 8 à 12 semaines pour valider votre marché avant d'investir dans des fonctionnalités avancées. Chaque sprint bi-hebdomadaire est validé avec vous pour rester parfaitement alignés."
        }
      ]}
      faq={[
        {
          q: "Quelle technologie utilisez-vous pour développer des SaaS ?",
          a: "Nous utilisons principalement React / Next.js pour le frontend, Node.js ou Python (FastAPI) pour le backend, et PostgreSQL pour la base de données. Le tout est déployé sur des infrastructures cloud modernes (AWS, Vercel, Railway) avec CI/CD automatisé."
        },
        {
          q: "Combien coûte le développement d'un SaaS à Marrakech ?",
          a: "Un MVP SaaS complet (authentification, abonnements, tableau de bord de base) démarre à partir de 25 000 MAD. Un produit plus avancé avec fonctionnalités métier complexes peut nécessiter un budget de 60 000 MAD et plus. Nous étalons souvent le développement en phases pour respecter votre trésorerie."
        },
        {
          q: "Pouvez-vous aider à définir les fonctionnalités de mon SaaS ?",
          a: "Oui, nous proposons des ateliers de product discovery (2 à 4h) pour définir votre parcours utilisateur, votre modèle de pricing et vos fonctionnalités prioritaires. Cet investissement initial évite de développer des features inutiles et accélère votre time-to-market."
        }
      ]}
    />
  )
}
