const WEBP = '/media/website/images/optimized'

/** Texte alt des captures site (homepage, réalisations). */
export function websitePosterAlt(name) {
  return `Screenshot du site ${name} réalisé par Supra v3`
}

/** Sites web affichés sur /realisations/websites */
export const WEBSITE_PROJECTS = [
  {
    slug: 'emara-estates',
    name: 'Emara Estates',
    sector: 'Immobilier premium · Marrakech',
    description:
      'Site immobilier premium conçu pour présenter des biens haut de gamme, renforcer la crédibilité de la marque et générer des demandes qualifiées.',
    tag: 'Immobilier',
    video: null,
    poster: `${WEBP}/emara-estates.webp`,
    publicUrl: 'https://emaraestates.com/',
  },
  {
    slug: 'hachkar',
    name: 'Hachkar',
    sector: 'Mode · E-commerce',
    description:
      'Site e-commerce mode développé pour valoriser l’univers de marque, présenter les collections et faciliter l’achat en ligne.',
    tag: 'E-commerce',
    video: null,
    poster: `${WEBP}/hachkar.webp`,
    publicUrl: 'https://hachkar.com/',
  },
  {
    slug: 'by-merrachi',
    name: 'By Merrachi',
    sector: 'Mode artisanale · E-commerce',
    description:
      'Boutique en ligne artisanale pensée pour mettre en avant les pièces, raconter l’identité de la marque et structurer l’expérience d’achat.',
    tag: 'E-commerce',
    video: null,
    poster: `${WEBP}/by-merrachi.webp`,
    publicUrl: 'https://bymerrachi.com/',
  },
  {
    slug: 'africa-beauty',
    name: 'Africa Beauty',
    sector: 'Beauté · Marrakech',
    description:
      'Site vitrine pour salon de beauté à Marrakech, conçu pour présenter les services, renforcer la visibilité locale et faciliter la prise de contact.',
    tag: 'Beauté',
    video: null,
    poster: `${WEBP}/africa-beauty.webp`,
    publicUrl: 'https://salonafricabeauty.com/',
  },
  {
    slug: 'gatsby-barber',
    name: 'Gatsby Barber',
    sector: 'Barbershop · Marrakech',
    description:
      'Site vitrine conçu pour présenter l’univers du barber, valoriser les services, renforcer l’image premium et faciliter la prise de contact.',
    tag: 'Site vitrine',
    video: null,
    poster: `${WEBP}/gatsby-barber.webp`,
    publicUrl: null,
  },
  {
    slug: 'verde-paris',
    name: 'Verde Paris',
    sector: 'Restaurant · Paris',
    description:
      'Site vitrine restaurant conçu pour présenter l’univers du lieu, valoriser l’expérience client et faciliter la prise de contact.',
    tag: 'Restauration',
    video: null,
    poster: `${WEBP}/verde-paris.webp`,
    publicUrl: 'https://verde-paris.fr/',
  },
]
