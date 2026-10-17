/** `stat` (facultatif) : chiffre affiché en haut de la carte — ex. { value: '2 M', label: 'de vues' }. */
const VIDEO_BASE = '/media/videos/realisations'
const POSTER_BASE = '/media/videos/posters'

/** Anciennes vidéos du site (vid1–vid6) — optimisées, affichées en premier */
const LEGACY_REALISATION_VIDEOS = [
  {
    id: 'video-legacy-01',
    slug: 'legacy-film-immobilier',
    title: 'Ghiz Properties',
    ariaLabel: 'Film de marque immobilier — Supra v3',
    sector: 'Immobilier',
    tags: ['Film de marque', 'Vertical', '9:16'],
  },
  {
    id: 'video-legacy-05',
    slug: 'legacy-social-media',
    title: 'Gatsby Barber',
    ariaLabel: 'Contenu social media — Supra v3',
    sector: 'Retail',
    tags: ['Social media', 'Vertical', '9:16'],
  },
  {
    id: 'video-legacy-06',
    slug: 'legacy-hospitality',
    title: 'Cassi - Contenu social media',
    ariaLabel: 'Vidéo présentation hospitality — Supra v3',
    sector: 'Hospitality',
    tags: ['Présentation', 'Vertical', '9:16'],
  },
]

/** Nouvelles productions optimisées — ajoutées après les vidéos historiques */
const NEW_REALISATION_VIDEOS = [
  {
    id: 'video-01',
    slug: 'africa-beauty-ad',
    title: 'Africa Beauty',
    ariaLabel: 'Vidéo publicitaire beauté — Supra v3',
    sector: 'Beauté',
    tags: ['Publicité', 'Vertical', '9:16'],
  },
  {
    id: 'video-02',
    slug: 'sbr-beauty-ad',
    title: 'SBR Beauty',
    ariaLabel: 'Vidéo publicitaire SBR Beauty — Supra v3',
    sector: 'Beauté',
    tags: ['Publicité', 'Vertical', '9:16'],
  },
  {
    id: 'video-03',
    slug: 'scultbody-video-01',
    title: 'Sclupttbody',
    ariaLabel: 'Vidéo fitness Scultbody — Supra v3',
    sector: 'Fitness',
    tags: ['Contenu', 'Vertical', '9:16'],
  },
  {
    id: 'video-05',
    slug: 'yasmine-ads',
    title: 'Supra v3 - Agence Communication 360',
    ariaLabel: 'Vidéo publicitaire — Supra v3',
    sector: 'Contenu',
    tags: ['Publicité', 'Vertical', '9:16'],
  },
  {
    id: 'video-07',
    slug: 'home-tour-bm',
    title: 'Home tour BM Conciergerie',
    ariaLabel: 'Home tour villa — BM Conciergerie — Supra v3',
    sector: 'Immobilier',
    tags: ['Home tour', 'Vertical', '9:16'],
  },
]

/**
 * Productions récentes — pour l’instant dans le bandeau de /votre-projet uniquement (ni l’accueil
 * ni /realisations). Les déplacer dans NEW_REALISATION_VIDEOS les affiche partout.
 */
const LANDING_REALISATION_VIDEOS = [
  {
    id: 'video-08',
    slug: 'prime-golf-ad',
    title: 'Prime Golf',
    ariaLabel: 'Vidéo publicitaire Prime Golf — Supra v3',
    sector: 'Loisirs',
    tags: ['Publicité', 'Vertical', '9:16'],
  },
  {
    id: 'video-09',
    slug: 'pauline-localisation-ads',
    title: 'Emara Estates - Ads emplacement et prix',
    ariaLabel: 'Vidéo publicitaire immobilière, emplacement et prix — Supra v3',
    sector: 'Immobilier',
    tags: ['Publicité', 'Vertical', '9:16'],
  },
  {
    id: 'video-10',
    slug: 'ava-bay',
    title: 'Ava Bay',
    ariaLabel: 'Vidéo lifestyle Ava Bay — Supra v3',
    sector: 'Hospitality',
    tags: ['Contenu', 'Vertical', '9:16'],
  },
  {
    id: 'video-11',
    slug: 'gym-factory',
    stat: { value: '2 M', label: 'de vues' },
    title: 'The Gym Factory',
    ariaLabel: 'Vidéo publicitaire The Gym Factory — Supra v3',
    sector: 'Fitness',
    tags: ['Publicité', 'Vertical', '9:16'],
  },
  {
    id: 'video-12',
    slug: 'prime-golf-match-cut',
    title: 'Prime Golf - Match cut',
    ariaLabel: 'Vidéo publicitaire Prime Golf, version match cut — Supra v3',
    sector: 'Loisirs',
    tags: ['Publicité', 'Vertical', '9:16'],
  },
  {
    id: 'video-14',
    slug: 'faissal-ads-1',
    stat: { value: '400', label: 'prospects générés' },
    title: 'Faissal - Video ADS',
    ariaLabel: 'Vidéo publicitaire Faissal — Supra v3',
    sector: 'Contenu',
    tags: ['Publicité', 'Vertical', '9:16'],
  },
  {
    id: 'video-15',
    slug: 'fayssal-ads-2',
    stat: { value: '400', label: 'prospects générés' },
    title: 'Fayssal - Video ADS 2',
    ariaLabel: 'Vidéo publicitaire Fayssal, seconde version — Supra v3',
    sector: 'Contenu',
    tags: ['Publicité', 'Vertical', '9:16'],
  },
  {
    id: 'video-16',
    slug: 'gym-factory-ad',
    stat: { value: '2 M', label: 'de vues' },
    title: 'The Gym Factory - Video ADS',
    ariaLabel: 'Vidéo publicitaire The Gym Factory, version sans hook — Supra v3',
    sector: 'Fitness',
    tags: ['Publicité', 'Vertical', '9:16'],
  },
  {
    id: 'video-17',
    slug: 'gym-factory-tour',
    stat: { value: '2 M', label: 'de vues' },
    title: 'The Gym Factory - Visite',
    ariaLabel: 'Visite de la salle The Gym Factory — Supra v3',
    sector: 'Fitness',
    tags: ['Contenu', 'Vertical', '9:16'],
  },
]

function toVideoItem(item, videoBase = VIDEO_BASE) {
  const videoSrc = `${videoBase}/${item.slug}.mp4`
  const poster = `${POSTER_BASE}/${item.slug}.webp`

  return {
    ...item,
    videoSrc,
    video: videoSrc,
    poster,
    publicUrl: null,
  }
}

const ALL_REALISATION_VIDEOS = [...LEGACY_REALISATION_VIDEOS, ...NEW_REALISATION_VIDEOS]

/**
 * Homepage strip — priority order, then remaining videos in gallery order.
 * VIDEO_PROJECTS order is unchanged for /realisations/production-videos.
 */
const HOMEPAGE_PRIORITY_SLUGS = [
  'yasmine-ads',
  'scultbody-video-01',
  'africa-beauty-ad',
  'home-tour-bm',
  'legacy-film-immobilier',
]

function buildOrderedVideoItems(videoBase) {
  const prioritySlugs = HOMEPAGE_PRIORITY_SLUGS.filter(Boolean)
  const prioritySet = new Set(prioritySlugs)
  const restSlugs = ALL_REALISATION_VIDEOS.filter((entry) => !prioritySet.has(entry.slug)).map(
    (entry) => entry.slug,
  )
  const orderedSlugs = [...prioritySlugs, ...restSlugs]

  return orderedSlugs.map((slug) => {
    const item = ALL_REALISATION_VIDEOS.find((entry) => entry.slug === slug)
    if (!item) {
      throw new Error(`Missing video slug: ${slug}`)
    }
    return toVideoItem(item, videoBase)
  })
}

/** Production vidéo — même priorité que homepage, puis le reste */
export const VIDEO_PROJECTS = buildOrderedVideoItems(VIDEO_BASE)

/** Homepage — même fichiers MP4 que réalisations (`VIDEO_BASE`) */
export const HOMEPAGE_VIDEO_ITEMS = VIDEO_PROJECTS

const fisherYates = (items) => {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}

/** Copie mélangée — ordre aléatoire à chaque chargement, sans toucher à la source. */
export function shuffleVideoItems(items) {
  return fisherYates(items)
}

/**
 * Bandeau de /votre-projet : uniquement les vidéos du dossier `media/videos/Landing page videos`
 * (sources brutes, non servies), dans l’ordre du dossier. Chaque slug correspond au MP4 optimisé
 * de `public/media/videos/realisations` encodé depuis cette source.
 */
const LANDING_SLUGS = [
  'faissal-ads-1', // ADS FAISSAL 1.mp4
  'fayssal-ads-2', // Fayssal.mov
  'gym-factory-ad', // final version gym without hook.mp4
  'gym-factory-tour', // gym factory tour full quality.mp4
  'prime-golf-match-cut', // match cut hook_1.mp4
  'legacy-film-immobilier', // vid1.mp4
]

const LANDING_CATALOG = [...ALL_REALISATION_VIDEOS, ...LANDING_REALISATION_VIDEOS]

export const LANDING_VIDEO_ITEMS = LANDING_SLUGS.map((slug) => {
  const item = LANDING_CATALOG.find((entry) => entry.slug === slug)
  if (!item) throw new Error(`Missing landing video slug: ${slug}`)
  return toVideoItem(item)
})

export const HOMEPAGE_VIDEO_SRCS = HOMEPAGE_VIDEO_ITEMS.map((item) => item.videoSrc)
