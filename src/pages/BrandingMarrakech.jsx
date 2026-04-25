import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Branding et identité visuelle à Marrakech",
  "description": "Supra v. crée votre identité de marque complète à Marrakech : logo, charte graphique, brand book et supports de communication.",
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
  "url": "https://suprav3.com/branding-marrakech",
  "serviceType": "Branding et identité visuelle"
}

export default function BrandingMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Branding Marrakech — Identité de Marque Sur-mesure | Supra v.",
        description: "Créez une identité de marque forte à Marrakech avec Supra v. : logo, charte graphique, brand strategy et supports print/digital. Devis gratuit.",
        path: "/branding-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Branding Marrakech" }
      ]}
      title="Branding à Marrakech — Construisez une marque mémorable"
      subtitle="Une identité visuelle cohérente qui inspire confiance et fidélise vos clients"
      intro="Le branding Marrakech est bien plus qu'un simple logo : c'est l'ensemble des éléments visuels et émotionnels qui font que vos clients reconnaissent et font confiance à votre marque. Chez Supra v., nous construisons des identités de marque complètes et cohérentes pour les entreprises de Marrakech — des startups naissantes aux enseignes établies souhaitant se repositionner. Notre approche combine stratégie de marque, design graphique et connaissance des codes culturels du marché marocain pour créer une identité qui résonne avec votre audience cible."
      services={[
        {
          title: "Brand strategy & positionnement",
          desc: "Définition de votre ADN de marque : mission, vision, valeurs, personnalité et ton de voix. Nous analysons votre marché, vos concurrents à Marrakech et vos clients cibles pour construire un positionnement différenciant et durable."
        },
        {
          title: "Création logo & identité visuelle",
          desc: "Logo déclinable sur tous supports (print, digital, signalétique), palette de couleurs, typographies et éléments graphiques. Nous livrons votre logo dans tous les formats professionnels (SVG, PDF, PNG) avec guide d'utilisation."
        },
        {
          title: "Brand book & charte graphique complète",
          desc: "Document de référence rassemblant toutes les règles d'utilisation de votre identité visuelle. Votre équipe, vos fournisseurs et vos prestataires disposent d'un guide clair pour appliquer votre branding de manière cohérente."
        },
        {
          title: "Supports de communication print & digital",
          desc: "Cartes de visite, papeterie, kakémonos, flyers, templates réseaux sociaux et signatures email. Chaque support est conçu dans le respect de votre charte graphique pour une cohérence parfaite de votre marque Marrakech."
        }
      ]}
      faq={[
        {
          q: "Combien coûte un projet de branding complet à Marrakech ?",
          a: "Un projet de branding complet chez Supra v. (logo + charte + brand book + supports de base) est proposé à partir de 7 000 MAD. Un projet incluant la brand strategy, le repositionnement et un volume important de supports peut atteindre 20 000 MAD. Nous adaptons toujours notre offre à votre budget."
        },
        {
          q: "Combien de propositions de logo créez-vous ?",
          a: "Nous proposons 3 directions créatives distinctes après la phase de brief et de recherche. Vous choisissez la direction qui vous correspond le mieux, puis nous affinons ensemble jusqu'à votre satisfaction totale. Deux rounds de retouches sont inclus dans le tarif de base."
        },
        {
          q: "Peut-on garder nos couleurs existantes et juste moderniser notre logo ?",
          a: "Absolument. Nous proposons des missions de restyling qui modernisent votre logo existant tout en conservant les éléments identitaires que vos clients connaissent déjà. Cette approche évolutive est moins coûteuse qu'un rebranding total et limite le risque de désorientation de votre clientèle."
        }
      ]}
    />
  )
}
