import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageV3 from './PageV3.jsx'
import PageHero, { Swash, SwashR } from './PageHero.jsx'
import { Btn, WaBtn, Li, SecHead } from './ui.jsx'
import { VIDEO_PROJECTS } from '../../data/videoProjects.js'
import './css/realisations.css'

/*
 * Réalisations v3 : sites web (9 designs, présentés par secteur uniquement, sans nom ni domaine)
 * et vidéos (aperçu muet au survol, lecture plein écran au clic).
 * `only` : undefined → /realisations (filtre en place), 'sites' → /realisations/websites, 'videos' → /realisations/production-videos.
 */

const SITE = 'https://www.suprav3.com'
const D = '/media/website/images/designs/'

/* Rangées de la mosaïque : colonnes (fr) et sites, dans l'ordre d'affichage. --op : cadrage de la capture. */
const ROWS = [
  { cols: '7fr 5fr', sz: ['58vw', '42vw'], h: 'clamp(260px, 30vw, 440px)', items: [['vistahaven', 'Agence immobilière', 'center 45%'], ['architecture', "Studio d'architecture", '78% center']] },
  { cols: 'repeat(3, minmax(0, 1fr))', sz: ['33vw', '33vw', '33vw'], h: 'clamp(200px, 20vw, 300px)', items: [['the-hotel', 'Hôtellerie de luxe', 'center'], ['dermato', 'Clinique de dermatologie', 'center'], ['homevia', 'Promotion immobilière', 'center 35%']] },
  { cols: '5fr 7fr', sz: ['42vw', '58vw'], h: 'clamp(240px, 26vw, 380px)', items: [['rumaya', 'Hôtel de charme', 'center 40%'], ['camino', 'Restaurant méditerranéen', 'center']] },
  { cols: '1fr 1fr', sz: ['50vw', '50vw'], h: 'clamp(230px, 24vw, 360px)', items: [['prestix', 'Conseil immobilier', 'center'], ['tennix', 'Académie de tennis', 'center 45%']] },
]
const SITES = ROWS.flatMap((r) => r.items)
/* numéro du premier site de chaque rangée */
const ROW_START = ROWS.map((_, i) => ROWS.slice(0, i).reduce((s, r) => s + r.items.length, 0))

/* Libellés affichés : secteurs en français, et l'orthographe du client corrigée (voir data/videoProjects.js). */
const SECTOR_FR = { Hospitality: 'Hôtellerie', Retail: 'Commerce', Contenu: 'Marque' }
const NAME_FIX = { 'scultbody-video-01': 'Scultbody' }
const VIDEOS = VIDEO_PROJECTS.map((v) => ({
  ...v,
  name: NAME_FIX[v.slug] || v.title.split(' - ')[0],
  kind: v.tags?.[0] || 'Vidéo',
  sectorFr: SECTOR_FR[v.sector] || v.sector,
}))

const bySlug = (s) => VIDEOS.find((v) => v.slug === s) || VIDEOS[0]

const COUNTS = { all: SITES.length + VIDEOS.length, sites: SITES.length, videos: VIDEOS.length }
const PATHS = { all: '/realisations', sites: '/realisations/websites', videos: '/realisations/production-videos' }
const FILTERS = [['all', 'Tout'], ['sites', 'Sites web'], ['videos', 'Vidéos']]

const COPY = {
  all: {
    title: 'Réalisations : sites web et vidéos à Marrakech | Supra v3',
    description: "Sites web, vidéos publicitaires et contenus réseaux réalisés par Supra v3, agence de communication à Marrakech : immobilier, hôtellerie, beauté, sport.",
    crumbs: [{ label: 'Réalisations' }],
    kicker: 'Réalisations · Agence de communication à Marrakech',
    h1: <>Nos réalisations, <Swash>en vrai</Swash>.</>,
    lede: "Sites web, vidéos publicitaires et contenus pour les réseaux : un aperçu de ce que notre équipe conçoit, tourne et monte à Marrakech.",
    name: 'Réalisations Supra v3',
  },
  sites: {
    title: 'Création de site web à Marrakech : réalisations | Supra v3',
    description: "Les sites web conçus par Supra v3 à Marrakech : immobilier, hôtellerie, restauration, santé et sport. Des sites pensés pour transformer la visite en demande.",
    crumbs: [{ label: 'Réalisations', to: '/realisations' }, { label: 'Sites web' }],
    kicker: 'Création de sites web à Marrakech',
    h1: <>Des sites web qui <Swash>donnent envie</Swash>.</>,
    lede: "Immobilier, hôtellerie, restauration, santé, sport : neuf designs conçus pour présenter une offre clairement et transformer la visite en demande.",
    name: 'Sites web réalisés par Supra v3',
  },
  videos: {
    title: 'Production vidéo à Marrakech : réalisations | Supra v3',
    description: "Publicités, home tours et contenus Instagram, TikTok et Snapchat : les vidéos tournées et montées par l'équipe Supra v3 à Marrakech, sans sous-traitance.",
    crumbs: [{ label: 'Réalisations', to: '/realisations' }, { label: 'Production vidéo' }],
    kicker: 'Production vidéo à Marrakech',
    h1: <>Des vidéos qui <Swash>vendent</Swash>.</>,
    lede: "Script, tournage, montage et déclinaisons pour Instagram, TikTok et Snapchat : des vidéos faites par notre équipe, sans sous-traitance.",
    name: 'Vidéos réalisées par Supra v3',
  },
}

/* Comment on travaille : uniquement des engagements déjà annoncés sur le site (FAQ, offre). */
const HOW = {
  all: [
    ['brief', 'Une seule équipe', "Site, identité, vidéos et publicité sont faits par la même équipe, basée à Marrakech, du brief à la mise en ligne."],
    ['video', "Rien n'est sous-traité", 'Script, tournage, montage, sous-titres et déclinaisons pour chaque réseau : tout est produit en interne.'],
    ['clock', 'Devis sous 48 heures', "L'appel de cadrage est gratuit. Vous recevez ensuite un devis détaillé, avec le planning écrit."],
  ],
  sites: [
    ['clock', '3 à 6 semaines', "C'est le délai habituel d'un site web. Le planning exact est écrit dans le devis, et on le respecte."],
    ['link', 'Relié au reste', "Le site travaille avec vos vidéos, votre publicité et votre agent IA, pour que chaque vue devienne une demande."],
    ['target', 'Une action claire', "Réserver, appeler, écrire sur WhatsApp ou demander une visite : chaque site mène vers une demande."],
  ],
  videos: [
    ['video', "Rien n'est sous-traité", 'Notre équipe écrit, tourne et monte vos vidéos, sous-titres et déclinaisons compris.'],
    ['trend', 'En ligne en 5 jours', 'Une campagne publicitaire peut être en ligne en 5 jours, avec un objectif chiffré suivi chaque mois.'],
    ['phone', 'Instagram, TikTok, Snapchat', 'Chaque vidéo est déclinée aux formats des réseaux où vos clients regardent.'],
  ],
}

const crumbList = (crumbs, path) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Accueil', path: '/' }, ...crumbs.map((c, i) => ({ name: c.label, path: c.to || (i === crumbs.length - 1 ? path : '/') }))]
    .map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: SITE + c.path })),
})
const SCHEMA = Object.fromEntries(['all', 'sites', 'videos'].map((k) => {
  const c = COPY[k], path = PATHS[k]
  const items = [
    ...(k !== 'videos' ? SITES.map(([slug, sector]) => ({ name: `Design de site web : ${sector.toLowerCase()}`, image: `${SITE}${D}${slug}.webp` })) : []),
    ...(k !== 'sites' ? VIDEOS.map((v) => ({ name: `${v.name} — ${v.kind.toLowerCase()}`, image: SITE + v.poster })) : []),
  ]
  return [k, {
    '@context': 'https://schema.org',
    '@graph': [
      crumbList(c.crumbs, path),
      {
        '@type': 'CollectionPage', name: c.name, url: SITE + path, description: c.description, inLanguage: 'fr',
        isPartOf: { '@type': 'WebSite', name: 'Supra v3', url: SITE + '/' },
        mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'CreativeWork', ...it, creator: { '@type': 'Organization', name: 'Supra v3' } } })) },
      },
    ],
  }]
}))

/* Aperçu muet au survol : seulement avec une souris, sans réduction des animations ni économie de données. */
const canPreview = () => typeof window !== 'undefined'
  && matchMedia('(hover: hover) and (pointer: fine)').matches
  && !matchMedia('(prefers-reduced-motion: reduce)').matches
  && !(navigator.connection && navigator.connection.saveData)

const PlayIc = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" /></svg>
const ZoomIc = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
const CloseIc = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>

/* ---------- haut de page : pile visuelle en verre ---------- */
function HeroAside({ only }) {
  if (only === 'videos') {
    return (
      <div className="rz-stack rz-fan" aria-hidden="true">
        {[bySlug('africa-beauty-ad'), bySlug('yasmine-ads'), bySlug('home-tour-bm')].map((v, i) => (
          <span key={v.slug} className={`rz-p rz-p${i}`}><img src={v.poster} alt="" width="720" height="1280" decoding="async" /><i className="rz-pl"><PlayIc /></i></span>
        ))}
        <span className="rz-chip glass"><b>{COUNTS.videos}</b> vidéos tournées et montées par l'équipe</span>
      </div>
    )
  }
  const pair = only === 'sites' ? [SITES[0], SITES[5]] : [SITES[2], null]
  return (
    <div className={`rz-stack${only === 'sites' ? ' rz-two' : ''}`} aria-hidden="true">
      {pair.map((s, i) => s && (
        <span key={s[0]} className={`rz-b rz-b${i}`}>
          <span className="rz-bc"><i /><i /><i /><em>{s[1]}</em></span>
          <img src={`${D}${s[0]}-800.webp`} alt="" width="800" height="560" decoding="async" style={{ objectPosition: s[2] }} />
        </span>
      ))}
      {only !== 'sites' ? <span className="rz-p rz-p1 rz-solo"><img src={bySlug('yasmine-ads').poster} alt="" width="720" height="1280" decoding="async" /><i className="rz-pl"><PlayIc /></i></span> : null}
      <span className="rz-chip glass">{only === 'sites' ? <><b>{COUNTS.sites}</b> designs, un par métier</> : <><b>{COUNTS.sites}</b> sites · <b>{COUNTS.videos}</b> vidéos</>}</span>
    </div>
  )
}

/* ---------- barre de filtres collante ---------- */
/* filtre en place (groupe de boutons) sur /realisations, liens entre les pages sur les sous-pages */
const Group = ({ only, children }) => (only === undefined
  ? <div className="rz-flt" role="group" aria-label="Filtrer les réalisations">{children}</div>
  : <nav className="rz-flt" aria-label="Catégories de réalisations">{children}</nav>)

function FilterBar({ only, view, setView }) {
  return (
    <div className="rz-barw">
      <div className="rz-bar">
        <Group only={only}>
          {FILTERS.map(([k, label]) => (only === undefined
            ? <button key={k} type="button" aria-pressed={view === k} onClick={() => setView(k)}>{label}<span className="ct">{COUNTS[k]}</span></button>
            : <Link key={k} to={PATHS[k]} aria-current={(only || 'all') === k ? 'page' : undefined}>{label}<span className="ct">{COUNTS[k]}</span></Link>))}
        </Group>
        <Link className="rz-go" to="/contact"><span>Démarrer un projet</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
      </div>
    </div>
  )
}

/* ---------- sites web ---------- */
function SiteCard({ slug, sector, op, n, delay, sizes, onOpen }) {
  return (
    <figure className="rz-site" data-r={delay} style={{ '--op': op }}>
      <button type="button" className="rz-frame" onClick={() => onOpen({ kind: 'image', src: `${D}${slug}.webp`, alt: `Design de site web : ${sector.toLowerCase()}`, caption: `${String(n).padStart(2, '0')} · ${sector}` })} aria-label={`Agrandir le design : ${sector}`}>
        <span className="rz-chrome" aria-hidden="true"><i /><i /><i /><span className="rz-url"><span>{sector}</span><span><ZoomIc />Agrandir</span></span></span>
        <span className="rz-shot"><img src={`${D}${slug}-800.webp`} srcSet={`${D}${slug}-800.webp 800w, ${D}${slug}.webp 1600w`} sizes={sizes} alt={`Design de site web : ${sector.toLowerCase()}`} loading="lazy" decoding="async" width="1600" height="1100" /></span>
      </button>
      <figcaption><i>{String(n).padStart(2, '0')}</i><b>{sector}</b></figcaption>
    </figure>
  )
}

function Sites({ only, hidden, onOpen }) {
  return (
    <section className="sec light wrap rz-sec rz-sites" id="sites" hidden={hidden} aria-labelledby="rz-sites-t">
      <div className="c">
        <div className="chead" data-r>
          <div className="l">
            <span className="nb"><b>Sites web</b>{COUNTS.sites} designs</span>
            <h2 className="h2" id="rz-sites-t">Un site par métier, <span className="it">pas un modèle</span>.</h2>
            <p className="lede">Chaque site part de l'offre du client : ce qu'il vend, à qui, et ce que le visiteur doit faire ensuite. Réserver, appeler, demander une visite.</p>
          </div>
          {only === 'sites' ? <Link className="tlink" to="/realisations/production-videos">Voir les vidéos<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg></Link> : null}
        </div>
        <div className="rz-grid">
          {ROWS.map((r, ri) => (
            <div key={ri} className="rz-row" style={{ '--cols': r.cols, '--h': r.h }}>
              {r.items.map(([slug, sector, op], j) => (
                <SiteCard key={slug} slug={slug} sector={sector} op={op} n={ROW_START[ri] + j + 1} delay={j * 90} sizes={`(max-width: 760px) 92vw, ${r.sz[j]}`} onOpen={onOpen} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- vidéos ---------- */
function VideoCard({ v, i, preview, onOpen }) {
  const vid = useRef(null)
  const enter = () => {
    const el = vid.current
    if (!preview || !el) return
    if (!el.getAttribute('src')) el.setAttribute('src', v.videoSrc)
    el.currentTime = 0
    el.play().then(() => el.closest('.rz-vc')?.classList.add('rz-live')).catch(() => {})
  }
  const leave = () => {
    const el = vid.current
    if (!el) return
    el.pause(); el.closest('.rz-vc')?.classList.remove('rz-live')
  }
  return (
    <li className="rz-vi" data-r={(i % 4) * 80}>
      <button type="button" className="rz-vc" onPointerEnter={enter} onPointerLeave={leave}
        onClick={() => { leave(); onOpen({ kind: 'video', src: v.videoSrc, poster: v.poster, caption: `${v.name} · ${v.kind} · ${v.sectorFr}` }) }}
        aria-label={`Regarder la vidéo ${v.name}, ${v.kind.toLowerCase()}, ${v.sectorFr.toLowerCase()}`}>
        <span className="rz-media">
          <img src={v.poster} alt="" width="720" height="1280" loading="lazy" decoding="async" />
          {preview ? <video ref={vid} muted playsInline loop preload="none" aria-hidden="true" tabIndex={-1} /> : null}
        </span>
        <span className="rz-top"><span className="rz-sec-chip">{v.sectorFr}</span>{v.stat ? <span className="rz-stat"><b>{v.stat.value}</b> {v.stat.label}</span> : null}</span>
        <span className="rz-play" aria-hidden="true"><PlayIc /></span>
        <span className="rz-bot"><b>{v.name}</b><span>{v.kind}</span></span>
      </button>
    </li>
  )
}

function Videos({ only, hidden, onOpen }) {
  const [preview] = useState(canPreview)
  return (
    <section className="sec dark wrap rz-sec rz-videos" id="videos" hidden={hidden} aria-labelledby="rz-vid-t">
      <div className="c">
        <div className="chead" data-r>
          <div className="l">
            <span className="nb"><b>Vidéos</b>{COUNTS.videos} productions</span>
            <h2 className="h2" id="rz-vid-t">Tournées et montées <span className="it">par notre équipe</span>.</h2>
            <p className="lede">Publicités, home tours, contenus pour les réseaux. {preview ? 'Survolez une vidéo pour un aperçu, cliquez pour la regarder avec le son.' : 'Touchez une vidéo pour la regarder avec le son.'}</p>
          </div>
          {only === 'videos' ? <Link className="tlink" to="/realisations/websites">Voir les sites web<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9" /></svg></Link> : null}
        </div>
        <ul className="rz-vgrid">
          {VIDEOS.map((v, i) => <VideoCard key={v.slug} v={v} i={i} preview={preview} onOpen={onOpen} />)}
        </ul>
      </div>
    </section>
  )
}

/* ---------- lecteur plein écran (vidéo avec son, ou design en grand) ---------- */
function Viewer({ item, onClose }) {
  const dlg = useRef(null)
  const vid = useRef(null)
  const back = useRef(null)

  useEffect(() => {
    const d = dlg.current
    if (!d) return
    if (item && !d.open) {
      back.current = document.activeElement
      d.showModal()
      document.documentElement.style.overflow = 'hidden'
      vid.current?.play().catch(() => {})
    }
  }, [item])

  const close = useCallback(() => {
    const v = vid.current
    if (v) { v.pause(); v.removeAttribute('src'); v.load() }
    if (dlg.current?.open) dlg.current.close()
  }, [])

  return (
    <dialog ref={dlg} className={`vdlg rz-dlg${item?.kind === 'image' ? ' rz-img' : ''}`} aria-label={item?.kind === 'image' ? 'Design en grand' : 'Lecture de la vidéo'}
      onClose={() => { document.documentElement.style.overflow = ''; onClose(); back.current?.focus?.({ preventScroll: true }) }}
      onCancel={(e) => { e.preventDefault(); close() }}
      onClick={(e) => { if (e.target === e.currentTarget) close() }}>
      {item?.kind === 'video' ? <video ref={vid} src={item.src} poster={item.poster} controls playsInline autoPlay preload="auto" /> : null}
      {item?.kind === 'image' ? <img src={item.src} alt={item.alt} width="1600" height="1100" /> : null}
      <button type="button" className="x" onClick={close} aria-label="Fermer"><CloseIc /></button>
      {item ? <p className="cap">{item.caption}</p> : null}
    </dialog>
  )
}

/* ---------- transition vers le quiz : méthode + repères ---------- */
function Outro({ k }) {
  return (
    <section className="sec mist wrap rz-outro" aria-labelledby="rz-out-t">
      <div className="c">
        <SecHead center badge="Et la suite" label="Votre projet" title={<span id="rz-out-t">Votre marque pourrait être <SwashR>la prochaine</SwashR>.</span>}
          lede="Quatre questions, trente secondes : on vous renvoie un plan adapté à votre projet, puis un devis détaillé sous 48 heures." />
        <div className="rz-how">
          {HOW[k].map(([ic, t, p], i) => (
            <div key={t} className="rz-hc" data-r={i * 90} data-hov>
              <span className="rz-ib"><Li k={ic} /></span>
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
        <div className="kpis rz-kpis" data-r>
          <div className="kpi"><b>5,0<em>/5</em></b><span>Note moyenne sur Google, avis publics et vérifiables.</span></div>
          <div className="kpi"><b>13</b><span>Marques nous ont confié leur image.</span></div>
          <div className="kpi"><b>150<em> K€</em></b><span>Gérés chaque mois en Meta Ads pour nos clients.</span></div>
          <div className="kpi"><b>6</b><span>Villes : Marrakech, Casablanca, Rabat, Dubaï, Paris, Miami.</span></div>
        </div>
        <div className="rz-next" data-r>
          <Btn href="#contact">Répondre aux 4 questions</Btn>
          <WaBtn text="Bonjour Supra v3, j'ai vu vos réalisations et je souhaite parler d'un projet." />
        </div>
      </div>
    </section>
  )
}

export default function Realisations({ only }) {
  const k = only || 'all'
  const c = COPY[k]
  const [view, setView] = useState('all')
  const [item, setItem] = useState(null)
  const work = useRef(null)
  const shown = useRef('all')

  /* filtre en place : remonte en haut des résultats et les fait réapparaître en fondu */
  useEffect(() => {
    if (shown.current === view) return
    shown.current = view
    const w = work.current
    if (!w) return
    const top = w.getBoundingClientRect().top
    if (top < 0) window.scrollTo({ top: window.scrollY + top - 70, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    w.querySelectorAll('.rz-sec:not([hidden])').forEach((s) => { s.classList.remove('rz-pop'); void s.offsetWidth; s.classList.add('rz-pop') })
  }, [view])

  const showSites = only ? only === 'sites' : view !== 'videos'
  const showVideos = only ? only === 'videos' : view !== 'sites'

  return (
    <PageV3 className="rz" seo={{ title: c.title, description: c.description, path: PATHS[k], schema: SCHEMA[k] }}>
      <PageHero crumbs={c.crumbs} kicker={c.kicker} title={c.h1} lede={c.lede} aside={<HeroAside only={only} />}>
        <div className="ctas rz-ctas">
          <Btn to="/contact">Réserver un appel</Btn>
          <WaBtn text="Bonjour Supra v3, j'ai vu vos réalisations et je souhaite parler d'un projet." />
        </div>
      </PageHero>
      <div className="rz-work" ref={work}>
        <FilterBar only={only} view={view} setView={setView} />
        {only !== 'videos' ? <Sites only={only} hidden={!showSites} onOpen={setItem} /> : null}
        {only !== 'sites' ? <Videos only={only} hidden={!showVideos} onOpen={setItem} /> : null}
      </div>
      <Outro k={k} />
      <Viewer item={item} onClose={() => setItem(null)} />
    </PageV3>
  )
}
