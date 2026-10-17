/** Numéro Supra v3 — source unique pour tel / WhatsApp sur le site */
export const PHONE_DISPLAY = '+212 7 86 44 95 72'
export const PHONE_TEL = 'tel:+212786449572'
export const WHATSAPP_MSISDN = '212786449572'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_MSISDN}`

export const SOCIAL_LINKS = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/supra_v3/',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@supravofficiel',
  },
  {
    id: 'snapchat',
    label: 'Snapchat',
    href: 'https://snapchat.com/t/jL89tQsB',
  },
]

export function whatsappUrl(encodedText = '') {
  if (!encodedText) return WHATSAPP_URL
  return `${WHATSAPP_URL}?text=${encodedText}`
}

export function whatsappUrlWithMessage(message) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
}
