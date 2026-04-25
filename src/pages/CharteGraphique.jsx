import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Création de charte graphique à Marrakech",
  "description": "Supra v. conçoit votre charte graphique à Marrakech pour garantir une cohérence visuelle parfaite sur tous vos supports de communication.",
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
  "url": "https://suprav3.com/charte-graphique",
  "serviceType": "Création de charte graphique"
}

export default function CharteGraphique() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Charte Graphique Marrakech — Identité Visuelle Cohérente | Supra v.",
        description: "Supra v. crée votre charte graphique à Marrakech : couleurs, typographies, logo déclinaisons, templates. Cohérence visuelle garantie sur tous supports.",
        path: "/charte-graphique",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Charte Graphique" }
      ]}
      title="Création de charte graphique à Marrakech"
      subtitle="Donnez une cohérence professionnelle à tous vos supports de communication"
      intro="Une charte graphique Marrakech bien construite est le socle de toute communication professionnelle : elle garantit que votre marque est reconnue immédiatement, quel que soit le support — site web, réseaux sociaux, flyers ou signalétique. Supra v. conçoit des chartes graphiques complètes et documentées pour les entreprises de Marrakech, en partant de votre logo existant ou en le créant simultanément. Le résultat est un document de référence que votre équipe et vos prestataires peuvent utiliser immédiatement pour produire des visuels cohérents sans passer par notre agence à chaque fois."
      services={[
        {
          title: "Palette de couleurs & codes techniques",
          desc: "Sélection de 2 à 5 couleurs principales et secondaires avec tous leurs codes techniques (Pantone, CMJN pour l'impression, RVB et Hexadécimal pour le digital). Chaque couleur est justifiée par la psychologie des couleurs et l'identité de votre marque."
        },
        {
          title: "Typographies & hiérarchie textuelle",
          desc: "Sélection de 2 à 3 familles de polices complémentaires (titre, corps de texte, accent) avec les règles d'utilisation : tailles minimales, graisses autorisées et associations recommandées. Les polices choisies sont disponibles en version web et print."
        },
        {
          title: "Règles d'usage du logo & déclinaisons",
          desc: "Zones de protection, tailles minimales, versions autorisées (couleur, noir, blanc, sur fond sombre ou clair), fonds interdits et exemples de mauvais usages. Vos prestataires ne pourront plus malmener votre logo."
        },
        {
          title: "Templates & éléments graphiques",
          desc: "Création de templates prêts à l'emploi : modèle de présentation PowerPoint, templates posts Instagram, bannière LinkedIn et signature email. Ces modèles permettent à votre équipe de créer des visuels professionnels en autonomie."
        }
      ]}
      faq={[
        {
          q: "Quelle est la différence entre un logo et une charte graphique ?",
          a: "Le logo est le signe graphique identitaire de votre marque. La charte graphique est le guide complet qui définit comment utiliser ce logo et tous les autres éléments visuels (couleurs, typographies, icônes) sur l'ensemble de vos supports. Sans charte, votre logo sera interprété différemment par chaque prestataire."
        },
        {
          q: "Combien coûte une charte graphique à Marrakech ?",
          a: "Une charte graphique complète chez Supra v. est proposée entre 3 500 et 8 000 MAD selon le nombre de supports inclus. Elle est souvent réalisée en même temps que la création du logo pour bénéficier d'un tarif packagé avantageux."
        },
        {
          q: "Ma charte graphique sera-t-elle adaptée au web et aux réseaux sociaux ?",
          a: "Oui, toutes nos chartes graphiques intègrent les spécifications pour le digital : tailles d'images pour les réseaux sociaux, polices web-safe ou Google Fonts, et formats d'export optimisés pour le web (WebP, SVG). Vous recevez également des templates prêts à publier pour Instagram et LinkedIn."
        }
      ]}
    />
  )
}
