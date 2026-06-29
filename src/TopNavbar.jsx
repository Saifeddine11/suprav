import './TopNavbar.css'

export function TopNavbar() {
  return (
    <div className="top-navbar-wrap">
      <div className="top-navbar-shape">
        <svg
          className="top-navbar-shape__svg"
          xmlns="http://www.w3.org/2000/svg"
          width="342"
          height="36"
          viewBox="0 0 342 36"
          fill="none"
          overflow="visible"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M 5.456 0 C -54.232 0 396.772 0 336.428 0 C 276.084 0 312.723 36 253.697 36 C 194.671 36 108.098 36 89.438 36 C 27.285 36 65.144 0 5.456 0 Z"
            fill="currentColor"
          />
        </svg>
        <div className="top-navbar-shape__inner" role="status" aria-live="polite">
          <span className="top-navbar-shape__dot" aria-hidden="true" />
          <span className="top-navbar-shape__label">Disponible pour vos projets</span>
        </div>
      </div>
    </div>
  )
}
