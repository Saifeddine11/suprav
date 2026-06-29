import { useState } from 'react'
import './ExpandableGrid.css'

/**
 * Affiche un sous-ensemble d’éléments avec bouton Voir plus / Voir moins.
 */
export default function ExpandableGrid({ items, initialVisible, children }) {
  const [expanded, setExpanded] = useState(false)
  const hasMore = items.length > initialVisible
  const visibleItems = !hasMore || expanded ? items : items.slice(0, initialVisible)

  return (
    <div className="expandable-grid">
      {children(visibleItems)}
      {hasMore ? (
        <div className="expandable-grid__toggle-wrap">
          <button
            type="button"
            className="expandable-grid__toggle"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
          >
            {expanded ? 'Voir moins' : 'Voir plus'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
