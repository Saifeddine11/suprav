import { Link, useParams } from 'react-router-dom'
import PageSEO from '../components/PageSEO.jsx'
import {
  formatBlogDate,
  getBlogPostBySlug,
  getBlogPostPath,
  resolveInternalLinks,
  resolveRelatedPosts,
} from '../data/blogPosts.js'
import { buildBlogPostSchema } from '../utils/blogSchema.js'
import NotFound from './NotFound.jsx'
import '../styles/blog.css'

function BlogSection({ section }) {
  if (!section) return null

  switch (section.type) {
    case 'h2':
      return <h2 className="blog-article__h2">{section.content}</h2>
    case 'h3':
      return <h3 className="blog-article__h3">{section.content}</h3>
    case 'p':
      return <p className="blog-article__p">{section.content}</p>
    case 'ul':
      return (
        <ul className="blog-article__list">
          {(section.items || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    default:
      return null
  }
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return <NotFound />
  }

  const relatedPosts = resolveRelatedPosts(post)
  const internalLinks = resolveInternalLinks(post)
  const path = getBlogPostPath(post.slug)

  const seo = {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path,
    type: 'article',
    image: post.cover?.startsWith('http') ? post.cover : post.cover ? `https://www.suprav3.com${post.cover}` : undefined,
    schema: buildBlogPostSchema(post),
  }

  return (
    <div className="blog-page">
      <PageSEO {...seo} path={path} />

      <div className="blog-article-wrap">
        <div className="container">
          <nav className="blog-breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span aria-hidden="true"> / </span>
            <Link to="/blog">Blog</Link>
            <span aria-hidden="true"> / </span>
            <span>{post.title}</span>
          </nav>

          <article className="blog-article">
            <header className="blog-article__header">
              <span className="blog-article__category">{post.category}</span>
              <h1 className="blog-article__title">{post.title}</h1>
              <p className="blog-article__excerpt">{post.excerpt}</p>
              <div className="blog-article__meta">
                <span>{post.author}</span>
                <span>{formatBlogDate(post.publishedAt)}</span>
                <span>{post.readingTime} de lecture</span>
              </div>
            </header>

            <div className="blog-article__body">
              {(post.sections || []).map((section, index) => (
                <BlogSection key={`${section.type}-${index}`} section={section} />
              ))}
            </div>

            {internalLinks.length > 0 ? (
              <nav className="blog-article__cta" aria-label="Liens utiles">
                <h2>À lire aussi sur Supra v3</h2>
                <p>Approfondissez votre stratégie avec nos pages dédiées.</p>
                <div className="blog-article__cta-actions">
                  {internalLinks.map((link) => (
                    <Link key={link.path} to={link.path} className="btn btn--primary">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            ) : (
              <aside className="blog-article__cta">
                <h2>Passer de la lecture à l’action</h2>
                <p>
                  Vous voulez appliquer ces idées à votre marque ? Parlons de votre projet et
                  construisons ensemble une stratégie claire.
                </p>
                <div className="blog-article__cta-actions">
                  <Link to="/contact" className="btn btn--primary">
                    Parler de votre projet
                  </Link>
                  <Link to="/services" className="btn btn--ghost">
                    Nos services
                  </Link>
                </div>
              </aside>
            )}
          </article>

          {relatedPosts.length > 0 ? (
            <section className="blog-related" aria-label="Articles associés">
              <h2 className="blog-related__title">Articles associés</h2>
              <div className="blog-related__grid">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    to={getBlogPostPath(related.slug)}
                    className="blog-related__card"
                  >
                    <span className="blog-card__category">{related.category}</span>
                    <h3>{related.title}</h3>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
