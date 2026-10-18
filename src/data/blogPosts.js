/**
 * Blog Supra v3 — source unique des articles.
 * Chaque article est un module `src/data/blog/<slug>.js` (export par défaut) ; ils sont chargés ici
 * automatiquement. Les fichiers qui commencent par `_` sont ignorés (brouillons, gabarits).
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
 * Bloc du corps d'article. Mise en forme en ligne (p, ul, ol, note, cta) : `**gras**` et `[texte](/chemin)`.
 * @typedef {(
 *   { type: 'h2', id: string, content: string } |
 *   { type: 'h3', content: string } |
 *   { type: 'p', content: string } |
 *   { type: 'ul' | 'ol', items: string[] } |
 *   { type: 'table', caption?: string, head: string[], rows: string[][] } |
 *   { type: 'note', title?: string, content: string } |
 *   { type: 'cta', title: string, content?: string }
 * )} BlogSection
 */

/**
 * @typedef {Object} BlogPost
 * @property {string} slug
 * @property {string} title — H1 (70 caractères max)
 * @property {string} metaTitle — 60 caractères max, « | Supra v3 » compris
 * @property {string} metaDescription — 140 à 158 caractères
 * @property {string} excerpt
 * @property {string} category — une des BLOG_CATEGORIES
 * @property {string[]} tags
 * @property {'informationnelle' | 'commerciale'} intent
 * @property {string} mainKeyword
 * @property {string[]} secondaryKeywords
 * @property {string} publishedAt — date ISO (AAAA-MM-JJ)
 * @property {string} updatedAt — date ISO (AAAA-MM-JJ)
 * @property {string} author
 * @property {string} readingTime — ex. « 8 min »
 * @property {'web' | 'brand' | 'search' | 'video' | 'ads' | 'ai'} visual — couverture générée
 * @property {string[]} takeaways — « L'essentiel », 3 ou 4 phrases
 * @property {BlogSection[]} sections
 * @property {{ q: string, a: string }[]} faq
 * @property {{ label: string, url: string }[]} sources
 * @property {string[]} relatedPosts — slugs d'articles publiés
 */

/* Ordre éditorial à date égale (le premier est mis à la une). */
const EDITORIAL_ORDER = [
  'combien-coute-site-web-marrakech',
  'choisir-agence-communication-marrakech',
  'seo-marrakech-delais-et-couts',
  'meta-tiktok-snapchat-maroc',
  'site-vitrine-one-page-ou-e-commerce',
  'agent-ia-riad-agence-immobiliere',
]
const rank = (slug) => {
  const i = EDITORIAL_ORDER.indexOf(slug)
  return i === -1 ? EDITORIAL_ORDER.length : i
}

const modules = import.meta.glob('./blog/*.js', { eager: true })

/* un seul article par slug (le premier fichier trouvé l'emporte) */
const seen = new Set()

/** @type {BlogPost[]} triés du plus récent au plus ancien */
export const BLOG_POSTS = Object.entries(modules)
  .filter(([path]) => !/\/_[^/]*$/.test(path))
  .map(([, mod]) => mod.default)
  .filter((post) => post && post.slug && post.title && !seen.has(post.slug) && seen.add(post.slug))
  .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '') || rank(a.slug) - rank(b.slug))

const SITE = 'https://www.suprav3.com'

export function getBlogPostPath(slug) {
  return `/blog/${slug}`
}

export function getBlogPostBySlug(slug) {
  if (!slug) return null
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null
}

export function getPublishedBlogPosts() {
  return [...BLOG_POSTS]
}

/** Nombre de mots du corps, de « L'essentiel » et de la FAQ. */
export function countBlogWords(post) {
  const parts = [...(post.takeaways || [])]
  for (const s of post.sections || []) {
    if (s.content) parts.push(s.content)
    if (s.title) parts.push(s.title)
    if (s.items) parts.push(...s.items)
    if (s.head) parts.push(...s.head)
    if (s.rows) s.rows.forEach((r) => parts.push(...r))
  }
  for (const f of post.faq || []) parts.push(f.q, f.a)
  return parts.join(' ').replace(/\*\*|\[|\]\([^)]*\)/g, ' ').split(/\s+/).filter(Boolean).length
}

/** Durée de lecture affichée : celle de l'article, sinon calculée (≈ 220 mots par minute). */
export function formatBlogReadTime(post) {
  const given = String(post?.readingTime ?? '').match(/(\d+)/)
  const minutes = given ? Number.parseInt(given[1], 10) : Math.max(1, Math.round(countBlogWords(post || {}) / 220))
  return `${minutes} min`
}

export function getBlogIndexCards() {
  return getPublishedBlogPosts().map((post) => ({
    slug: post.slug,
    path: getBlogPostPath(post.slug),
    title: post.title,
    category: post.category,
    readTime: formatBlogReadTime(post),
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    visual: post.visual || 'web',
  }))
}

/** Catégories réellement utilisées, dans l'ordre de BLOG_CATEGORIES. */
export function getBlogFilterCategories() {
  const used = new Set(BLOG_POSTS.map((post) => post.category))
  return ['Tous', ...BLOG_CATEGORIES.filter((category) => used.has(category))]
}

/** Articles liés : ceux demandés, complétés par la même catégorie puis les plus récents. */
export function resolveRelatedPosts(post, limit = 3) {
  if (!post) return []
  const bySlug = new Map(BLOG_POSTS.map((entry) => [entry.slug, entry]))
  const out = []
  const add = (entry) => { if (entry && entry.slug !== post.slug && !out.includes(entry)) out.push(entry) }
  ;(post.relatedPosts || []).forEach((slug) => add(bySlug.get(slug)))
  BLOG_POSTS.filter((entry) => entry.category === post.category).forEach(add)
  BLOG_POSTS.forEach(add)
  return out.slice(0, limit)
}

/** Chemins internes reconnus dans les articles (les autres liens internes sont rendus en texte simple). */
export const BLOG_STATIC_PATHS = new Set([
  '/',
  '/realisations',
  '/realisations/websites',
  '/realisations/production-videos',
  '/agence',
  '/contact',
  '/rejoindre',
  '/blog',
  '/mentions-legales',
])

export function isKnownInternalPath(path) {
  if (!path || !path.startsWith('/')) return false
  const [pathname] = path.split('#')
  if (BLOG_STATIC_PATHS.has(pathname || '/')) return true
  const blogMatch = pathname.match(/^\/blog\/([^/]+)$/)
  return Boolean(blogMatch && getBlogPostBySlug(blogMatch[1]))
}

/** Liens internes d'un article (`internalLinks`, ancien format) limités aux chemins connus. */
export function resolveInternalLinks(post) {
  return (post?.internalLinks || []).filter((link) => link?.label && isKnownInternalPath(link.path))
}

export function formatBlogDate(isoDate) {
  if (!isoDate) return ''
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function buildBlogPostCanonical(slug) {
  return `${SITE}${getBlogPostPath(slug)}`
}
