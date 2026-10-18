import PageV3 from './PageV3.jsx'
import PageHero, { Swash, SwashR } from './PageHero.jsx'
import { Btn, Li, SecHead } from './ui.jsx'
import { POLES, TEAM } from '../../data/team.js'
import { W_VIEW, W_LAND, W_CITIES } from './parts/mapMonde.js'
import initAgence from './parts/initAgence.js'
import './css/agence.css'

const SITE = 'https://www.suprav3.com'
const DESC = "Supra v3, agence de communication 360° à Marrakech : vidéo, publicité, sites web, identité et agents IA, faits par la même équipe dans notre studio."
const SEO = {
  title: "L'agence Supra v3 : équipe et studio à Marrakech",
  description: DESC,
  path: '/agence',
  schema: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${SITE}/agence#page`,
        url: `${SITE}/agence`,
        name: "L'agence Supra v3 : équipe et studio à Marrakech",
        description: DESC,
        inLanguage: 'fr',
        about: { '@id': 'https://suprav3.com/#agence' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: "L'agence", item: `${SITE}/agence` },
        ],
      },
    ],
  },
}

/* Manifeste : les mots s'allument au fil du défilement. */
const SAY = 'Une vidéo qui fait des vues ne suffit pas.'.split(' ')
const SAY_IT = 'Elle doit mener quelque part.'.split(' ')

const PRINCIPES = [
  { k: 'flow', t: 'Tout sous le même toit', p: "Le contenu, le site qui le reçoit et l'agent IA qui répond aux demandes sont faits au même endroit. Rien ne se perd entre la vue et le rendez-vous." },
  { k: 'video', t: "Rien n'est sous-traité", p: 'Script, tournage, montage, sous-titres et déclinaisons pour Instagram, TikTok et Snapchat : notre équipe fait tout, de l’idée au montage final.' },
  { k: 'target', t: 'Un objectif chiffré', p: 'Chaque campagne vise des demandes, des appels, des réservations ou des ventes. Vous suivez les résultats sur un tableau de bord, on fait le point chaque mois.' },
  { k: 'cal', t: 'Un planning écrit, et tenu', p: 'Identité en 2 à 4 semaines, site en 3 à 6 semaines, campagne en ligne en 5 jours. Le planning exact figure dans le devis, et on le respecte.' },
]

const ENGAGEMENTS = [
  { k: 'pin', t: 'Un studio où venir nous voir', p: 'Business Center Paul, rue Mouatamid Ibn Abaad, à Marrakech. Vous savez qui travaille sur votre marque, et où.' },
  { k: 'heart', t: 'Des avis publics', p: 'Une note de 5,0 sur Google, avec des avis laissés par nos clients et vérifiables par tous.' },
  { k: 'doc', t: 'Un devis clair sous 48 h', p: "Après un appel de cadrage gratuit, vous recevez sous 48 heures un devis détaillé, avec le montant exact et le planning." },
  { k: 'coin', t: 'Le budget pub à part', p: 'Le budget payé à Meta, TikTok ou Snapchat est distinct de nos honoraires. Vous savez ce qui va aux plateformes.' },
]

const VILLES = [
  { id: 'mrk', n: 'Marrakech', c: 'Maroc', tz: 'Africa/Casablanca', tag: 'Studio' },
  { id: 'cas', n: 'Casablanca', c: 'Maroc', tz: 'Africa/Casablanca' },
  { id: 'rab', n: 'Rabat', c: 'Maroc', tz: 'Africa/Casablanca' },
  { id: 'par', n: 'Paris', c: 'France', tz: 'Europe/Paris' },
  { id: 'dxb', n: 'Dubaï', c: 'Émirats arabes unis', tz: 'Asia/Dubai' },
  { id: 'mia', n: 'Miami', c: 'États-Unis', tz: 'America/New_York', tag: 'À distance · Meta Ads' },
]

/* Arc courbe de Marrakech vers une ville (point de contrôle soulevé selon la distance). */
const arc = (to, lift) => {
  const [x1, y1] = W_CITIES.mrk, [x2, y2] = W_CITIES[to]
  const d = Math.hypot(x2 - x1, y2 - y1), cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 - d * lift
  return `M${x1} ${y1} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`
}
const LABELS = [
  { id: 'mia', t: 'Miami', dx: 0, dy: 26, a: 'middle' },
  { id: 'par', t: 'Paris', dx: 0, dy: -16, a: 'middle' },
  { id: 'dxb', t: 'Dubaï', dx: 0, dy: 26, a: 'middle' },
  { id: 'mrk', t: 'Marrakech', dx: -14, dy: 24, a: 'end' },
  { id: 'cas', t: 'Casablanca', dx: -14, dy: -8, a: 'end' },
  { id: 'rab', t: 'Rabat', dx: 12, dy: -10, a: 'start' },
]

function WorldMap() {
  return (
    <svg viewBox={W_VIEW} role="img" aria-label="Carte : le studio de Marrakech relié à Casablanca, Rabat, Paris, Dubaï et Miami">
      <defs>
        <radialGradient id="agGlow"><stop offset="0" stopColor="#E8491C" stopOpacity=".35" /><stop offset="1" stopColor="#E8491C" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx={W_CITIES.mrk[0]} cy={W_CITIES.mrk[1]} r="120" fill="url(#agGlow)" />
      <path className="land" d={W_LAND} />
      {[['par', .32], ['dxb', .26], ['mia', .22]].map(([to, l], k) => (
        <path key={to} className="arc" style={{ '--k': k }} pathLength="1" d={arc(to, l)} />
      ))}
      {VILLES.map((v) => {
        const [x, y] = W_CITIES[v.id]
        const hq = v.id === 'mrk'
        return (
          <g key={v.id} className={`cty${hq ? ' hq' : ''}${v.id === 'mia' ? ' rm' : ''}`} data-c={v.id}>
            {hq ? <circle className="ring" cx={x} cy={y} r="7" /> : null}
            <circle className="dot" cx={x} cy={y} r={hq ? 7 : v.id === 'cas' || v.id === 'rab' ? 3.6 : 5} />
          </g>
        )
      })}
      {LABELS.map((l, i) => {
        const [x, y] = W_CITIES[l.id]
        return <text key={l.id} className="lb" style={{ '--i': i }} x={x + l.dx} y={y + l.dy} textAnchor={l.a}>{l.t}</text>
      })}
    </svg>
  )
}

function Member({ m, i }) {
  return (
    <li className="ag-mem" data-hov style={{ '--i': i }}>
      {m.photo ? (
        <figure>
          <img src={m.photo} srcSet={m.photo480 ? `${m.photo480} 480w, ${m.photo} 900w` : undefined} sizes="(max-width: 600px) 62vw, 240px" width="900" height="1125" loading="lazy" decoding="async" alt={`${m.name}, ${m.role} chez Supra v3`} />
        </figure>
      ) : (
        <div className="ag-mono" aria-hidden="true">
          <span className="ag-no">{String(i + 1).padStart(2, '0')}</span>
          <span className="ag-ini">{m.name.charAt(0)}</span>
          <span className="ag-stu">Supra v3 · Marrakech</span>
        </div>
      )}
      <div className="who">
        <b>{m.name}</b>
        <span>{m.role}</span>
        {m.instagram ? <a href={m.instagram} target="_blank" rel="noopener" aria-label={`Instagram de ${m.name}`}>Instagram</a> : null}
      </div>
    </li>
  )
}

export default function Agence() {
  return (
    <PageV3 seo={SEO} init={initAgence} className="ag">
      <PageHero
        crumbs={[{ label: "L'agence" }]}
        kicker="L'agence · Supra v3 à Marrakech"
        title={<>Une équipe, <Swash>tout</Swash> sous le même toit.</>}
        lede="Vidéo, publicité, sites web, identité et agents IA : chez Supra v3, tout est conçu et produit par la même équipe, dans notre studio du Business Center Paul à Marrakech."
      >
        <Btn to="/contact">Réserver un appel</Btn>
        <Btn to="/realisations" tone="dk">Voir nos réalisations</Btn>
      </PageHero>

      {/* Manifeste et façon de travailler */}
      <section className="sec light wrap ag-mani" id="manifeste">
        <div className="c">
          <div className="ag-say-w">
            <span className="nb" data-r><b>Notre conviction</b>Ce qui nous guide</span>
            <p className="ag-say" id="agsay">
              {SAY.map((w, i) => <span className="wd" key={`a${i}`}>{w} </span>)}
              <span className="it">{SAY_IT.map((w, i) => <span className="wd" key={`b${i}`}>{w}{i < SAY_IT.length - 1 ? ' ' : ''}</span>)}</span>
            </p>
            <p className="lede ag-say-p" data-r>Supra v3 réalise la vidéo et la publicité, les sites web, l'identité de marque, le SEO, les applications et les agents IA, avec la même équipe. Voici comment on travaille.</p>
          </div>
          <ol className="ag-prin">
            {PRINCIPES.map((x, i) => (
              <li className="ag-pr" key={x.t} data-r={i * 90} data-hov>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span className="ib"><Li k={x.k} /></span>
                <h3>{x.t}</h3>
                <p>{x.p}</p>
              </li>
            ))}
          </ol>
          <div className="kpis ag-kpis" id="agkpi" data-r>
            <div className="kpi"><b><span className="cnt" data-to="5,0" aria-hidden="true">5,0</span><em aria-hidden="true">/5</em><span className="sr">5,0 sur 5</span></b><span>Note moyenne sur Google, avis publics</span></div>
            <div className="kpi"><b><span className="cnt" data-to="13" aria-hidden="true">13</span><span className="sr">13</span></b><span>Marques qui nous ont confié leur image</span></div>
            <div className="kpi"><b><span className="cnt" data-to="150" aria-hidden="true">150</span><em aria-hidden="true"> K€</em><span className="sr">150 000 €</span></b><span>Gérés chaque mois en Meta Ads pour nos clients</span></div>
            <div className="kpi"><b><span className="cnt" data-to="6" aria-hidden="true">6</span><span className="sr">6</span></b><span>Villes, de Marrakech à Miami</span></div>
          </div>
        </div>
      </section>

      {/* L'équipe : les personnes, puis les pôles du studio */}
      <section className="sec dark wrap ag-team" id="equipe">
        <div className="c">
          <SecHead
            badge="L'équipe"
            label="Le studio"
            title={<>Les visages derrière <SwashR>vos</SwashR> projets.</>}
            lede="Marketing, cadrage, gestion de projet, media buying, IA et web : chacun son métier, tous dans le même studio à Marrakech."
          />
          <ul className="ag-mems">{TEAM.map((m, i) => <Member m={m} i={i} key={m.name} />)}</ul>

          <div className="ag-sub" data-r>
            <h3>Cinq pôles, une seule équipe.</h3>
            <p>Chaque pôle travaille dans le même studio : la vidéo, la publicité, le site et l'agent IA avancent ensemble, sans relais extérieur.</p>
          </div>
          <ul className="ag-poles">
            {POLES.map((p, i) => (
              <li className="bc ag-pole" key={p.id} data-r={(i % 3) * 90}>
                <div className="tp"><span className="ib"><Li k={p.icon} /></span><span className="n">{String(i + 1).padStart(2, '0')}</span></div>
                <h3>{p.name}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Engagements */}
      <section className="sec light wrap ag-eng" id="engagements">
        <div className="c">
          <SecHead
            badge="Engagements"
            label="Ce que vous pouvez vérifier"
            title={<>Vous savez qui travaille sur votre marque, <span className="it">et où.</span></>}
          />
          <ul className="ag-eng-g">
            {ENGAGEMENTS.map((x, i) => (
              <li className="scd" key={x.t} data-r={i * 80}>
                <span className="ib"><Li k={x.k} /></span>
                <h3>{x.t}</h3>
                <p>{x.p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Présence */}
      <section className="sec dark wrap ag-pres" id="presence">
        <div className="c">
          <SecHead
            center
            badge="Présence"
            label="Où on travaille"
            title={<>Basés à Marrakech. <span className="it">Présents de Dubaï à Miami.</span></>}
            lede="Le studio est à Marrakech. On accompagne des marques à Casablanca, Rabat, Dubaï et Paris, et on gère à distance les comptes Meta Ads de clients aux États-Unis."
          />
          <div className="ag-map" id="agmap" data-r><WorldMap /></div>
          <ul className="ag-cities" id="agcities">
            {VILLES.map((v, i) => (
              <li key={v.id} data-c={v.id} tabIndex={0} data-r={i * 60}>
                <span className={`pin${v.id === 'mrk' ? ' hq' : ''}`} aria-hidden="true" />
                <span className="nm"><b>{v.n}</b><small>{v.c}</small></span>
                <span className="tm" data-tz={v.tz} aria-label={`Heure locale à ${v.n}`}>--:--</span>
                {v.tag ? <span className={`tg${v.id === 'mrk' ? ' s' : ''}`}>{v.tag}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Rejoindre l'agence */}
      <section className="sec tight light wrap ag-join">
        <div className="c">
          <div className="band-cta" data-r>
            <div>
              <span className="eyebrow">Recrutement et casting</span>
              <h2>Envie de travailler <span className="it">avec nous&nbsp;?</span></h2>
              <p>Vidéastes, monteurs, designers, développeurs, talents face caméra : déposez votre CV ou votre book.</p>
            </div>
            <Btn to="/rejoindre" tone="wh">Rejoindre l'agence</Btn>
          </div>
        </div>
      </section>
    </PageV3>
  )
}
