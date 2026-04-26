import { Link } from 'react-router-dom'
import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const seo = {
  title: 'Création Site Web Marrakech — Supra v. | Sites vitrines, e-commerce & sur-mesure',
  description: "Création de site web à Marrakech par Supra v. : sites vitrines, e-commerce, applications web. Rapides, référencés Google, mobile-first. Devis gratuit sous 48h.",
  path: '/creation-site-web-marrakech',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Création de site web à Marrakech',
    provider: { '@type': 'LocalBusiness', name: 'Supra v.', url: 'https://suprav3.com' },
    areaServed: { '@type': 'City', name: 'Marrakech' },
    description: "Création de sites web sur-mesure à Marrakech : sites vitrines, e-commerce, plateformes. Design soigné, SEO natif, performance Lighthouse.",
    telephone: '+33744208673',
    email: 'contact@suprav3.com',
  },
}

export default function CreationSiteWebMarrakech() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[
        { label: 'Accueil', path: '/' },
        { label: 'Agence web', path: '/agence-communication-marrakech' },
        { label: 'Création site web Marrakech' },
      ]}
      title="Création site web à Marrakech"
      subtitle="Sites vitrines, e-commerce et plateformes sur-mesure"
      intro="Supra v. crée des sites web à Marrakech conçus pour charger en moins de deux secondes, se positionner naturellement sur Google et convertir les visiteurs en clients. Pas de templates, pas de WordPress alourdi de plugins inutiles. Du code propre, un design sur-mesure et une architecture pensée pour durer plusieurs années sans refonte majeure."
      stats={[
        { value: '< 2s', label: 'Temps de chargement moyen' },
        { value: '95+', label: 'Score Lighthouse moyen' },
        { value: '3–6', label: 'Semaines de délai moyen' },
      ]}
      services={[
        {
          title: 'Site vitrine professionnel',
          desc: "Votre présence digitale principale : présentation de votre activité, services, équipe, références et formulaire de contact. Design soigné, animations fluides, 100% mobile-first. Parfait pour les PME, restaurants, hôtels, cabinets et professions libérales de Marrakech.",
        },
        {
          title: 'Site e-commerce Marrakech',
          desc: "Boutique en ligne complète avec gestion de catalogue, paiement sécurisé (CMI, PayPal, virement), gestion des commandes et tunnel de vente optimisé pour les achats marocains. Intégration des moyens de paiement locaux et livraison.",
        },
        {
          title: 'Landing page & one-page',
          desc: "Page unique haute conversion pour un lancement de produit, une campagne publicitaire ou un événement. Structure persuasive, appels à l'action optimisés, compatible avec Meta Ads et Google Ads. Livrable en 1 à 2 semaines.",
        },
        {
          title: 'Refonte de site web',
          desc: "Modernisation complète de votre site existant avec migration SEO sécurisée pour ne perdre aucune position sur Google. Audit de l'existant, nouveau design, réécriture du code, redirection 301 et suivi de l'indexation après migration.",
        },
        {
          title: 'Site multilingue',
          desc: "Version française, arabe et anglaise de votre site pour toucher les visiteurs internationaux à Marrakech. Structure hreflang correctement configurée pour un SEO multilingue efficace. Idéal pour les acteurs du tourisme et de l'hôtellerie.",
        },
        {
          title: 'Maintenance & hébergement',
          desc: "Contrat de maintenance mensuel : mises à jour de sécurité, sauvegardes quotidiennes, monitoring de la disponibilité, corrections de bugs et hébergement haute performance inclus. Votre site est toujours en ligne et à jour.",
        },
      ]}
      richContent={[
        {
          heading: "Qu'est-ce qu'un bon site web en 2026 ?",
          body: [
            "Un bon site web n'est pas simplement un beau site. C'est un outil commercial qui travaille pour vous 24 heures sur 24, 7 jours sur 7, pour attirer des prospects qualifiés et les convertir en clients. En 2026, les critères d'un site web performant à Marrakech recouvrent trois dimensions indissociables : la vitesse de chargement, l'expérience utilisateur et l'optimisation pour les moteurs de recherche.",
            "La vitesse de chargement est devenue un critère décisif : 53 % des visiteurs abandonnent une page qui met plus de 3 secondes à se charger sur mobile. Google l'a officiellement intégré comme facteur de classement depuis 2021 via les Core Web Vitals. Nos sites obtiennent systématiquement un score Lighthouse supérieur à 90 sur mobile et desktop, grâce à un code optimisé, des images compressées et un hébergement haute performance.",
            "L'expérience utilisateur va bien au-delà du design esthétique. Il s'agit de guider le visiteur vers l'action que vous souhaitez qu'il effectue — appeler, remplir un formulaire, acheter — avec le moins de friction possible. Nous concevons chaque page avec une hiérarchie visuelle claire, des appels à l'action stratégiquement placés et des parcours utilisateurs testés.",
          ],
        },
        {
          heading: "Les technologies que nous utilisons",
          body: "Nous choisissons les technologies en fonction des besoins spécifiques de chaque projet, pas par habitude ou facilité. Voici notre stack principal :",
          sub: [
            {
              heading: "React & Next.js pour les projets complexes",
              body: "Pour les plateformes e-commerce avancées, les applications web et les sites à fort trafic, nous utilisons React et Next.js. Ces technologies offrent des performances exceptionnelles, un SEO natif grâce au rendu côté serveur et une scalabilité qui s'adapte à la croissance de votre activité.",
            },
            {
              heading: "Sites statiques ultra-rapides",
              body: "Pour les sites vitrines et landing pages, nous privilégions les architectures JAMstack qui génèrent des pages HTML statiques. Résultat : un temps de chargement en dessous de la seconde, un hébergement moins coûteux et une sécurité maximale (pas de base de données exposée).",
            },
            {
              heading: "Solutions e-commerce sur-mesure",
              body: "Selon votre volume de produits et vos besoins spécifiques, nous intégrons WooCommerce, Shopify ou des solutions entièrement sur-mesure avec paiement local Maroc (CMI, PayPal, M-Pesa). Chaque intégration est précédée d'une phase de spécification technique pour éviter les mauvaises surprises.",
            },
          ],
        },
        {
          heading: "Le SEO intégré dès la conception",
          body: [
            "L'un des avantages les plus importants de faire appel à Supra v. pour la création de votre site web à Marrakech est que le SEO est intégré dès la première ligne de code, pas ajouté après coup comme un plugin.",
            "Cela signifie concrètement : une architecture d'URL logique et descriptive, des balises title et meta description optimisées pour chaque page, des données structurées Schema.org pour apparaître dans les résultats enrichis de Google, une sitemap XML soumise à Google Search Console, et un code HTML sémantique que les robots de Google comprennent parfaitement.",
            <>Nous effectuons également une recherche de mots-clés avant la conception pour s&apos;assurer que les pages de votre site ciblent les requêtes que vos clients potentiels à Marrakech tapent réellement dans Google. Cette étape, souvent négligée par les agences web qui se concentrent uniquement sur le design, est ce qui fait la différence entre un joli site invisible et un site qui génère des leads. Pour aller plus loin, découvrez notre <Link to="/referencement-seo-marrakech">offre de référencement SEO à Marrakech</Link>.</>,
          ],
        },
        {
          heading: "Ce qui différencie nos sites des templates WordPress",
          body: [
            "La majorité des sites web créés à Marrakech sont construits sur WordPress avec des thèmes premium achetés sur ThemeForest. Cette approche a un avantage évident : elle est rapide et peu coûteuse à produire. Elle a aussi des inconvénients majeurs que la plupart des agences ne mentionnent pas.",
            "Un site WordPress avec thème premium chargera 3 à 6 mégaoctets de CSS et JavaScript dont votre site n'a pas besoin, ralentissant considérablement les performances. Il sera difficile à maintenir sur le long terme à mesure que les plugins vieillissent et deviennent incompatibles. Et son design sera par définition identique à des milliers d'autres sites dans le monde.",
            "Nos sites sont écrits de zéro. Chaque ligne de CSS, chaque composant JavaScript sert un objectif précis. Le résultat est un site unique, rapide, facile à maintenir et dont vous êtes propriétaire à 100% — sans dépendance à un thème ou à un plugin tiers.",
          ],
        },
        {
          heading: "De la livraison à la performance : notre suivi post-lancement",
          body: [
            <>La mise en ligne de votre site n&apos;est pas la fin de notre collaboration — c&apos;est le début de la phase où votre site commence à travailler pour vous. En parallèle du lancement, notre <Link to="/agence-communication-marrakech">agence de communication à Marrakech</Link> peut prendre en charge votre SEO, vos réseaux sociaux et vos campagnes publicitaires pour maximiser votre retour sur investissement.</>,
            "Un mois après le lancement, nous vous envoyons un rapport de performance : trafic, sources d'acquisition, pages les plus visitées, taux de conversion des formulaires, positionnements SEO. Ces données nous permettent d'identifier rapidement ce qui fonctionne et ce qui peut être amélioré.",
            "Pour les clients sous contrat de maintenance, nous proposons des optimisations trimestrielles basées sur les données : ajustement des appels à l'action, amélioration des pages à fort trafic, ajout de contenu pour renforcer le SEO. Un site bien entretenu et régulièrement enrichi prend de la valeur avec le temps.",
          ],
        },
      ]}
      faq={[
        {
          q: "Quel est le délai pour créer un site web à Marrakech ?",
          a: "Un site vitrine standard est livré en 3 à 6 semaines. Une boutique e-commerce prend 6 à 10 semaines. Une plateforme web sur-mesure demande 8 à 16 semaines selon la complexité. Ces délais incluent la phase de design, le développement, les révisions et les tests. Nous vous donnons un planning précis dès la signature du devis.",
        },
        {
          q: "Mon site sera-t-il bien positionné sur Google ?",
          a: "Le SEO est intégré dès la conception : architecture d'URL, balises optimisées, Schema.org, vitesse de chargement et Core Web Vitals. Nous configurons Google Search Console et Google Analytics avant la mise en ligne. Pour un positionnement compétitif sur des requêtes ciblées à Marrakech, une stratégie SEO continue (contenu + netlinking) est recommandée en complément.",
        },
        {
          q: "Puis-je gérer mon site moi-même après la livraison ?",
          a: "Oui. Nous développons les sites avec une interface d'administration adaptée à vos besoins réels : modifier les textes, ajouter des photos, publier des articles ou gérer votre catalogue. Nous incluons une formation d'une à deux heures à la livraison. Pour les tâches techniques (mises à jour de sécurité, modifications de code), notre contrat de maintenance mensuel couvre tout cela.",
        },
        {
          q: "Mon site sera-t-il compatible avec les paiements marocains ?",
          a: "Oui. Pour les projets e-commerce, nous intégrons les solutions de paiement disponibles au Maroc : CMI (paiement par carte bancaire marocaine), PayPal pour les paiements internationaux, et virement bancaire. Nous vous conseillons sur la solution la plus adaptée selon votre volume de ventes prévisible.",
        },
        {
          q: "Proposez-vous l'hébergement du site après la livraison ?",
          a: "Oui. Nous proposons un hébergement haute performance sur des serveurs SSD avec certificat SSL inclus, sauvegardes quotidiennes et monitoring de la disponibilité. L'hébergement peut être intégré à votre contrat de maintenance mensuel. Vous pouvez également choisir d'héberger votre site chez un prestataire de votre choix — nous vous accompagnons dans la configuration.",
        },
        {
          q: "Combien coûte la maintenance d'un site web ?",
          a: "Nos contrats de maintenance couvrent les mises à jour de sécurité, les sauvegardes, le monitoring et les petites corrections de contenu. Le tarif dépend de la complexité du site et du niveau de service souhaité. Demandez votre devis gratuit pour obtenir une estimation précise.",
        },
      ]}
      sectionNum="02"
    />
  )
}
