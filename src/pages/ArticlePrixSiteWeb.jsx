import { Link } from 'react-router-dom'
import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Combien coûte un site web à Marrakech ? Les vrais facteurs à comprendre',
  description:
    'Le coût d’un site web à Marrakech dépend du design, du nombre de pages, du contenu, du SEO, des fonctionnalités et du niveau d’accompagnement.',
  datePublished: '2026-04-25',
  author: { '@type': 'Organization', name: 'Supra v3' },
  publisher: { '@type': 'Organization', name: 'Supra v3', url: 'https://suprav3.com' },
  url: 'https://suprav3.com/blog/combien-coute-site-web-marrakech',
  inLanguage: 'fr',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://suprav3.com/blog/combien-coute-site-web-marrakech',
  },
}

export default function ArticlePrixSiteWeb() {
  return (
    <SeoPageTemplate
      seo={{
        title: 'Combien coûte un site web à Marrakech ? Les vrais facteurs à comprendre',
        description:
          'Le coût d’un site web à Marrakech dépend du design, du nombre de pages, du contenu, du SEO, des fonctionnalités et du niveau d’accompagnement. Guide sans grille tarifaire.',
        path: '/blog/combien-coute-site-web-marrakech',
        schema,
        type: 'article',
      }}
      breadcrumb={[
        { label: 'Accueil', path: '/' },
        { label: 'Blog', path: '/blog' },
        { label: 'Budget site web Marrakech' },
      ]}
      title="Combien coûte un site web à Marrakech ? Les vrais facteurs à comprendre"
      subtitle="Article — Budget & décision"
      intro="Il n’existe pas de prix unique pour un site web à Marrakech. Deux projets qui semblent proches au départ peuvent avoir des budgets très différents. Cet article explique les facteurs qui influencent une estimation — sans afficher de montants publics, car chaque mission mérite un cadrage sérieux."
      primaryCta={{ href: '/devis-gratuit', label: 'Demander une estimation personnalisée →' }}
      secondaryCta={{
        href:
          'https://wa.me/33744208673?text=' +
          encodeURIComponent('Bonjour Supra v3, je souhaite parler de mon projet web à Marrakech.'),
        label: 'Parler de mon projet web',
        external: true,
      }}
      services={[
        {
          title: 'Objectif du site',
          desc: 'Vitrine, génération de leads, e-commerce ou outil métier : l’objectif business oriente l’architecture, les pages et les intégrations nécessaires.',
        },
        {
          title: 'Niveau de design',
          desc: 'Template adapté, design semi-sur-mesure ou interface premium entièrement conçue : le temps de conception et le nombre de maquettes changent la charge de travail.',
        },
        {
          title: 'Contenu & SEO',
          desc: 'Textes fournis par vos soins ou rédigés par l’agence, recherche de mots-clés, pages locales, blog : le contenu est souvent sous-estimé dans les devis trop bas.',
        },
        {
          title: 'Fonctionnalités & accompagnement',
          desc: 'Formulaires, CRM, paiement, multilingue, maintenance, formation : chaque brique ajoute de la valeur et du temps de production.',
        },
      ]}
      servicesHeadline={
        <>
          Les facteurs qui <span className="text-accent">font varier le budget.</span>
        </>
      }
      richContent={[
        {
          heading: 'Pourquoi il n’existe pas un prix unique',
          body: [
            'Un site web n’est pas un produit standardisé. C’est un assemblage de stratégie, design, développement, contenu et parfois publicité ou automatisation. Comparer deux devis uniquement sur le chiffre final sans lire le périmètre mène souvent à des mauvaises surprises.',
            'Chez Supra v3, chaque projet est étudié avant proposition afin d’éviter les offres génériques. Le plus simple pour obtenir une estimation fiable reste un diagnostic personnalisé après un court échange sur vos objectifs.',
          ],
        },
        {
          heading: 'Site simple, site premium, e-commerce ou sur-mesure',
          sub: [
            {
              heading: 'Site vitrine professionnel',
              body: 'Présenter votre activité, rassurer, convertir vers un appel ou un formulaire. Le budget dépend du nombre de pages, du niveau de design et de la qualité du contenu.',
            },
            {
              heading: 'Site premium',
              body: 'Direction artistique forte, animations maîtrisées, SEO technique soigné, performances élevées. Utile quand l’image doit soutenir un positionnement haut de gamme à Marrakech.',
            },
            {
              heading: 'E-commerce',
              body: 'Catalogue, tunnel d’achat, paiement, logistique, fiches produit : la complexité augmente vite. L’estimation tient compte du volume de références et des intégrations.',
            },
            {
              heading: 'Projet sur-mesure',
              body: 'Plateforme, espace client, réservation, outil interne : on valide souvent un MVP avant d’étendre les fonctionnalités pour maîtriser le risque et la trésorerie.',
            },
          ],
        },
        {
          heading: 'Pourquoi éviter de choisir uniquement selon le prix',
          body: [
            'Un devis très bas cache parfois l’absence de SEO, de contenu rédigé, de tests mobile ou de suivi après mise en ligne. Le coût réel d’un site qui ne génère aucune demande dépasse vite celui d’un site bien construit.',
            'Deux sites web peuvent avoir des budgets très différents, même s’ils semblent similaires au départ. La différence se joue sur la profondeur du cadrage, la qualité du design et ce qui est inclus après la livraison.',
          ],
        },
        {
          heading: 'Comment préparer votre budget avant de contacter une agence',
          bullets: [
            'Clarifier l’objectif principal : visibilité, leads, ventes en ligne, crédibilité.',
            'Lister les pages indispensables et les langues souhaitées.',
            'Préciser si vous fournissez textes et visuels ou si l’agence les produit.',
            'Indiquer les intégrations (WhatsApp, CRM, réservation, paiement).',
            'Définir un délai réaliste et le niveau d’accompagnement post-lancement.',
          ],
        },
        {
          heading: 'Pourquoi Supra v3 propose une estimation personnalisée',
          body: [
            <>Nous ne publions pas de grille tarifaire : le budget dépend du niveau d&apos;exigence, des objectifs business, du design, du contenu, des fonctionnalités et de l&apos;accompagnement souhaité. Après cadrage, nous remettons une proposition structurée avec périmètre, planning et prochaines étapes. Découvrez notre approche sur la page <Link to="/creation-site-web-marrakech">création de site web à Marrakech</Link>.</>,
          ],
        },
      ]}
      faq={[
        {
          q: 'Pourquoi les devis varient-ils autant entre prestataires ?',
          a: 'Parce que le périmètre n’est pas le même : design, contenu, SEO, maintenance, nombre de retouches et technologies utilisées diffèrent. Comparez toujours ce qui est inclus, pas seulement le total.',
        },
        {
          q: 'Y a-t-il des coûts récurrents après la mise en ligne ?',
          a: 'Oui — hébergement, nom de domaine et éventuellement maintenance ou évolutions. Nous détaillons ces postes dans la proposition pour éviter les angles morts.',
        },
        {
          q: 'Comment obtenir une estimation chez Supra v3 ?',
          a: 'Via le formulaire de diagnostic ou WhatsApp. Nous posons quelques questions sur votre activité, vos objectifs et votre calendrier, puis nous revenons avec une proposition adaptée.',
        },
      ]}
      internalLinks={[
        { label: 'Création site web Marrakech', path: '/creation-site-web-marrakech', desc: 'Notre méthode et types de sites.' },
        { label: 'Contact', path: '/contact', desc: 'Parler de votre projet.' },
        { label: 'Marketing digital', path: '/marketing-digital-marrakech', desc: 'Visibilité après le lancement.' },
      ]}
    />
  )
}
