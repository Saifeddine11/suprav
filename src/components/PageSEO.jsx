import { useEffect } from 'react'

const SITE = 'https://suprav3.com'
const DEFAULT_OG_IMAGE = 'https://suprav3.com/logo.webp'
const SOCIAL_PROFILE_URLS = [
  'https://www.instagram.com/supra_v3/',
  'https://www.tiktok.com/@supravofficiel',
  'https://snapchat.com/t/jL89tQsB',
]

function addSocialProfilesToSchema(schema) {
  if (!schema || typeof schema !== 'object') return schema

  if (Array.isArray(schema)) {
    return schema.map(addSocialProfilesToSchema)
  }

  const enriched = {}
  for (const [key, value] of Object.entries(schema)) {
    enriched[key] = addSocialProfilesToSchema(value)
  }

  const type = enriched['@type']
  const types = Array.isArray(type) ? type : [type]
  const isBrandEntity = types.includes('Organization') || types.includes('LocalBusiness')

  if (isBrandEntity && !enriched.sameAs) {
    enriched.sameAs = SOCIAL_PROFILE_URLS
  }

  return enriched
}

/**
 * Injecte dynamiquement les meta SEO dans le <head>.
 * Compatible SPA React sans react-helmet.
 * Gère : title, description, canonical, OG, Twitter, JSON-LD schema.
 */
export default function PageSEO({
  title,
  description,
  path = '/',
  schema = null,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
}) {
  useEffect(() => {
    const fullTitle = title.includes('Supra v3') ? title : `${title} | Supra v3`
    const canonicalUrl = `${SITE}${path}`

    /* ── Title ── */
    document.title = fullTitle

    /* ── Helpers ── */
    const setMeta = (attr, val, prop = 'name') => {
      let el = document.querySelector(`meta[${prop}="${attr}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(prop, attr)
        document.head.appendChild(el)
      }
      el.setAttribute('content', val)
    }

    /* ── Core ── */
    setMeta('description', description)
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')

    /* ── Canonical ── */
    let canon = document.querySelector('link[rel="canonical"]')
    if (!canon) {
      canon = document.createElement('link')
      canon.setAttribute('rel', 'canonical')
      document.head.appendChild(canon)
    }
    canon.setAttribute('href', canonicalUrl)

    /* ── Open Graph ── */
    setMeta('og:type', type, 'property')
    setMeta('og:site_name', 'Supra v3', 'property')
    setMeta('og:locale', 'fr_MA', 'property')
    setMeta('og:title', fullTitle, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', canonicalUrl, 'property')
    setMeta('og:image', image, 'property')
    setMeta('og:image:width', '1200', 'property')
    setMeta('og:image:height', '630', 'property')

    /* ── Twitter Card ── */
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:site', '@suprav_com')
    setMeta('twitter:title', fullTitle, 'property')
    setMeta('twitter:description', description, 'property')
    setMeta('twitter:image', image, 'property')

    SOCIAL_PROFILE_URLS.forEach((url) => {
      let link = document.querySelector(`link[rel="me"][href="${url}"]`)
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'me')
        link.setAttribute('href', url)
        document.head.appendChild(link)
      }
    })

    /* ── Geo ── */
    setMeta('geo.region', 'MA-05')
    setMeta('geo.placename', 'Marrakech')

    /* ── Schema JSON-LD dynamique ── */
    const old = document.getElementById('page-schema')
    if (old) old.remove()
    if (schema) {
      const s = document.createElement('script')
      s.id = 'page-schema'
      s.type = 'application/ld+json'
      s.textContent = JSON.stringify(addSocialProfilesToSchema(schema))
      document.head.appendChild(s)
    }

    return () => {
      const s = document.getElementById('page-schema')
      if (s) s.remove()
    }
  }, [title, description, path, schema, image, type, noindex])

  return null
}
