/**
 * Blog Supra v3 — source unique des articles.
 * Ajoutez de nouveaux posts dans BLOG_POSTS (tableau trié par date décroissante).
 */

export const BLOG_CATEGORIES = [
  'Communication',
  'Web',
  'Vidéo',
  'SEO',
  'Branding',
  'Marketing digital',
  'IA & automatisation',
]

/**
 * @typedef {Object} BlogSection
 * @property {'h2' | 'h3' | 'p' | 'ul'} type
 * @property {string} [content]
 * @property {string[]} [items]
 */

/**
 * @typedef {Object} BlogPost
 * @property {string} slug
 * @property {string} title
 * @property {string} excerpt
 * @property {string} category
 * @property {string[]} tags
 * @property {string} intent
 * @property {string} mainKeyword
 * @property {string[]} secondaryKeywords
 * @property {string} publishedAt — ISO date (YYYY-MM-DD)
 * @property {string} updatedAt — ISO date (YYYY-MM-DD)
 * @property {string} author
 * @property {string} readingTime
 * @property {string | null} [cover]
 * @property {string} metaTitle
 * @property {string} metaDescription
 * @property {string[]} relatedPosts — slugs d’articles publiés
 * @property {{ label: string, path: string }[]} internalLinks
 * @property {BlogSection[]} sections
 * @property {'orbit' | 'frame' | 'search' | 'signal'} [visual]
 */

/** @type {BlogPost[]} */
export const BLOG_POSTS = []

const SITE = 'https://www.suprav3.com'

export function getBlogPostPath(slug) {
  return `/blog/${slug}`
}

export function getBlogPostBySlug(slug) {
  if (!slug) return null
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null
}

export function getPublishedBlogPosts() {
  return [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/** Affichage index — durée plafonnée à 2 min (format FR). */
export function formatBlogReadTime(readingTime) {
  const match = String(readingTime ?? '').match(/(\d+)/)
  const minutes = match ? Number.parseInt(match[1], 10) : 2
  return `${Math.min(Number.isFinite(minutes) ? minutes : 2, 2)} min`
}

export function getBlogIndexCards() {
  return getPublishedBlogPosts().map((post, index) => ({
    slug: post.slug,
    path: getBlogPostPath(post.slug),
    title: post.title,
    category: post.category,
    readTime: formatBlogReadTime(post.readingTime),
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    cover: post.cover ?? null,
    visual: post.visual ?? ['orbit', 'frame', 'search', 'signal'][index % 4],
  }))
}

export function getBlogFilterCategories() {
  const used = new Set(BLOG_POSTS.map((post) => post.category))
  return ['Tous', ...BLOG_CATEGORIES.filter((category) => used.has(category))]
}

export function resolveRelatedPosts(post, limit = 3) {
  if (!post?.relatedPosts?.length) return []

  const bySlug = new Map(BLOG_POSTS.map((entry) => [entry.slug, entry]))

  return post.relatedPosts
    .map((slug) => bySlug.get(slug))
    .filter((entry) => entry && entry.slug !== post.slug)
    .slice(0, limit)
}

export function resolveInternalLinks(post) {
  if (!post?.internalLinks?.length) return []

  const publishedSlugs = new Set(BLOG_POSTS.map((entry) => entry.slug))
  const staticPaths = new Set([
    '/',
    '/services',
    '/realisations',
    '/realisations/websites',
    '/realisations/production-videos',
    '/contact',
    '/blog',
    '/mentions-legales',
  ])

  return post.internalLinks.filter((link) => {
    if (!link?.path || !link?.label) return false
    if (staticPaths.has(link.path)) return true
    const blogMatch = link.path.match(/^\/blog\/([^/]+)$/)
    if (blogMatch) return publishedSlugs.has(blogMatch[1])
    return false
  })
}

export function formatBlogDate(isoDate) {
  if (!isoDate) return ''
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('fr-MA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function buildBlogPostCanonical(slug) {
  return `${SITE}${getBlogPostPath(slug)}`
}
