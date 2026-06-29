/** Numéro Supra v3 — source unique pour tel / WhatsApp sur le site */
export const PHONE_DISPLAY = '+212 728-521896'
export const PHONE_TEL = 'tel:+212728521896'
export const WHATSAPP_MSISDN = '212728521896'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_MSISDN}`

export function whatsappUrl(encodedText = '') {
  if (!encodedText) return WHATSAPP_URL
  return `${WHATSAPP_URL}?text=${encodedText}`
}

export function whatsappUrlWithMessage(message) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
}
