import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Publicité digitale Meta Ads à Marrakech",
  "description": "Supra v. gère vos campagnes de publicité digitale à Marrakech : Meta Ads (Facebook & Instagram), Google Ads et TikTok Ads pour générer des leads qualifiés.",
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
  "url": "https://suprav3.com/publicite-marrakech",
  "serviceType": "Publicité digitale Meta Ads"
}

export default function PubliciteMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Publicité Digitale Marrakech — Meta Ads & Google Ads | Supra v.",
        description: "Agence Meta Ads et Google Ads à Marrakech. Campagnes publicitaires ciblées, créa publicitaire et optimisation ROI. Audit gratuit de vos campagnes actuelles.",
        path: "/publicite-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Publicité Marrakech" }
      ]}
      title="Publicité digitale à Marrakech — Meta Ads & Google Ads"
      subtitle="Des campagnes publicitaires qui génèrent des leads et des ventes mesurables"
      intro="La publicité digitale Marrakech Meta Ads est l'un des leviers les plus puissants pour acquérir de nouveaux clients rapidement et à moindre coût par rapport à la publicité traditionnelle. Supra v. gère des campagnes Meta Ads (Facebook et Instagram), Google Ads et TikTok Ads pour des entreprises de tous secteurs à Marrakech, avec un focus constant sur le retour sur investissement mesurable. Notre équipe certifiée Meta et Google crée les visuels, rédige les accroches, configure le ciblage et optimise les enchères pour maximiser chaque dirham investi dans votre publicité."
      services={[
        {
          title: "Campagnes Meta Ads (Facebook & Instagram)",
          desc: "Création et gestion de campagnes Meta Ads pour générer des leads, des ventes ou de la notoriété à Marrakech et au Maroc. Ciblage par centre d'intérêt, géolocalisation, lookalike audiences et retargeting. Rapport de performance hebdomadaire inclus."
        },
        {
          title: "Google Ads — Search & Display",
          desc: "Campagnes Google Search pour capter les recherches à forte intention d'achat, campagnes Display pour la notoriété et remarketing pour reconvertir vos visiteurs. Gestion des mots-clés, des enchères et du Quality Score pour réduire votre CPC."
        },
        {
          title: "Création publicitaire & A/B testing",
          desc: "Nous créons vos visuels, vidéos publicitaires et accroches copywriting pour chaque campagne. A/B testing systématique des créas pour identifier rapidement les contenus qui performent le mieux auprès de votre audience à Marrakech."
        },
        {
          title: "Suivi des conversions & reporting ROI",
          desc: "Installation du Pixel Meta et du tag Google Ads sur votre site, configuration des événements de conversion (formulaire, achat, appel). Vous voyez en temps réel le coût par lead et le retour sur investissement de chaque euro dépensé."
        }
      ]}
      faq={[
        {
          q: "Quel budget publicitaire recommandez-vous pour Marrakech ?",
          a: "Pour démarrer efficacement, nous recommandons un budget publicitaire minimum de 3 000 MAD/mois, auquel s'ajoutent nos honoraires de gestion. En dessous, les algorithmes Meta et Google n'ont pas assez de données pour optimiser correctement. Nous adaptons nos recommandations selon votre secteur et vos objectifs."
        },
        {
          q: "En combien de temps verrai-je des résultats avec mes campagnes ?",
          a: "Les premières leads ou ventes apparaissent généralement dans les 48 à 72h suivant le lancement. Les campagnes s'optimisent progressivement sur 2 à 4 semaines à mesure que les algorithmes apprennent. Nous partageons des rapports hebdomadaires et ajustons la stratégie en continu."
        },
        {
          q: "Gérez-vous les campagnes ou me formez-vous à le faire moi-même ?",
          a: "Nous proposons les deux : gestion complète de vos campagnes (formule tout inclus) ou formation Meta Ads / Google Ads pour vous rendre autonome. La formation dure 1 à 2 jours et inclut un support de 30 jours pour répondre à vos questions après la formation."
        }
      ]}
    />
  )
}
