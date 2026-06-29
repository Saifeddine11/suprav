import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageSEO from '../components/PageSEO.jsx'
import AnimatedText from '../components/animations/AnimatedText.jsx'
import { SEO_PAGES } from '../data/seoPages.js'
import {
  getBlogFilterCategories,
  getBlogIndexCards,
  getPublishedBlogPosts,
} from '../data/blogPosts.js'
import { buildBlogIndexSchema } from '../utils/blogSchema.js'
import '../styles/blog.css'

function ArticleCard({ article }) {
  const hasCover = Boolean(article.cover)

  return (
    <article className="blog-card-shell">
      <Link to={article.path} className="blog-card" aria-label={`Lire : ${article.title}`}>
        {hasCover ? (
          <div className="blog-card__visual blog-card__visual--cover" aria-hidden="true">
            <img
              src={article.cover}
              alt=""
              className="blog-card__cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <div
            className={`blog-card__visual blog-card__visual--${article.visual}`}
            aria-hidden="true"
          >
            <span className="blog-card__visual-grid" />
            <span className="blog-card__visual-shape blog-card__visual-shape--one" />
            <span className="blog-card__visual-shape blog-card__visual-shape--two" />
          </div>
        )}

        <div className="blog-card__content">
          <span className="blog-card__category">{article.category}</span>
          <h2 className="blog-card__title">{article.title}</h2>
          <div className="blog-card__footer">
            <p className="blog-card__excerpt">{article.excerpt}</p>
            <span className="blog-card__read-time">{article.readTime}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function BlogEmptyState() {
  return (
    <section className="blog-index-empty-state" aria-label="Articles à venir">
      <div className="blog-index-empty-state__mark" aria-hidden="true" />
      <p className="blog-index-empty-state__eyebrow">Ressources à venir</p>
      <h2 className="blog-index-empty-state__title">Les prochains articles arrivent.</h2>
      <p className="blog-index-empty-state__text">
        Nous préparons des guides utiles sur la communication, le web, la vidéo, le SEO et la
        croissance des marques.
      </p>
      <Link to="/contact" className="blog-index-empty-state__btn">
        Parler de votre projet
        <span aria-hidden="true">↗</span>
      </Link>
    </section>
  )
}

export default function Blog() {
  const articles = getBlogIndexCards()
  const categories = getBlogFilterCategories()
  const [activeCategory, setActiveCategory] = useState('Tous')
  const hasArticles = articles.length > 0

  const visibleArticles = useMemo(
    () =>
      activeCategory === 'Tous'
        ? articles
        : articles.filter((article) => article.category === activeCategory),
    [activeCategory, articles],
  )

  const pageSeo = useMemo(
    () => ({
      ...SEO_PAGES.blog,
      path: '/blog',
      schema: buildBlogIndexSchema(getPublishedBlogPosts()),
    }),
    [],
  )

  return (
    <div className="blog-page blog-index">
      <PageSEO {...pageSeo} path="/blog" />

      <header className="blog-index-hero">
        <div className="blog-index-hero__word" aria-hidden="true">
          Blog Insights
        </div>
        <div className="container blog-index-hero__inner">
          <p className="blog-index-hero__eyebrow">Blog Supra v3</p>
          <AnimatedText
            as="h1"
            className="blog-index-hero__title"
            text="Idées, stratégies et conseils pour faire grandir votre marque"
            animateBy="words"
            direction="top"
            delay={100}
            stepDuration={0.35}
            instant
          />
          <p className="blog-index-hero__intro">
            Analyses, guides et retours d’expérience sur la communication, le web, le contenu
            vidéo, le SEO et la croissance des marques.
          </p>
        </div>
      </header>

      <section className="blog-index-body" aria-label="Ressources du blog">
        <div className="container">
          {hasArticles ? (
            <div className="blog-index-toolbar">
              <p className="blog-index-toolbar__label">Explorer les sujets</p>
              <div className="blog-index-filters" aria-label="Filtrer les articles">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`blog-index-filters__chip${activeCategory === category ? ' is-active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={activeCategory === category}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {hasArticles ? (
            <section className="blog-index-grid" aria-label="Articles du blog" aria-live="polite">
              {visibleArticles.map((article) => (
                <ArticleCard key={article.path} article={article} />
              ))}
            </section>
          ) : (
            <BlogEmptyState />
          )}

          <aside className="blog-index-cta">
            <div className="blog-index-cta__mark" aria-hidden="true" />
            <div className="blog-index-cta__copy">
              <p className="blog-index-cta__eyebrow">Passer de l’idée à l’action</p>
              <h2 className="blog-index-cta__title">
                Vous voulez appliquer ces idées à votre marque ?
              </h2>
              <p className="blog-index-cta__text">
                On vous aide à clarifier votre positionnement, produire les bons contenus et
                transformer votre présence digitale en vrai levier de croissance.
              </p>
            </div>
            <Link to="/contact" className="blog-index-cta__btn">
              Demander un diagnostic
              <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </section>
    </div>
  )
}
