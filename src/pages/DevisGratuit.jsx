import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const seo = {
  title: 'Devis Gratuit — Agence de communication Supra v. Marrakech',
  description: 'Obtenez un devis gratuit sous 48h pour votre projet de communication à Marrakech : branding, site web, contenus, IA. Sans engagement.',
  path: '/devis-gratuit',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Devis Gratuit Supra v.',
    url: 'https://suprav3.com/devis-gratuit',
    description: 'Demande de devis gratuit pour agence de communication à Marrakech.',
  },
}

export default function DevisGratuit() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[{ label: 'Accueil', path: '/' }, { label: 'Devis Gratuit' }]}
      title="Devis Gratuit en 48h"
      subtitle="Sans engagement — Réponse garantie sous 48 heures"
      intro="Décrivez votre projet en quelques lignes. Nous analysons votre besoin et vous remettons un devis détaillé avec notre approche, le budget estimé et le planning proposé — sous 48 heures ouvrées."
      services={[
        { title: 'Sites vitrines', desc: 'À partir de 15 000 MAD. Livraison 3 à 6 semaines. Design sur-mesure, SEO optimisé, mobile-first.' },
        { title: 'Sites e-commerce', desc: 'À partir de 35 000 MAD. Paiement Maroc intégré, gestion stock, tableau de bord commandes.' },
        { title: 'Identité & branding', desc: 'À partir de 12 000 MAD. Naming, logo, charte graphique, brand book complet.' },
        { title: 'Projets IA & SaaS', desc: 'Devis sur mesure après cadrage. Agents IA, automatisation, applications métier.' },
      ]}
      faq={[
        { q: 'Le devis est-il vraiment gratuit ?', a: 'Oui, sans condition et sans engagement. Nous remettons un devis détaillé sous 48h ouvrées.' },
        { q: 'Que doit contenir ma demande ?', a: 'Décrivez votre activité, ce que vous souhaitez créer, votre budget indicatif et votre délai souhaité. Plus c\'est précis, plus le devis sera pertinent.' },
        { q: 'Puis-je avoir un appel avant le devis ?', a: 'Oui, un appel de cadrage de 30 minutes est toujours possible via WhatsApp ou en visio.' },
      ]}
    />
  )
}
