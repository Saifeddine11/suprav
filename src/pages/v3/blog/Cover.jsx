/*
 * Couvertures d'articles sans photo : fond sombre, voiles orange et une petite maquette évocatrice
 * selon `visual` (web, brand, search, video, ads, ai). Tailles en unités de conteneur : la même
 * couverture sert pour les cartes, la une et le haut d'article.
 */
import { Li, Bi } from '../ui.jsx'

const ICON = { web: 'globe', brand: 'palette', search: 'search', video: 'video', ads: 'target', ai: 'bot' }

function Web() {
  return (
    <>
      <div className="bl-m-win">
        <div className="bl-m-bar"><i /><i /><i /><span /></div>
        <div className="bl-m-body">
          <b className="bl-m-h" /><b className="bl-m-l" /><b className="bl-m-l s" />
          <span className="bl-m-btn" />
          <div className="bl-m-g"><i /><i /><i /></div>
        </div>
      </div>
      <div className="bl-m-ph"><span /><b /><b className="s" /><i /></div>
    </>
  )
}

/* variante web : boutique en ligne (fiches produits, panier) */
function Shop() {
  return (
    <>
      <div className="bl-m-win shop">
        <div className="bl-m-bar"><i /><i /><i /><span /></div>
        <div className="bl-m-shop">
          {[0, 1, 2, 3, 4, 5].map((k) => <span key={k}><i /><b /><em /></span>)}
        </div>
      </div>
      <div className="bl-m-cart"><Li k="bag" s={1.8} /><b>3</b></div>
    </>
  )
}

function Brand() {
  return (
    <>
      <div className="bl-m-aa">A<span>a</span></div>
      <div className="bl-m-sw"><i /><i /><i /><i /></div>
      <div className="bl-m-mark"><Li k="spark" s={1.6} /></div>
      <div className="bl-m-grid" />
    </>
  )
}

function Search() {
  return (
    <>
      <div className="bl-m-q"><Li k="search" s={2} /><b /><i /></div>
      <div className="bl-m-res on"><span>1</span><b /><b className="s" /></div>
      <div className="bl-m-res"><span>2</span><b /><b className="s" /></div>
      <div className="bl-m-res"><span>3</span><b /><b className="s" /></div>
      <div className="bl-m-pin"><Li k="pin" s={1.8} /></div>
    </>
  )
}

function Video() {
  return (
    <>
      <div className="bl-m-reel">
        <span className="bl-m-rec">REC</span>
        <span className="bl-m-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" /></svg></span>
        <span className="bl-m-prog"><i /></span>
      </div>
      <div className="bl-m-strip"><i /><i /><i /><i /><i /></div>
    </>
  )
}

function Ads() {
  return (
    <>
      <div className="bl-m-apps">
        <span className="meta"><Bi k="meta" /></span>
        <span className="tiktok"><Bi k="tiktok" /></span>
        <span className="snap"><Bi k="snapchat" /></span>
      </div>
      <div className="bl-m-bars"><i /><i /><i /><i /><i /></div>
      <div className="bl-m-trend"><Li k="trend" s={2} /></div>
    </>
  )
}

function Ai() {
  return (
    <div className="bl-m-chat">
      <div className="bl-m-msg in"><b /><b className="s" /></div>
      <div className="bl-m-msg out"><span className="bl-m-bot"><Li k="bot" s={1.8} /></span><div><b /><b /><b className="s" /></div></div>
      <div className="bl-m-msg in sm"><b className="s" /></div>
      <div className="bl-m-typing"><i /><i /><i /></div>
    </div>
  )
}

const ART = { web: Web, brand: Brand, search: Search, video: Video, ads: Ads, ai: Ai }

/* petite empreinte du slug : deux articles du même thème n'ont pas exactement la même couverture */
const variantOf = (seed = '') => ([...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 2 === 0 ? 1 : 0)

export default function Cover({ visual = 'web', seed = '', className = '' }) {
  const v = ART[visual] ? visual : 'web'
  const alt = variantOf(seed)
  const Art = v === 'web' && alt ? Shop : ART[v]
  return (
    <div className={`bl-cv bl-cv-${v}${alt ? ' alt' : ''} ${className}`.trim()} aria-hidden="true">
      <i className="bl-cv-veil" />
      <i className="bl-cv-veil b" />
      <i className="bl-cv-grain" />
      <Li k={ICON[v]} s={1.1} className="bl-cv-ic" />
      <div className="bl-cv-art"><Art /></div>
    </div>
  )
}
