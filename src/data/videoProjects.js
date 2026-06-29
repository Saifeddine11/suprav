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
    id: 'video-06',
    slug: 'ehab-ads',
    title: 'Emara Estates - Video ADS',
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
  'ehab-ads',
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

export const HOMEPAGE_VIDEO_SRCS = HOMEPAGE_VIDEO_ITEMS.map((item) => item.videoSrc)
