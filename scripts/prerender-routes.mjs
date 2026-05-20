/**
 * Routes pré-rendues (Groupe A uniquement) — HTML statique pour crawlers.
 * @see scripts/PRERENDER-AUDIT.md pour la classification A/B/C
 *
 * Règles :
 * - Une seule URL canonique par intention (pas de doublons alias)
 * - Pas de /community-management → utiliser /gestion-reseaux-sociaux-marrakech
 * - Pas de /production-contenu → utiliser /agence-video-marrakech
 * - Pas de /automatisation-ia → utiliser /automatisation-ia-marrakech
 */

export const PRERENDER_ROUTES = [
  // Pilier & conversion
  '/',
  '/agence-communication-marrakech',
  '/contact',
  '/devis-gratuit',

  // Web & tech (Marrakech)
  '/creation-site-web-marrakech',
  '/site-vitrine-marrakech',
  '/site-ecommerce-marrakech',
  '/refonte-site-web',

  // Branding & contenu
  '/branding-marrakech',
  '/creation-logo-marrakech',
  '/charte-graphique',
  '/agence-video-marrakech',

  // Marketing & SEO
  '/marketing-digital-marrakech',
  '/referencement-seo-marrakech',
  '/seo-local-marrakech',
  '/publicite-marrakech',
  '/gestion-reseaux-sociaux-marrakech',

  // IA
  '/automatisation-ia-marrakech',
  '/chatbot-ia-marrakech',

  // Sectoriel
  '/agence-communication-immobilier-marrakech',
  '/agence-communication-restaurant-marrakech',
  '/agence-communication-hotel-marrakech',
  '/personal-branding-marrakech',

  // Blog (hub + articles)
  '/blog',
  '/blog/combien-coute-site-web-marrakech',
  '/blog/seo-local-guide-marrakech',
  '/blog/comment-choisir-agence-communication',
  '/blog/ia-communication-entreprise',
]

export function routeToOutputFile(route) {
  if (route === '/') return 'index.html'
  const trimmed = route.replace(/^\/+|\/+$/g, '')
  return `${trimmed}/index.html`
}

export function canonicalForRoute(route) {
  return route === '/' ? 'https://suprav3.com/' : `https://suprav3.com${route}`
}
