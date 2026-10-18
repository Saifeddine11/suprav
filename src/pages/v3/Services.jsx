import { Link } from 'react-router-dom'
import PageV3 from './PageV3.jsx'
import PageHero, { Swash, SwashR } from './PageHero.jsx'
import { Btn, Li, SecHead, WaBtn } from './ui.jsx'
import Faq from '../home-v3/sections/Faq.jsx'
import './css/services.css'

const SITE = 'https://www.suprav3.com'
const ORG = { '@id': 'https://suprav3.com/#agence' }

/* Les 9 métiers de l'agence ; `links` = pages et guides qui prolongent la carte (maillage interne). */
const SERVICES = [
  { k: 'target', t: 'Stratégie de marque', d: 'On cadre votre marché, vos clients et vos objectifs avant toute production, pour que chaque décision serve une direction claire.', tags: ['Audit', 'Positionnement', 'Feuille de route'], links: [{ to: '/blog/choisir-agence-communication-marrakech', l: 'Bien choisir son agence' }] },
  { k: 'palette', t: 'Identité visuelle et branding', d: 'Logo, charte, typographies, déclinaisons et brand book : une image cohérente sur chaque écran et chaque vitrine.', tags: ['Logo', 'Charte', 'Brand book'], links: [{ to: '/#systeme', l: 'Voir un avant / après' }] },
  { k: 'globe', t: 'Sites web', d: 'Sites vitrines, one page et e-commerce pensés pour présenter l’offre, rassurer et transformer les visites en demandes.', tags: ['Vitrine', 'E-commerce', 'Multilingue'], links: [{ to: '/realisations/websites', l: 'Nos sites' }, { to: '/blog/combien-coute-site-web-marrakech', l: 'Le prix d’un site' }] },
  { k: 'video', t: 'Production vidéo', d: 'Script, tournage, montage et sous-titres par notre équipe, puis les formats pour Instagram, TikTok et Snapchat.', tags: ['Publicité', 'Reels', 'Home tour'], links: [{ to: '/realisations/production-videos', l: 'Nos vidéos' }] },
  { k: 'trend', t: 'Publicité et acquisition', d: 'Campagnes Meta, TikTok et Snapchat avec un objectif chiffré, des pages d’atterrissage et un suivi des demandes.', tags: ['Meta Ads', 'TikTok Ads', 'Snapchat Ads'], links: [{ to: '/blog/meta-tiktok-snapchat-maroc', l: 'Quelle plateforme choisir' }] },
  { k: 'search', t: 'Référencement SEO', d: 'Structure, contenus, fiche Google Business Profile et suivi dans la Search Console pour être trouvé sur Google.', tags: ['SEO local', 'Contenus', 'Technique'], links: [{ to: '/blog/seo-marrakech-delais-et-couts', l: 'Délais et coûts du SEO' }] },
  { k: 'chat', t: 'Réseaux sociaux', d: 'Ligne éditoriale, calendrier et publications régulières, alignés sur la stratégie et sur les campagnes en cours.', tags: ['Éditorial', 'Calendrier', 'Community'], links: [] },
  { k: 'db', t: 'Applications et plateformes', d: 'Tableaux de bord, espaces clients et outils internes quand les fichiers Excel et les processus éclatés freinent l’activité.', tags: ['Dashboard', 'Espace client', 'Outil métier'], links: [] },
  { k: 'bot', t: 'Agents IA et automatisation', d: 'Agents IA qui répondent et qualifient les demandes sur WhatsApp et le site, et automatisations entre vos outils.', tags: ['Agents IA', 'WhatsApp', 'Workflows'], links: [{ to: '/blog/agent-ia-riad-agence-immobiliere', l: 'Ce que fait un agent IA' }] },
]

const INSIGHTS = [
  { t: 'Marché', d: 'Le contexte, les attentes des clients et ce que font les concurrents.' },
  { t: 'Positionnement', d: 'Une promesse claire et ce qui vous distingue.' },
  { t: 'Message', d: 'Les mots, les preuves et l’histoire qui parlent à votre cible.' },
  { t: 'Conversion', d: 'Le parcours et les appels à l’action qui mènent à une demande.' },
]

const METHOD = [
  { n: '01', t: 'Comprendre', d: 'Audit, marché, cible et objectifs, pendant l’appel de cadrage gratuit.' },
  { n: '02', t: 'Structurer', d: 'Positionnement, message, parcours et priorités, écrits dans le devis.' },
  { n: '03', t: 'Créer', d: 'Identité, vidéos, site et campagnes, faits par la même équipe.' },
  { n: '04', t: 'Diffuser', d: 'Publicité, réseaux sociaux et SEO, sur les canaux de votre cible.' },
  { n: '05', t: 'Améliorer', d: 'Résultats suivis sur un tableau de bord et point chaque mois.' },
]

const DESC = 'Services Supra v3 à Marrakech : stratégie de marque, branding, sites web, production vidéo, publicité Meta et TikTok, SEO, réseaux sociaux et agents IA.'

const SEO = {
  title: 'Services communication, web et marketing digital à Marrakech',
  description: DESC,
  path: '/services',
  schema: {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${SITE}/services#page`, url: `${SITE}/services`, name: 'Services de Supra v3', description: DESC, inLanguage: 'fr', about: ORG },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/services` },
        ],
      },
      {
        '@type': 'ItemList',
        itemListElement: SERVICES.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'Service', name: s.t, description: s.d, provider: ORG, areaServed: { '@type': 'City', name: 'Marrakech' } },
        })),
      },
    ],
  },
}

export default function Services() {
  return (
    <PageV3 seo={SEO} className="sv">
      <PageHero
        crumbs={[{ label: 'Services' }]}
        kicker="Services · Agence de communication 360° à Marrakech"
        title={<>Tout ce qu’il faut pour <Swash>grandir</Swash>, au même endroit.</>}
        lede="De l’étude de votre marché à la diffusion, Supra v3 construit votre communication avec une seule équipe : stratégie, identité, vidéo, site, publicité, SEO et agents IA."
        aside={(
          <div className="glass sv-aside">
            <span className="eyebrow">9 métiers · 1 studio</span>
            <ul>
              {SERVICES.map((s) => <li key={s.t}><span className="ib"><Li k={s.k} /></span>{s.t}</li>)}
            </ul>
          </div>
        )}
      >
        <Btn to="/contact">Parler de votre projet</Btn>
        <Btn to="/realisations" tone="dk">Voir nos réalisations</Btn>
      </PageHero>

      {/* Comprendre avant de produire */}
      <section className="sec light wrap sv-intro">
        <div className="c sv-intro-g">
          <SecHead
            badge="Approche"
            label="Avant de produire"
            title={<>On ne commence pas par produire. <span className="it">On commence par comprendre.</span></>}
            lede="Avant un site, une vidéo ou une campagne, on analyse votre marché, vos clients et vos objectifs. Chaque action doit servir une direction claire."
          />
          <ul className="sv-ins">
            {INSIGHTS.map((x, i) => (
              <li key={x.t} data-r={i * 80}><b>{String(i + 1).padStart(2, '0')}</b><h3>{x.t}</h3><p>{x.d}</p></li>
            ))}
          </ul>
        </div>
      </section>

      {/* Les services */}
      <section className="sec mist wrap" id="liste">
        <div className="c">
          <SecHead
            badge="Services"
            label="Ce qu'on fait"
            title={<>Neuf métiers, <SwashR>une</SwashR> seule équipe.</>}
            lede="Stratégie, production, diffusion et suivi : la même équipe garde la cohérence de votre marque à chaque étape."
          />
          <ul className="sv-grid">
            {SERVICES.map((s, i) => (
              <li className="scd sv-card" key={s.t} data-r={(i % 3) * 80}>
                <div className="sv-top"><span className="ib"><Li k={s.k} /></span><span className="sv-n">{String(i + 1).padStart(2, '0')}</span></div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                <div className="chips">{s.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
                {s.links.length ? (
                  <div className="sv-links">
                    {s.links.map((l) => <Link key={l.to} to={l.to}>{l.l}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>)}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Méthode */}
      <section className="sec dark wrap sv-meth">
        <div className="c">
          <SecHead
            center
            badge="Méthode"
            label="Cinq étapes"
            title={<>De l’appel de cadrage aux <SwashR>résultats</SwashR>.</>}
            lede="Le planning exact est écrit dans le devis, envoyé sous 48 heures après l’appel."
          />
          <ol className="sv-steps">
            {METHOD.map((m, i) => (
              <li key={m.n} data-r={i * 90}><span className="sv-dot">{m.n}</span><h3>{m.t}</h3><p>{m.d}</p></li>
            ))}
          </ol>
          <div className="sv-cta" data-r>
            <Btn to="/contact">Réserver l’appel de cadrage</Btn>
            <WaBtn text="Bonjour Supra v3, je voudrais parler d'un projet." />
          </div>
        </div>
      </section>

      <Faq />
    </PageV3>
  )
}
