import { useParams, Link } from 'react-router-dom'
import PageV3 from './PageV3.jsx'
import PageHero, { Swash } from './PageHero.jsx'
import { Btn, Li } from './ui.jsx'
import Cover from './blog/Cover.jsx'
import PostCard from './blog/PostCard.jsx'
import { Blocks, Inline } from './blog/Rich.jsx'
import { blogPostSchema, shortTitle } from './blog/utils.js'
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
  resolveRelatedPosts,
  formatBlogDate,
  formatBlogReadTime,
  countBlogWords,
} from '../../data/blogPosts.js'
import './css/blog.css'

/* Sommaire : les h2 de l'article, puis la FAQ et les sources. */
function tocOf(post) {
  const items = (post.sections || []).filter((s) => s.type === 'h2').map((s, i) => ({ id: s.id || `partie-${i}`, label: s.content }))
  if (post.faq?.length) items.push({ id: 'questions-frequentes', label: 'Questions fréquentes' })
  if (post.sources?.length) items.push({ id: 'sources', label: 'Sources' })
  return items
}

function Toc({ items }) {
  return (
    <ol className="bl-toc-l">
      {items.map((it, i) => (
        <li key={it.id}>
          <a href={`#${it.id}`} data-toc={it.id}><span className="n">{String(i + 1).padStart(2, '0')}</span><span><Inline text={it.label} /></span></a>
        </li>
      ))}
    </ol>
  )
}

/* Comportements : barre de lecture, sommaire actif, sommaire mobile refermé après un clic. */
function initArticle(ctx) {
  const { root, $id, IO, on, onWin, rAF } = ctx
  const body = $id('bl-body'), bar = $id('bl-prog')
  if (body && bar) {
    let queued = false
    const upd = () => {
      queued = false
      const r = body.getBoundingClientRect(), vh = innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.3 - r.top) / Math.max(1, r.height - vh * 0.5)))
      bar.style.transform = `scaleX(${p.toFixed(4)})`
      bar.parentElement.classList.toggle('on', r.top < vh * 0.5 && r.bottom > 0)
    }
    const ask = () => { if (!queued) { queued = true; rAF(upd) } }
    onWin('scroll', ask, { passive: true }); onWin('resize', ask); upd()
  }
  const links = [...root.querySelectorAll('[data-toc]')]
  const heads = [...new Set(links.map((a) => a.dataset.toc))].map((id) => root.querySelector('#' + CSS.escape(id))).filter(Boolean)
  if (heads.length && 'IntersectionObserver' in window) {
    const mark = (id) => links.forEach((a) => {
      const cur = a.dataset.toc === id
      a.classList.toggle('on', cur)
      if (cur) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current')
    })
    /* partie active : le dernier titre passé au-dessus du tiers haut de l'écran */
    const pick = () => {
      let cur = heads[0].id
      for (const h of heads) { if (h.getBoundingClientRect().top < innerHeight * 0.32) cur = h.id }
      mark(cur)
    }
    const io = IO(pick, { rootMargin: '0px 0px -68% 0px', threshold: [0, 1] })
    heads.forEach((h) => io.observe(h))
    pick()
  }
  const tm = $id('bl-tocm')
  if (tm) tm.querySelectorAll('a').forEach((a) => on(a, 'click', () => { tm.open = false }))
}

function Article({ post }) {
  const toc = tocOf(post)
  const related = resolveRelatedPosts(post, 3)
  const date = post.updatedAt || post.publishedAt
  const wa = `Bonjour Supra v3, je viens de lire « ${post.title} » et j'aimerais en parler pour mon projet.`
  const seo = {
    title: post.metaTitle || `${post.title} | Supra v3`,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    type: 'article',
    schema: blogPostSchema(post, countBlogWords(post)),
  }

  return (
    <PageV3 seo={seo} init={initArticle} className="bl-page bl-art">
      <div className="bl-progress" aria-hidden="true"><i id="bl-prog" /></div>
      <PageHero
        crumbs={[{ to: '/blog', label: 'Blog' }, { label: shortTitle(post.title) }]}
        kicker={`${post.category} · Blog Supra v3`}
        title={post.title}
        lede={post.excerpt}
        aside={<Cover visual={post.visual} seed={post.slug} className="bl-lg bl-hero" />}
      >
        <div className="bl-by">
          <span className="bl-av"><i className="a-logo" /></span>
          <span className="bl-by-t">
            <b>{post.author || 'L’équipe Supra v3'}</b>
            <span>
              Mis à jour le <time dateTime={date}>{formatBlogDate(date)}</time>
              <span aria-hidden="true"> · </span>
              {formatBlogReadTime(post)} de lecture
            </span>
          </span>
        </div>
      </PageHero>

      <section className="light wrap bl-read">
        <div className="c bl-lay">
          <aside className="bl-toc" aria-label="Sommaire">
            <span className="bl-toc-h">Sommaire</span>
            <Toc items={toc} />
            <Link className="bl-toc-back" to="/blog"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>Tous les guides</Link>
          </aside>

          <article className="bl-prose" id="bl-body">
            {toc.length ? (
              <details className="bl-tocm" id="bl-tocm">
                <summary><Li k="doc" s={1.8} />Sommaire<i aria-hidden="true" /></summary>
                <Toc items={toc} />
              </details>
            ) : null}

            {post.takeaways?.length ? (
              <div className="bl-tk">
                <span className="bl-tk-h"><Li k="check" s={2} />L’essentiel</span>
                <ul className="checks">{post.takeaways.map((t) => <li key={t}><span><Inline text={t} /></span></li>)}</ul>
              </div>
            ) : null}

            <Blocks sections={post.sections} wa={wa} />

            {post.faq?.length ? (
              <div className="bl-faq">
                <h2 id="questions-frequentes" className="bl-h2">Questions fréquentes<a className="bl-anc" href="#questions-frequentes" aria-label="Lien vers cette partie">#</a></h2>
                <div className="qa">
                  {post.faq.map((f, i) => (
                    <details key={f.q} open={i === 0}>
                      <summary><Inline text={f.q} /><i aria-hidden="true" /></summary>
                      <div className="an"><Inline text={f.a} /></div>
                    </details>
                  ))}
                </div>
              </div>
            ) : null}

            {post.sources?.length ? (
              <div className="bl-src">
                <h2 id="sources" className="bl-h2 sm">Sources<a className="bl-anc" href="#sources" aria-label="Lien vers cette partie">#</a></h2>
                <ol>
                  {post.sources.map((s) => (
                    <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.label}</a><span className="bl-src-d">{s.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span></li>
                  ))}
                </ol>
              </div>
            ) : null}

            <div className="bl-author">
              <span className="bl-av bl-av-lg"><i className="a-logo" /></span>
              <div>
                <b>L’équipe Supra v3</b>
                <p>Agence de communication 360° à Marrakech : vidéo et publicité, sites web, identité de marque, SEO et agents IA, avec la même équipe, du script à la mise en ligne.</p>
                <Link className="bl-author-l" to="/agence">Découvrir l’agence<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {related.length ? (
        <section className="sec tight mist wrap bl-rel">
          <div className="c">
            <div className="chead" data-r>
              <div className="l">
                <span className="nb"><b>Blog</b>À lire aussi</span>
                <h2 className="h2">Continuer la <Swash>lecture</Swash>.</h2>
              </div>
              <Link className="tlink" to="/blog">Tous les guides<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
            </div>
            <div className="bl-grid" data-r>
              {related.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </div>
        </section>
      ) : null}
    </PageV3>
  )
}

function Missing() {
  const latest = getPublishedBlogPosts().slice(0, 3)
  return (
    <PageV3 seo={{ title: 'Article introuvable | Supra v3', description: 'Cet article du blog Supra v3 n’existe pas ou a changé d’adresse. Retrouvez tous nos guides sur les sites web, le SEO et la publicité à Marrakech.', path: '/blog', noindex: true }} className="bl-page">
      <PageHero
        size="sm"
        crumbs={[{ to: '/blog', label: 'Blog' }, { label: 'Article introuvable' }]}
        kicker="Erreur 404 · Blog Supra v3"
        title={<>Cet article est <span className="nw"><Swash>introuvable</Swash>.</span></>}
        lede="Il a peut-être changé d’adresse. Tous nos guides sont sur la page du blog."
      >
        <Btn to="/blog">Voir tous les guides</Btn>
      </PageHero>
      {latest.length ? (
        <section className="sec tight light wrap">
          <div className="c">
            <div className="bl-grid" data-r>{latest.map((p) => <PostCard key={p.slug} post={p} />)}</div>
          </div>
        </section>
      ) : null}
    </PageV3>
  )
}

export default function BlogArticle() {
  const { slug } = useParams()
  const post = getBlogPostBySlug(slug)
  if (!post) return <Missing key={`404-${slug}`} />
  return <Article key={slug} post={post} />
}
