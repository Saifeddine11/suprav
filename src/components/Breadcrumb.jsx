/**
 * Breadcrumb SEO — Schema BreadcrumbList JSON-LD inclus.
 * @param {Array<{label: string, path?: string}>} items
 */
export default function Breadcrumb({ items = [] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.path ? { item: `https://suprav3.com${item.path}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <ol className="breadcrumb__list">
          {items.map((item, i) => (
            <li key={i} className="breadcrumb__item">
              {item.path && i < items.length - 1 ? (
                <a href={item.path} className="breadcrumb__link">{item.label}</a>
              ) : (
                <span className="breadcrumb__current" aria-current="page">{item.label}</span>
              )}
              {i < items.length - 1 && (
                <span className="breadcrumb__sep" aria-hidden="true">›</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
