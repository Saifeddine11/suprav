import { Link } from 'react-router-dom'
import { WEBSITE_PROJECTS } from '../../data/websiteProjects.js'
import { whatsappUrlWithMessage } from '../../data/contactChannels.js'
import { websiteDisplayDomain } from '../../utils/websiteDisplay.js'

export const WHATSAPP = whatsappUrlWithMessage(
  'Bonjour Supra v3, je souhaite discuter d\'un projet pour mon entreprise.\nType de projet :\nBudget estimé :\nDélai souhaité :',
)

export const WEBSITE_FOCUS_ITEMS = WEBSITE_PROJECTS.map((project, index) => ({
  id: project.name,
  number: String(index + 1).padStart(2, '0'),
  title: project.name,
  sector: project.sector,
  description: project.description,
  tag: project.tag ?? null,
  poster: project.poster,
  video: project.video,
  publicUrl: project.publicUrl,
  domain: websiteDisplayDomain(project),
}))

export function RealisationsFinalCta() {
  return (
    <section className="seo-rich" style={{ paddingTop: 48 }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p className="seo-rich__p">
          Vous avez un projet comparable ? Nous cadrons la mission avant toute proposition.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 16 }}>
          <Link to="/contact" className="btn btn--primary">
            Demander un diagnostic →
          </Link>
          <Link to="/services" className="btn btn--secondary">
            Voir nos services
          </Link>
        </div>
      </div>
    </section>
  )
}
