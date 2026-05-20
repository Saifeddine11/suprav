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
      const root = document.querySelector('#root')
      return root && root.innerHTML.trim().length > 200
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
        document.querySelector('main.page-content'),
    )
  })
  if (!hasMainContent) {
    throw new Error(`Missing main content shell for ${route}`)
  }

  const html = await page.content()
  const outRel = routeToOutputFile(route)
  const outPath = join(DIST, outRel)
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, html, 'utf8')

  return outRel
}

async function main() {
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
    page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS)
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      console.log(`[prerender] Chrome: ${process.env.PUPPETEER_EXECUTABLE_PATH}`)
    }

    for (const route of PRERENDER_ROUTES) {
      try {
        const out = await prerenderRoute(page, route)
        console.log(`  ✓ ${route} → dist/${out}`)
      } catch (err) {
        console.error(`  ✗ ${route}:`, err.message)
        throw err
      }
    }

    console.log('\n[prerender] Done.\n')
  } finally {
    if (browser) await browser.close()
    if (preview) preview.kill('SIGTERM')
  }
}

main().catch((err) => {
  console.error('[prerender] Failed:', err)
  process.exit(1)
})
