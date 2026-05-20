import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Mentions légales',
  url: 'https://suprav3.com/mentions-legales',
  inLanguage: 'fr',
  publisher: {
    '@type': 'Organization',
    name: 'Supra v3',
    url: 'https://suprav3.com',
  },
}

export default function MentionsLegales() {
  return (
    <SeoPageTemplate
      seo={{
        title: 'Mentions Légales | Supra v3',
        description:
          'Mentions légales du site Supra v3 : éditeur, contact, hébergement, propriété intellectuelle et responsabilité.',
        path: '/mentions-legales',
        schema,
      }}
      breadcrumb={[
        { label: 'Accueil', path: '/' },
        { label: 'Mentions légales' },
      ]}
      title="Mentions légales"
      subtitle="Informations relatives au site suprav3.com"
      intro="Le site suprav3.com est édité par Supra v3, agence de communication, création web, marketing digital et automatisation IA. Pour toute demande relative au site, à un contenu publié ou à une collaboration, vous pouvez nous contacter à l'adresse contact@suprav3.com ou via WhatsApp au +33 7 44 20 86 73."
      services={[
        {
          title: 'Éditeur du site',
          desc: "Supra v3 édite ce site pour présenter ses services de communication, branding, création web, SEO, production de contenus et automatisation IA à Marrakech et au Maroc.",
        },
        {
          title: 'Hébergement',
          desc: "Les informations d'hébergement peuvent varier selon l'environnement de déploiement. Elles seront complétées avec les coordonnées définitives de l'hébergeur lors de la mise en production.",
        },
        {
          title: 'Propriété intellectuelle',
          desc: "Les textes, visuels, interfaces, logos, vidéos et éléments graphiques présents sur le site sont protégés. Toute reproduction ou réutilisation sans autorisation écrite préalable est interdite.",
        },
        {
          title: 'Responsabilité',
          desc: "Supra v3 s'efforce de fournir des informations exactes et à jour. Les contenus du site sont présentés à titre informatif et peuvent être modifiés à tout moment.",
        },
      ]}
      faq={[
        {
          q: 'Comment contacter Supra v3 ?',
          a: 'Vous pouvez écrire à contact@suprav3.com ou utiliser le formulaire de contact du site.',
        },
        {
          q: 'Puis-je réutiliser les contenus du site ?',
          a: "Toute réutilisation doit faire l'objet d'une autorisation écrite préalable de Supra v3",
        },
      ]}
    />
  )
}
