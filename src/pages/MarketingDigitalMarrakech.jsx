import { Link } from 'react-router-dom'
import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Supra v3 — Marketing digital à Marrakech",
  "description": "Agence de marketing digital à Marrakech : SEO, publicité digitale, réseaux sociaux et email marketing pour accélérer la croissance de votre entreprise.",
  "provider": {
    "@type": "Organization",
    "name": "Supra v3",
    "url": "https://suprav3.com",
    "telephone": "+33744208673",
    "email": "contact@suprav3.com"
  },
  "areaServed": { "@type": "City", "name": "Marrakech" },
  "url": "https://suprav3.com/marketing-digital-marrakech",
  "serviceType": "Marketing digital"
}

export default function MarketingDigitalMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Marketing Digital Marrakech — Stratégie 360° | Supra v3",
        description: "Agence de marketing digital à Marrakech : SEO, Meta Ads, réseaux sociaux, email marketing. Stratégie digitale complète pour accélérer votre croissance au Maroc.",
        path: "/marketing-digital-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/agence-communication-marrakech" },
        { label: "Marketing Digital Marrakech" }
      ]}
      title="Marketing digital à Marrakech — Stratégie 360°"
      subtitle="Attirez, convertissez et fidélisez vos clients grâce au digital"
      intro="Le marketing digital à Marrakech englobe l'ensemble des actions menées sur les canaux numériques pour faire croître votre activité : référencement naturel, publicité digitale, réseaux sociaux, email marketing et automatisation. Supra v3 conçoit et exécute des stratégies marketing complètes pour les entreprises de Marrakech qui souhaitent accélérer leur croissance de manière structurée et mesurable. Nous commençons par un audit de votre situation actuelle pour identifier les leviers prioritaires avant de lancer la moindre campagne payante."
      stats={[
        { value: '×3', label: 'Trafic qualifié moyen an 1' },
        { value: '360°', label: 'Canaux coordonnés' },
        { value: '48h', label: 'Premiers résultats Meta Ads' },
      ]}
      services={[
        {
          title: "Stratégie digitale & plan d'action",
          desc: "Audit de votre présence digitale actuelle, analyse concurrentielle, définition des personas et des tunnels de conversion. Plan d'action sur 6 à 12 mois avec allocation des leviers, KPIs mesurables et jalons de suivi. Vous savez exactement où va chaque dirham investi.",
        },
        {
          title: "Publicité Meta Ads & TikTok",
          desc: "Création des visuels et des copies publicitaires, ciblage précis de vos audiences à Marrakech et au Maroc, optimisation continue des campagnes. Chaque campagne dispose d'un objectif chiffré et d'un tableau de bord de performance actualisé quotidiennement.",
        },
        {
          title: "Référencement SEO Marrakech",
          desc: "Optimisation technique et éditoriale pour apparaître en première page de Google sur les requêtes de vos clients. Le SEO est le levier à plus fort ROI sur le moyen terme : il génère du trafic qualifié en continu, longtemps après que votre investissement initial a été amorti.",
        },
        {
          title: "Social media management",
          desc: "Ligne éditoriale, calendrier mensuel, création des publications, animation de votre communauté. Une présence sociale professionnelle et cohérente sur Instagram, Facebook, LinkedIn ou TikTok selon votre secteur et votre audience cible.",
        },
        {
          title: "Email marketing & automation",
          desc: "Séquences d'emails automatisées (bienvenue, nurturing, relance, fidélisation), newsletters et campagnes événementielles. Configuration sur Mailchimp, Brevo, Klaviyo ou votre outil existant. L'email marketing reste l'un des canaux au meilleur retour sur investissement.",
        },
        {
          title: "Reporting & tableaux de bord",
          desc: "Dashboard unifié connectant Google Analytics 4, Search Console, Meta Ads Manager et votre CRM. Rapport mensuel avec analyse des KPIs, des gains et des recommandations pour le mois suivant. Vous lisez vos performances en trente secondes.",
        },
      ]}
      richContent={[
        {
          heading: "Le marketing digital au Maroc en 2026 : état des lieux",
          body: [
            "Le Maroc compte plus de 30 millions d'internautes actifs, avec un taux de pénétration mobile supérieur à 80 %. À Marrakech, les comportements de recherche et d'achat ont radicalement évolué : avant de contacter un prestataire, vos clients potentiels consultent Google, comparent plusieurs sites, lisent les avis et vérifient votre présence sur Instagram. Chaque étape de ce parcours est une opportunité d'être visible ou invisible.",
            <>Le marketing digital n&apos;est plus une option pour les entreprises de Marrakech qui souhaitent croître. C&apos;est le terrain où se joue la bataille commerciale. Les entreprises qui ont investi tôt dans leur présence digitale bénéficient aujourd&apos;hui d&apos;une avance concurrentielle significative. Pour une vision complète de notre offre, consultez notre page <Link to="/agence-communication-marrakech">agence de communication à Marrakech</Link>.</>,
          ],
        },
        {
          heading: "Les leviers du marketing digital et comment les combiner",
          sub: [
            {
              heading: "SEO — pour une croissance organique durable",
              body: <>Le <Link to="/referencement-seo-marrakech">référencement naturel (SEO) à Marrakech</Link> est le levier au meilleur retour sur investissement à moyen terme. Il génère du trafic qualifié sans coût au clic. En revanche, il demande du temps : les premiers résultats significatifs s&apos;observent après 3 à 6 mois d&apos;optimisation. Idéal pour construire un actif digital durable.</>,
            },
            {
              heading: "Meta Ads — pour des résultats immédiats",
              body: "Les campagnes publicitaires sur Meta (Facebook et Instagram) permettent de cibler précisément vos audiences à Marrakech, au Maroc ou à l'international. Les résultats sont quasi immédiats — les premières impressions et les premiers leads arrivent dans les 48 heures après le lancement. Le revers : le trafic s'arrête quand la campagne s'arrête.",
            },
            {
              heading: "Content marketing — pour éduquer et convertir",
              body: "Produire du contenu de valeur (articles de blog, vidéos, guides, infographies) positionne votre marque comme experte sur votre secteur et nourrit le tunnel de conversion sur le long terme. Un article bien écrit sur un sujet que vos clients cherchent peut générer des leads pendant plusieurs années.",
            },
            {
              heading: "Email marketing — pour fidéliser et maximiser la lifetime value",
              body: "Vos clients existants sont votre meilleure source de chiffre d'affaires additionnel. Une séquence email bien construite peut doubler la fréquence d'achat d'un client e-commerce ou transformer un client ponctuel en ambassadeur de votre marque. L'email marketing reste en 2026 le canal avec le meilleur retour sur investissement.",
            },
          ],
        },
        {
          heading: "Comment nous mesurons le retour sur investissement",
          body: [
            "La mesurabilité est l'avantage fondamental du marketing digital par rapport à la communication traditionnelle. Chez Supra v3, nous configurons dès le premier jour un écosystème de mesure complet pour chaque client : Google Analytics 4 pour le comportement des visiteurs, Google Search Console pour les performances SEO, Meta Business Manager pour les campagnes sociales, et un pixel de conversion correctement paramétré pour tracker chaque vente, chaque lead, chaque appel.",
            "Tous ces flux de données sont consolidés dans un dashboard unifié que vous pouvez consulter à tout moment. Chaque mois, nous vous remettons un rapport d'analyse complet avec les chiffres clés, leur évolution, ce qui a bien fonctionné, ce qui doit être amélioré et les priorités pour le mois suivant. Nous ne vous vendons pas des services — nous gérons ensemble un investissement qui doit être rentable.",
          ],
        },
        {
          heading: "Marketing digital pour les touristes et la clientèle internationale",
          body: [
            "Marrakech est une ville internationale. Nombreux sont les secteurs — hôtellerie, restauration, artisanat, immobilier de luxe — dont la clientèle principale est étrangère : française, britannique, espagnole, américaine ou des pays du Golfe. Un marketing digital efficace à Marrakech doit savoir parler plusieurs langues et plusieurs cultures.",
            "Nous développons des stratégies de marketing digital multilingues qui ciblent les bons pays, les bons langages et les bons canaux selon votre audience. Meta Ads avec ciblage géographique international, SEO en français et en anglais, contenu Instagram adapté aux codes esthétiques de chaque marché. Notre double culture franco-marocaine est un avantage réel pour concevoir ces stratégies.",
          ],
        },
      ]}
      faq={[
        {
          q: "Par quoi commencer sa stratégie de marketing digital à Marrakech ?",
          a: "La première étape est un audit de votre présence actuelle : site web, réseaux sociaux, SEO, publicités existantes. Cet audit révèle vos forces, vos faiblesses et les opportunités immédiatement exploitables. Ensuite, nous priorisons les leviers selon votre budget et vos objectifs : acquisition immédiate (Meta Ads) ou croissance organique (SEO + content). Commencez par un appel découverte gratuit de 30 minutes.",
        },
        {
          q: "Quel budget faut-il prévoir pour la publicité digitale à Marrakech ?",
          a: "Il faut un budget média adapté à votre secteur pour que Meta Ads apprenne correctement — le montant se définit au cadrage, hors honoraires création et gestion. Demandez un diagnostic pour une recommandation personnalisée."
        },
        {
          q: "Faut-il être présent sur tous les réseaux sociaux ?",
          a: "Non — mieux vaut être excellent sur deux plateformes que médiocre sur cinq. Le choix des plateformes dépend de votre secteur et de votre audience : Instagram et TikTok pour les marques visuelles grand public, LinkedIn pour le B2B et les professions libérales, Facebook pour les audiences de plus de 35 ans. Nous vous conseillons sur la sélection lors de l'audit initial.",
        },
        {
          q: "Travaillez-vous avec des marques françaises qui souhaitent vendre au Maroc ?",
          a: "Oui. Supra v3 accompagne des marques françaises et européennes dans leur développement au Maroc. Notre connaissance du marché marocain, des réglementations locales et des habitudes de consommation est un avantage décisif pour adapter les stratégies marketing au contexte marocain.",
        },
        {
          q: "Comment savoir si mes campagnes Meta Ads sont vraiment rentables ?",
          a: "Nous configurons un pixel Meta et un système de tracking complet avant le lancement de vos campagnes pour mesurer précisément chaque lead, chaque vente et chaque appel générés. Vous avez accès à un tableau de bord en temps réel et recevez un rapport hebdomadaire pendant la phase d'optimisation. Si une campagne n'est pas rentable, nous le voyons immédiatement et nous l'ajustons.",
        },
      ]}
      sectionNum="03"
    />
  )
}
