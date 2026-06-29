import PageSEO from '../components/PageSEO.jsx'
import BookingCTA from '../components/BookingCTA.jsx'
import { SEO_PAGES } from '../data/seoPages.js'
import '../App.css'
import '../styles/contact-page.css'

const seo = {
  ...SEO_PAGES.contact,
  path: '/contact',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Supra v3',
    url: 'https://www.suprav3.com/contact',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'Supra v3',
      telephone: '+212728521896',
      email: 'contact@suprav3.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Marrakech',
        addressCountry: 'MA',
      },
    },
  },
}

export default function Contact() {
  return (
    <>
      <PageSEO {...seo} path="/contact" />
      <article className="contact-page" aria-label="Contact Supra v3">
        <BookingCTA pageHero />
      </article>
    </>
  )
}
