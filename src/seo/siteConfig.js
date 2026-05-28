/** Domaine canonique public (www) — canonical, sitemap, OG, JSON-LD, prerender */
export const SITE_URL = 'https://www.suprav3.com'

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return `${SITE_URL}/`
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}
