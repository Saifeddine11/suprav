import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Développement d'application mobile à Marrakech",
  "description": "Supra v3 développe des applications mobiles iOS et Android sur-mesure pour les entreprises de Marrakech et du Maroc.",
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
  "url": "https://suprav3.com/application-mobile-marrakech",
  "serviceType": "Développement application mobile"
}

export default function ApplicationMobileMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Application Mobile Marrakech — iOS & Android Sur-mesure | Supra v3",
        description: "Développement d'application mobile à Marrakech : iOS, Android et React Native. Supra v3 conçoit votre app de A à Z. Devis gratuit en 24h.",
        path: "/application-mobile-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/agence-communication-marrakech" },
        { label: "Application Mobile Marrakech" }
      ]}
      title="Développement d'application mobile à Marrakech"
      subtitle="Des applications iOS et Android performantes pour digitaliser votre activité"
      intro="Le développement d'une application mobile Marrakech est aujourd'hui l'un des investissements les plus rentables pour les entreprises qui souhaitent fidéliser leurs clients et automatiser leurs processus métier. Supra v3 accompagne les entrepreneurs et PME de Marrakech dans la conception et le développement d'applications mobiles natives (iOS, Android) ou cross-platform (React Native), de l'idée initiale à la publication sur l'App Store et le Play Store. Nos développeurs maîtrisent les technologies modernes pour livrer des applications robustes, rapides et intuitives."
      services={[
        {
          title: "Applications React Native cross-platform",
          desc: "Une seule base de code pour iOS et Android : réduisez votre budget de développement tout en offrant une expérience native à vos utilisateurs. Idéal pour les startups et PME de Marrakech avec un budget optimisé."
        },
        {
          title: "Applications natives iOS & Android",
          desc: "Pour les projets complexes nécessitant des performances maximales (géolocalisation, AR, paiement in-app), nous développons des applications natives avec Swift (iOS) et Kotlin (Android)."
        },
        {
          title: "UX/UI design mobile centré utilisateur",
          desc: "Wireframes, prototypes interactifs et design final. Chaque écran est pensé pour guider l'utilisateur vers l'action souhaitée avec un minimum de friction. Tests utilisateurs inclus avant livraison."
        },
        {
          title: "Publication stores & maintenance",
          desc: "Nous gérons la publication sur l'App Store (Apple) et le Google Play Store, y compris les screenshots, descriptions ASO et conformité aux guidelines. Forfaits de maintenance mensuelle disponibles."
        }
      ]}
      faq={[
        {
          q: "Combien coûte le développement d'une application mobile à Marrakech ?",
          a: "Le budget dépend des fonctionnalités (auth, paiement, back-office, notifications). Nous chiffrons après analyse de vos besoins — souvent en MVP puis phases d'évolution."
        },
        {
          q: "Quelle est la durée de développement d'une application mobile ?",
          a: "Un MVP (version minimale viable) est livré en 6 à 10 semaines. Une application complète avec fonctionnalités avancées nécessite 3 à 6 mois. Nous travaillons en méthode agile avec des sprints bi-hebdomadaires pour vous tenir informé de l'avancement."
        },
        {
          q: "Pouvez-vous reprendre une application existante pour l'améliorer ?",
          a: "Oui, nous réalisons des audits de code d'applications existantes et pouvons prendre en charge la maintenance, l'ajout de fonctionnalités ou la migration vers une technologie plus récente. Contactez-nous avec votre code source pour une évaluation."
        }
      ]}
    />
  )
}
