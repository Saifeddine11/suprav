import { Link } from 'react-router-dom'
import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const WHATSAPP =
  'https://wa.me/33744208673?text=' +
  encodeURIComponent(
    'Bonjour Supra v3, je cherche une agence de communication à Marrakech pour mon projet.'
  )

const seo = {
  title: 'Agence de communication à Marrakech | Agence digitale Marrakech | Supra v3',
  description:
    'Supra v3, agence de communication et agence digitale à Marrakech : branding, sites web, SEO, publicité, contenus et IA. Stratégie locale, production interne, diagnostic personnalisé.',
  path: '/agence-communication-marrakech',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Supra v3 — Agence de communication Marrakech',
    alternateName: 'Agence digitale Marrakech',
    url: 'https://suprav3.com/agence-communication-marrakech',
    description:
      'Agence de communication et agence digitale à Marrakech : branding, création de sites web, marketing digital, SEO local et automatisation IA.',
    areaServed: { '@type': 'City', name: 'Marrakech' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Marrakech',
      addressRegion: 'Marrakech-Safi',
      addressCountry: 'MA',
    },
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
      subtitle="Agence digitale Marrakech — stratégie, création & acquisition"
      intro="Supra v3 est une agence de communication implantée à Marrakech pour les marques qui veulent une image claire, une présence digitale crédible et des demandes qualifiées — sans sous-traitance dispersée. Cette page présente notre façon de travailler sur le marché local : ce que nous faisons, pour qui, et comment démarrer avec un diagnostic adapté à votre situation."
      primaryCta={{ href: '/devis-gratuit', label: 'Demander un diagnostic →' }}
      secondaryCta={{ href: WHATSAPP, label: 'Parler sur WhatsApp', external: true }}
      stats={[
        { value: '360°', label: 'Communication & digital' },
        { value: 'Guéliz', label: 'Atelier à Marrakech' },
        { value: '100 %', label: 'Production en interne' },
      ]}
      servicesHeadline={
        <>
          Les services de notre <span className="text-accent">agence digitale.</span>
        </>
      }
      services={[
        {
          title: 'Branding & identité de marque',
          desc: (
            <>
              Positionnement, logo, charte et direction artistique pour une marque lisible sur tous vos
              supports.{' '}
              <Link to="/branding-marrakech">Voir le branding à Marrakech →</Link>
            </>
          ),
        },
        {
          title: 'Création de site web',
          desc: (
            <>
              Sites vitrines, e-commerce et pages de conversion rapides, pensés pour le mobile et le SEO
              local.{' '}
              <Link to="/creation-site-web-marrakech">Création site web Marrakech →</Link>
            </>
          ),
        },
        {
          title: 'Marketing digital & publicité',
          desc: (
            <>
              Stratégie d&apos;acquisition, Meta Ads, contenus et tunnels mesurés pour transformer la
              visibilité en contacts.{' '}
              <Link to="/marketing-digital-marrakech">Marketing digital Marrakech →</Link>
            </>
          ),
        },
        {
          title: 'Référencement SEO',
          desc: (
            <>
              SEO technique, contenus et visibilité Google pour capter les recherches liées à votre
              activité à Marrakech.{' '}
              <Link to="/referencement-seo-marrakech">Référencement SEO Marrakech →</Link>
            </>
          ),
        },
        {
          title: 'Contenus photo & vidéo',
          desc: 'Films de marque, Reels, shootings et direction artistique pour des supports qui rassurent avant le premier appel.',
        },
        {
          title: 'Réseaux sociaux & community',
          desc: 'Ligne éditoriale, calendrier et publications régulières pour une présence cohérente sur Instagram, TikTok ou LinkedIn.',
        },
        {
          title: 'Automatisation & agents IA',
          desc: 'Chatbots, workflows et outils internes pour répondre plus vite aux prospects et soulager vos équipes.',
        },
        {
          title: 'Accompagnement sectoriel',
          desc: (
            <>
              Restauration, immobilier, hôtellerie, retail : des équipes qui connaissent les enjeux du
              marché marrakchi.{' '}
              <Link to="/agence-communication-restaurant-marrakech">Communication restaurant →</Link>
              {' · '}
              <Link to="/agence-communication-immobilier-marrakech">Communication immobilier →</Link>
            </>
          ),
        },
      ]}
      richContent={[
        {
          heading: 'Pourquoi une communication professionnelle est essentielle à Marrakech',
          body: [
            'Marrakech concentre tourisme, immobilier, restauration, artisanat et services B2B dans un même écosystème très visible. Vos clients comparent plusieurs marques en ligne avant de vous appeler, réserver ou visiter — souvent via Google, Instagram ou une recommandation suivie d\'une vérification digitale.',
            'Une communication professionnelle ne consiste pas à « publier plus ». Elle aligne message, design, site, contenus et canaux d\'acquisition pour que chaque point de contact raconte la même histoire. C\'est ce qui différencie une marque mémorable d\'une présence dispersée qui ne convertit pas.',
            'En tant qu\'agence digitale à Marrakech, Supra v3 relie la stratégie de marque et l\'exécution technique : pas de beau PDF sans site, pas de site sans SEO de base, pas de campagne sans landing page claire. L\'objectif reste concret : plus de clarté, plus de crédibilité, plus de demandes utiles.',
          ],
        },
        {
          heading: 'Les problèmes que nous voyons chez les entreprises locales',
          bullets: [
            'Une image visuelle incohérente entre site, réseaux sociaux et supports print',
            'Un site lent ou daté qui fait fuir les visiteurs sur mobile',
            'Une invisibilité sur Google et Google Maps malgré une bonne offre terrain',
            'Des publications irrégulières ou sans ligne éditoriale claire',
            'Des campagnes publicitaires lancées sans page de destination ni suivi des conversions',
            'Des équipes débordées qui n\'ont pas le temps de structurer la communication',
            'Des prestataires multiples (logo ici, site ailleurs, ads ailleurs) sans fil conducteur',
          ],
        },
        {
          heading: 'Notre méthode de travail',
          body: 'Chaque mission suit un processus transparent. Vous savez où nous en sommes et ce qui est livré à chaque étape.',
          sub: [
            {
              heading: '01 — Comprendre votre marché à Marrakech',
              body: 'Atelier de cadrage : clients cibles, concurrence locale, objectifs (visibilité, leads, ventes, notoriété). Nous validons le brief avant toute production.',
            },
            {
              heading: '02 — Structurer le plan de communication',
              body: 'Messages clés, priorités par canal, planning et livrables. La stratégie est validée avant le design ou le code.',
            },
            {
              heading: '03 — Créer les supports',
              body: 'Identité, contenus, site, campagnes — avec des validations intermédiaires et deux rounds de retouches inclus sur les volets créatifs.',
            },
            {
              heading: '04 — Déployer et configurer',
              body: 'Mise en ligne, tracking, fiches Google Business, lancement des campagnes et formation courte si nécessaire.',
            },
            {
              heading: '05 — Optimiser avec les données',
              body: 'Analyse des performances un mois après le lancement : trafic, leads, contenus qui engagent. Nous ajustons ce qui doit l\'être.',
            },
          ],
        },
        {
          heading: 'Secteurs que nous accompagnons à Marrakech',
          body: [
            'Nous adaptons le ton, les formats et les leviers selon votre secteur — pas de recette unique copiée d\'un client à l\'autre.',
          ],
          bullets: [
            'Hôtellerie & riads : image premium, réservation directe, contenus pour voyageurs internationaux',
            'Immobilier & promotion : lancements, programmes, supports de commercialisation digitale',
            'Restauration : visuels, Google Business, réseaux sociaux et réservations',
            'Retail & e-commerce : catalogue, tunnel d\'achat, campagnes de lancement',
            'PME & start-ups : structuration de marque et premier socle digital',
            'Experts & dirigeants : personal branding et site d\'autorité',
          ],
        },
        {
          heading: 'Pourquoi choisir Supra v3 comme agence de communication à Marrakech',
          body: [
            'Nous ne promettons pas de tout faire pour tout le monde. Nous prenons les projets où notre équipe interne peut produire un résultat mesurable — branding, web, contenus, SEO, ads et IA — sous un même toit.',
            'Vous avez un interlocuteur unique qui comprend à la fois la direction créative et les contraintes techniques. Cela réduit les allers-retours, les délais et les incohérences entre prestataires.',
            'Nous connaissons le rythme du marché local : saison touristique, Ramadan, événements, attentes des clients marocains et internationaux. Nos recommandations tiennent compte de ce calendrier, pas d\'un modèle importé tel quel.',
            'Chaque projet démarre par un diagnostic : périmètre, priorités, planning et proposition adaptée. Pas de grille tarifaire affichée en ligne — une estimation personnalisée après cadrage.',
          ],
        },
      ]}
      faq={[
        {
          q: 'Quelle différence entre agence de communication, agence digitale et agence web à Marrakech ?',
          a: 'Une agence de communication couvre la stratégie, l\'image et les contenus sur plusieurs canaux. Une agence digitale met l\'accent sur le web, l\'acquisition et la mesure. Une agence web se concentre sur le développement. Supra v3 réunit ces compétences en interne pour éviter de multiplier les interlocuteurs.',
        },
        {
          q: 'Travaillez-vous uniquement avec des entreprises basées à Marrakech ?',
          a: 'Notre atelier est à Marrakech (Guéliz), mais nous accompagnons aussi des clients à Casablanca, Rabat et à l\'international. Les cadrages se font en visio ou en présentiel ; les tournages et ateliers créatifs se organisent sur place quand le projet l\'exige.',
        },
        {
          q: 'Peut-on commencer par un seul service (site, branding ou SEO) ?',
          a: 'Oui. Beaucoup de clients démarrent par un levier prioritaire — souvent le site ou la refonte d\'image — puis étendent vers le SEO, les réseaux ou la publicité une fois la base solide.',
        },
        {
          q: 'Comment se passe le premier échange ?',
          a: 'Un diagnostic d\'environ 30 minutes pour comprendre votre situation, vos objectifs et votre calendrier. Ensuite nous revenons avec une proposition structurée : périmètre, étapes et prochaines actions — sans engagement.',
        },
        {
          q: 'Sous-traitez-vous la production ?',
          a: 'Non. Design, développement, contenus et gestion des campagnes sont réalisés par notre équipe. Cela garantit la cohérence entre votre site, vos visuels et vos messages.',
        },
        {
          q: 'Proposez-vous un suivi mensuel après un projet ?',
          a: 'Oui : SEO, community management, maintenance de site, optimisation des campagnes. Le format (ponctuel ou récurrent) est défini selon vos objectifs au cadrage.',
        },
        {
          q: 'Comment obtenir une estimation pour mon projet ?',
          a: 'Via le formulaire de diagnostic ou WhatsApp. Nous précisons vos besoins puis remettons une proposition adaptée — jamais de montants publics sur le site.',
        },
      ]}
      internalLinks={[
        {
          label: 'Création site web Marrakech',
          path: '/creation-site-web-marrakech',
          desc: 'Sites vitrines, e-commerce et landing pages.',
        },
        {
          label: 'Branding Marrakech',
          path: '/branding-marrakech',
          desc: 'Identité, logo et charte graphique.',
        },
        {
          label: 'Marketing digital',
          path: '/marketing-digital-marrakech',
          desc: 'Acquisition, ads et stratégie digitale.',
        },
        {
          label: 'Référencement SEO',
          path: '/referencement-seo-marrakech',
          desc: 'Visibilité Google à Marrakech.',
        },
        {
          label: 'Communication restaurant',
          path: '/agence-communication-restaurant-marrakech',
          desc: 'Restauration & visibilité locale.',
        },
        {
          label: 'Communication immobilier',
          path: '/agence-communication-immobilier-marrakech',
          desc: 'Promotion et lancements immobiliers.',
        },
        {
          label: 'Contact',
          path: '/contact',
          desc: 'Parler de votre projet avec l\'équipe.',
        },
      ]}
      sectionNum="02"
    />
  )
}
