/* Outils du blog v3 (sans composant : compatibles avec le rafraîchissement à chaud). */
const SITE = 'https://www.suprav3.com'

/* Titre court pour le fil d'Ariane : coupé au mot, 34 caractères environ. */
export function shortTitle(title, max = 34) {
  const t = String(title || '').replace(/\s*[?!:]\s*$/, '')
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:·–-]+$/, '') + '…'
}

/* Texte brut (sans **gras** ni [liens](…)) pour les données structurées. */
export function plain(s) {
  return String(s || '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

const ORG = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'Supra v3',
  url: SITE,
  logo: { '@type': 'ImageObject', url: `${SITE}/logo.webp` },
}

const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE}${it.path}` })),
})

const stamp = (d) => (d ? `${d}T09:00:00+01:00` : undefined)

export function blogIndexSchema(posts) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${SITE}/blog#blog`,
        name: 'Blog Supra v3',
        description: 'Conseils concrets sur les sites web, le SEO, la publicité Meta, TikTok et Snapchat, la vidéo et les agents IA pour les marques à Marrakech et au Maroc.',
        url: `${SITE}/blog`,
        inLanguage: 'fr',
        publisher: ORG,
        blogPost: posts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          url: `${SITE}/blog/${p.slug}`,
          datePublished: stamp(p.publishedAt),
          dateModified: stamp(p.updatedAt || p.publishedAt),
          articleSection: p.category,
        })),
      },
      {
        '@type': 'ItemList',
        itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/blog/${p.slug}`, name: p.title })),
      },
      crumbs([{ name: 'Accueil', path: '/' }, { name: 'Blog', path: '/blog' }]),
    ],
  }
}

export function blogPostSchema(post, words) {
  const url = `${SITE}/blog/${post.slug}`
  const graph = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      image: `${SITE}/logo.webp`,
      datePublished: stamp(post.publishedAt),
      dateModified: stamp(post.updatedAt || post.publishedAt),
      inLanguage: 'fr',
      articleSection: post.category,
      keywords: [post.mainKeyword, ...(post.secondaryKeywords || [])].filter(Boolean).join(', '),
      wordCount: words,
      author: { '@type': 'Organization', name: 'Supra v3', url: `${SITE}/agence` },
      publisher: ORG,
    },
    crumbs([{ name: 'Accueil', path: '/' }, { name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]),
  ]
  if (post.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: post.faq.map((f) => ({ '@type': 'Question', name: plain(f.q), acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}
