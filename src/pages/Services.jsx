import { Link } from 'react-router-dom'
import PageSEO from '../components/PageSEO.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import AnimatedText from '../components/animations/AnimatedText.jsx'
import {
  SERVICE_INSIGHTS,
  SERVICE_OFFERS,
  SERVICE_METHOD,
  SERVICE_EXPLORE,
} from '../data/servicesPage.js'
import { SEO_PAGES } from '../data/seoPages.js'
import '../styles/services-page.css'

const seo = {
  ...SEO_PAGES.services,
  path: '/services',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Services Supra v3',
    url: 'https://www.suprav3.com/services',
    provider: {
      '@type': 'Organization',
      name: 'Supra v3',
      url: 'https://www.suprav3.com',
    },
    areaServed: { '@type': 'City', name: 'Marrakech' },
  },
}

const SERVICE_ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20"/></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11l18-8v18l-18-8v-2z"/></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  <svg key="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>,
  <svg key="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
]

export default function Services() {
  return (
    <article className="seo-page services-page">
      <PageSEO {...seo} path="/services" />

      <header className="services-hero seo-hero">
        <div className="services-hero__bg seo-hero__bg" aria-hidden="true" />
        <div className="container">
          <div className="services-hero__inner seo-hero__inner">
            <Breadcrumb items={[{ label: 'Accueil', path: '/' }, { label: 'Services' }]} />
            <p className="label seo-hero__eyebrow">Services</p>
            <AnimatedText
              as="h1"
              className="services-hero__title"
              text="Services communication à Marrakech pour structurer et développer votre marque."
              animateBy="words"
              direction="top"
              delay={100}
              stepDuration={0.35}
              instant
            />
            <p className="services-hero__body">
              De l&apos;étude de votre marché à la stratégie, de la production à la diffusion,
              Supra v3 construit des systèmes de communication pensés pour attirer, convaincre et
              convertir.
            </p>
            <p className="services-hero__body services-hero__body--secondary">
              Chaque service s&apos;inscrit dans une logique complète : comprendre votre marché,
              structurer votre message, produire les bons supports, diffuser au bon endroit et
              améliorer les résultats.
            </p>
            <div className="services-hero__actions seo-hero__actions">
              <Link to="/contact" className="btn btn--primary">
                Parler de votre projet →
              </Link>
              <Link to="/realisations" className="btn btn--secondary">
                Voir nos réalisations
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="services-intro" aria-labelledby="services-intro-title">
        <div className="container services-intro__grid">
          <div>
            <AnimatedText
              as="h2"
              id="services-intro-title"
              className="services-intro__title"
              text="On ne commence pas par produire. On commence par comprendre."
              animateBy="words"
              direction="top"
              delay={100}
              stepDuration={0.35}
              threshold={0.15}
              rootMargin="-50px"
            />
            <p className="services-intro__text">
              Nos services couvrent la chaîne complète : avant de créer un site, une vidéo ou une
              campagne, nous analysons votre marché, votre positionnement, vos clients et vos
              objectifs. Chaque action doit servir une direction claire.
            </p>
          </div>
          <div className="services-intro__insights">
            {SERVICE_INSIGHTS.map((item) => (
              <div key={item.title} className="services-insight">
                <p className="services-insight__title">{item.title}</p>
                <p className="services-insight__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-offers" aria-labelledby="services-offers-title">
        <div className="container">
          <div className="services-section-head">
            <p className="label">02 — Prestations</p>
            <AnimatedText
              as="h2"
              id="services-offers-title"
              className="services-section-head__title"
              lines={[
                [
                  { text: 'Des services pensés pour la ' },
                  { text: 'croissance', className: 'text-accent' },
                  { text: ', pas pour cocher des cases.' },
                ],
              ]}
              animateBy="words"
              direction="top"
              delay={100}
              stepDuration={0.35}
              threshold={0.15}
              rootMargin="-50px"
            />
            <p className="services-section-head__subtitle">
              Stratégie, production, diffusion et suivi : une même équipe pour garder la cohérence
              de la marque au fil du parcours client.
            </p>
          </div>

          <div className="services-offers__grid">
            {SERVICE_OFFERS.map((service, index) => (
              <Link
                key={service.title}
                to="/contact"
                className="services-offer-card"
              >
                <div className="services-offer-card__top">
                  <span className="services-offer-card__num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="services-offer-card__icon">
                    {SERVICE_ICONS[index % SERVICE_ICONS.length]}
                  </span>
                </div>
                <h3 className="services-offer-card__title">{service.title}</h3>
                <p className="services-offer-card__desc">{service.desc}</p>
                <div className="services-offer-card__tags">
                  {service.tags.map((tag) => (
                    <span key={tag} className="services-offer-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="services-offer-card__cta">Discuter de ce besoin →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="services-method" aria-labelledby="services-method-title">
        <div className="container">
          <div className="services-section-head">
            <p className="label">03 — Méthode</p>
            <AnimatedText
              as="h2"
              id="services-method-title"
              className="services-section-head__title"
              lines={[
                [
                  { text: 'Notre méthode : clarifier, créer, diffuser, ' },
                  { text: 'optimiser.', className: 'text-accent' },
                ],
              ]}
              animateBy="words"
              direction="top"
              delay={100}
              stepDuration={0.35}
              threshold={0.15}
              rootMargin="-50px"
            />
          </div>
          <div className="services-method__track">
            {SERVICE_METHOD.map((step) => (
              <div key={step.title} className="services-method__step">
                <span className="services-method__step-num">{step.step}</span>
                <h3 className="services-method__step-title">{step.title}</h3>
                <p className="services-method__step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-explore" aria-labelledby="services-explore-title">
        <div className="container">
          <div className="services-section-head">
            <p className="label">04 — Explorer</p>
            <AnimatedText
              as="h2"
              id="services-explore-title"
              className="services-section-head__title"
              lines={[
                [
                  { text: 'Explorer notre ' },
                  { text: 'travail', className: 'text-accent' },
                ],
              ]}
              animateBy="words"
              direction="top"
              delay={100}
              stepDuration={0.35}
              threshold={0.15}
              rootMargin="-50px"
            />
            <p className="services-section-head__subtitle">
              Découvrez comment nos services prennent forme à travers des projets web, des
              productions vidéo et des accompagnements concrets.
            </p>
          </div>
          <div className="services-explore__grid">
            {SERVICE_EXPLORE.map((item) => (
              <Link key={item.path} to={item.path} className="services-explore-card">
                <h3 className="services-explore-card__title">{item.title}</h3>
                <p className="services-explore-card__desc">{item.desc}</p>
                <span className="services-explore-card__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="services-final-cta" aria-labelledby="services-cta-title">
        <div className="container">
          <div className="services-final-cta__inner">
            <h2 id="services-cta-title" className="services-final-cta__title">
              Vous voulez structurer votre croissance ?
            </h2>
            <p className="services-final-cta__text">
              Parlez-nous de votre marque, de vos objectifs et de vos blocages. Nous vous aiderons
              à identifier les priorités avant de proposer une solution.
            </p>
            <div className="services-final-cta__actions">
              <Link to="/contact" className="btn btn--primary">
                Demander un diagnostic →
              </Link>
              <Link to="/realisations" className="btn btn--secondary">
                Voir les réalisations
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
