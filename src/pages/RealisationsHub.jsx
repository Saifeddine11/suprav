import { Link } from 'react-router-dom'
import SeoPageTemplate from '../components/SeoPageTemplate.jsx'
import { RealisationsFinalCta, WHATSAPP } from '../components/realisations/realisationsShared.jsx'
import { WEBSITE_PROJECTS } from '../data/websiteProjects.js'
import BrowserMockup from '../components/ui/BrowserMockup.jsx'
import { websiteDisplayDomain } from '../utils/websiteDisplay.js'
import { VIDEO_PROJECTS } from '../data/videoProjects.js'
import { SEO_PAGES } from '../data/seoPages.js'
import '../App.css'
import '../styles/realisations-hub.css'

const seo = {
  ...SEO_PAGES.realisations,
  path: '/realisations',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Réalisations agence communication Supra v3',
    url: 'https://www.suprav3.com/realisations',
    description: SEO_PAGES.realisations.description,
    publisher: {
      '@type': 'Organization',
      name: 'Supra v3',
      url: 'https://www.suprav3.com',
    },
  },
}

/** Capture site web — poster `public/media/website/images/optimized/` */
const hubWebPreview =
  WEBSITE_PROJECTS.find((project) => project.name === 'Emara Estates') ||
  WEBSITE_PROJECTS.find((project) => project.poster && !project.video) ||
  WEBSITE_PROJECTS.find((project) => project.poster)

const featuredVideo = VIDEO_PROJECTS.slice(0, 2)

export default function RealisationsHub() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[{ label: 'Accueil', path: '/' }, { label: 'Réalisations' }]}
      title="Réalisations agence communication à Marrakech"
      subtitle="Sites web, vidéos et contenus — une vision claire du travail Supra v3"
      intro="Explorez nos réalisations par univers : expériences digitales sur-mesure et production vidéo pour marques ambitieuses. Nos réalisations montrent comment la stratégie, le design, le contenu et le web peuvent renforcer la crédibilité d&apos;une marque et créer plus de demandes qualifiées."
      internalLinks={[
        { label: 'Services', path: '/services', desc: 'Stratégie, branding, web, vidéo et marketing digital.' },
        { label: 'Contact', path: '/contact', desc: 'Parler de votre projet avec Supra v3.' },
      ]}
      primaryCta={{ href: '/contact', label: 'Parler de votre projet →' }}
      secondaryCta={{ href: WHATSAPP, label: 'WhatsApp', external: true }}
      showBookingCta={false}
    >
      <section className="realisations-hub" aria-label="Catégories de réalisations">
        <div className="container">
          <p className="realisations-hub__intro">
            Deux expertises complémentaires — le digital et le contenu — pour construire une présence
            de marque cohérente, premium et performante.
          </p>

          <div className="realisations-hub__grid">
            <Link
              to="/realisations/websites"
              className="realisations-category-card realisations-category-card--web"
            >
              <p className="realisations-category-card__eyebrow">Digital</p>
              <h2 className="realisations-category-card__title">
                Sites <span>web</span>
              </h2>
              <p className="realisations-category-card__text">
                Sites vitrines, plateformes et expériences digitales livrées ou accompagnées par notre
                équipe.
              </p>
              {hubWebPreview?.poster ? (
                <div className="realisations-category-preview-shell realisations-category-preview-shell--web">
                  <BrowserMockup
                    className="browser-mockup--hub"
                    image={hubWebPreview.poster}
                    title={hubWebPreview.name}
                    domain={websiteDisplayDomain(hubWebPreview)}
                    url={hubWebPreview.publicUrl}
                    alt={`Aperçu du site ${hubWebPreview.name}`}
                  />
                </div>
              ) : null}
              <span className="realisations-category-link">
                Voir les projets web <span aria-hidden="true">→</span>
              </span>
            </Link>

            <Link to="/realisations/production-videos" className="realisations-category-card">
              <p className="realisations-category-card__eyebrow">Contenus</p>
              <h2 className="realisations-category-card__title">
                Production <span>vidéos</span>
              </h2>
              <p className="realisations-category-card__text">
                Films de marque, reels et contenus sociaux pensés pour capter l&apos;attention et
                renforcer votre image.
              </p>
              {featuredVideo.length ? (
                <div className="realisations-category-preview-shell">
                  <div
                    className="realisations-category-preview realisations-category-preview--video"
                    aria-hidden="true"
                  >
                    {featuredVideo.map((item) => (
                      <div key={item.id} className="realisations-category-preview__item">
                        {item.poster ? (
                          <img
                            src={item.poster}
                            alt={item.title ? `Aperçu vidéo ${item.title}` : ''}
                            aria-hidden={item.title ? undefined : true}
                            loading="lazy"
                            decoding="async"
                            width={360}
                            height={640}
                            draggable={false}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <span className="realisations-category-link">
                Voir les vidéos <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <RealisationsFinalCta />
    </SeoPageTemplate>
  )
}
