import { Link } from 'react-router-dom'
import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Création de charte graphique à Marrakech',
  description:
    'Supra v3 crée des chartes graphiques professionnelles à Marrakech : logo, couleurs, typographies, règles visuelles, supports digitaux et print.',
  provider: {
    '@type': 'Organization',
    name: 'Supra v3',
    url: 'https://suprav3.com',
    telephone: '+33744208673',
    email: 'contact@suprav3.com',
  },
  areaServed: { '@type': 'City', name: 'Marrakech' },
  url: 'https://suprav3.com/charte-graphique',
  serviceType: 'Création de charte graphique',
}

export default function CharteGraphique() {
  return (
    <SeoPageTemplate
      seo={{
        title: 'Charte graphique à Marrakech | Identité visuelle professionnelle | Supra v3',
        description:
          'Supra v3 crée des chartes graphiques professionnelles à Marrakech : logo, couleurs, typographies, règles visuelles, supports digitaux et print.',
        path: '/charte-graphique',
        schema,
      }}
      breadcrumb={[
        { label: 'Accueil', path: '/' },
        { label: 'Branding', path: '/branding-marrakech' },
        { label: 'Charte graphique' },
      ]}
      title="Création de charte graphique à Marrakech"
      subtitle="Identité visuelle — cohérence sur tous les supports"
      intro="Une charte graphique structure l’usage de votre logo, vos couleurs et vos typographies sur le web, les réseaux, le print et la signalétique. Supra v3 conçoit des chartes claires et utilisables par votre équipe — page dédiée, contenu unique, sans dupliquer la homepage."
      primaryCta={{ href: '/devis-gratuit', label: 'Créer mon identité visuelle →' }}
      secondaryCta={{
        href: 'https://wa.me/33744208673?text=' + encodeURIComponent('Bonjour Supra v3, je souhaite parler de ma charte graphique / branding.'),
        label: 'Parler de ma marque',
        external: true,
      }}
      services={[
        {
          title: 'Logo & déclinaisons',
          desc: 'Versions couleur, noir, blanc, sur fond clair ou sombre. Zones de protection et tailles minimales pour éviter les déformations.',
        },
        {
          title: 'Couleurs & typographies',
          desc: 'Palette principale et secondaire avec codes print et digital. Polices titres, textes et accents avec règles d’association.',
        },
        {
          title: 'Réseaux & print',
          desc: 'Templates Instagram, LinkedIn, signatures email, cartes de visite et déclinaisons print selon votre secteur à Marrakech.',
        },
        {
          title: 'Direction artistique',
          desc: 'Iconographie, photos, ton visuel : pour une marque premium, locale ou internationale, sans effet « template ».',
        },
      ]}
      servicesHeadline={
        <>
          Contenu d&apos;une <span className="text-accent">charte complète.</span>
        </>
      }
      richContent={[
        {
          heading: 'À quoi sert une charte graphique ?',
          body: [
            'Elle évite que chaque prestataire interprète votre logo différemment. Elle accélère la production de visuels cohérents et renforce la reconnaissance de votre marque à Marrakech et au-delà.',
          ],
        },
        {
          heading: 'Pourquoi c’est important pour une marque premium',
          body: [
            'Dans l’immobilier, l’hôtellerie, la restauration ou le conseil, la cohérence visuelle soutient le positionnement haut de gamme. Une charte sérieuse rassure avant même la première réunion.',
          ],
        },
        {
          heading: 'Processus Supra v3',
          bullets: [
            'Audit de l’existant et benchmarks',
            'Atelier positionnement et univers visuel',
            'Propositions créatives',
            'Affinage et livraison des fichiers sources',
            'Guide d’utilisation pour vos équipes',
          ],
        },
        {
          heading: 'Erreurs fréquentes',
          bullets: [
            'Logo sans règles d’usage',
            'Trop de couleurs ou polices incohérentes',
            'Charte trop théorique, pas utilisable au quotidien',
            'Absence de templates réseaux sociaux',
          ],
        },
      ]}
      faq={[
        {
          q: 'Quelle différence entre logo et charte graphique ?',
          a: 'Le logo est le signe. La charte explique comment l’utiliser avec les couleurs, typographies et supports — pour que votre image reste cohérente partout.',
        },
        {
          q: 'La charte couvre-t-elle le digital ?',
          a: 'Oui : formats web, réseaux sociaux, signatures email et recommandations pour votre site. Nous alignons la charte avec votre futur site si celui-ci est dans le projet.',
        },
        {
          q: 'Comment obtenir une proposition ?',
          a: 'Après diagnostic sur vos supports actuels et vos objectifs, nous remettons une proposition adaptée. Pas de grille tarifaire publique sur le site.',
        },
      ]}
      internalLinks={[
        { label: 'Branding Marrakech', path: '/branding-marrakech', desc: 'Stratégie de marque et logo.' },
        { label: 'Création site web', path: '/creation-site-web-marrakech', desc: 'Décliner la charte en ligne.' },
        { label: 'Contact', path: '/contact', desc: 'Diagnostic branding.' },
      ]}
    />
  )
}
