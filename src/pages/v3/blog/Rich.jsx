/*
 * Rendu des articles : mise en forme en ligne (`**gras**`, `[texte](/chemin)`) et blocs du corps.
 * Aucun HTML injecté : tout passe par des éléments React.
 */
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { isKnownInternalPath } from '../../../data/blogPosts.js'
import { Btn, WaBtn, Li } from '../ui.jsx'

const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g

function link(text, href, key) {
  if (href.startsWith('/')) {
    return isKnownInternalPath(href) ? <Link key={key} to={href}>{text}</Link> : <Fragment key={key}>{text}</Fragment>
  }
  if (/^https?:\/\//.test(href)) return <a key={key} href={href} target="_blank" rel="noopener">{text}</a>
  return <Fragment key={key}>{text}</Fragment>
}

/* Texte avec **gras** et [liens](/chemin). */
export function Inline({ text }) {
  const parts = String(text ?? '').split(TOKEN)
  return parts.map((part, i) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}><Inline text={part.slice(2, -2)} /></strong>
    }
    const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (m) return link(<Inline text={m[1]} />, m[2], i)
    return <Fragment key={i}>{part}</Fragment>
  })
}

function H2({ id, children }) {
  return (
    <h2 id={id} className="bl-h2">
      {children}
      <a className="bl-anc" href={`#${id}`} aria-label="Lien vers cette partie">#</a>
    </h2>
  )
}

/* Corps de l'article, bloc par bloc. */
export function Blocks({ sections = [], wa }) {
  return sections.map((s, i) => {
    switch (s.type) {
      case 'h2':
        return <H2 key={i} id={s.id || `partie-${i}`}><Inline text={s.content} /></H2>
      case 'h3':
        return <h3 key={i} className="bl-h3"><Inline text={s.content} /></h3>
      case 'p':
        return <p key={i}><Inline text={s.content} /></p>
      case 'ul':
        return <ul key={i} className="bl-ul">{(s.items || []).map((it, k) => <li key={k}><Inline text={it} /></li>)}</ul>
      case 'ol':
        return <ol key={i} className="bl-ol">{(s.items || []).map((it, k) => <li key={k}><Inline text={it} /></li>)}</ol>
      case 'table':
        return (
          <figure key={i} className="bl-tbl">
            {s.caption ? <figcaption><Inline text={s.caption} /></figcaption> : null}
            <div className="bl-tbl-s" role="region" aria-label={s.caption || 'Tableau'} tabIndex={0}>
              <table>
                <thead><tr>{(s.head || []).map((h, k) => <th key={k} scope="col"><Inline text={h} /></th>)}</tr></thead>
                <tbody>{(s.rows || []).map((r, k) => <tr key={k}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row"><Inline text={c} /></th> : <td key={j}><Inline text={c} /></td>))}</tr>)}</tbody>
              </table>
            </div>
          </figure>
        )
      case 'note':
        return (
          <aside key={i} className="bl-note">
            <span className="bl-note-ic"><Li k="spark" s={1.8} /></span>
            <div>
              <b>{s.title ? <Inline text={s.title} /> : 'Bon à savoir'}</b>
              <p><Inline text={s.content} /></p>
            </div>
          </aside>
        )
      case 'cta':
        return (
          <aside key={i} className="bl-cta">
            <span className="bl-cta-k">Appel de cadrage gratuit</span>
            <h3><Inline text={s.title} /></h3>
            {s.content ? <p><Inline text={s.content} /></p> : null}
            <div className="bl-cta-b">
              <Btn to="/contact">Réserver un appel</Btn>
              <WaBtn text={wa} tone="wh">WhatsApp</WaBtn>
            </div>
          </aside>
        )
      default:
        return null
    }
  })
}
