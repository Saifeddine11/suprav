import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const seo = {
  title: 'Contact — Agence de communication Supra v. Marrakech',
  description: 'Contactez Supra v., agence de communication à Marrakech. Un café à Guéliz, un appel en visio ou un WhatsApp. La première conversation est offerte.',
  path: '/contact',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Supra v.',
    url: 'https://suprav3.com/contact',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'Supra v.',
      telephone: '+33744208673',
      email: 'contact@suprav3.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressCountry: 'MA' },
    },
  },
}

export default function Contact() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[{ label: 'Accueil', path: '/' }, { label: 'Contact' }]}
      title="Parlons de votre projet"
      subtitle="Agence de communication Supra v. — Marrakech"
      intro="Un café à Guéliz, un appel en visio, ou un WhatsApp. La première conversation est toujours offerte et dure environ 30 minutes. Nous vous répondons sous 24 heures."
      services={[
        { title: 'WhatsApp', desc: '+33 7 44 20 86 73 — Disponible du lundi au vendredi, 9h–18h. Réponse garantie sous 2h.' },
        { title: 'Email', desc: 'contact@suprav3.com — Pour les briefs détaillés, cahiers des charges et demandes de devis.' },
        { title: 'En présentiel', desc: 'Notre atelier est à Marrakech, quartier Guéliz. Sur rendez-vous via WhatsApp ou le formulaire de devis.' },
      ]}
    />
  )
}
