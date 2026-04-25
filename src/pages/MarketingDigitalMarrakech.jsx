import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Supra v. — Marketing digital à Marrakech",
  "description": "Supra v. est une agence de marketing digital à Marrakech : SEO, publicité digitale, réseaux sociaux et email marketing pour accélérer la croissance de votre entreprise.",
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
  "url": "https://suprav3.com/marketing-digital-marrakech",
  "serviceType": "Marketing digital"
}

export default function MarketingDigitalMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Marketing Digital Marrakech — Stratégie 360° | Supra v.",
        description: "Agence de marketing digital à Marrakech : SEO, Meta Ads, réseaux sociaux, email marketing. Stratégie digitale complète pour accélérer votre croissance au Maroc.",
        path: "/marketing-digital-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Marketing Digital Marrakech" }
      ]}
      title="Marketing digital à Marrakech — Stratégie 360°"
      subtitle="Une stratégie marketing complète pour dominer votre marché à Marrakech et au-delà"
      intro="Le marketing digital Marrakech englobe l'ensemble des actions menées sur les canaux numériques pour attirer, convertir et fidéliser vos clients : SEO, publicité payante, réseaux sociaux, email marketing et automatisation. Supra v. conçoit et exécute des stratégies de marketing digital 360° pour les entreprises de Marrakech qui souhaitent accélérer leur croissance de manière structurée et mesurable. Nous commençons toujours par un audit de votre situation actuelle avant de recommander les leviers les plus pertinents pour votre secteur et votre budget, évitant ainsi de disperser vos investissements sur des canaux peu efficaces."
      services={[
        {
          title: "Stratégie digitale & plan d'action",
          desc: "Analyse de votre marché digital à Marrakech, étude des concurrents, définition des personas et des tunnels de conversion. Plan d'action sur 6 à 12 mois avec allocation budgétaire par levier et KPIs mesurables pour chaque canal."
        },
        {
          title: "Acquisition multi-canaux",
          desc: "Orchestration de vos leviers d'acquisition : SEO pour le trafic organique, Meta Ads et Google Ads pour l'acquisition payante, et content marketing pour nourrir votre entonnoir. Chaque canal est optimisé en fonction de votre budget et de vos objectifs de croissance."
        },
        {
          title: "Email marketing & automation",
          desc: "Mise en place de séquences d'emails automatisées (bienvenue, nurturing, relance panier abandonné, fidélisation) avec des outils comme Mailchimp, Brevo ou Klaviyo. L'email reste le canal avec le meilleur ROI moyen : 36 MAD générés pour chaque MAD investi."
        },
        {
          title: "Analyse de performance & reporting",
          desc: "Tableau de bord personnalisé connectant Google Analytics 4, Google Search Console, Meta Ads Manager et vos outils CRM. Rapport mensuel avec analyse des KPIs, des gains et des recommandations d'optimisation pour le mois suivant."
        }
      ]}
      faq={[
        {
          q: "Par quoi commencer sa stratégie de marketing digital à Marrakech ?",
          a: "Tout dépend de votre objectif et de votre budget. Pour une visibilité locale immédiate, commencez par optimiser votre Google Business Profile et lancer des campagnes Meta Ads ciblées Marrakech. Pour une croissance durable, investissez en parallèle dans le SEO et le content marketing. Nous vous aidons à prioriser lors d'un appel découverte gratuit."
        },
        {
          q: "Comment mesurer le retour sur investissement du marketing digital ?",
          a: "Chaque canal a ses métriques propres : coût par lead (CPL) pour les campagnes payantes, trafic organique et positionnements pour le SEO, taux d'engagement pour les réseaux sociaux. Nous connectons tous ces outils dans un dashboard unifié pour avoir une vision globale du ROI de votre investissement marketing."
        },
        {
          q: "Travaillez-vous avec les entreprises marocaines ET les marques françaises souhaitant s'implanter à Marrakech ?",
          a: "Oui, Supra v. accompagne à la fois les entreprises locales de Marrakech et les marques françaises ou européennes souhaitant développer leur présence au Maroc. Notre double culture franco-marocaine est un avantage pour adapter les stratégies digitales aux deux marchés."
        }
      ]}
    />
  )
}
