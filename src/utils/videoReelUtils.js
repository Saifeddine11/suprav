const FALLBACK_VIDEO_TITLE = 'Production vidéo Supra v3'

export function videoDisplayTitle(item) {
  const title = item?.title?.trim()
  return title || FALLBACK_VIDEO_TITLE
}

export function videoAriaLabel(item, action = 'Lire') {
  if (item?.ariaLabel?.trim()) return item.ariaLabel.trim()
  return `${action} la vidéo : ${videoDisplayTitle(item)}`
}
