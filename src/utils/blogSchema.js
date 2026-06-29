const SITE = 'https://www.suprav3.com'

export const BLOG_PUBLISHER = {
  '@type': 'Organization',
  name: 'Supra v3',
  url: SITE,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE}/logo.webp`,
  },
}

export function buildBlogIndexSchema(posts = []) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Supra v3',
    description:
      'Conseils, analyses et guides sur la communication, le web, le marketing digital et la visibilité des marques à Marrakech.',
    url: `${SITE}/blog`,
    inLanguage: 'fr-MA',
    publisher: BLOG_PUBLISHER,
  }

  if (posts.length > 0) {
    schema.blogPost = posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE}/blog/${post.slug}`,
      articleSection: post.category,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      inLanguage: 'fr-MA',
    }))
  }

  return schema
}

export function buildBlogPostSchema(post) {
  const url = `${SITE}/blog/${post.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    articleSection: post.category,
    keywords: [post.mainKeyword, ...(post.secondaryKeywords || []), ...(post.tags || [])]
      .filter(Boolean)
      .join(', '),
    inLanguage: 'fr-MA',
    author: {
      '@type': 'Organization',
      name: post.author || 'Supra v3',
    },
    publisher: BLOG_PUBLISHER,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(post.cover
      ? {
          image: {
            '@type': 'ImageObject',
            url: post.cover.startsWith('http') ? post.cover : `${SITE}${post.cover}`,
          },
        }
      : {}),
  }
}
