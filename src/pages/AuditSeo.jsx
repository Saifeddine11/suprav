import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Audit SEO à Marrakech",
  "description": "Supra v. réalise des audits SEO complets pour les sites web des entreprises de Marrakech : technique, on-page, contenu et backlinks.",
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
  "url": "https://suprav3.com/audit-seo",
  "serviceType": "Audit SEO"
}

export default function AuditSeo() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Audit SEO Marrakech — Diagnostic Complet de votre Site | Supra v.",
        description: "Audit SEO professionnel à Marrakech par Supra v. : 100+ points de contrôle, rapport détaillé et plan d'action prioritaire. Identifiez pourquoi Google ne vous trouve pas.",
        path: "/audit-seo",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Audit SEO" }
      ]}
      title="Audit SEO à Marrakech — Diagnostic complet de votre site"
      subtitle="Identifiez tous les freins qui empêchent Google de vous positionner en première page"
      intro="Un audit SEO Marrakech est la première étape indispensable avant tout travail de référencement naturel : sans un diagnostic précis, vous risquez d'investir du temps et de l'argent dans des optimisations qui ne résolvent pas les vrais problèmes de votre site. Supra v. réalise des audits SEO approfondis couvrant plus de 100 points de contrôle — technique, on-page, contenu et profil de liens — et vous livre un rapport actionnable avec des recommandations classées par priorité et impact. Chaque audit est réalisé manuellement par nos experts SEO et non pas par un outil automatisé générique."
      services={[
        {
          title: "Audit technique & indexation",
          desc: "Crawl complet du site, analyse des erreurs 404, redirections en boucle, pages dupliquées, vitesse de chargement (Core Web Vitals), mobile-friendliness, HTTPS et structure du fichier robots.txt. Toutes les erreurs techniques qui pénalisent votre référencement identifiées en un rapport."
        },
        {
          title: "Audit on-page & structure de contenu",
          desc: "Analyse des balises title et meta description (présence, longueur, duplication), structure des titres Hn, optimisation des images, maillage interne et données structurées. Vérification de l'optimisation de chaque page clé sur vos mots-clés cibles à Marrakech."
        },
        {
          title: "Audit du profil de backlinks",
          desc: "Analyse de votre profil de liens entrants : nombre de domaines référents, autorité des sites pointant vers vous, liens toxiques à désavouer et opportunités de netlinking identifiées dans votre secteur et à Marrakech."
        },
        {
          title: "Rapport & plan d'action priorisé",
          desc: "Rapport de 20 à 40 pages avec captures d'écran, explication de chaque problème identifié, impact estimé sur votre référencement et recommandations d'action classées par priorité (critique, important, à faire). Session de restitution vidéo incluse."
        }
      ]}
      faq={[
        {
          q: "Combien coûte un audit SEO à Marrakech ?",
          a: "Un audit SEO complet chez Supra v. est proposé entre 2 000 et 5 000 MAD selon la taille du site (nombre de pages, complexité technique). Pour les sites de moins de 20 pages, nous proposons un audit simplifié à 1 200 MAD incluant les points les plus critiques."
        },
        {
          q: "Réalisez-vous aussi les corrections après l'audit ?",
          a: "Oui, nous proposons deux options : recevoir uniquement le rapport d'audit pour le faire appliquer par votre développeur interne, ou nous confier les corrections et l'optimisation continue via un forfait SEO mensuel. Dans ce dernier cas, le coût de l'audit est déduit du premier mois de prestation."
        },
        {
          q: "Comment savoir si mon site a besoin d'un audit SEO ?",
          a: "Votre site a besoin d'un audit SEO si : vous n'apparaissez pas en première page de Google sur vos mots-clés principaux, votre trafic organique stagne ou baisse depuis plusieurs mois, vous venez de lancer un nouveau site, ou votre site a récemment subi une refonte. Dans tous ces cas, un audit est le point de départ indispensable."
        }
      ]}
    />
  )
}
