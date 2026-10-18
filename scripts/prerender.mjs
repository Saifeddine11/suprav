/**
 * Post-build prerender for Vite SPA.
 * Serves dist/ with vite preview, captures fully rendered HTML (incl. PageSEO useEffect).
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
import {
  PRERENDER_ROUTES,
  routeToOutputFile,
  canonicalForRoute,
} from './prerender-routes.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const PREVIEW_PORT = 4173
const PREVIEW_URL = `http://127.0.0.1:${PREVIEW_PORT}`
const IS_CI = process.env.CI === 'true'
const NAV_TIMEOUT_MS = IS_CI ? 120_000 : 90_000
const WAIT_TIMEOUT_MS = IS_CI ? 45_000 : 30_000
// Scripts de mesure (GA4, pixel Meta, Ahrefs) : jamais chargés pendant le prerender,
// sinon chaque build compterait des visites et des PageView fantômes.
const ANALYTICS_HOSTS = ['googletagmanager.com', 'google-analytics.com', 'facebook.net', 'facebook.com', 'analytics.ahrefs.com']
// Balise insérée dans le DOM par le snippet du pixel : retirée de l’instantané, le snippet la recrée au chargement.
const INJECTED_PIXEL_SCRIPT = /<script[^>]*src="https:\/\/connect\.facebook\.net\/[^"]*fbevents\.js"[^>]*><\/script>/g

function waitForPreviewReady(proc, timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('vite preview startup timeout')), timeoutMs)
    const onData = (chunk) => {
      const text = chunk.toString()
      if (text.includes('Local:') || text.includes(`127.0.0.1:${PREVIEW_PORT}`)) {
        clearTimeout(timer)
        proc.stdout?.off('data', onData)
        proc.stderr?.off('data', onData)
        resolve()
      }
    }
    proc.stdout?.on('data', onData)
    proc.stderr?.on('data', onData)
    proc.on('exit', (code) => {
      if (code !== null && code !== 0) {
        clearTimeout(timer)
        reject(new Error(`vite preview exited with code ${code}`))
      }
    })
  })
}

function startPreview() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'npx',
      ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PREVIEW_PORT), '--strictPort'],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, NODE_ENV: 'production' } },
    )
    waitForPreviewReady(proc)
      .then(() => resolve(proc))
      .catch((err) => {
        proc.kill()
        reject(err)
      })
  })
}

async function prerenderRoute(page, route) {
  const url = `${PREVIEW_URL}${route === '/' ? '/' : route}`
  const expectedCanonical = canonicalForRoute(route)

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS })

  await page.waitForFunction(
    () => {
      const shell =
        document.querySelector('.app main') ||
        document.querySelector('.v3 main') ||
        document.querySelector('main.page-content') ||
        document.querySelector('.seo-page') ||
        document.querySelector('.blog-page')
      return shell && shell.innerHTML.trim().length > 200
    },
    { timeout: WAIT_TIMEOUT_MS },
  )

  await page.waitForFunction(
    (canonical) => {
      const link = document.querySelector('link[rel="canonical"]')
      return link?.getAttribute('href') === canonical
    },
    { timeout: WAIT_TIMEOUT_MS },
    expectedCanonical,
  )

  await page.waitForFunction(
    () => {
      const title = document.title || ''
      const desc = document.querySelector('meta[name="description"]')?.getAttribute('content')
      return title.length > 10 && desc && desc.length > 40
    },
    { timeout: WAIT_TIMEOUT_MS },
  )

  const hasMainContent = await page.evaluate(() => {
    return Boolean(
      document.querySelector('.seo-page') ||
        document.querySelector('.app main') ||
        document.querySelector('.v3 main') ||
        document.querySelector('main.page-content') ||
        document.querySelector('.blog-page'),
    )
  })
  if (!hasMainContent) {
    throw new Error(`Missing main content shell for ${route}`)
  }

  const html = (await page.content()).replace(INJECTED_PIXEL_SCRIPT, '')
  const outRel = routeToOutputFile(route)
  const outPath = join(DIST, outRel)
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, html, 'utf8')

  return outRel
}

async function main() {
  // Vercel n'a pas les bibliothèques système de Chrome : le pré-rendu y fait échouer la build.
  // Les aperçus Vercel servent donc la version SPA ; le pré-rendu reste fait pour Hostinger.
  if (process.env.VERCEL && process.env.PRERENDER_ON_VERCEL !== '1') {
    console.log('[prerender] Vercel détecté : pré-rendu ignoré (SPA servie telle quelle).')
    return
  }
  console.log(`\n[prerender] ${PRERENDER_ROUTES.length} routes → dist/…\n`)

  let preview
  let browser

  try {
    preview = await startPreview()
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    // Instantané figé : sans animations (prefers-reduced-motion), les pages se rendent vite même sur une
    // machine lente (runner GitHub sans carte graphique) et le HTML pré-rendu montre tout le contenu.
    if (process.env.PRERENDER_MOTION !== '1') {
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    }
    // Pour reproduire en local une machine lente : PRERENDER_CPU_THROTTLE=8
    if (process.env.PRERENDER_CPU_THROTTLE) {
      const cdp = await page.createCDPSession()
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.PRERENDER_CPU_THROTTLE) })
    }
    page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS)
    await page.setRequestInterception(true)
    page.on('request', (request) => {
      const { hostname } = new URL(request.url())
      if (ANALYTICS_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`))) request.abort()
      else request.continue()
    })
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      console.log(`[prerender] Chrome: ${process.env.PUPPETEER_EXECUTABLE_PATH}`)
    }

    for (const route of PRERENDER_ROUTES) {
      try {
        const out = await prerenderRoute(page, route)
        console.log(`  ✓ ${route} → dist/${out}`)
      } catch (err) {
        console.error(`  ✗ ${route}:`, err.message)
        // Annotation visible dans l'onglet Actions de GitHub
        if (process.env.GITHUB_ACTIONS) console.log(`::error::Pré-rendu de ${route} impossible : ${err.message}`)
        throw err
      }
    }

    console.log('\n[prerender] Done.\n')
  } finally {
    if (browser) await browser.close()
    if (preview) preview.kill('SIGTERM')
  }
}

main()
  // Sortie explicite : le serveur de prévisualisation lancé via npx peut garder le processus en vie.
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[prerender] Failed:', err)
    if (process.env.GITHUB_ACTIONS) console.log(`::error::Pré-rendu impossible : ${String(err?.message || err).split('\n')[0]}`)
    process.exit(1)
  })
