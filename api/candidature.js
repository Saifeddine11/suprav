/*
 * Candidatures « Rejoindre l'agence » (Vercel) : POST multipart/form-data avec CV, book ou photo en pièce jointe.
 * Même anti-spam que le formulaire de contact ; le fichier est vérifié par sa signature, pas par son extension.
 * Équivalent Hostinger : public/api/candidature.php (même comportement, mêmes réponses JSON).
 */
import { mailConfig, smtpReady, sendMail, escapeHtml, safeHeader } from './_mail.js'

const MAX_BODY_BYTES = 4 * 1024 * 1024
const MAX_FILE_BYTES = 3 * 1024 * 1024
const MIN_FILL_MS = 4000
const rateLimitStore = new Map()

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"']+@[^\s@<>()[\]\\,;:"']+\.[^\s@<>()[\]\\,;:"']{2,}$/i
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+){0,5}$/
const CITY_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+){0,4}$/
const URL_PATTERN = /(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|ma|fr|info|biz|ru|cn)\b)/i
const SPAM_PATTERN = /\b(?:casino|crypto|bitcoin|forex|loan|viagra|porn|seo backlinks?|whatsapp marketing|telegram)\b/i

const TYPES = { casting: 'Casting', competence: 'Compétence' }
const DOMAINS = {
  casting: ['Comédien ou comédienne', 'Mannequin', 'Créateur ou créatrice de contenu UGC', 'Voix off', 'Autre talent face caméra'],
  competence: ['Vidéo : cadrage et tournage', 'Montage et motion design', 'Design graphique et direction artistique', 'Développement web', 'Publicité en ligne (media buying)', 'Social media et community management', 'IA et automatisation', 'Stage ou alternance', 'Autre compétence'],
}
const FILE_TYPES = {
  pdf: { ext: 'pdf', mime: 'application/pdf', label: 'PDF' },
  jpg: { ext: 'jpg', mime: 'image/jpeg', label: 'JPG' },
  png: { ext: 'png', mime: 'image/png', label: 'PNG' },
  webp: { ext: 'webp', mime: 'image/webp', label: 'WebP' },
}

const GENERIC = 'Votre candidature n’a pas pu être traitée. Merci de réessayer.'

export default async function handler(req, res) {
  setSecurityHeaders(res)

  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return }
  if (req.method !== 'POST') return respond(res, 405, { ok: false, message: GENERIC })

  const contentType = String(req.headers['content-type'] || '')
  if (!/^multipart\/form-data;\s*boundary=/i.test(contentType)) return respond(res, 415, { ok: false, message: GENERIC })
  if (Number(req.headers['content-length'] || 0) > MAX_BODY_BYTES) return respond(res, 413, tooLarge())

  const ip = clientIp(req)
  if (!checkRateLimit(ip)) return respond(res, 429, { ok: false, message: 'Merci de patienter quelques minutes avant de renvoyer votre candidature.' })

  const body = await readBody(req)
  if (!body.ok) return respond(res, body.status, body.status === 413 ? tooLarge() : { ok: false, message: GENERIC })

  let form
  try {
    form = await new Request('http://localhost/api/candidature', { method: 'POST', headers: { 'content-type': contentType }, body: body.data }).formData()
  } catch {
    return respond(res, 400, { ok: false, message: GENERIC })
  }

  const text = (key) => { const v = form.get(key); return typeof v === 'string' ? cleanText(v) : '' }
  const values = {
    type: text('type'),
    domain: text('domain'),
    name: text('name'),
    email: text('email').toLowerCase(),
    phone: text('phone'),
    city: text('city'),
    portfolio: text('portfolio'),
    message: cleanMessage(form.get('message')),
    consent: text('consent'),
    website: text('website'),
  }
  const startedAt = Number(text('startedAt')) || 0
  const turnstileToken = text('turnstileToken')

  /* champ piège rempli : on répond comme si tout allait bien, sans rien envoyer */
  if (values.website) return respond(res, 200, { ok: true })

  const errors = validate(values, startedAt)
  const file = await inspectFile(form.get('cv'), values.type)
  if (file.error) errors.cv = file.error

  const cfg = mailConfig()
  if (cfg.turnstileSecret && turnstileToken && !(await verifyTurnstile(cfg.turnstileSecret, turnstileToken, ip))) {
    errors.form = 'Merci de confirmer le formulaire avant l’envoi.'
  }
  if (Object.keys(errors).length) return respond(res, 422, { ok: false, errors })

  if (!smtpReady(cfg)) {
    console.error('Candidature : SMTP non configuré (CONTACT_SMTP_HOST, CONTACT_SMTP_USERNAME, CONTACT_SMTP_PASSWORD).')
    return respond(res, 500, { ok: false, message: 'L’envoi en ligne est momentanément indisponible.' })
  }

  const sent = await sendMail(cfg, {
    subject: `Candidature Supra v3 — ${TYPES[values.type]} — ${safeHeader(values.name)}`,
    html: buildHtmlEmail(values, file, ip),
    replyTo: safeHeader(values.email),
    attachments: [{ filename: file.filename, contentType: file.type.mime, content: file.buffer }],
  })
  if (!sent) return respond(res, 500, { ok: false, message: 'Votre candidature n’a pas pu être envoyée pour le moment.' })

  return respond(res, 200, { ok: true })
}

function validate(values, startedAt) {
  const errors = {}
  const digits = phoneDigits(values.phone)

  if (!TYPES[values.type]) errors.type = 'Choisissez Casting ou Compétence.'
  else if (!DOMAINS[values.type].includes(values.domain)) errors.domain = 'Choisissez un domaine.'

  if (
    !values.name || values.name.length < 2 || values.name.length > 80
    || !NAME_PATTERN.test(values.name) || EMAIL_PATTERN.test(values.name) || URL_PATTERN.test(values.name) || /\d/.test(values.name)
  ) errors.name = 'Indiquez votre prénom et votre nom (lettres uniquement).'

  if (!values.email || values.email.length > 120 || !EMAIL_PATTERN.test(values.email)) errors.email = 'Indiquez une adresse e-mail valide.'
  if (!values.phone || !isLikelyPhone(values.phone)) errors.phone = 'Indiquez un numéro WhatsApp valide.'
  if (!values.city || values.city.length > 60 || !CITY_PATTERN.test(values.city)) errors.city = 'Indiquez votre ville.'

  if (values.portfolio && !isPortfolioUrl(values.portfolio)) errors.portfolio = 'Collez un lien complet qui commence par https://'

  if (values.message) {
    if ([...values.message].length > 1500) errors.message = '1500 caractères maximum.'
    else if (URL_PATTERN.test(values.message)) errors.message = 'Mettez vos liens dans le champ portfolio, pas dans le message.'
    else if (SPAM_PATTERN.test(values.message) || /(.)\1{9,}/i.test(values.message)) errors.message = 'Merci de reformuler votre message.'
  }

  if (values.consent !== 'oui') errors.consent = 'Cochez cette case pour que nous puissions traiter votre candidature.'

  if (digits.length >= 6 && phoneDigits(values.name).includes(digits)) errors.name = 'Indiquez uniquement votre prénom et votre nom dans ce champ.'
  if (values.email && values.name.toLowerCase().includes(values.email)) errors.name = 'Indiquez uniquement votre prénom et votre nom dans ce champ.'

  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) errors.form = 'Merci de patienter quelques secondes avant d’envoyer votre candidature.'
  return errors
}

async function inspectFile(entry, type) {
  const missing = type === 'casting' ? 'Ajoutez une photo récente ou votre book.' : 'Ajoutez votre CV.'
  if (!entry || typeof entry === 'string' || !entry.size) return { error: missing }
  if (entry.size > MAX_FILE_BYTES) return { error: 'Fichier trop lourd : 3 Mo maximum.' }
  const buffer = Buffer.from(await entry.arrayBuffer())
  const kind = sniff(buffer)
  if (!kind) return { error: 'Format non accepté. Envoyez un PDF, un JPG, un PNG ou un WebP.' }
  return { buffer, type: FILE_TYPES[kind], size: buffer.length, filename: sanitizeFilename(entry.name, FILE_TYPES[kind].ext) }
}

/* Type réel du fichier d'après ses premiers octets. */
function sniff(buffer) {
  if (buffer.length < 12) return ''
  if (buffer.subarray(0, 4).toString('latin1') === '%PDF') return 'pdf'
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg'
  if (buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) return 'png'
  if (buffer.subarray(0, 4).toString('latin1') === 'RIFF' && buffer.subarray(8, 12).toString('latin1') === 'WEBP') return 'webp'
  return ''
}

function sanitizeFilename(name, ext) {
  const base = String(name || '')
    .split(/[\\/]/).pop()
    .replace(/\.[^.]*$/, '')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 80)
  return `${base || 'candidature'}.${ext}`
}

function isPortfolioUrl(value) {
  if (value.length > 300) return false
  try {
    const url = new URL(value)
    return /^https?:$/.test(url.protocol) && url.hostname.includes('.') && !url.username && !url.password
  } catch {
    return false
  }
}

function buildHtmlEmail(values, file, ip) {
  const v = Object.fromEntries(Object.entries(values).map(([k, val]) => [k, escapeHtml(val)]))
  const type = escapeHtml(TYPES[values.type])
  const message = values.message ? escapeHtml(values.message).replace(/\n/g, '<br>') : '<span style="color:rgba(255,255,255,0.45);">Aucun message</span>'
  const portfolio = values.portfolio ? `<a href="${v.portfolio}" style="color:#E8491C;text-decoration:none;word-break:break-all;">${v.portfolio}</a>` : '<span style="color:rgba(255,255,255,0.45);">Non renseigné</span>'
  const fileLine = `${escapeHtml(file.filename)} · ${escapeHtml(file.type.label)} · ${escapeHtml(formatSize(file.size))}`
  const mailtoHref = escapeHtml(`mailto:${values.email}?subject=${encodeURIComponent('Re: Votre candidature — Supra V3')}`)
  const whatsappHref = escapeHtml(`https://wa.me/${phoneDigitsWithCountry(values.phone)}`)
  const telHref = escapeHtml(`tel:+${phoneDigitsWithCountry(values.phone)}`)
  const label = 'font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin-bottom:6px;'
  const value = 'font-size:14px;font-weight:600;color:#ffffff;line-height:1.45;'
  const cell = 'padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.06);'

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Nouvelle candidature — Supra V3</title></head>
<body style="margin:0;padding:0;background:#0e0e0e;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0e0e0e;margin:0;padding:36px 14px;"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
<tr><td style="padding:32px 36px 28px;background:#111111;border-bottom:1px solid rgba(255,255,255,0.06);">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="font-size:22px;font-weight:800;color:#ffffff;">SUPRA<span style="color:#E8491C;">V3</span></td><td align="right"><span style="display:inline-block;background:rgba(232,73,28,0.12);border:1px solid rgba(232,73,28,0.28);color:#E8491C;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:999px;">● Candidature</span></td></tr></table>
<h1 style="margin:22px 0 0;font-size:20px;line-height:1.3;font-weight:700;color:#ffffff;">Nouvelle candidature — ${type}</h1><p style="margin:5px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.45);">Reçue le ${escapeHtml(formatReceivedAt())}</p></td></tr>
<tr><td style="padding:24px 36px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(232,73,28,0.08);border:1px solid rgba(232,73,28,0.16);border-radius:10px;"><tr><td width="54" style="padding:14px 0 14px 18px;vertical-align:middle;"><div style="width:42px;height:36px;line-height:36px;text-align:center;background:rgba(232,73,28,0.15);border-radius:8px;color:#E8491C;font-size:11px;font-weight:800;letter-spacing:0.8px;">${values.type === 'casting' ? 'CAST' : 'CV'}</div></td><td style="padding:14px 18px 14px 12px;"><div style="font-size:14px;font-weight:700;color:#ffffff;line-height:1.4;">${v.domain}</div><div style="font-size:12px;color:rgba(255,255,255,0.48);line-height:1.5;">${type} · ${v.city}</div></td></tr></table></td></tr>
<tr><td style="padding:28px 36px 20px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;">
<tr><td width="50%" style="${cell}border-right:1px solid rgba(255,255,255,0.06);"><div style="${label}">Nom</div><div style="${value}">${v.name}</div></td><td width="50%" style="${cell}"><div style="${label}">Téléphone</div><div style="${value}"><a href="${telHref}" style="color:#E8491C;text-decoration:none;">${v.phone}</a></div></td></tr>
<tr><td width="50%" style="${cell}border-right:1px solid rgba(255,255,255,0.06);"><div style="${label}">Email</div><div style="${value}"><a href="mailto:${v.email}" style="color:#E8491C;text-decoration:none;">${v.email}</a></div></td><td width="50%" style="${cell}"><div style="${label}">Ville</div><div style="${value}">${v.city}</div></td></tr>
<tr><td colspan="2" style="${cell}"><div style="${label}">Portfolio</div><div style="${value}">${portfolio}</div></td></tr>
<tr><td colspan="2" style="padding:16px 18px;"><div style="${label}">Pièce jointe</div><div style="${value}">${fileLine}</div></td></tr></table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;"><tr><td style="padding:20px;"><div style="${label}margin-bottom:10px;">Message</div><div style="font-size:15px;line-height:1.65;color:rgba(255,255,255,0.82);">${message}</div></td></tr></table></td></tr>
<tr><td style="padding:0 36px 28px;"><table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="padding-right:10px;"><a href="${mailtoHref}" style="display:inline-block;background:#E8491C;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:13px 22px;border-radius:10px;">Répondre par email</a></td><td><a href="${whatsappHref}" style="display:inline-block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.78);text-decoration:none;font-size:13px;font-weight:700;padding:12px 22px;border-radius:10px;">WhatsApp</a></td></tr></table></td></tr>
<tr><td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="font-size:11px;color:rgba(255,255,255,0.3);">Rejoindre l’agence · suprav3.com · consentement donné (12 mois)</td><td align="right" style="font-size:11px;color:rgba(255,255,255,0.25);">IP <span style="font-family:monospace;font-size:10px;background:rgba(255,255,255,0.05);padding:3px 6px;border-radius:4px;color:rgba(255,255,255,0.4);">${escapeHtml(ip)}</span></td></tr></table></td></tr>
</table></td></tr></table></body></html>`
}

function setSecurityHeaders(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('X-Frame-Options', 'DENY')
}

function respond(res, status, payload) {
  res.statusCode = status
  res.end(JSON.stringify(payload))
}

function tooLarge() {
  return { ok: false, errors: { cv: 'Fichier trop lourd : 3 Mo maximum.' }, message: 'Fichier trop lourd : 3 Mo maximum.' }
}

async function readBody(req) {
  const chunks = []
  let size = 0
  try {
    for await (const chunk of req) {
      size += chunk.length
      if (size > MAX_BODY_BYTES) return { ok: false, status: 413 }
      chunks.push(chunk)
    }
  } catch {
    return { ok: false, status: 400 }
  }
  return { ok: true, data: Buffer.concat(chunks) }
}

function cleanText(value) {
  return String(value ?? '')
    .split('')
    .filter((char) => { const code = char.charCodeAt(0); return code > 31 && code !== 127 })
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

/* Message : on garde les retours à la ligne, on retire les autres caractères de contrôle. */
function cleanMessage(value) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/\r\n?/g, '\n')
    .split('')
    .filter((char) => { const code = char.charCodeAt(0); return char === '\n' || (code > 31 && code !== 127) })
    .join('')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function isLikelyPhone(value) {
  const digits = phoneDigits(value)
  if (!/^\+?[0-9()[\]\s.-]{8,24}$/.test(value)) return false
  if (digits.length < 8 || digits.length > 15) return false
  if (/^(\d)\1{7,}$/.test(digits)) return false
  return !/(?:0123456789|1234567890|9876543210|0987654321)/.test(digits)
}

function phoneDigits(value) {
  return String(value ?? '').replace(/\D/g, '')
}

function phoneDigitsWithCountry(phone) {
  const digits = phoneDigits(phone)
  if (digits.startsWith('00')) return digits.slice(2)
  if (digits.startsWith('0')) return `212${digits.slice(1)}`
  return digits
}

async function verifyTurnstile(secret, token, ip) {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    })
    const data = await response.json()
    return data?.success === true
  } catch {
    return false
  }
}

function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const attempts = (rateLimitStore.get(ip) || []).filter((timestamp) => now - timestamp < windowMs)
  if (attempts.length >= 5) { rateLimitStore.set(ip, attempts); return false }
  attempts.push(now)
  rateLimitStore.set(ip, attempts)
  return true
}

function clientIp(req) {
  return String(req.headers['x-real-ip'] || req.socket?.remoteAddress || '0.0.0.0')
}

function formatSize(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} Ko` : `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} Mo`
}

function formatReceivedAt() {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca' })
    .format(new Date()).replace(':', 'h')
}
