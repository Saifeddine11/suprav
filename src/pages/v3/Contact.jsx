import PageV3 from './PageV3.jsx'
import PageHero, { Swash, SwashR } from './PageHero.jsx'
import { Btn, Bi, Li, SecHead, WaBtn } from './ui.jsx'
import { PHONE, TEL, MAIL, MAPS_URL, waText } from './consts.js'
import FinalCta from '../home-v3/sections/FinalCta.jsx'
import { MA_VIEW, MA_LAND, MA_OTHER, MA_CITIES } from './parts/mapMaroc.js'
import initContact from './parts/initContact.js'
import './css/contact.css'

const SITE = 'https://www.suprav3.com'
const DESC = 'Contactez Supra v3, agence de communication à Marrakech : quiz de 30 secondes, WhatsApp, téléphone ou studio au Business Center Paul. Devis sous 48 h.'
const ROUTE = 'https://www.google.com/maps/dir/?api=1&destination=31.6316875,-8.0073125'

const FAQ = [
  { q: "L'appel de cadrage est-il payant ?", a: "Non. L'appel de cadrage est gratuit et sans engagement. On fait le point sur votre marque et vos objectifs, puis vous recevez un devis détaillé sous 48 heures." },
  { q: 'En combien de temps répondez-vous ?', a: "Après le quiz, on revient vers vous sous 24 heures avec votre plan d'action. Pour aller plus vite, écrivez-nous sur WhatsApp." },
  { q: 'Quel budget prévoir ?', a: "Chaque formule a un prix de départ. Le montant exact dépend du nombre de vidéos, de pages ou de canaux, et figure dans le devis envoyé sous 48 heures après l'appel de cadrage. Le budget publicitaire payé à Meta, TikTok ou Snapchat s'ajoute à nos honoraires." },
  { q: 'Où êtes-vous ?', a: "Le studio est au Business Center Paul, rue Mouatamid Ibn Abaad, à Marrakech. On est présents à Casablanca, Rabat, Dubaï et Paris, et on gère à distance les comptes Meta Ads de clients jusqu'à Miami." },
]

const SEO = {
  title: 'Contact : agence de communication à Marrakech | Supra v3',
  description: DESC,
  path: '/contact',
  schema: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${SITE}/contact#page`,
        url: `${SITE}/contact`,
        name: 'Contact : agence de communication à Marrakech',
        description: DESC,
        inLanguage: 'fr',
        about: { '@id': 'https://suprav3.com/#agence' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE}/contact` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  },
}

const CopyIc = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="3" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
const PhoneIc = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>

/* Carte du Maroc en points : le studio de Marrakech, Casablanca et Rabat. */
function MoroccoMap() {
  const P = MA_CITIES
  const others = [['cas', 'Casablanca', -14, 4, 'end'], ['rab', 'Rabat', -14, -6, 'end'], ['tng', 'Tanger', 12, 4, 'start'], ['fes', 'Fès', 12, 5, 'start'], ['aga', 'Agadir', -14, 5, 'end']]
  return (
    <svg viewBox={MA_VIEW} role="img" aria-label="Carte du Maroc : le studio Supra v3 à Marrakech, et les villes de Casablanca, Rabat, Tanger, Fès et Agadir">
      <defs>
        <radialGradient id="ctGlow"><stop offset="0" stopColor="#E8491C" stopOpacity=".42" /><stop offset="1" stopColor="#E8491C" stopOpacity="0" /></radialGradient>
      </defs>
      <text className="sea" x="34" y="128">Océan</text>
      <text className="sea" x="34" y="152">Atlantique</text>
      <text className="sea" x="560" y="36">Méditerranée</text>
      <path className="oth" d={MA_OTHER} />
      <path className="ma" d={MA_LAND} />
      <circle cx={P.mrk[0]} cy={P.mrk[1]} r="150" fill="url(#ctGlow)" />
      <path className="lk" pathLength="1" d={`M${P.mrk[0]} ${P.mrk[1]} Q${(P.mrk[0] + P.cas[0]) / 2 - 40} ${(P.mrk[1] + P.cas[1]) / 2} ${P.cas[0]} ${P.cas[1]}`} />
      <path className="lk" pathLength="1" style={{ '--k': 1 }} d={`M${P.mrk[0]} ${P.mrk[1]} Q${(P.mrk[0] + P.rab[0]) / 2 + 30} ${(P.mrk[1] + P.rab[1]) / 2 + 10} ${P.rab[0]} ${P.rab[1]}`} />
      {others.map(([k, n, dx, dy, a]) => (
        <g key={k} className={`town${k === 'cas' || k === 'rab' ? ' on' : ''}`}>
          <circle cx={P[k][0]} cy={P[k][1]} r="5" />
          <text x={P[k][0] + dx} y={P[k][1] + dy} textAnchor={a}>{n}</text>
        </g>
      ))}
      <g className="hq">
        <circle className="ring" cx={P.mrk[0]} cy={P.mrk[1]} r="10" />
        <circle className="ring r2" cx={P.mrk[0]} cy={P.mrk[1]} r="10" />
        <circle className="dot" cx={P.mrk[0]} cy={P.mrk[1]} r="10" />
        <text x={P.mrk[0] + 20} y={P.mrk[1] + 6}>Marrakech</text>
      </g>
    </svg>
  )
}

export default function Contact() {
  return (
    <PageV3 seo={SEO} init={initContact} cta={false} className="ct">
      <PageHero
        size="sm"
        crumbs={[{ label: 'Contact' }]}
        kicker="Contact · Agence de communication à Marrakech"
        title={<>Parlons de votre <Swash>projet</Swash>.</>}
        lede="Répondez à 4 questions en 30 secondes, écrivez-nous sur WhatsApp ou passez au studio. On revient vers vous avec un plan clair."
        aside={(
          <div className="glass ct-now">
            <div className="ct-now-t">
              <span className="live" aria-hidden="true" />
              <span>Il est <b data-tz="Africa/Casablanca">--:--</b> au studio</span>
            </div>
            <a className="ct-now-r" href={TEL}><span className="ic"><PhoneIc /></span><span><small>Téléphone</small>{PHONE}</span></a>
            <a className="ct-now-r" href={`mailto:${MAIL}`}><span className="ic"><Li k="mail" /></span><span><small>E-mail</small>{MAIL}</span></a>
            <p className="ct-now-f">Appel de cadrage gratuit · devis détaillé sous 48 heures</p>
          </div>
        )}
      >
        <Btn href="#contact">Répondre au quiz</Btn>
        <WaBtn text="Bonjour Supra v3, je souhaite parler d'un projet." />
      </PageHero>

      {/* Le quiz arrive tout de suite (section #contact) */}
      <FinalCta />

      {/* Tous les canaux */}
      <section className="sec light wrap ct-ch" id="canaux">
        <div className="c">
          <SecHead
            badge="Canaux"
            label="Choisissez le vôtre"
            title={<>Le plus rapide&nbsp;? <SwashR>WhatsApp</SwashR>.</>}
            lede="Un message, une photo de votre vitrine ou un lien vers votre compte Instagram suffit pour démarrer. Vous préférez parler ? Appelez-nous."
          />
          <ul className="ct-grid">
            <li className="ct-card ct-wa" data-r>
              <span className="ib"><Bi k="whatsapp" /></span>
              <span className="lab">WhatsApp · le plus rapide</span>
              <b className="val">{PHONE}</b>
              <div className="act">
                <a className="vbtn b-dk b-sm" href={waText("Bonjour Supra v3, je souhaite parler d'un projet.")} target="_blank" rel="noopener"><span className="ic"><Bi k="whatsapp" /></span><span>Écrire maintenant</span></a>
              </div>
            </li>
            <li className="ct-card" data-r={80} data-hov>
              <span className="ib"><PhoneIc /></span>
              <span className="lab">Téléphone</span>
              <b className="val">{PHONE}</b>
              <div className="act">
                <a className="ct-lnk" href={TEL}>Appeler</a>
                <button type="button" className="ct-copy" data-copy="+212786449572" aria-label="Copier le numéro de téléphone"><CopyIc /><span>Copier</span></button>
              </div>
            </li>
            <li className="ct-card" data-r={160} data-hov>
              <span className="ib"><Li k="mail" /></span>
              <span className="lab">E-mail</span>
              <b className="val">{MAIL}</b>
              <div className="act">
                <a className="ct-lnk" href={`mailto:${MAIL}`}>Écrire</a>
                <button type="button" className="ct-copy" data-copy={MAIL} aria-label="Copier l'adresse e-mail"><CopyIc /><span>Copier</span></button>
              </div>
            </li>
            <li className="ct-card" data-r={240}>
              <span className="ib"><Bi k="instagram" /></span>
              <span className="lab">Réseaux</span>
              <b className="val">@supra_v3</b>
              <div className="act ct-soc">
                <a href="https://www.instagram.com/supra_v3/" target="_blank" rel="noopener" aria-label="Instagram de Supra v3"><Bi k="instagram" /></a>
                <a href="https://www.tiktok.com/@supravofficiel" target="_blank" rel="noopener" aria-label="TikTok de Supra v3"><Bi k="tiktok" /></a>
                <a href="https://snapchat.com/t/jL89tQsB" target="_blank" rel="noopener" aria-label="Snapchat de Supra v3"><Bi k="snapchat" /></a>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Le studio et la carte */}
      <section className="sec light wrap ct-studio" id="studio">
        <div className="c ct-st">
          <div className="ct-st-l" data-r>
            <span className="nb"><b>Le studio</b>Marrakech</span>
            <h2 className="h2">Passez nous voir, <span className="it">à Marrakech.</span></h2>
            <address className="ct-addr">
              <span className="ib"><Li k="pin" /></span>
              <span><b>Supra v3 · Business Center Paul</b>Rue Mouatamid Ibn Abaad<br />40000 Marrakech, Maroc</span>
            </address>
            <p className="lede">Prévenez-nous avant de passer : on vous réserve un moment avec la bonne personne. On est aussi présents à Casablanca, Rabat, Dubaï et Paris.</p>
            <div className="ctas">
              <Btn href={ROUTE} tone="dk" icon={<Li k="pin" />}>Itinéraire</Btn>
              <a className="tlink" href={MAPS_URL} target="_blank" rel="noopener">Ouvrir dans Google Maps<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></a>
            </div>
          </div>
          <a className="ct-map" id="ctmap" href={MAPS_URL} target="_blank" rel="noopener" aria-label="Ouvrir l'emplacement du studio dans Google Maps" data-r={120}>
            <MoroccoMap />
            <span className="ct-geo">31,63° N · 8,01° O</span>
            <span className="ct-open">Ouvrir la carte<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg></span>
          </a>
        </div>
      </section>

      {/* Questions avant de nous écrire */}
      <section className="sec mist wrap" id="faq">
        <div className="c faq">
          <div className="fl" data-r>
            <span className="nb"><b>FAQ</b>Avant de nous écrire</span>
            <h2 className="h2">Les questions qu'on nous <SwashR>pose</SwashR>.</h2>
            <p className="lede">Une autre question&nbsp;? Le plus simple reste WhatsApp : on vous répond directement.</p>
            <WaBtn text="Bonjour Supra v3, j'ai une question avant de démarrer." />
          </div>
          <div className="qa" data-r>
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0}><summary>{f.q}<i aria-hidden="true" /></summary><div className="an">{f.a}</div></details>
            ))}
          </div>
        </div>
      </section>
    </PageV3>
  )
}
