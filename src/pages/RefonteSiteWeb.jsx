import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Refonte de site web à Marrakech",
  "description": "Supra v3 réalise la refonte complète de votre site web à Marrakech pour améliorer votre design, votre performance et votre référencement SEO.",
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
  "url": "https://suprav3.com/refonte-site-web",
  "serviceType": "Refonte de site web"
}

export default function RefonteSiteWeb() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Refonte Site Web Marrakech — Modernisation & Performance | Supra v3",
        description: "Votre site web est dépassé ? Supra v3 à Marrakech le refond de A à Z : nouveau design, SEO optimisé, vitesse améliorée. Audit gratuit disponible.",
        path: "/refonte-site-web",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/agence-communication-marrakech" },
        { label: "Refonte Site Web" }
      ]}
      title="Refonte de site web à Marrakech"
      subtitle="Donnez une nouvelle vie à votre présence en ligne avec une refonte complète"
      intro="La refonte site web Marrakech est une étape cruciale pour les entreprises dont le site date de plus de 3 ans, affiche un taux de rebond élevé ou ne génère plus de leads. Chez Supra v3, nous auditons votre site existant avant toute chose pour identifier les points bloquants — design vieillissant, lenteur, mauvaise expérience mobile ou SEO défaillant — puis nous planifions une refonte stratégique qui conserve votre historique SEO tout en modernisant votre image à Marrakech. Le résultat : un site qui performe mieux à chaque niveau."
      services={[
        {
          title: "Audit complet du site existant",
          desc: "Analyse technique (Core Web Vitals, erreurs 404, redirections), audit SEO (positionnements, maillage, contenu) et audit UX (parcours utilisateur, taux de conversion). Vous recevez un rapport détaillé avec nos recommandations."
        },
        {
          title: "Nouveau design moderne & UX optimisée",
          desc: "Maquettes Figma soumises à votre validation avant développement. Nous modernisons votre interface en gardant votre identité visuelle ou en proposant une évolution complète de votre charte graphique."
        },
        {
          title: "Migration SEO sans perte de positionnement",
          desc: "Plan de redirection 301, conservation des URLs stratégiques, soumission du nouveau sitemap à Google Search Console. Votre refonte site web Marrakech n'impacte pas négativement votre référencement naturel existant."
        },
        {
          title: "Optimisation des performances & sécurité",
          desc: "Temps de chargement inférieur à 2 secondes, score Core Web Vitals au vert, HTTPS et mise à jour des technologies (PHP, WordPress, plugins). Votre nouveau site est rapide, sécurisé et maintenu."
        }
      ]}
      faq={[
        {
          q: "Quels sont les signes qu'il est temps de refondre son site web ?",
          a: "Les principaux signaux sont : un design qui date de plus de 3-4 ans, un site non adapté au mobile, un temps de chargement supérieur à 3 secondes, un taux de rebond au-dessus de 70 %, peu ou pas de leads générés, ou encore un CMS qui n'est plus maintenu."
        },
        {
          q: "La refonte va-t-elle faire perdre mon référencement Google ?",
          a: "Pas si elle est bien préparée. Nous établissons un plan de redirection complet pour transférer le juice SEO de vos anciennes URLs vers les nouvelles. Dans la majorité des cas, une refonte bien exécutée améliore le référencement plutôt qu'elle ne le dégrade."
        },
        {
          q: "Combien coûte une refonte de site web à Marrakech ?",
          a: "Le budget dépend de l'audit SEO, du volume de pages, du nouveau design et des migrations techniques. Nous commençons par un audit pour cadrer la refonte puis remettons une proposition détaillée."
        }
      ]}
    />
  )
}
