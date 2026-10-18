import { Link } from 'react-router-dom'
import Cover from './Cover.jsx'
import { formatBlogDate, formatBlogReadTime, getBlogPostPath } from '../../../data/blogPosts.js'

/* Carte d'article : couverture, catégorie, titre, extrait, date et durée de lecture. */
export default function PostCard({ post, style, className = '', headingLevel = 'h3' }) {
  const H = headingLevel
  return (
    <article className={`bl-card ${className}`.trim()} style={style} data-hov>
      <Link className="bl-card-l" to={getBlogPostPath(post.slug)}>
        <Cover visual={post.visual} seed={post.slug} />
        <div className="bl-card-b">
          <span className="bl-cat">{post.category}</span>
          <H className="bl-card-t">{post.title}</H>
          <p className="bl-card-x">{post.excerpt}</p>
          <span className="bl-meta">
            <time dateTime={post.updatedAt || post.publishedAt}>{formatBlogDate(post.updatedAt || post.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{formatBlogReadTime(post)} de lecture</span>
          </span>
        </div>
      </Link>
    </article>
  )
}
