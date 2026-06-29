import './BrowserMockup.css'

function GlobeIcon() {
  return (
    <svg
      className="browser-mockup__globe"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3.75c2.2 2.5 3.4 5.2 3.4 8.25s-1.2 5.75-3.4 8.25M12 3.75c-2.2 2.5-3.4 5.2-3.4 8.25s1.2 5.75 3.4 8.25M4.5 9.75h15M4.5 14.25h15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Cadre navigateur — capture site web uniquement (pas de lecture vidéo).
 */
export default function BrowserMockup({
  image,
  title,
  domain,
  url,
  alt,
  aspectRatio = '16 / 10',
  className = '',
}) {
  const displayDomain =
    domain ||
    (url
      ? (() => {
          try {
            return new URL(url).hostname.replace(/^www\./i, '')
          } catch {
            return 'suprav3.com'
          }
        })()
      : 'suprav3.com')

  const mediaAlt = alt || (title ? `Capture du site ${title}` : 'Aperçu de site web')

  return (
    <div className={`browser-mockup ${className}`.trim()}>
      <div className="browser-mockup__frame">
        <div className="browser-mockup__chrome">
          <div className="browser-mockup__bar">
            <span className="browser-mockup__dots" aria-hidden="true">
              <span className="browser-mockup__dot browser-mockup__dot--close" />
              <span className="browser-mockup__dot browser-mockup__dot--minimize" />
              <span className="browser-mockup__dot browser-mockup__dot--zoom" />
            </span>
            <div className="browser-mockup__url" aria-hidden="true">
              <GlobeIcon />
              <span className="browser-mockup__url-text">{displayDomain}</span>
            </div>
          </div>
          <div className="browser-mockup__viewport" style={{ aspectRatio }}>
            {image ? (
              <img
                className="browser-mockup__shot"
                src={image}
                alt={mediaAlt}
                loading="lazy"
                decoding="async"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
