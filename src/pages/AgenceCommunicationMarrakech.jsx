import { Link } from 'react-router-dom'
import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const seo = {
  title: 'Agence de Communication Marrakech — Supra v. | Branding, Web & IA',
  description: "Supra v. est l'agence de communication 360° à Marrakech : branding, création de sites web, contenus photo/vidéo, publicité digitale et automatisation IA. Une équipe, de la stratégie au code.",
  path: '/agence-communication-marrakech',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Supra v. — Agence de communication Marrakech',
    url: 'https://suprav3.com/agence-communication-marrakech',
    description: "Agence de communication 360° à Marrakech spécialisée en branding, création de sites web, marketing digital et automatisation IA.",
    areaServed: { '@type': 'City', name: 'Marrakech' },
    address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressCountry: 'MA' },
    telephone: '+33744208673',
    email: 'contact@suprav3.com',
  },
}

export default function AgenceCommunicationMarrakech() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[
        { label: 'Accueil', path: '/' },
        { label: 'Agence de communication Marrakech' },
      ]}
      title="Agence de communication à Marrakech"
      subtitle="Communication 360° — Branding, Web, Contenus & IA"
      intro="Supra v. est l'agence de communication à Marrakech qui accompagne les marques ambitieuses de la stratégie jusqu'au code. Branding, création de sites web, production de contenus, publicité digitale, community management et automatisation IA — tout en interne, sans sous-traitance. Nous croyons qu'une communication efficace commence par comprendre votre marché, votre audience et vos objectifs avant de produire quoi que ce soit."
      stats={[
        { value: '50+', label: 'Projets livrés' },
        { value: '8', label: 'Disciplines maîtrisées' },
        { value: '100%', label: 'Interne, sans sous-traitance' },
      ]}
      services={[
        {
          title: 'Stratégie de marque & branding',
          desc: <>Positionnement, naming, identité visuelle, direction artistique complète. Un territoire de marque différenciant que vos concurrents ne peuvent pas copier. Nous livrons logo, charte graphique, brand book et les déclinaisons sur tous vos supports. <Link to="/branding-marrakech">Découvrir notre offre branding →</Link></>,
        },
        {
          title: 'Création de site web Marrakech',
          desc: <><Link to="/creation-site-web-marrakech">Sites vitrines, e-commerce et plateformes sur-mesure</Link> codés proprement, optimisés Core Web Vitals, pensés pour convertir les visiteurs en prospects dès la première visite. Pas de templates, pas de WordPress lent.</>,
        },
        {
          title: 'Production photo & vidéo',
          desc: "Films de marque, capsules verticales pour Instagram et TikTok, direction artistique photo, motion design. Votre équipe créative complète, disponible à Marrakech et en déplacement au Maroc.",
        },
        {
          title: 'Publicité digitale & Meta Ads',
          desc: <>Campagnes Meta Ads, TikTok et Snapchat avec création des visuels, ciblage précis et optimisation continue. Chaque dirham investi est traçable dans un tableau de bord que vous lisez en trente secondes. <Link to="/marketing-digital-marrakech">Voir notre stratégie marketing 360° →</Link></>,
        },
        {
          title: 'Community management',
          desc: "Ligne éditoriale, calendrier mensuel, création des publications, animation de votre communauté au quotidien. Une présence sociale qui parle la même langue que votre marque, sans rupture de ton.",
        },
        {
          title: 'Référencement SEO Marrakech',
          desc: <>Audit technique, optimisation on-page, création de contenu SEO et acquisition de backlinks. Pour apparaître en premier sur Google lorsque vos clients recherchent vos services à Marrakech. <Link to="/referencement-seo-marrakech">En savoir plus sur le SEO →</Link></>,
        },
        {
          title: 'Automatisation & agents IA',
          desc: "Workflows automatisés, chatbots intelligents, intégrations CRM et API. L'IA au service de vos opérations : gagner du temps sur les tâches répétitives pour vous concentrer sur ce qui crée de la valeur.",
        },
        {
          title: 'Applications web & mobile',
          desc: "Applications iOS, Android et plateformes web sur-mesure. Du cadrage à la mise en production sur les stores, en passant par le design et le développement. Du code propre, pensé pour durer.",
        },
      ]}
      richContent={[
        {
          heading: "Pourquoi choisir une agence de communication à Marrakech ?",
          body: [
            "Le marché de la communication à Marrakech a radicalement évolué au cours des cinq dernières années. La montée en puissance des réseaux sociaux, la démocratisation du e-commerce au Maroc et l'accélération de la transformation digitale ont profondément changé les attentes des consommateurs marocains. Travailler avec une agence de communication implantée à Marrakech présente un avantage décisif : la connaissance intime du marché local, des codes culturels et des habitudes de consommation spécifiques à la région.",
            "Supra v. est une agence de communication à Marrakech fondée par des professionnels du digital formés en Europe et ancrés dans la réalité marocaine. Cette double culture nous permet de créer des stratégies de communication qui fonctionnent localement tout en répondant aux standards internationaux les plus exigeants. Nos clients bénéficient d'une équipe pluridisciplinaire réunie sous un même toit : stratèges, designers, développeurs, rédacteurs et spécialistes des médias sociaux travaillent ensemble dès le premier brief.",
            "Contrairement à de nombreuses agences de communication à Marrakech qui externalisent une grande partie de leur production, nous gardons l'intégralité de la chaîne de valeur en interne. Cela se traduit par des délais plus courts, une cohérence créative totale et une responsabilité assumée sur chaque livrable.",
          ],
        },
        {
          heading: "Les secteurs que nous accompagnons à Marrakech",
          body: "Nous avons développé une expertise sectorielle sur les marchés les plus actifs de Marrakech. Voici les secteurs dans lesquels nos clients obtiennent les meilleurs résultats :",
          bullets: [
            "Hôtellerie & tourisme : riads, hôtels boutique, agences de voyage et opérateurs d'excursions. Marrakech accueille plus de 3 millions de visiteurs par an — votre présence digitale doit être à la hauteur.",
            "Immobilier & promotion : programmes résidentiels et commerciaux, agences immobilières, marchands de biens. La commercialisation digitale représente aujourd'hui plus de 60 % des prises de contact initiales.",
            "Restauration & gastronomie : restaurants, traiteurs, concepts food. La visibilité sur Google Maps et les contenus visuels de qualité sont les deux leviers les plus efficaces pour remplir une salle.",
            "Retail & e-commerce : boutiques physiques en transition vers le digital, marques d'artisanat souhaitant vendre en ligne, enseignes cherchant à développer leur présence nationale.",
            "Professions libérales & services B2B : cabinets d'avocats, de médecins, architectes, consultants. Le personal branding et le SEO local sont vos meilleurs outils pour attirer de nouveaux clients.",
            "Start-ups & PME ambitieuses : entreprises en phase de croissance qui ont besoin de structurer leur communication pour passer au palier supérieur.",
          ],
        },
        {
          heading: "Notre méthode de travail en 5 étapes",
          body: "Chaque projet de communication chez Supra v. suit un processus structuré, reproductible et transparent. Vous savez à tout moment où nous en sommes et ce qui est prévu.",
          sub: [
            {
              heading: "01 — Comprendre",
              body: "Avant de produire quoi que ce soit, nous prenons le temps de comprendre votre marché, vos clients, vos concurrents et vos objectifs. Un atelier de cadrage d'une à deux heures suffit généralement pour poser les bonnes bases. Nous en sortons avec un brief validé, un positionnement clair et une liste de priorités.",
            },
            {
              heading: "02 — Structurer",
              body: "Nous traduisons le brief en un plan d'action concret : quels messages, quels canaux, quels formats, dans quel ordre. Cette phase évite de produire des livrables dans tous les sens sans cohérence globale. Vous validez la stratégie avant que nous ne passions en production.",
            },
            {
              heading: "03 — Créer",
              body: "C'est ici qu'on produit : identité visuelle, contenus, code, campagnes. Chaque livrable est soumis à votre validation avec deux rounds de retouches inclus. Notre équipe créative travaille avec des outils professionnels et des process de contrôle qualité stricts.",
            },
            {
              heading: "04 — Déployer",
              body: "Mise en ligne, lancement de campagnes, formation de vos équipes à l'utilisation des outils. Nous assurons que tout est correctement configuré avant de vous laisser prendre les rênes. Un déploiement raté peut effacer des semaines de travail — nous ne laissons rien au hasard.",
            },
            {
              heading: "05 — Optimiser",
              body: "Un mois après le lancement, nous analysons les données, identifions ce qui performe et ce qui peut être amélioré, et nous ajustons. La communication efficace n'est jamais statique : elle s'améliore en continu grâce aux données réelles.",
            },
          ],
        },
        {
          heading: "Communication digitale vs communication traditionnelle à Marrakech",
          body: [
            "La communication traditionnelle (flyers, panneaux d'affichage, annonces presse) reste pertinente dans certains contextes à Marrakech, notamment pour les commerces de proximité ou les événements locaux. Cependant, le digital offre un avantage fondamental : la mesurabilité. Chaque dépense peut être trackée, chaque résultat quantifié, chaque euro justifié.",
            "Chez Supra v., nous concevons des stratégies qui combinent intelligemment les deux approches lorsque c'est pertinent, mais avec une orientation résolument digitale. Nos clients bénéficient d'un tableau de bord mensuel qui montre exactement ce que leur investissement en communication a généré : visites, leads, conversions, chiffre d'affaires attribuable.",
          ],
        },
        {
          heading: "Pourquoi Supra v. plutôt qu'une agence de communication généraliste ?",
          body: [
            "Il existe des dizaines d'agences de communication à Marrakech. La plupart se présentent comme des généralistes capables de tout faire — ce qui signifie souvent qu'elles sous-traitent beaucoup et maîtrisent peu. Supra v. a fait un choix différent : nous ne prenons que les types de projets pour lesquels nous avons une expertise réelle et documentée.",
            "Nous refusons régulièrement des projets qui ne correspondent pas à notre cœur de métier. Parce que vous méritez une agence qui dit non quand elle n'est pas la meilleure option, plutôt qu'une agence qui dit oui à tout et délivre des résultats moyens. Nos références parlent d'elles-mêmes : des clients qui nous font confiance depuis plusieurs années et qui nous recommandent activement.",
            "Notre atelier est ouvert à Marrakech pour des réunions en présentiel. Mais nous travaillons avec des clients à Casablanca, Rabat, Paris et Dubaï. La qualité de notre travail n'est pas géographiquement limitée. Demandez un appel découverte gratuit de 30 minutes pour voir si nous sommes le bon partenaire pour votre projet.",
          ],
        },
      ]}
      faq={[
        {
          q: "Quelle est la différence entre une agence de communication et une agence web à Marrakech ?",
          a: "Une agence de communication couvre l'ensemble de la chaîne : stratégie de marque, identité visuelle, contenus, digital et publicité. Une agence web se concentre sur la technique (développement de sites et d'applications). Supra v. couvre les deux dimensions, ce qui vous permet d'avoir un interlocuteur unique pour tous vos projets de communication et de digital.",
        },
        {
          q: "Pouvez-vous travailler avec des clients hors Marrakech ?",
          a: "Oui. Notre atelier est à Marrakech mais nous accompagnons des clients à Casablanca, Rabat, Paris et à l'international. Les cadrages se font en visioconférence ou en présentiel selon votre préférence. Nous nous déplaçons pour les projets qui le nécessitent (tournages vidéo, lancements, formations).",
        },
        {
          q: "Quel est le délai moyen pour un projet de communication complet ?",
          a: "Un projet de branding (logo + charte) prend 2 à 4 semaines. Un site web est livré en 3 à 6 semaines. Une campagne publicitaire peut être en ligne en 5 jours ouvrés. Un projet de transformation digitale complète (branding + site + SEO + réseaux sociaux) s'étale sur 3 à 6 mois selon la complexité.",
        },
        {
          q: "Sous-traitez-vous une partie de votre production ?",
          a: "Non. L'intégralité de notre production est réalisée en interne par notre équipe : design, développement, création de contenu, gestion des campagnes. C'est un choix délibéré qui garantit la cohérence qualitative de vos livrables et des délais maîtrisés.",
        },
        {
          q: "Comment obtenez-vous un devis pour votre projet ?",
          a: "Contactez-nous via le formulaire de devis gratuit ou directement sur WhatsApp. Nous organisons un appel découverte de 30 minutes pour comprendre votre projet, puis nous vous envoyons une proposition détaillée sous 48 heures. Sans engagement.",
        },
        {
          q: "Proposez-vous des contrats mensuels ou uniquement des projets ponctuels ?",
          a: "Les deux. Nous gérons des projets ponctuels (branding, création de site, campagne) et des missions récurrentes (community management, SEO mensuel, maintenance de site, gestion de campagnes en continu). Les contrats mensuels incluent un bilan mensuel et des recommandations d'optimisation.",
        },
        {
          q: "Avez-vous des références dans le secteur hôtelier à Marrakech ?",
          a: "Oui, l'hôtellerie et la restauration sont l'un de nos secteurs de prédilection à Marrakech. Nous avons accompagné des riads, des hôtels boutique et des restaurants dans la création de leur identité visuelle, de leur site web et de leur stratégie de contenu. Demandez-nous nos références lors de votre premier appel.",
        },
      ]}
      sectionNum="02"
    />
  )
}
