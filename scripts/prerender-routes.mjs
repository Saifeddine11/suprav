/**
 * Routes pré-rendues — architecture minimale Supra v3
 */

export const PRERENDER_ROUTES = [
  '/',
  '/services',
  '/realisations',
  '/realisations/websites',
  '/realisations/production-videos',
  '/contact',
  '/blog',
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
