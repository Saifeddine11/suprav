/**
 * Envoi d'une demande vers l'endpoint contact existant (/api/contact.php).
 * Les règles de validation reprennent celles du serveur (api/contact.js, public/api/contact.php)
 * pour éviter un aller-retour inutile. Aucun succès n'est simulé.
 */
export const CONTACT_API_ENDPOINT = '/api/contact.php'

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"']+@[^\s@<>()[\]\\,;:"']+\.[^\s@<>()[\]\\,;:"']{2,}$/i
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+){0,5}$/
const URL_PATTERN = /(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|ma|fr|info|biz|ru|cn)\b)/i
const SPAM_PATTERN = /\b(?:casino|crypto|bitcoin|forex|loan|viagra|porn|seo backlinks?|whatsapp marketing|telegram)\b/i

export const CONTACT_ERRORS = {
  requiredName: 'Veuillez indiquer votre nom complet.',
  invalidName: 'Veuillez indiquer votre nom complet, sans chiffre ni symbole.',
  requiredPhone: 'Merci d’indiquer votre numéro de téléphone ou WhatsApp.',
  invalidPhone: 'Merci d’indiquer un numéro de téléphone valide.',
  invalidEmail: 'Merci de saisir une adresse email valide.',
  customTooShort: 'Merci de préciser en quelques mots.',
  customInvalid: 'Merci de reformuler sans lien ni adresse de site.',
  network: 'L’envoi n’a pas abouti. Vous pouvez réessayer dans un instant.',
}

export const cleanTextInput = (value) => String(value ?? '')
  .split('')
  .filter((char) => {
    const code = char.charCodeAt(0)
    return code > 31 && code !== 127
  })
  .join('')
  .replace(/\s+/g, ' ')
  .trim()

const phoneDigits = (value) => String(value ?? '').replace(/\D/g, '')

const isLikelyPhone = (value) => {
  const raw = cleanTextInput(value)
  const digits = phoneDigits(raw)
  if (!/^\+?[0-9()[\]\s.-]{8,24}$/.test(raw)) return false
  if (digits.length < 8 || digits.length > 15) return false
  if (/^(\d)\1{7,}$/.test(digits)) return false
  return !/(?:0123456789|1234567890|9876543210|0987654321)/.test(digits)
}

/** Réponse libre (option « Autre ») — refusée côté serveur si elle contient un lien. */
export function validateFreeText(value) {
  const text = cleanTextInput(value)
  if (text.length < 2) return CONTACT_ERRORS.customTooShort
  if (text.length > 160 || URL_PATTERN.test(text) || SPAM_PATTERN.test(text) || /(.)\1{9,}/i.test(text)) {
    return CONTACT_ERRORS.customInvalid
  }
  return ''
}

export function validateContactFields(values) {
  const name = cleanTextInput(values.name)
  const phone = cleanTextInput(values.phone)
  const email = cleanTextInput(values.email).toLowerCase()
  const errors = {}

  if (!name) errors.name = CONTACT_ERRORS.requiredName
  else if (
    name.length < 2
    || name.length > 80
    || !NAME_PATTERN.test(name)
    || URL_PATTERN.test(name)
  ) errors.name = CONTACT_ERRORS.invalidName

  if (!phone) errors.phone = CONTACT_ERRORS.requiredPhone
  else if (!isLikelyPhone(phone)) errors.phone = CONTACT_ERRORS.invalidPhone

  if (email && (email.length > 120 || !EMAIL_PATTERN.test(email))) errors.email = CONTACT_ERRORS.invalidEmail

  return {
    errors,
    sanitized: { name, phone, email },
    isValid: Object.keys(errors).length === 0,
  }
}

/**
 * Message composé à partir des réponses — une seule ligne :
 * le serveur supprime les retours à la ligne avant de chercher des liens.
 */
export function buildProjectMessage(summary) {
  const lines = summary.map((item) => `${item.label} : ${item.value}`)
  return cleanTextInput(`Demande via le parcours projet. ${lines.join(' | ')}`)
}

export async function sendContactRequest(payload) {
  let response
  try {
    response = await fetch(CONTACT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    return { ok: false, status: 0, message: CONTACT_ERRORS.network }
  }

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json().catch(() => ({})) : {}

  if (response.ok && data.ok) {
    return { ok: true, status: response.status, recap: data.recap ?? null }
  }

  return {
    ok: false,
    status: response.status,
    errors: data.errors && typeof data.errors === 'object' ? data.errors : null,
    message: data.message || CONTACT_ERRORS.network,
  }
}
