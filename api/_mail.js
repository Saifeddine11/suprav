/*
 * Envoi SMTP sans dépendance, avec pièces jointes (MIME multipart/mixed).
 * Le préfixe « _ » empêche Vercel d'exposer ce fichier comme une fonction.
 * Mêmes variables d'environnement que le formulaire de contact (CONTACT_SMTP_*).
 */
import crypto from 'node:crypto'
import net from 'node:net'
import tls from 'node:tls'

export const mailConfig = () => ({
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY || '',
  mailTo: process.env.CONTACT_MAIL_TO || 'contact@suprav3.com',
  mailFrom: process.env.CONTACT_MAIL_FROM || 'contact@suprav3.com',
  smtpHost: process.env.CONTACT_SMTP_HOST || '',
  smtpPort: Number(process.env.CONTACT_SMTP_PORT || 465),
  smtpUsername: process.env.CONTACT_SMTP_USERNAME || '',
  smtpPassword: process.env.CONTACT_SMTP_PASSWORD || '',
  smtpSecure: (process.env.CONTACT_SMTP_SECURE || 'ssl').toLowerCase(),
})

export const smtpReady = (cfg) => Boolean(cfg.smtpHost && cfg.smtpUsername && cfg.smtpPassword)

export function safeHeader(value) {
  return String(value ?? '').replace(/[\r\n]/g, '')
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/* En-tête non ASCII encodé selon la RFC 2047 (objet avec accents, tirets cadratins…). */
export function encodeHeaderWord(value) {
  const text = safeHeader(value)
  if (/^[\x20-\x7E]*$/.test(text)) return text
  return `=?UTF-8?B?${Buffer.from(text, 'utf8').toString('base64')}?=`
}

const base64Lines = (buffer) => buffer.toString('base64').replace(/.{76}/g, '$&\r\n')

/**
 * Construit le message complet (en-têtes + corps).
 * @param {{ from: string, to: string, replyTo?: string, subject: string, html: string,
 *           attachments?: { filename: string, contentType: string, content: Buffer }[] }} mail
 */
export function buildMessage(mail) {
  const boundary = `supra-${crypto.randomBytes(12).toString('hex')}`
  const domain = String(mail.from).split('@')[1] || 'suprav3.com'
  const headers = [
    `From: Supra v <${safeHeader(mail.from)}>`,
    `To: ${safeHeader(mail.to)}`,
    ...(mail.replyTo ? [`Reply-To: ${safeHeader(mail.replyTo)}`] : []),
    `Subject: ${encodeHeaderWord(mail.subject)}`,
    `Date: ${new Date().toUTCString().replace('GMT', '+0000')}`,
    `Message-ID: <${crypto.randomUUID()}@${safeHeader(domain)}>`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
  ]
  const parts = [
    [
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
      '',
      base64Lines(Buffer.from(mail.html, 'utf8')),
    ].join('\r\n'),
    ...(mail.attachments || []).map((file) => [
      `--${boundary}`,
      `Content-Type: ${safeHeader(file.contentType)}; name="${safeHeader(file.filename)}"`,
      `Content-Disposition: attachment; filename="${safeHeader(file.filename)}"`,
      'Content-Transfer-Encoding: base64',
      '',
      base64Lines(file.content),
    ].join('\r\n')),
  ]
  return `${headers.join('\r\n')}\r\n\r\n${parts.join('\r\n')}\r\n--${boundary}--`
}

/** Envoie le message ; renvoie true si le serveur SMTP l'a accepté. */
export async function sendMail(cfg, mail) {
  const message = buildMessage({ from: cfg.mailFrom, to: cfg.mailTo, ...mail })
  let socket
  try {
    socket = await openSocket(cfg)
    await expect(socket, [220])
    await command(socket, 'EHLO suprav3.com', [250])
    if (cfg.smtpSecure === 'tls') {
      await command(socket, 'STARTTLS', [220])
      socket = await upgrade(socket, cfg)
      await command(socket, 'EHLO suprav3.com', [250])
    }
    await command(socket, 'AUTH LOGIN', [334])
    await command(socket, Buffer.from(cfg.smtpUsername).toString('base64'), [334])
    await command(socket, Buffer.from(cfg.smtpPassword).toString('base64'), [235])
    await command(socket, `MAIL FROM:<${safeHeader(cfg.mailFrom)}>`, [250])
    await command(socket, `RCPT TO:<${safeHeader(cfg.mailTo)}>`, [250, 251])
    await command(socket, 'DATA', [354])
    await command(socket, `${dotStuff(message)}\r\n.`, [250])
    await command(socket, 'QUIT', [221]).catch(() => {})
    socket.end()
    return true
  } catch (error) {
    console.error('SMTP delivery failed:', error?.message || error)
    socket?.destroy()
    return false
  }
}

function openSocket(cfg) {
  return new Promise((resolve, reject) => {
    const options = { host: cfg.smtpHost, port: cfg.smtpPort, servername: cfg.smtpHost }
    const socket = cfg.smtpSecure === 'ssl' ? tls.connect(options, () => resolve(socket)) : net.connect(options, () => resolve(socket))
    socket.setTimeout(15_000)
    socket.once('error', reject)
    socket.once('timeout', () => { socket.destroy(); reject(new Error('SMTP timeout')) })
  })
}

function upgrade(socket, cfg) {
  return new Promise((resolve, reject) => {
    const secure = tls.connect({ socket, servername: cfg.smtpHost }, () => resolve(secure))
    secure.setTimeout(15_000)
    secure.once('error', reject)
    secure.once('timeout', () => { secure.destroy(); reject(new Error('SMTP timeout')) })
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
      socket.off('close', onClose)
      const code = Number(last.slice(0, 3))
      if (expectedCodes.includes(code)) resolve(response)
      else reject(new Error(response.trim()))
    }
    const onClose = () => { socket.off('data', onData); reject(new Error('SMTP connection closed')) }
    socket.on('data', onData)
    socket.once('close', onClose)
  })
}

function dotStuff(body) {
  return body.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').map((line) => (line.startsWith('.') ? `.${line}` : line)).join('\r\n')
}
