import crypto from 'node:crypto'
import net from 'node:net'
import tls from 'node:tls'

const RECAP_COOKIE = 'suprav_contact_recap'
const RECAP_TTL_SECONDS = 48 * 60 * 60
const MAX_BODY_BYTES = 12_000
const rateLimitStore = new Map()

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"']+@[^\s@<>()[\]\\,;:"']+\.[^\s@<>()[\]\\,;:"']{2,}$/i
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+){0,5}$/
const URL_PATTERN = /(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|io|co|ma|fr|info|biz|ru|cn)\b)/i
const SPAM_PATTERN = /\b(?:casino|crypto|bitcoin|forex|loan|viagra|porn|seo backlinks?|whatsapp marketing|telegram)\b/i

const config = () => ({
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY || '',
  mailTo: process.env.CONTACT_MAIL_TO || 'contact@suprav3.com',
  mailFrom: process.env.CONTACT_MAIL_FROM || 'contact@suprav3.com',
  smtpHost: process.env.CONTACT_SMTP_HOST || '',
  smtpPort: Number(process.env.CONTACT_SMTP_PORT || 465),
  smtpUsername: process.env.CONTACT_SMTP_USERNAME || '',
  smtpPassword: process.env.CONTACT_SMTP_PASSWORD || '',
  smtpSecure: (process.env.CONTACT_SMTP_SECURE || 'ssl').toLowerCase(),
})

export default async function handler(req, res) {
  setSecurityHeaders(res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  const ip = clientIp(req)

  if (req.method === 'GET') {
    respond(res, 200, { ok: true, recap: readRecapCookie(req, ip) })
    return
  }

  if (req.method !== 'POST') {
    respond(res, 405, { ok: false, message: 'Votre demande n’a pas pu être traitée. Merci de réessayer.' })
    return
  }

  if (!checkRateLimit(ip)) {
    respond(res, 429, { ok: false, message: 'Merci de patienter quelques minutes avant de renvoyer votre demande.' })
    return
  }

  const input = await readJsonBody(req)
  if (!input.ok) {
    respond(res, input.status, { ok: false, message: input.message })
    return
  }

  const values = {
    name: cleanText(input.data.name),
    email: cleanText(input.data.email).toLowerCase(),
    phone: cleanText(input.data.phone),
    message: cleanText(input.data.message),
    website: cleanText(input.data.website),
    date: cleanText(input.data.date),
    time: cleanText(input.data.time),
  }
  const turnstileToken = cleanText(input.data.turnstileToken)
  const errors = validateContact(values)
  const cfg = config()

  if (cfg.turnstileSecret && turnstileToken && !(await verifyTurnstile(cfg.turnstileSecret, turnstileToken, ip))) {
    errors.turnstile = 'Merci de confirmer le formulaire avant l’envoi.'
  }

  if (Object.keys(errors).length > 0) {
    respond(res, 422, { ok: false, errors })
    return
  }

  if (!cfg.smtpHost || !cfg.smtpUsername || !cfg.smtpPassword) {
    respond(res, 500, {
      ok: false,
      message: 'SMTP non configuré sur Vercel. Ajoutez CONTACT_SMTP_HOST, CONTACT_SMTP_USERNAME et CONTACT_SMTP_PASSWORD.',
    })
    return
  }

  const subject = `Nouveau projet Supra v - ${safeHeader(values.name)}`
  const html = buildHtmlEmail(values, ip)
  const sent = await sendSmtpMail(cfg, subject, html, safeHeader(values.email))

  if (!sent) {
    respond(res, 500, { ok: false, message: 'Votre message n’a pas pu être envoyé pour le moment. Merci de réessayer dans quelques instants.' })
    return
  }

  const recap = buildRecap(values)
  setRecapCookie(res, ip, recap)
  respond(res, 200, { ok: true, recap })
}

function setSecurityHeaders(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('X-Frame-Options', 'DENY')
}

function respond(res, status, payload) {
  res.status(status).json(payload)
}

async function readJsonBody(req) {
  const contentType = req.headers['content-type'] || ''
  if (!contentType.includes('application/json')) {
    return { ok: false, status: 415, message: 'Votre demande n’a pas pu être traitée. Merci de réessayer.' }
  }

  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) {
      return { ok: false, status: 413, message: 'Merci de raccourcir légèrement votre message avant l’envoi.' }
    }
    chunks.push(chunk)
  }

  try {
    const data = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    return { ok: true, data }
  } catch {
    return { ok: false, status: 400, message: 'Votre demande n’a pas pu être traitée. Merci de réessayer.' }
  }
}

function cleanText(value) {
  return String(value ?? '')
    .split('')
    .filter((char) => {
      const code = char.charCodeAt(0)
      return code > 31 && code !== 127
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

function validateContact(values) {
  const errors = {}
  const digits = phoneDigits(values.phone)
  const email = values.email.toLowerCase()
  const comparableName = cleanText(values.name).toLowerCase()
  const comparablePhone = cleanText(values.phone).toLowerCase()

  if (!values.name) errors.name = 'Veuillez indiquer votre nom complet.'
  else if (
    values.name.length < 2
    || values.name.length > 80
    || !NAME_PATTERN.test(values.name)
    || EMAIL_PATTERN.test(values.name)
    || URL_PATTERN.test(values.name)
    || /\d/.test(values.name)
  ) errors.name = 'Veuillez indiquer votre nom complet.'

  if (!email) errors.email = 'Merci de saisir votre adresse email.'
  else if (email.length > 120 || !EMAIL_PATTERN.test(email)) errors.email = 'Merci de saisir une adresse email valide.'

  if (!values.phone) errors.phone = 'Merci d’indiquer votre numéro de téléphone.'
  else if (!isLikelyPhone(values.phone)) errors.phone = 'Merci d’indiquer un numéro de téléphone valide.'

  if (!values.message) errors.message = 'Pouvez-vous nous en dire un peu plus sur votre projet ?'
  else if (
    values.message.length < 30
    || values.message.length > 2000
    || URL_PATTERN.test(values.message)
    || SPAM_PATTERN.test(values.message)
    || /(.)\1{9,}/i.test(values.message)
  ) errors.message = 'Merci de détailler légèrement votre demande pour que nous puissions mieux vous accompagner.'

  if (email && comparableName.includes(email)) errors.name = 'Veuillez indiquer uniquement votre nom complet dans ce champ.'
  if (digits.length >= 6 && phoneDigits(values.name).includes(digits)) errors.name = 'Veuillez indiquer uniquement votre nom complet dans ce champ.'
  if (digits.length >= 6 && phoneDigits(email).includes(digits)) errors.email = 'Merci de vérifier votre adresse email.'
  if (email && comparablePhone.includes(email)) errors.phone = 'Merci de vérifier votre numéro de téléphone.'

  return errors
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

async function verifyTurnstile(secret, token, ip) {
  if (!token) return false
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

function buildHtmlEmail(values, ip) {
  const name = escapeHtml(values.name)
  const email = escapeHtml(values.email)
  const phone = escapeHtml(values.phone)
  const message = escapeHtml(values.message).replace(/\n/g, '<br>')
  const date = escapeHtml(values.date)
  const time = escapeHtml(values.time)
  const receivedAt = escapeHtml(formatReceivedAt())
  const ipText = escapeHtml(ip)
  const mailtoHref = escapeHtml(`mailto:${values.email}?subject=${encodeURIComponent('Re: Votre demande — Supra V3')}`)
  const whatsappHref = escapeHtml(`https://wa.me/${phoneDigitsWithCountry(values.phone)}`)
  const telHref = escapeHtml(`tel:${phoneDigitsWithCountry(values.phone)}`)

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Nouvelle demande — Supra V3</title></head>
<body style="margin:0;padding:0;background:#0e0e0e;color:#e8e8e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0e0e0e;margin:0;padding:36px 14px;"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#161616;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
<tr><td style="padding:32px 36px 28px;background:#111111;border-bottom:1px solid rgba(255,255,255,0.06);">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="font-size:22px;font-weight:800;color:#ffffff;">SUPRA<span style="color:#E8491C;">V3</span></td><td align="right"><span style="display:inline-block;background:rgba(232,73,28,0.12);border:1px solid rgba(232,73,28,0.28);color:#E8491C;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;border-radius:999px;">● Nouveau lead</span></td></tr></table>
<h1 style="margin:22px 0 0;font-size:20px;line-height:1.3;font-weight:700;color:#ffffff;">Nouvelle demande de projet</h1><p style="margin:5px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.45);">Reçue le ${receivedAt}</p></td></tr>
<tr><td style="padding:24px 36px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(232,73,28,0.08);border:1px solid rgba(232,73,28,0.16);border-radius:10px;"><tr><td width="54" style="padding:14px 0 14px 18px;vertical-align:middle;"><div style="width:42px;height:36px;line-height:36px;text-align:center;background:rgba(232,73,28,0.15);border-radius:8px;color:#E8491C;font-size:11px;font-weight:800;letter-spacing:0.8px;">RDV</div></td><td style="padding:14px 18px 14px 12px;"><div style="font-size:14px;font-weight:700;color:#ffffff;line-height:1.4;">${date}</div><div style="font-size:12px;color:rgba(255,255,255,0.48);line-height:1.5;">Créneau souhaité · ${time}</div></td></tr></table></td></tr>
<tr><td style="padding:28px 36px 20px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;"><tr><td width="50%" style="padding:16px 18px;border-right:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin-bottom:6px;">Nom</div><div style="font-size:14px;font-weight:600;color:#ffffff;line-height:1.45;">${name}</div></td><td width="50%" style="padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.06);"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin-bottom:6px;">Téléphone</div><div style="font-size:14px;font-weight:600;line-height:1.45;"><a href="${telHref}" style="color:#E8491C;text-decoration:none;">${phone}</a></div></td></tr><tr><td colspan="2" style="padding:16px 18px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin-bottom:6px;">Email</div><div style="font-size:14px;font-weight:600;line-height:1.45;"><a href="mailto:${email}" style="color:#E8491C;text-decoration:none;">${email}</a></div></td></tr></table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;"><tr><td style="padding:20px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,0.35);margin-bottom:10px;">Message</div><div style="font-size:15px;line-height:1.65;color:rgba(255,255,255,0.82);">${message}</div></td></tr></table></td></tr>
<tr><td style="padding:0 36px 28px;"><table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="padding-right:10px;"><a href="${mailtoHref}" style="display:inline-block;background:#E8491C;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:13px 22px;border-radius:10px;">Répondre par email</a></td><td><a href="${whatsappHref}" style="display:inline-block;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.78);text-decoration:none;font-size:13px;font-weight:700;padding:12px 22px;border-radius:10px;">WhatsApp</a></td></tr></table></td></tr>
<tr><td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="font-size:11px;color:rgba(255,255,255,0.3);">Formulaire · suprav3.com</td><td align="right" style="font-size:11px;color:rgba(255,255,255,0.25);">IP <span style="font-family:monospace;font-size:10px;background:rgba(255,255,255,0.05);padding:3px 6px;border-radius:4px;color:rgba(255,255,255,0.4);">${ipText}</span></td></tr></table></td></tr>
</table></td></tr></table></body></html>`
}

async function sendSmtpMail(cfg, subject, html, replyTo) {
  const headers = [
    `From: Supra v <${safeHeader(cfg.mailFrom)}>`,
    `To: ${safeHeader(cfg.mailTo)}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${safeHeader(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
  ]
  const message = `${headers.join('\r\n')}\r\n\r\n${dotStuff(html)}`

  try {
    const socket = await openSmtpSocket(cfg)
    await expect(socket, [220])
    await command(socket, 'EHLO suprav3.com', [250])
    await command(socket, 'AUTH LOGIN', [334])
    await command(socket, Buffer.from(cfg.smtpUsername).toString('base64'), [334])
    await command(socket, Buffer.from(cfg.smtpPassword).toString('base64'), [235])
    await command(socket, `MAIL FROM:<${safeHeader(cfg.mailFrom)}>`, [250])
    await command(socket, `RCPT TO:<${safeHeader(cfg.mailTo)}>`, [250, 251])
    await command(socket, 'DATA', [354])
    await command(socket, `${message}\r\n.`, [250])
    await command(socket, 'QUIT', [221])
    socket.end()
    return true
  } catch (error) {
    console.error('SMTP delivery failed:', error?.message || error)
    return false
  }
}

function openSmtpSocket(cfg) {
  return new Promise((resolve, reject) => {
    const options = { host: cfg.smtpHost, port: cfg.smtpPort, servername: cfg.smtpHost }
    const socket = cfg.smtpSecure === 'ssl' ? tls.connect(options, () => resolve(socket)) : net.connect(options, () => resolve(socket))
    socket.setTimeout(12_000)
    socket.once('error', reject)
    socket.once('timeout', () => reject(new Error('SMTP timeout')))
  })
}

function command(socket, line, expectedCodes) {
  socket.write(`${line}\r\n`)
  return expect(socket, expectedCodes)
}

function expect(socket, expectedCodes) {
  return new Promise((resolve, reject) => {
    let response = ''
    const onData = (chunk) => {
      response += chunk.toString('utf8')
      const lines = response.split(/\r?\n/).filter(Boolean)
      const last = lines.at(-1) || ''
      if (!/^\d{3}\s/.test(last)) return

      socket.off('data', onData)
      const code = Number(last.slice(0, 3))
      if (expectedCodes.includes(code)) resolve(response)
      else reject(new Error(response.trim()))
    }
    socket.on('data', onData)
  })
}

function dotStuff(body) {
  return body.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').map((line) => (line.startsWith('.') ? `.${line}` : line)).join('\r\n')
}

function buildRecap(values) {
  const now = Date.now()
  return {
    name: values.name,
    date: values.date,
    time: values.time,
    sentAt: new Date(now).toISOString(),
    expiresAt: new Date(now + RECAP_TTL_SECONDS * 1000).toISOString(),
  }
}

function setRecapCookie(res, ip, recap) {
  const payload = Buffer.from(JSON.stringify({ ...recap, ipHash: sha256(ip) })).toString('base64url')
  const signature = sign(payload)
  res.setHeader('Set-Cookie', `${RECAP_COOKIE}=${payload}.${signature}; Max-Age=${RECAP_TTL_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Lax`)
}

function readRecapCookie(req, ip) {
  const raw = parseCookies(req.headers.cookie || '')[RECAP_COOKIE]
  if (!raw || !raw.includes('.')) return null
  const [payload, signature] = raw.split('.')
  if (!payload || !signature || sign(payload) !== signature) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (data.ipHash !== sha256(ip)) return null
    if (!data.expiresAt || new Date(data.expiresAt).getTime() <= Date.now()) return null
    return {
      name: cleanText(data.name),
      date: cleanText(data.date),
      time: cleanText(data.time),
      sentAt: cleanText(data.sentAt),
      expiresAt: cleanText(data.expiresAt),
    }
  } catch {
    return null
  }
}

function sign(value) {
  const secret = process.env.CONTACT_RECAP_SECRET || process.env.CONTACT_SMTP_PASSWORD || 'suprav-local-recap-secret'
  return crypto.createHmac('sha256', secret).update(value).digest('base64url')
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function parseCookies(header) {
  return Object.fromEntries(header.split(';').map((part) => {
    const [key, ...value] = part.trim().split('=')
    return [key, value.join('=')]
  }).filter(([key]) => key))
}

function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const attempts = (rateLimitStore.get(ip) || []).filter((timestamp) => now - timestamp < windowMs)
  if (attempts.length >= 5) {
    rateLimitStore.set(ip, attempts)
    return false
  }
  attempts.push(now)
  rateLimitStore.set(ip, attempts)
  return true
}

function clientIp(req) {
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '0.0.0.0'
}

function safeHeader(value) {
  return String(value ?? '').replace(/[\r\n]/g, '')
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatReceivedAt() {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date()).replace(':', 'h')
}

function phoneDigitsWithCountry(phone) {
  const digits = phoneDigits(phone)
  if (digits.startsWith('00')) return digits.slice(2)
  if (digits.startsWith('0')) return `212${digits.slice(1)}`
  return digits
}
