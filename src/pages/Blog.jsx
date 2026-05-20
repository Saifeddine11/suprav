import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import PageSEO from '../components/PageSEO.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import BookingCTA from '../components/BookingCTA.jsx'
import { ANIMATE_VARIANTS, VIEWPORT_SETTINGS, EASING } from '../animationConstants.js'

/* ─────────────────────────────────────────
   Animation système — identique à la home
───────────────────────────────────────── */
const stagger  = ANIMATE_VARIANTS.staggerContainer
const fadeUp   = ANIMATE_VARIANTS.fadeUp
const viewport = VIEWPORT_SETTINGS

const cardVariant = {
  hidden:  { opacity: 0, y: 48, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', bounce: 0.26, duration: 0.72, delay: i * 0.09 },
  }),
}

/* ─────────────────────────────────────────
   Données — Articles
───────────────────────────────────────── */
const ARTICLES = [
  {
    title:    "Combien coûte un site web à Marrakech en 2026 ?",
    path:     "/blog/combien-coute-site-web-marrakech",
    date:     "25 avril 2026",
    readTime: "8 min",
    category: "Création web",
    excerpt:  "Comprendre ce qui influence le budget d'un site vitrine, e-commerce ou application au Maroc — sans grille tarifaire, avec les vrais facteurs à anticiper.",
    featured: true,
  },
  {
    title:    "Comment choisir son agence de communication à Marrakech ?",
    path:     "/blog/comment-choisir-agence-communication",
    date:     "25 avril 2026",
    readTime: "6 min",
    category: "Conseils",
    excerpt:  "Les 7 critères essentiels pour ne pas se tromper dans le choix de votre agence de communication à Marrakech. Checklist et questions à poser.",
  },
  {
    title:    "SEO local à Marrakech : guide complet 2026",
    path:     "/blog/seo-local-guide-marrakech",
    date:     "25 avril 2026",
    readTime: "10 min",
    category: "SEO",
    excerpt:  "Tout ce que vous devez savoir pour dominer les recherches locales à Marrakech sur Google Maps et Google Search en 2026.",
  },
  {
    title:    "L'IA au service de la communication d'entreprise à Marrakech",
    path:     "/blog/ia-communication-entreprise",
    date:     "25 avril 2026",
    readTime: "7 min",
    category: "Intelligence artificielle",
    excerpt:  "Comment les entreprises marocaines utilisent déjà l'intelligence artificielle pour automatiser leur communication et gagner en compétitivité.",
  },
]

const CATEGORIES = ['Tout', 'Création web', 'SEO', 'Conseils', 'Intelligence artificielle']

/* ─────────────────────────────────────────
   Schema JSON-LD
───────────────────────────────────────── */
const schema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Blog Supra v3 — Marketing Digital & Communication Marrakech",
  "description": "Conseils, guides et ressources sur le marketing digital, le SEO, la création de site web et la communication d'entreprise à Marrakech.",
  "publisher": {
    "@type": "Organization",
    "name": "Supra v3",
    "url": "https://suprav3.com",
    "telephone": "+33744208673",
    "email": "contact@suprav3.com",
  },
  "url": "https://suprav3.com/blog",
  "inLanguage": "fr",
  "blogPost": ARTICLES.map(a => ({
    "@type": "BlogPosting",
    "headline": a.title,
    "url": `https://suprav3.com${a.path}`,
    "datePublished": "2026-04-25",
    "articleSection": a.category,
  })),
}

/* ─────────────────────────────────────────
   Composant Blog
───────────────────────────────────────── */
export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('Tout')

  const featured = ARTICLES.find(a => a.featured)
  const filtered  = ARTICLES.filter(a =>
    activeCategory === 'Tout' ? true : a.category === activeCategory
  )
  const gridArticles = filtered.filter(a => !a.featured || activeCategory !== 'Tout')

  return (
    <>
      <PageSEO
        title="Blog Marketing Digital & Communication Marrakech | Supra v3"
        description="Conseils SEO, création web, réseaux sociaux et IA pour les entreprises de Marrakech. Articles pratiques par l'équipe Supra v3, agence de communication 360°."
        path="/blog"
        schema={schema}
      />

      <article className="seo-page">

        {/* ══════════════════════════
            HERO
        ══════════════════════════ */}
        <header className="seo-hero blog-hero">
          <div className="seo-hero__bg" aria-hidden="true" />
          <div className="container">
            <motion.div
              className="seo-hero__inner blog-hero__inner"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp}>
                <Breadcrumb items={[{ label: 'Accueil', path: '/' }, { label: 'Blog' }]} />
              </motion.div>

              <motion.p className="label seo-hero__eyebrow" variants={fadeUp}>
                — Ressources & insights
              </motion.p>

              <motion.h1 className="seo-hero__title blog-hero__title" variants={fadeUp}>
                Le blog<br />
                <span className="text-accent">Supra v3</span>
              </motion.h1>

              <motion.p className="seo-hero__body" variants={fadeUp}>
                Marketing digital, SEO, branding et IA : des articles pratiques
                rédigés par notre équipe pour les entrepreneurs de Marrakech.
              </motion.p>
            </motion.div>
          </div>
        </header>

        {/* ══════════════════════════
            CATÉGORIES (filter pills)
        ══════════════════════════ */}
        <section className="blog-cats-bar">
          <div className="container">
            <motion.div
              className="blog-cats"
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
              }}
            >
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat}
                  type="button"
                  className={`blog-cat-pill${activeCategory === cat ? ' is-active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  variants={fadeUp}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  {cat}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════
            ARTICLE FEATURED (visible quand "Tout")
        ══════════════════════════ */}
        <AnimatePresence mode="wait">
          {activeCategory === 'Tout' && featured && (
            <motion.section
              key="featured"
              className="blog-featured-section"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASING }}
            >
              <div className="container">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={stagger}
                >
                  <motion.p className="label" variants={fadeUp}>
                    — À la une
                  </motion.p>

                  <motion.div variants={fadeUp}>
                    <Link to={featured.path} className="blog-featured-card">
                      {/* Accent bar */}
                      <div className="blog-featured-card__bar" aria-hidden="true" />

                      <div className="blog-featured-card__left">
                        <span className="blog-card__tag">{featured.category}</span>
                        <h2 className="blog-featured-card__title">{featured.title}</h2>
                        <p className="blog-featured-card__excerpt">{featured.excerpt}</p>
                        <div className="blog-card__meta">
                          <span className="blog-card__date">{featured.date}</span>
                          <span className="blog-card__dot" aria-hidden="true">·</span>
                          <span className="blog-card__read">{featured.readTime} de lecture</span>
                        </div>
                      </div>

                      <div className="blog-featured-card__right" aria-hidden="true">
                        <motion.span
                          className="blog-featured-card__arrow"
                          whileHover={{ x: 4, y: -4 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="28" height="28" aria-hidden="true">
                            <path d="M7 17L17 7M17 7H7M17 7v10"/>
                          </svg>
                        </motion.span>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ══════════════════════════
            GRILLE D'ARTICLES
        ══════════════════════════ */}
        <section className="blog-grid-section">
          <div className="container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="blog-hub__grid"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {gridArticles.length > 0 ? (
                  gridArticles.map((article, i) => (
                    <motion.div
                      key={article.path}
                      variants={cardVariant}
                      custom={i}
                      whileHover={{ y: -6, borderColor: 'rgba(17,17,17,0.2)' }}
                      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    >
                      <Link to={article.path} className="blog-card">
                        {/* Orange bar top */}
                        <div className="blog-card__bar" aria-hidden="true" />

                        <span className="blog-card__tag">{article.category}</span>

                        <h2 className="blog-card__title">{article.title}</h2>
                        <p className="blog-card__excerpt">{article.excerpt}</p>

                        <div className="blog-card__footer">
                          <div className="blog-card__meta">
                            <span className="blog-card__date">{article.date}</span>
                            <span className="blog-card__dot" aria-hidden="true">·</span>
                            <span className="blog-card__read">{article.readTime} de lecture</span>
                          </div>
                          <span className="blog-card__link">
                            Lire l'article
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
                              <path d="M4 10h12M11 5l5 5-5 5"/>
                            </svg>
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <motion.p
                    key="empty"
                    className="blog-empty"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                  >
                    Aucun article dans cette catégorie pour l'instant.
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ══════════════════════════
            CTA FINAL — panel sombre avec calendrier
        ══════════════════════════ */}
        <BookingCTA />

      </article>
    </>
  )
}
