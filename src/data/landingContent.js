/**
 * Contenu de la landing page /votre-projet — source unique.
 * Les textes viennent du brief ; les projets, des données existantes
 * (websiteProjects.js, videoProjects.js). Aucun chiffre, aucun témoignage inventé.
 */
import { WEBSITE_PROJECTS } from './websiteProjects.js'
import { VIDEO_PROJECTS } from './videoProjects.js'
import { partnerImage } from './partnerAssets.js'
import { websiteDisplayDomain } from '../utils/websiteDisplay.js'

export const LANDING_PATH = '/votre-projet'
export const FORM_ANCHOR = 'parler-de-votre-projet'
export const WORK_ANCHOR = 'projets'
export const PRIMARY_CTA = 'Parler de mon projet'
export const SECONDARY_CTA = 'Voir nos projets'

export const LANDING_SEO = {
  title: 'We build brands — vidéo, digital et acquisition',
  description:
    'Supra v3 transforme l’attention en image, en visibilité, en demandes qualifiées et en croissance : vidéos qui convertissent, expériences digitales, achat média et CRM.',
}

/* ── Projets : une seule liste, filtrable, facile à compléter ─────────────── */

function siteProject(slug, services) {
  const project = WEBSITE_PROJECTS.find((entry) => entry.slug === slug)
  if (!project) throw new Error(`Missing website project: ${slug}`)
  return {
    id: `site-${slug}`,
    kind: 'site',
    category: 'websites',
    name: project.name,
    services,
    image: project.poster,
    href: project.publicUrl,
    domain: websiteDisplayDomain(project),
  }
}

function videoProject(slug, name, category, services) {
  const video = VIDEO_PROJECTS.find((entry) => entry.slug === slug)
  if (!video) throw new Error(`Missing video project: ${slug}`)
  return { id: `video-${slug}`, kind: 'video', category, name, services, image: video.poster, video }
}

/**
 * Pour ajouter un projet : une ligne ici (ou un objet avec `category` parmi
 * branding | websites | contenu | publicite | digital). Un filtre n’apparaît
 * que si au moins un projet porte sa catégorie.
 */
const PROJECTS = [
  siteProject('emara-estates', 'Site web · Immobilier premium'),
  videoProject('africa-beauty-ad', 'Africa Beauty', 'publicite', 'Vidéo publicitaire · Beauté'),
  videoProject('legacy-film-immobilier', 'Ghiz Properties', 'contenu', 'Film de marque · Immobilier'),
  videoProject('legacy-social-media', 'Gatsby Barber', 'contenu', 'Contenu social media'),
  videoProject('sbr-beauty-ad', 'SBR Beauty', 'publicite', 'Vidéo publicitaire · Beauté'),
  siteProject('hachkar', 'Site e-commerce · Mode'),
  siteProject('africa-beauty', 'Site vitrine · Beauté'),
  videoProject('home-tour-bm', 'BM Conciergerie', 'contenu', 'Home tour · Immobilier'),
  videoProject('legacy-hospitality', 'Cassi', 'contenu', 'Contenu social media · Hospitality'),
  videoProject('yasmine-ads', 'Supra v3', 'publicite', 'Vidéo publicitaire · Agence'),
  siteProject('verde-paris', 'Site vitrine · Restaurant'),
  siteProject('by-merrachi', 'Site e-commerce · Mode artisanale'),
  siteProject('gatsby-barber', 'Site vitrine · Barbershop'),
]

const projectById = (id) => PROJECTS.find((project) => project.id === id)

/* ── Structure actuelle de la page : ouverture, actions, système, formulaire ──
   SHOWREEL et BUILD ne sont plus affichés (LandingShowreel et LandingBuild retirés de la page)
   mais restent disponibles. */

export const OPENING = {
  eyebrow: 'Visuel • Visibilité • Vision',
  /* Deux lignes, une seule affirmation : « Dans votre » et « soyez » sont grisés, « secteur, »
     est en noir et le mot fort est souligné à la main. Chaque ligne est donnée en deux rangées : sur petit
     écran elles s’empilent à l’identique, quelle que soit la police déjà chargée. */
  title: [['Dans votre', 'secteur,'], ['soyez']],
  highlight: 'leader.',
  lead: 'Nous transformons l’attention en image, en visibilité, en demandes qualifiées et en croissance.',
  note: 'nos vraies réalisations',
}

/* Vidéos réelles uniquement (videoProjects.js) : nom du client, type et secteur. Aucun résultat chiffré. */
export const SHOWREEL = {
  label: 'Selected work',
  title: ['Des vidéos qui arrêtent le regard.', 'Et qui donnent envie d’agir.'],
  hint: {
    pointer: 'Survolez pour un aperçu, cliquez pour lancer la vidéo.',
    touch: 'Touchez une vidéo pour la lancer.',
  },
  play: 'Lire la vidéo',
  playShort: 'Lire',
  scroll: 'Faites défiler',
  projects: [
    'video-africa-beauty-ad',
    'video-legacy-film-immobilier',
    'video-home-tour-bm',
    'video-legacy-social-media',
  ].map(projectById),
}

export const ACTIONS = {
  primary: 'Parler de votre projet',
  secondary: { label: 'Voir tous nos projets', href: '/realisations' },
  note: 'On commence par votre vrai problème',
}

/* Régies publicitaires affichées en pastilles sur le bandeau vidéo (logo par `id` dans LandingAdBadges). */
export const AD_PLATFORMS = [
  { id: 'meta', label: 'Meta Ads' },
  { id: 'chatgpt', label: 'ChatGPT Ads' },
  { id: 'tiktok', label: 'TikTok Ads' },
  { id: 'google', label: 'Google Ads' },
]

/* Trois chantiers, pas un catalogue. `goal` = service pré-coché dans le formulaire (étape 1). */
export const BUILD = {
  title: ['Nous construisons tout ce qui', 'transforme l’attention'],
  highlight: 'en clients.',
  link: 'En parler',
  chapters: [
    {
      id: 'content',
      num: '01',
      kicker: 'Contenu',
      title: 'Des vidéos qui convertissent.',
      text: 'Des contenus conçus pour capter l’attention, clarifier une offre et donner envie de passer à l’action.',
      items: [
        'Vidéos commerciales',
        'Contenus social media',
        'Créations de campagne',
        'Storytelling visuel',
        'Formats vidéo performants',
      ],
      goal: 'contenu',
    },
    {
      id: 'digital',
      num: '02',
      kicker: 'Expériences digitales',
      title: 'Des expériences digitales performantes.',
      text: 'Des sites, landing pages, systèmes et applications qui rendent une marque plus simple à comprendre, à croire et à contacter.',
      items: [
        'Sites web rapides',
        'Landing pages de conversion',
        'Applications web',
        'Applications mobiles',
        'Fondations SEO',
        'Formulaires et parcours de conversion',
      ],
      goal: 'strategie',
    },
    {
      id: 'growth',
      num: '03',
      kicker: 'Systèmes de croissance',
      title: 'Un système qui génère et organise la demande.',
      text: 'Achat média, génération de leads et CRM : de quoi créer plus d’opportunités qualifiées et convertir davantage de clients.',
      items: [
        'Achat média Meta et Google',
        'Génération de leads',
        'Tracking et analytics',
        'Mise en place du CRM',
        'Workflows WhatsApp',
        'Qualification des leads',
        'Relances automatisées',
        'Reporting commercial',
        'IA et automatisation métier',
      ],
      goal: 'strategie',
    },
  ],
}

export const SYSTEM = {
  eyebrow: 'Le système complet',
  title: ['Du premier regard au client :', 'un seul système.'],
  text: [
    'Supra V3 ne crée pas seulement du contenu.',
    'Nous relions la marque, l’expérience digitale, l’acquisition et le suivi commercial en un seul système de croissance.',
  ],
  /* Quatre services, un bloc carré chacun ; `icon` choisit l’icône 3D (SystemIcons). */
  services: [
    {
      id: 'video',
      icon: 'video',
      label: 'Vidéo & marque',
      text: 'L’image qui arrête le regard et donne envie de vous choisir.',
    },
    {
      id: 'site',
      icon: 'site',
      label: 'Site & expérience digitale',
      text: 'L’endroit où l’intérêt devient une intention.',
    },
    {
      id: 'ads',
      icon: 'ads',
      label: 'Acquisition & leads',
      text: 'Les bonnes personnes, au bon moment : des demandes, pas seulement des vues.',
    },
    {
      id: 'crm',
      icon: 'crm',
      label: 'CRM & suivi commercial',
      text: 'Chaque demande est qualifiée, relancée et suivie jusqu’au client.',
    },
  ],
}

/*
 * Graphique de croissance commerciale (LandingGrowth). AUCUNE donnée client réelle : les séries
 * sont un indice relatif illustratif (base 100 = situation de départ), à ajuster ici si des
 * résultats vérifiés existent un jour. La mention `disclaimer` reste visible dans tous les cas.
 */
export const GROWTH = {
  eyebrow: 'Ce que ça change',
  title: ['Plus de demandes.', 'Plus de clients.'],
  lead: 'Avec Supra V3, l’acquisition, la qualification et le suivi commercial avancent ensemble.',
  message: [
    'Supra V3 ne génère pas seulement de la visibilité.',
    'Supra V3 construit un système qui aide à transformer l’attention en leads qualifiés et en ventes.',
  ],
  note: 'l’attention devient des clients',
  chartTitle: 'Progression commerciale',
  /* Mention unique, discrète, sous la carte : l’indice n’est jamais un résultat client. */
  disclaimer: 'Simulation illustrative — indice relatif, base 100 au départ.',
  periodLabel: 'Mois',
  periods: ['1', '2', '3', '4', '5', '6'],
  series: [
    {
      id: 'baseline',
      label: 'Sans système optimisé',
      short: 'Sans système',
      values: [100, 104, 101, 108, 106, 110],
    },
    {
      id: 'supra',
      label: 'Avec Supra V3',
      short: 'Avec Supra V3',
      values: [100, 122, 148, 182, 221, 265],
    },
  ],
  stagesLabel: 'Le parcours commercial',
  stages: ['Leads', 'Qualifiés', 'Opportunités', 'Ventes'],
  metricsLabel: 'Indices comparés en fin de période',
  metrics: [
    { id: 'qualified', label: 'Leads qualifiés', baseline: 100, supra: 240 },
    { id: 'conversion', label: 'Conversion', baseline: 100, supra: 180 },
    { id: 'sales', label: 'Ventes', baseline: 100, supra: 165 },
  ],
}

/* ── Sections de la version précédente — plus affichées, conservées telles quelles ── */

export const HERO = {
  eyebrow: 'Pour les entreprises qui veulent passer un cap',
  title: 'Votre entreprise mérite mieux qu’une présence en ligne.',
  highlight: 'Elle mérite une marque qui attire.',
  lead:
    'Nous construisons des marques, des contenus et des expériences digitales qui donnent envie de vous choisir — et qui transforment l’attention en clients.',
  cta: 'Parler de votre projet',
  trust: ['Branding', 'Web', 'Contenu', 'Publicité', 'IA'],
  note: 'On commence par votre vrai problème',
  /* Composition du hero : uniquement des réalisations existantes. */
  visuals: {
    site: projectById('site-emara-estates'),
    siteAlt: projectById('site-hachkar'),
    reels: [projectById('video-africa-beauty-ad'), projectById('video-legacy-film-immobilier')],
  },
}

export const PROBLEM = {
  title: ['Votre travail est bon.', 'Le problème, c’est que trop peu de personnes le savent.'],
  text: ['Vous avez peut-être le meilleur produit.', 'Le meilleur service.', 'Une vraie expertise.'],
  conclusion: 'Mais si votre image ne le montre pas, vos clients ne le verront jamais.',
  cards: [
    {
      quote: '« On a déjà un Instagram. »',
      text: 'Mais vos contenus ne reflètent pas réellement la qualité de votre entreprise.',
    },
    {
      quote: '« Notre site est en ligne. »',
      text: 'Mais il ne transforme pas assez vos visiteurs en prospects.',
    },
    {
      quote: '« On fait déjà de la publicité. »',
      text: 'Mais vous ne savez pas toujours ce qui fonctionne réellement.',
    },
  ],
}

export const IDEA = {
  title: 'Ce qui fait venir des clients, ce n’est pas juste une belle image.',
  highlight: 'C’est tout ce qui se passe derrière.',
  text: 'Le message. La stratégie. L’image. Le contenu. Le parcours. La publicité. La technologie.',
  conclusion: 'Tout doit fonctionner ensemble.',
  listTitle: 'Ce que vous obtenez avec Supra',
  list: [
    'Une marque claire et reconnaissable',
    'Un contenu qui donne envie de vous découvrir',
    'Un site qui transforme les visiteurs en prospects',
    'Des campagnes pensées pour générer des résultats',
    'Des outils qui automatisent ce qui peut l’être',
    'Une stratégie construite autour de vos objectifs',
  ],
  block: {
    title: 'Pas de contenu pour faire du contenu.',
    text: 'Chaque élément que nous créons doit avoir une fonction.',
  },
}

export const PROCESS = {
  title: 'Un échange. Une stratégie. Puis on construit.',
  steps: [
    {
      num: '01',
      title: 'On vous écoute',
      text: 'Vous nous expliquez où vous êtes, où vous voulez aller et ce qui vous bloque.',
    },
    {
      num: '02',
      title: 'On identifie les priorités',
      text: 'Nous analysons votre marque, votre marché et vos opportunités.',
    },
    {
      num: '03',
      title: 'On construit',
      text: 'Branding, site, contenu, publicité, automatisation… nous créons ce dont votre entreprise a réellement besoin.',
    },
    {
      num: '04',
      title: 'On lance',
      text: 'Votre nouvelle présence digitale est mise en ligne et prête à performer.',
    },
  ],
}

export const WORK = {
  title: ['Ne nous croyez pas sur parole.', 'Regardez notre travail.'],
  text: [
    'Des marques. Des sites. Des campagnes. Du contenu.',
    'Voici ce que nous construisons lorsque des entreprises nous confient leur image.',
  ],
  filters: [
    { id: 'all', label: 'Tout' },
    { id: 'branding', label: 'Branding' },
    { id: 'websites', label: 'Websites' },
    { id: 'contenu', label: 'Contenu' },
    { id: 'publicite', label: 'Publicité' },
    { id: 'digital', label: 'Digital' },
  ].filter((filter) => filter.id === 'all' || PROJECTS.some((project) => project.category === filter.id)),
  projectCta: 'Voir le projet',
  more: 'Voir plus de projets',
  all: { label: SECONDARY_CTA, href: '/realisations' },
  projects: PROJECTS,
}

export const SERVICES = {
  title: 'Une seule équipe pour transformer votre vision en réalité.',
  link: 'En parler',
  blocks: [
    {
      id: 'branding',
      num: '01',
      title: 'Stratégie & Branding',
      text: 'Positionnement, identité, direction artistique et stratégie de marque.',
      goal: 'branding',
    },
    {
      id: 'web',
      num: '02',
      title: 'Web & Digital',
      text: 'Sites vitrines, e-commerce, plateformes et expériences digitales pensées pour convertir.',
      goal: 'strategie',
    },
    {
      id: 'content',
      num: '03',
      title: 'Contenu & Publicité',
      text: 'Photo, vidéo, social media, Meta Ads, TikTok, Snapchat et acquisition.',
      goal: 'contenu',
    },
    {
      id: 'ai',
      num: '04',
      title: 'IA & Automatisation',
      text: 'Agents IA, automatisations et outils sur-mesure pour faire gagner du temps à votre entreprise.',
      goal: 'strategie',
    },
  ],
}

export const WHY = {
  title: 'Pas une agence qui exécute vos demandes.',
  highlight: 'Une équipe qui réfléchit avec vous.',
  text: [
    'Nous ne voulons pas simplement produire ce que vous demandez.',
    'Nous voulons comprendre pourquoi vous le faites, identifier ce qui peut être amélioré et construire la meilleure solution pour votre business.',
  ],
  pillars: [
    { title: 'Stratégie', text: 'On réfléchit avant de produire.' },
    { title: 'Créativité', text: 'On crée des choses qui méritent d’être remarquées.' },
    { title: 'Performance', text: 'On mesure ce qui compte.' },
  ],
}

export const AUDIENCE = {
  title: 'Nous travaillons avec des entreprises ambitieuses.',
  items: [
    { title: 'Immobilier', text: 'Promoteurs, agences et marchands de biens.' },
    { title: 'Hospitality', text: 'Hôtels, riads, restaurants et expériences touristiques.' },
    { title: 'PME & Startups', text: 'Des entreprises prêtes à passer au niveau supérieur.' },
    { title: 'Fondateurs & Experts', text: 'Des personnes qui veulent construire une marque autour de leur nom.' },
  ],
}

export const CLIENTS = {
  title: 'Ils nous ont confié leur image.',
  /* Logos déjà affichés sur la page d’accueil (public/media/partners). */
  logos: Array.from({ length: 13 }, (_, index) => partnerImage(index + 1)),
  /* Noms issus des projets ci-dessus — rien d’autre. */
  names: [...new Set(PROJECTS.map((project) => project.name).filter((name) => name !== 'Supra v3'))],
  /* Vide tant qu’aucun témoignage réel n’est fourni : { quote, name, company }. */
  testimonials: [],
}

export const LANDING_FAQ = {
  title: 'Les questions qu’on nous pose avant de commencer.',
  items: [
    {
      q: 'Combien coûte un projet avec Supra ?',
      a: 'Chaque projet est différent. Nous adaptons notre accompagnement à vos objectifs, vos besoins et votre niveau de développement.',
    },
    {
      q: 'Travaillez-vous uniquement à Marrakech ?',
      a: 'Non. Nous sommes basés à Marrakech et travaillons avec des entreprises au Maroc et à l’international.',
    },
    {
      q: 'Est-ce que vous pouvez gérer un projet de A à Z ?',
      a: 'Oui. De la stratégie à la création, jusqu’au lancement et à l’optimisation.',
    },
    {
      q: 'Vous faites uniquement du marketing ?',
      a: 'Non. Nous intervenons également sur le branding, le web, la création de contenu, les applications, les SaaS et l’automatisation IA.',
    },
    {
      q: 'Comment commencer ?',
      a: 'Un premier échange nous permet de comprendre votre projet et de déterminer si nous sommes la bonne équipe pour vous.',
    },
  ],
}

export const FINAL_CTA = {
  title: ['Qu’est-ce que vous voulez', 'faire avancer ?'],
  text: 'Parlons de votre entreprise, de vos objectifs et de ce qui vous empêche aujourd’hui de passer au niveau supérieur.',
  small: '30 minutes. Aucun engagement.',
}

export const FINDER = {
  title: 'On commence par votre situation.',
  microcopy:
    'Pas de formulaire interminable. Juste les informations nécessaires pour comprendre votre besoin.',
  submit: PRIMARY_CTA,
  steps: [
    {
      id: 'service',
      label: 'Service',
      question: 'Quel service vous intéresse ?',
      hint: 'Plusieurs réponses possibles',
      multiple: true,
      options: [
        { id: 'strategie', label: 'Stratégie marketing complète' },
        { id: 'contenu', label: 'Création de contenu' },
        { id: 'branding', label: 'Branding' },
      ],
    },
    {
      id: 'objective',
      label: 'Objectif',
      question: 'Quel est votre objectif principal ?',
      options: [
        { id: 'visibilite', label: 'Augmenter ma visibilité' },
        { id: 'leads', label: 'Générer plus de leads qualifiés' },
        { id: 'dubai', label: 'Développer ma présence' },
      ],
    },
    {
      id: 'contact',
      label: 'Contact',
      question: 'Comment pouvons-nous vous contacter ?',
    },
  ],
}

/*
 * Pied de page de campagne (trafic Meta Ads, surtout mobile) : dernière occasion de convertir,
 * aucun menu vers le reste du site. Deux canaux directs, un rappel du formulaire, les
 * réassurances déjà promises plus haut et les mentions obligatoires.
 */
export const FOOTER = {
  eyebrow: 'Avant de partir',
  title: 'Une question avant de vous lancer ?',
  text: 'Écrivez-nous sur WhatsApp ou appelez-nous. Un vrai échange, une réponse rapide, aucun engagement.',
  whatsapp: {
    label: 'Écrire sur WhatsApp',
    message: 'Bonjour Supra v3, j’ai vu votre publicité et je souhaite parler de mon projet.',
  },
  call: 'Appeler',
  form: 'Ou décrire mon projet en 2 minutes',
  assurances: ['Réponse rapide', 'Sans engagement', 'Marrakech · Maroc & international'],
  privacy: 'Vos informations servent uniquement à vous recontacter. Elles ne sont ni partagées ni revendues.',
  legal: { label: 'Mentions légales', href: '/mentions-legales' },
  copyright: 'Supra v3 — Agence de communication 360°',
}

/* Pas de FAQPage ici : index.html en déclare déjà un pour tout le site. */
export const LANDING_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: LANDING_SEO.title,
  url: `https://www.suprav3.com${LANDING_PATH}`,
  description: LANDING_SEO.description,
  inLanguage: 'fr',
  publisher: {
    '@type': 'Organization',
    name: 'Supra v3',
    url: 'https://www.suprav3.com',
  },
}
