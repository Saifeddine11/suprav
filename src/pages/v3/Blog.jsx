import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageV3 from './PageV3.jsx'
import PageHero, { Swash, SwashR } from './PageHero.jsx'
import { Btn, WaBtn, Li } from './ui.jsx'
import Cover from './blog/Cover.jsx'
import PostCard from './blog/PostCard.jsx'
import { blogIndexSchema } from './blog/utils.js'
import {
  getPublishedBlogPosts,
  getBlogFilterCategories,
  getBlogPostPath,
  formatBlogDate,
  formatBlogReadTime,
} from '../../data/blogPosts.js'
import './css/blog.css'

const POSTS = getPublishedBlogPosts()
const CATS = getBlogFilterCategories()
const [FEATURED, ...REST] = POSTS
const LAST_UPDATE = POSTS.reduce((d, p) => ((p.updatedAt || p.publishedAt) > d ? (p.updatedAt || p.publishedAt) : d), '')

const SEO = {
  title: 'Blog marketing, web et publicité à Marrakech | Supra v3',
  description: 'Prix d’un site web, choix d’une agence, délais du SEO, publicité Meta, TikTok ou Snapchat, agents IA : nos guides concrets pour les marques à Marrakech.',
  path: '/blog',
  schema: blogIndexSchema(POSTS),
}

/* À la une : grande carte, couverture à gauche. */
function Featured({ post, hidden }) {
  return (
    <article className="bl-feat" data-r data-hov hidden={hidden}>
      <Link className="bl-feat-l" to={getBlogPostPath(post.slug)}>
        <Cover visual={post.visual} seed={post.slug} className="bl-lg" />
        <div className="bl-feat-b">
          <span className="nb"><b>À la une</b>{post.category}</span>
          <h2 className="bl-feat-t">{post.title}</h2>
          <p className="bl-feat-x">{post.excerpt}</p>
          {post.takeaways?.length ? (
            <ul className="checks bl-feat-k">{post.takeaways.slice(0, 2).map((t) => <li key={t}>{t}</li>)}</ul>
          ) : null}
          <div className="bl-feat-f">
            <span className="bl-meta">
              <time dateTime={post.updatedAt || post.publishedAt}>{formatBlogDate(post.updatedAt || post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{formatBlogReadTime(post)} de lecture</span>
            </span>
            <span className="bl-go">Lire le guide<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default function Blog() {
  const [cat, setCat] = useState('Tous')
  const [touched, setTouched] = useState(false)
  const featured = FEATURED
  const list = useMemo(() => (cat === 'Tous' ? REST : POSTS.filter((p) => p.category === cat)), [cat])
  const count = (c) => (c === 'Tous' ? POSTS.length : POSTS.filter((p) => p.category === c).length)

  return (
    <PageV3 seo={SEO} className="bl-page">
      <PageHero
        crumbs={[{ label: 'Blog' }]}
        kicker="Blog · Conseils marketing à Marrakech"
        title={<>Ce qu’il faut savoir avant <span className="nw">d’<Swash>investir</Swash>.</span></>}
        lede="Prix d’un site web, choix d’une agence, délais du SEO, publicité sur Meta, TikTok ou Snapchat, agents IA : nos réponses franches aux questions que nos clients nous posent le plus souvent."
      >
        {POSTS.length ? (
          <span className="bl-hmeta">
            <b>{POSTS.length} guides</b>
            {LAST_UPDATE ? <span>Mis à jour le {formatBlogDate(LAST_UPDATE)}</span> : null}
          </span>
        ) : null}
      </PageHero>

      <section className="sec light wrap bl-idx">
        <div className="c">
          {featured ? (
            <>
              <Featured post={featured} hidden={cat !== 'Tous'} />

              <div className="bl-bar" data-r>
                <h2 className="bl-bar-t">{cat === 'Tous' ? 'Tous les guides' : cat}</h2>
                <div className="flt" role="group" aria-label="Filtrer les articles par thème">
                  {CATS.map((c) => (
                    <button key={c} type="button" aria-pressed={cat === c} onClick={() => { setCat(c); setTouched(true) }}>
                      {c}<span className="ct">{count(c)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`bl-grid${touched ? ' bl-anim' : ''}`} key={cat} data-r>
                {list.map((p, i) => <PostCard key={p.slug} post={p} style={{ '--i': i }} />)}
              </div>
            </>
          ) : (
            <div className="bl-empty" data-r>
              <span className="bl-empty-ic"><Li k="doc" s={1.6} /></span>
              <h2 className="h2">Les premiers guides <SwashR>arrivent</SwashR>.</h2>
              <p className="lede">En attendant, posez-nous directement votre question : on vous répond sur WhatsApp, sans jargon.</p>
              <div className="ctas"><Btn to="/contact">Réserver un appel</Btn><WaBtn text="Bonjour Supra v3, j'ai une question." /></div>
            </div>
          )}
        </div>
      </section>

      {POSTS.length ? (
        <section className="sec tight light wrap bl-ask">
          <div className="c">
            <div className="band-cta" data-r>
              <div>
                <h2>Votre question n’est pas dans la liste ?</h2>
                <p>Écrivez-nous : on vous répond sur WhatsApp, et si elle revient souvent, elle deviendra un guide.</p>
              </div>
              <div className="ctas">
                <WaBtn text="Bonjour Supra v3, j'ai une question sur mon projet." tone="ac">Poser ma question</WaBtn>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </PageV3>
  )
}
