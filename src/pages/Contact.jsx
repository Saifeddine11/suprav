import { Link } from 'react-router-dom'
import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const WHATSAPP =
  'https://wa.me/33744208673?text=' +
  encodeURIComponent(
    'Bonjour Supra v3, je souhaite discuter d\'un projet pour mon entreprise.\nType de projet :\nBudget estimé :\nDélai souhaité :'
  )

const seo = {
  title: 'Contact Supra v3 | Agence de communication à Marrakech',
  description:
    'Contactez Supra v3 pour votre projet de site web, branding, marketing digital, contenu ou automatisation à Marrakech. Réponse sous 24 h.',
  path: '/contact',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Supra v3',
    url: 'https://suprav3.com/contact',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'Supra v3',
      telephone: '+33744208673',
      email: 'contact@suprav3.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Marrakech', addressCountry: 'MA' },
    },
  },
}

function ContactChannels() {
  return (
    <section className="seo-contact-block">
      <div className="container">
        <div className="seo-contact-block__grid">
          <div className="seo-contact-block__channels">
            <div className="seo-contact-block__channel">
              <strong>WhatsApp</strong>
              <a href={WHATSAPP} target="_blank" rel="noreferrer noopener">
                Discuter sur WhatsApp →
              </a>
              <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: 'rgba(17,17,17,0.55)' }}>
                Lundi–vendredi, 9h–18h (heure Maroc). Réponse en général sous 2 h.
              </p>
            </div>
            <div className="seo-contact-block__channel">
              <strong>Email</strong>
              <a href="mailto:contact@suprav3.com">contact@suprav3.com</a>
              <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: 'rgba(17,17,17,0.55)' }}>
                Pour les briefs détaillés, cahiers des charges et demandes structurées.
              </p>
            </div>
            <div className="seo-contact-block__channel">
              <strong>Atelier</strong>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Marrakech, Maroc — quartier Guéliz. Rendez-vous sur place après échange WhatsApp ou visio.
              </p>
            </div>
            <div className="seo-contact-block__channel">
              <strong>Types de demandes</strong>
              <ul className="seo-contact-block__types">
                <li>Site web</li>
                <li>Branding</li>
                <li>Marketing digital</li>
                <li>Vidéo / contenu</li>
                <li>Automatisation IA</li>
                <li>Autre</li>
              </ul>
            </div>
          </div>
          <div className="seo-contact-block__form-panel">
            <h2 className="seo-rich__h2" style={{ marginTop: 0 }}>
              Envoyer ma demande
            </h2>
            <p>
              Décrivez votre projet en quelques lignes : objectif, secteur, délai souhaité et niveau
              d&apos;accompagnement attendu. Nous revenons vers vous avec un diagnostic et une proposition
              adaptée — sans grille tarifaire affichée en ligne.
            </p>
            <div className="seo-contact-block__actions">
              <Link to="/devis-gratuit" className="btn btn--primary">
                Demander un diagnostic →
              </Link>
              <a href={WHATSAPP} className="btn btn--secondary" target="_blank" rel="noreferrer noopener">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Contact() {
  return (
    <SeoPageTemplate
      seo={seo}
      breadcrumb={[{ label: 'Accueil', path: '/' }, { label: 'Contact' }]}
      title="Parlons de votre projet"
      subtitle="Contact — Supra v3, Marrakech"
      intro="Un café à Guéliz, un appel en visio ou un message WhatsApp : la première conversation sert à comprendre votre situation, vos objectifs et ce qui bloque aujourd'hui. Nous répondons en général sous 24 heures."
      primaryCta={{ href: '/devis-gratuit', label: 'Demander un diagnostic →' }}
      secondaryCta={{ href: WHATSAPP, label: 'Discuter sur WhatsApp', external: true }}
      services={[
        {
          title: 'Premier échange offert',
          desc: 'Environ 30 minutes pour cadrer votre besoin : image, visibilité, site, contenus ou automatisation. Sans engagement.',
        },
        {
          title: 'Estimation personnalisée',
          desc: 'Chaque projet est chiffré après cadrage. Pas de grille publique : nous adaptons la proposition à vos objectifs et au niveau de finition attendu.',
        },
        {
          title: 'Réponse rapide',
          desc: 'WhatsApp pour les échanges courts, email pour les briefs structurés. Nous priorisons la clarté avant la vitesse.',
        },
      ]}
      servicesHeadline={
        <>
          Comment nous <span className="text-accent">joindre.</span>
        </>
      }
      faq={[
        {
          q: 'Sous quel délai répondez-vous ?',
          a: 'En général sous 24 h ouvrées par WhatsApp ou email. Pour une demande urgente, précisez-le dans votre message : nous indiquons si un créneau est possible le jour même.',
        },
        {
          q: 'Faut-il préparer quelque chose avant de nous écrire ?',
          a: 'Une idée de votre activité, de l’objectif (plus de demandes, meilleure image, lancement…) et du délai souhaité suffisent. Des références visuelles ou un site existant accélèrent le cadrage.',
        },
        {
          q: 'Travaillez-vous avec des entreprises hors Marrakech ?',
          a: 'Oui — Casablanca, Rabat, France, diaspora. Les cadrages se font en visio ; les ateliers créatifs et tournages se organisent à Marrakech quand le projet le demande.',
        },
      ]}
      internalLinks={[
        { label: 'Création de site web', path: '/creation-site-web-marrakech', desc: 'Sites vitrines, e-commerce et landing pages.' },
        { label: 'Marketing digital', path: '/marketing-digital-marrakech', desc: 'SEO, publicité et stratégie digitale.' },
        { label: 'Agence communication', path: '/agence-communication-marrakech', desc: 'Accompagnement 360 à Marrakech.' },
      ]}
      showBookingCta={false}
    >
      <ContactChannels />
    </SeoPageTemplate>
  )
}
