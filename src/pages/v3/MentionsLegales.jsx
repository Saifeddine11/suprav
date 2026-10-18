import { Link } from 'react-router-dom'
import PageV3 from './PageV3.jsx'
import PageHero from './PageHero.jsx'
import { ADDRESS, MAIL, PHONE, TEL } from './consts.js'
import './css/legal.css'

const SITE = 'https://www.suprav3.com'
const SEO = {
  title: 'Mentions légales | Supra v3',
  description: 'Mentions légales du site suprav3.com : éditeur, hébergeur, propriété intellectuelle, données personnelles, mesure d’audience et responsabilité.',
  path: '/mentions-legales',
  schema: {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', url: `${SITE}/mentions-legales`, name: 'Mentions légales', inLanguage: 'fr', publisher: { '@id': 'https://suprav3.com/#agence' } },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Mentions légales', item: `${SITE}/mentions-legales` },
        ],
      },
    ],
  },
}

export default function MentionsLegales() {
  return (
    <PageV3 seo={SEO} cta={false} className="lg">
      <PageHero
        size="sm"
        crumbs={[{ label: 'Mentions légales' }]}
        kicker="Informations légales · suprav3.com"
        title="Mentions légales"
        lede="Qui édite ce site, qui l’héberge, et ce que nous faisons des informations que vous nous envoyez."
      />
      <section className="sec light wrap">
        <div className="c lg-body">
          <p className="lg-up">Mise à jour : 18 octobre 2026</p>

          <h2>Éditeur du site</h2>
          <p>Le site suprav3.com est édité par <b>Supra v3</b>, agence de communication 360° basée à Marrakech.</p>
          <ul>
            <li>ICE : 003908571000024</li>
            <li>RC n° 178175</li>
            <li>Adresse : {ADDRESS}, Maroc</li>
            <li>Téléphone : <a href={TEL}>{PHONE}</a></li>
            <li>E-mail : <a href={`mailto:${MAIL}`}>{MAIL}</a></li>
          </ul>

          <h2>Hébergement</h2>
          <p>Le site est hébergé par <b>Hostinger International Limited</b>, 61 Lordou Vironos str., 6023 Larnaca, Chypre (hostinger.com).</p>

          <h2>Propriété intellectuelle</h2>
          <p>Les textes, visuels, vidéos, interfaces, logos et éléments graphiques du site sont protégés. Toute reproduction ou réutilisation sans autorisation écrite préalable de Supra v3 est interdite. Les marques et contenus des clients présentés dans les réalisations restent la propriété de leurs titulaires.</p>

          <h2>Données personnelles</h2>
          <p>Le quiz de contact et le formulaire de candidature recueillent les informations que vous saisissez : nom, e-mail, téléphone, vos réponses et, pour une candidature, votre CV ou votre photo. Elles servent uniquement à vous répondre ou à étudier votre candidature, et ne sont ni vendues ni cédées.</p>
          <p>Les candidatures sont conservées 12 mois au maximum. Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel, vous pouvez demander l’accès, la rectification ou la suppression de vos données, ou vous opposer à leur traitement, en écrivant à <a href={`mailto:${MAIL}`}>{MAIL}</a>.</p>

          <h2>Mesure d’audience</h2>
          <p>Le site utilise Google Analytics, le pixel Meta et Ahrefs Analytics pour mesurer sa fréquentation et l’efficacité de nos publicités. Ces outils peuvent déposer des cookies ou des identifiants dans votre navigateur ; vous pouvez les bloquer ou les supprimer depuis les réglages de votre navigateur.</p>

          <h2>Responsabilité</h2>
          <p>Supra v3 s’efforce de publier des informations exactes et à jour. Les contenus sont donnés à titre informatif et peuvent être modifiés à tout moment. Les articles du blog citent leurs sources ; les liens vers des sites externes n’engagent pas leurs éditeurs ni Supra v3.</p>

          <h2>Contact</h2>
          <p>Pour toute question sur le site ou sur ces mentions : <a href={`mailto:${MAIL}`}>{MAIL}</a>, ou la <Link to="/contact">page contact</Link>.</p>
        </div>
      </section>
    </PageV3>
  )
}
