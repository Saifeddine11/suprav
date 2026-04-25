import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Référencement SEO à Marrakech",
  "description": "Supra v. améliore votre positionnement sur Google à Marrakech grâce au référencement naturel SEO : audit, optimisation on-page, contenu et netlinking.",
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
  "url": "https://suprav3.com/referencement-seo-marrakech",
  "serviceType": "Référencement SEO"
}

export default function ReferencementSeoMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Référencement SEO Marrakech — 1ère Page Google | Supra v.",
        description: "Agence SEO à Marrakech : audit technique, optimisation on-page, création de contenu et netlinking pour positionner votre site en 1ère page Google. Résultats durables.",
        path: "/referencement-seo-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Référencement SEO Marrakech" }
      ]}
      title="Référencement SEO à Marrakech"
      subtitle="Soyez trouvé par vos clients sur Google avant vos concurrents"
      intro="Le référencement SEO Marrakech est la stratégie la plus rentable sur le long terme pour attirer des visiteurs qualifiés sur votre site web sans payer à chaque clic. Supra v. applique une méthodologie SEO complète et éprouvée pour positionner votre site en première page de Google sur les mots-clés que tapent vos clients potentiels à Marrakech et au Maroc. Contrairement à la publicité payante, le référencement naturel génère un trafic qui continue à croître même lorsque vous ne dépensez plus, constituant un actif durable pour votre entreprise."
      services={[
        {
          title: "Audit SEO technique complet",
          desc: "Analyse de 100+ points techniques : vitesse de chargement, Core Web Vitals, indexation, structure des URLs, balises Hn, données structurées, maillage interne et backlinks toxiques. Rapport prioritaire avec feuille de route d'optimisation."
        },
        {
          title: "Optimisation on-page & architecture",
          desc: "Rédaction et optimisation des balises title et meta description, restructuration du maillage interne, optimisation des images (alt, format WebP) et implémentation des données structurées Schema.org pour maximiser votre visibilité dans les résultats enrichis."
        },
        {
          title: "Stratégie de contenu SEO",
          desc: "Recherche de mots-clés à fort potentiel pour Marrakech, création d'un silo thématique et rédaction d'articles et pages optimisés SEO par nos rédacteurs experts. Le contenu de qualité est le carburant de votre référencement naturel."
        },
        {
          title: "Netlinking & autorité de domaine",
          desc: "Acquisition de backlinks depuis des sites marocains et internationaux à forte autorité (DA 30+). Guest blogging, partenariats éditoriaux et RP digitales pour renforcer l'autorité de votre domaine et accélérer votre montée dans les résultats Google."
        }
      ]}
      faq={[
        {
          q: "Combien de temps faut-il pour voir des résultats SEO à Marrakech ?",
          a: "Les premiers mouvements de positionnement sont visibles après 4 à 6 semaines d'optimisation. Des résultats significatifs (top 10 Google) sont généralement obtenus en 3 à 6 mois selon la compétitivité de votre secteur à Marrakech. Le SEO est un investissement à moyen-long terme qui s'accélère avec le temps."
        },
        {
          q: "Combien coûte une prestation SEO mensuelle à Marrakech ?",
          a: "Nos forfaits SEO mensuels démarrent à 2 500 MAD/mois pour un site vitrine (optimisation on-page + 2 articles). Un forfait e-commerce ou SEO compétitif (audit + content + netlinking) est disponible à partir de 5 000 MAD/mois. Engagement minimum de 6 mois pour des résultats durables."
        },
        {
          q: "Pouvez-vous garantir la première position sur Google ?",
          a: "Aucune agence sérieuse ne peut garantir une position précise, car les algorithmes de Google évoluent constamment. Ce que nous garantissons, c'est une amélioration mesurable de votre trafic organique et de vos positionnements sur vos mots-clés cibles, vérifiable dans Google Search Console chaque mois."
        }
      ]}
    />
  )
}
