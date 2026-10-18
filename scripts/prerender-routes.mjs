/**
 * Routes pré-rendues — Supra v3 (accueil, pages intérieures v3 et articles du blog)
 */
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BLOG_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'blog')

/** Slugs des articles : un fichier par article dans src/data/blog (les fichiers « _ » sont ignorés). */
export const BLOG_SLUGS = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.js') && !f.startsWith('_'))
  .map((f) => f.replace(/\.js$/, ''))
  .sort()

export const PRERENDER_ROUTES = [
  '/',
  '/services',
  '/realisations',
  '/realisations/websites',
  '/realisations/production-videos',
  '/agence',
  '/contact',
  '/rejoindre',
  '/votre-projet',
  '/blog',
  ...BLOG_SLUGS.map((slug) => `/blog/${slug}`),
  '/mentions-legales',
]

export function routeToOutputFile(route) {
  if (route === '/') return 'index.html'
  const trimmed = route.replace(/^\/+|\/+$/g, '')
  return `${trimmed}/index.html`
}

export function canonicalForRoute(route) {
  if (route === '/') return 'https://www.suprav3.com/'
  return `https://www.suprav3.com${route}`
}
