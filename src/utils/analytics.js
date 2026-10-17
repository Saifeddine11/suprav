/**
 * Suivi marketing du site : GA4 (gtag) et pixel Meta (fbq), tous deux chargés dans index.html.
 * Chaque appel vérifie la présence du script : un bloqueur de publicité ne doit jamais casser la page.
 *
 * Événements standard Meta (ceux que les campagnes optimisent) : Lead (formulaire accepté par le serveur),
 * Contact (WhatsApp, appel, email), Schedule (créneau choisi), ViewContent (landing page affichée,
 * cf. trackLandingView). Tout autre nom part en événement personnalisé, sous le même nom qu’en GA4 :
 * form_start, cta_click, select_content (vidéo ou projet ouvert)…
 */
const META_STANDARD_EVENTS = {
  generate_lead: 'Lead',
  contact_click: 'Contact',
  schedule: 'Schedule',
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') window.gtag('event', name, params)
  if (typeof window.fbq === 'function') {
    const standard = META_STANDARD_EVENTS[name]
    if (standard) window.fbq('track', standard, params)
    else window.fbq('trackCustom', name, params)
  }
}

/** Clic WhatsApp / appel / email : « contact_click » côté GA4, « Contact » côté Meta. */
export function trackContactIntent(channel, place) {
  trackEvent('contact_click', { contact_channel: channel, cta_place: place })
}

/**
 * Landing page affichée : « ViewContent » côté Meta, une seule fois par affichage (l’appelant s’en assure).
 * Rien pour GA4, qui compte déjà la page vue.
 */
export function trackLandingView(name) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', 'ViewContent', { content_name: name, content_category: 'landing_page' })
}

/**
 * Navigation interne (React Router) : le pixel ne voit que le premier chargement, on lui signale
 * chaque nouvelle route. GA4 suit déjà l’historique du navigateur (mesure améliorée) : rien à envoyer.
 */
export function trackPageView() {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', 'PageView')
}
