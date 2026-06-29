import { motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const MOBILE_LABEL_HIDE_MS = 2500

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconServices() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconRealisations() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
      <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12v9M4 7.5 12 12l8-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBlog() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
      <path d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 4v4h4M8 12h8M8 16h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconContact() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
      <path d="M4 6h16v12H4V6Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TubelightLamp({ layoutId }) {
  return (
    <motion.div
      layoutId={layoutId}
      className="tubelight-nav__lamp"
      initial={false}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="tubelight-nav__lamp-bar" aria-hidden="true">
        <span className="tubelight-nav__lamp-glow tubelight-nav__lamp-glow--wide" />
        <span className="tubelight-nav__lamp-glow tubelight-nav__lamp-glow--mid" />
        <span className="tubelight-nav__lamp-glow tubelight-nav__lamp-glow--tight" />
      </div>
    </motion.div>
  )
}

export function TubelightNavItem({
  to,
  label,
  isActive,
  icon: Icon,
  layoutId,
  showLabel = true,
  showIcon = false,
  onClick,
  className = '',
  onFocus,
  onBlur,
  onPointerEnter,
  onPointerLeave,
}) {
  return (
    <Link
      to={to}
      className={`tubelight-nav__item${isActive ? ' is-active' : ''}${className ? ` ${className}` : ''}`}
      aria-label={showIcon && !showLabel ? label : undefined}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {showLabel ? <span className="tubelight-nav__label">{label}</span> : null}
      {showIcon && Icon ? (
        <span className="tubelight-nav__icon">
          <Icon />
        </span>
      ) : null}
      {isActive && layoutId ? <TubelightLamp layoutId={layoutId} /> : null}
    </Link>
  )
}

function TubelightMobileNavItem({
  to,
  label,
  isActive,
  icon: Icon,
  onFocus,
  onBlur,
  onPointerEnter,
  onPointerLeave,
  onClick,
}) {
  return (
    <Link
      to={to}
      className={`tubelight-nav__item tubelight-nav__item--mobile${isActive ? ' is-active' : ''}`}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <span className="tubelight-nav__icon">
        <Icon />
      </span>
    </Link>
  )
}

export function TubelightMobileNav({ items, onNavigate }) {
  const [visibleLabel, setVisibleLabel] = useState(null)
  const [isLabelVisible, setIsLabelVisible] = useState(false)
  const hideTimerRef = useRef(null)
  const activeItem = items.find((item) => item.isActive)
  const titleIsActive = visibleLabel === activeItem?.label

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  const showLabel = useCallback((label) => {
    if (!label) return

    clearHideTimer()
    setVisibleLabel(label)
    setIsLabelVisible(true)
    hideTimerRef.current = setTimeout(() => {
      setIsLabelVisible(false)
      hideTimerRef.current = null
    }, MOBILE_LABEL_HIDE_MS)
  }, [clearHideTimer])

  useEffect(() => {
    if (activeItem?.label) {
      showLabel(activeItem.label)
    }

    return clearHideTimer
  }, [activeItem?.label, showLabel, clearHideTimer])

  const handleItemPreview = useCallback((label) => {
    showLabel(label)
  }, [showLabel])

  const handleItemPreviewEnd = useCallback(() => {
    if (activeItem?.label) {
      showLabel(activeItem.label)
    }
  }, [activeItem?.label, showLabel])

  const handleTitleTransitionEnd = useCallback(() => {
    if (!isLabelVisible) {
      setVisibleLabel(null)
    }
  }, [isLabelVisible])

  return (
    <nav className="nav__tubelight-mobile" aria-label="Navigation mobile">
      {visibleLabel ? (
        <div className="tubelight-nav__mobile-title-slot" aria-hidden={!isLabelVisible}>
          <div
            className={`tubelight-nav__mobile-title${isLabelVisible ? ' is-visible' : ''}${titleIsActive ? ' is-active' : ''}`}
            aria-live="polite"
            onTransitionEnd={handleTitleTransitionEnd}
          >
            {visibleLabel}
          </div>
        </div>
      ) : null}
      <div className="tubelight-nav__pill tubelight-nav__pill--mobile">
        {items.map((item) => (
          <TubelightMobileNavItem
            key={item.key}
            to={item.to}
            label={item.label}
            isActive={item.isActive}
            icon={item.icon}
            onClick={onNavigate}
            onFocus={() => handleItemPreview(item.label)}
            onBlur={handleItemPreviewEnd}
            onPointerEnter={() => handleItemPreview(item.label)}
            onPointerLeave={handleItemPreviewEnd}
          />
        ))}
      </div>
    </nav>
  )
}

export const TUBELIGHT_NAV_ICONS = {
  home: IconHome,
  services: IconServices,
  realisations: IconRealisations,
  blog: IconBlog,
  contact: IconContact,
}
