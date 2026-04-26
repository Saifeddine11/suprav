import { Link } from 'react-router-dom'
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
  "areaServed": { "@type": "City", "name": "Marrakech" },
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
        { label: "Services", path: "/agence-communication-marrakech" },
        { label: "Branding Marrakech" }
      ]}
      title="Branding à Marrakech — Construisez une marque mémorable"
      subtitle="Identité visuelle cohérente qui inspire confiance et fidélise vos clients"
      intro="Le branding n'est pas un logo. C'est l'ensemble des éléments visuels, verbaux et émotionnels qui font que vos clients reconnaissent et préfèrent votre marque à celle de vos concurrents. Supra v. construit des identités de marque complètes et cohérentes pour les entreprises de Marrakech — des startups naissantes aux enseignes établies souhaitant se repositionner. Notre approche combine stratégie, design et une connaissance fine des codes culturels du marché marocain."
      stats={[
        { value: '3', label: 'Directions créatives proposées' },
        { value: '2–4', label: 'Semaines de délai moyen' },
        { value: '12+', label: 'Supports déclinés en standard' },
      ]}
      services={[
        {
          title: "Brand strategy & positionnement",
          desc: "Définition de votre ADN de marque : mission, vision, valeurs, personnalité et ton de voix. Analyse de votre marché et de vos concurrents à Marrakech pour construire un positionnement différenciant et durable que vos concurrents ne peuvent pas copier.",
        },
        {
          title: "Création logo & identité visuelle",
          desc: "Logo déclinable sur tous supports (print, digital, signalétique), palette de couleurs, typographies et éléments graphiques. Livraison dans tous les formats professionnels — SVG, PDF, PNG — avec guide d'utilisation intégré.",
        },
        {
          title: "Brand book & charte graphique",
          desc: "Document de référence rassemblant toutes les règles d'utilisation de votre identité visuelle. Votre équipe, vos fournisseurs et vos prestataires disposent d'un guide clair pour appliquer votre branding de manière cohérente sur tous les points de contact.",
        },
        {
          title: "Supports print & digital",
          desc: "Cartes de visite, papeterie complète (en-tête, enveloppe), kakémonos, flyers, menus, panneaux signalétiques, templates réseaux sociaux et signatures email. Chaque support respecte scrupuleusement votre charte graphique.",
        },
        {
          title: "Rebranding & restyling",
          desc: "Modernisation de votre identité existante sans perdre la reconnaissance de votre audience actuelle. Nous évaluons ce qui vaut la peine d'être conservé et ce qui doit évoluer, puis nous procédons par étapes pour une transition sans rupture.",
        },
        {
          title: "Naming & copywriting de marque",
          desc: "Création ou validation de votre nom de marque, vérification des conflits de marques déposées au Maroc, rédaction de votre baseline (tagline), de vos messages clés et du ton de voix à adopter sur tous vos supports de communication.",
        },
      ]}
      richContent={[
        {
          heading: "Pourquoi le branding est-il stratégique pour une entreprise à Marrakech ?",
          body: [
            "À Marrakech, dans des secteurs aussi compétitifs que l'hôtellerie, la restauration, l'immobilier ou le retail artisanal, la différenciation visuelle et émotionnelle est devenue un impératif commercial. Les clients ont l'embarras du choix — ils choisissent les marques qui leur inspirent confiance et qui leur ressemblent.",
            "Une identité de marque cohérente communique immédiatement vos valeurs, votre niveau de qualité et votre positionnement. Un riad qui dispose d'une identité visuelle professionnelle, d'un site web soigné et d'une présence Instagram cohérente peut pratiquer des tarifs nuit significativement plus élevés qu'un concurrent proposant le même niveau de service mais avec une communication amateur.",
            <>Le branding n&apos;est pas une dépense réservée aux grandes entreprises. C&apos;est un investissement qui se rentabilise rapidement dès lors qu&apos;il vous permet de vous démarquer, de justifier votre positionnement tarifaire et de fidéliser une clientèle qui se sent appartenir à votre univers. Découvrez l&apos;ensemble de nos services sur notre page <Link to="/agence-communication-marrakech">agence de communication à Marrakech</Link>.</>,
          ],
        },
        {
          heading: "Notre process de création d'identité visuelle",
          sub: [
            {
              heading: "Phase 1 — Brief & immersion",
              body: "Un atelier de 1h30 à 2h pour comprendre votre marché, vos clients cibles, vos ambitions et votre ADN. Nous posons des questions que vous n'attendez pas : Quelle marque internationale aimeriez-vous avoir comme voisin ? Si votre marque était une personne, comment la décririez-vous ? Ces éléments fondent la direction créative.",
            },
            {
              heading: "Phase 2 — Exploration créative",
              body: "Notre équipe de designers explore trois directions créatives distinctes : trois univers visuels différents qui répondent chacun à votre brief de manière cohérente. Vous recevez une présentation structurée expliquant le raisonnement derrière chaque direction, pas seulement des logos.",
            },
            {
              heading: "Phase 3 — Développement & affinement",
              body: "Vous choisissez la direction qui vous correspond le mieux, puis nous entrons dans une phase d'affinement : ajustements des proportions, tests de lisibilité en petite taille, vérification du rendu en couleur, noir & blanc et inversé. Deux rounds de retouches sont inclus.",
            },
            {
              heading: "Phase 4 — Déclinaison & livraison",
              body: "Déclinaison de l'identité sur l'ensemble des supports définis dans le devis, puis livraison des fichiers dans tous les formats nécessaires. Nous rédigeons également le guide d'utilisation — les règles d'usage de votre identité — pour garantir une application cohérente dans le temps.",
            },
          ],
        },
        {
          heading: "Les éléments d'une identité de marque complète",
          body: "Une identité de marque professionnelle va bien au-delà du logo. Voici les éléments que nous livrons systématiquement dans nos projets de branding :",
          bullets: [
            "Le logotype principal et ses variantes (horizontal, vertical, pictogramme seul, version compacte)",
            "La palette de couleurs primaires et secondaires avec les codes Pantone, CMJN, RVB et hexadécimaux",
            "Les typographies principales et secondaires avec règles d'usage (hiérarchie, espacements, styles)",
            "Les éléments graphiques distinctifs (motifs, formes, textures spécifiques à votre marque)",
            "Le tone of voice — comment votre marque parle, écrit et se comporte",
            "Les templates de base pour vos supports digitaux (posts Instagram, bannières, modèles email)",
            "Le brand book complet, document de référence pour tous vos prestataires actuels et futurs",
          ],
        },
        {
          heading: "Branding pour les secteurs clés de Marrakech",
          body: [
            "Marrakech a ses codes et ses références esthétiques. Une identité de marque efficace pour un riad de luxe ne ressemble pas à celle d'une startup tech ou d'un restaurant populaire du Mellah. Notre connaissance intime du marché marrakchi nous permet de créer des identités qui résonnent avec la culture locale tout en répondant aux attentes d'une clientèle internationale exigeante.",
            "Pour l'hôtellerie et la restauration, nous créons des identités qui évoquent l'hospitalité marocaine tout en se démarquant d'un secteur souvent uniformisé. Pour l'immobilier de luxe, nous développons des codes visuels qui communiquent l'excellence sans ostentation. Pour le retail et l'artisanat, nous construisons des marques qui valorisent le savoir-faire local dans un langage contemporain.",
          ],
        },
      ]}
      faq={[
        {
          q: "Combien de propositions de logo créez-vous ?",
          a: "Nous proposons 3 directions créatives distinctes après la phase de brief et d'exploration. Chaque direction est présentée avec le raisonnement créatif derrière. Vous choisissez la direction qui vous correspond le mieux, puis nous entrons dans la phase d'affinement avec deux rounds de retouches inclus.",
        },
        {
          q: "Peut-on garder nos couleurs existantes et moderniser notre logo ?",
          a: "Absolument. Nous proposons des missions de restyling qui modernisent votre logo existant tout en conservant les éléments identitaires que vos clients reconnaissent déjà. Cette approche évolutive limite le risque de désorientation de votre clientèle et est moins coûteuse qu'un rebranding total.",
        },
        {
          q: "Faut-il déposer son logo à l'OMPIC avant de l'utiliser ?",
          a: "C'est fortement recommandé, en particulier si vous prévoyez une activité commerciale significative. Nous pouvons vous accompagner dans cette démarche ou vous orienter vers un cabinet de propriété intellectuelle partenaire au Maroc. Avant de finaliser votre logo, nous effectuons une vérification de base des conflits visuels évidents.",
        },
        {
          q: "Quels formats de fichiers livrez-vous ?",
          a: "Nous livrons votre identité visuelle dans tous les formats professionnels : SVG et AI pour le print et la signalétique (vectoriel, redimensionnable à l'infini), PDF pour les imprimeurs, PNG et WebP pour le digital. Vous recevez également les fichiers source editables si vous souhaitez pouvoir travailler avec d'autres prestataires à l'avenir.",
        },
        {
          q: "Combien de temps dure un projet de branding complet ?",
          a: "Un projet de branding complet (logo + charte + brand book + supports de base) prend entre 2 et 4 semaines selon la complexité et votre réactivité sur les validations. Un projet de brand strategy complet avec repositionnement, naming et identité visuelle peut s'étendre à 5 à 8 semaines.",
        },
        {
          q: "Pouvez-vous aussi créer le site web après le branding ?",
          a: <>Oui, et c&apos;est la configuration idéale. Créer le branding et le site web avec la même équipe garantit une cohérence totale entre l&apos;identité visuelle et le design web. Consultez notre offre de <Link to="/creation-site-web-marrakech">création de site web à Marrakech</Link> — nous proposons des packages combinés branding + site web. Demandez votre devis pour en savoir plus.</>,
        },
      ]}
      sectionNum="02"
    />
  )
}
