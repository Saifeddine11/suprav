import { Link } from 'react-router-dom'
import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "SEO local à Marrakech : guide pour rendre votre entreprise visible sur Google",
  "description": "Maîtrisez le SEO local à Marrakech en 2026 : Google Business Profile, citations locales, avis clients et optimisation on-page pour dominer les recherches de proximité.",
  "datePublished": "2026-04-25",
  "author": {
    "@type": "Organization",
    "name": "Supra v3"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Supra v3",
    "url": "https://suprav3.com"
  },
  "url": "https://suprav3.com/blog/seo-local-guide-marrakech",
  "inLanguage": "fr",
  "about": {
    "@type": "Thing",
    "name": "SEO local Marrakech"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://suprav3.com/blog/seo-local-guide-marrakech"
  }
}

export default function ArticleSeoLocal() {
  return (
    <SeoPageTemplate
      seo={{
        title: 'SEO local Marrakech | Guide pour rendre votre entreprise visible sur Google',
        description:
          'Découvrez comment améliorer votre SEO local à Marrakech : Google Business Profile, avis clients, pages locales, mots-clés, citations et contenu.',
        path: '/blog/seo-local-guide-marrakech',
        schema,
        type: 'article',
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Blog", path: "/blog" },
        { label: "SEO Local Marrakech Guide Complet" }
      ]}
      title="SEO local à Marrakech : guide pour rendre votre entreprise visible sur Google"
      subtitle="Article — Visibilité locale"
      intro="Le SEO local permet d’apparaître quand un client cherche un service à Marrakech sur Google ou Maps. Ce guide couvre Google Business Profile, les avis, les mots-clés locaux, les pages de votre site et les erreurs fréquentes — sans reprendre le contenu de la page d’accueil."
      primaryCta={{ href: '/devis-gratuit', label: 'Demander un diagnostic SEO local →' }}
      secondaryCta={{
        href: 'https://wa.me/33744208673?text=' + encodeURIComponent('Bonjour Supra v3, je souhaite améliorer ma visibilité locale à Marrakech.'),
        label: 'Améliorer ma visibilité',
        external: true,
      }}
      servicesHeadline={
        <>
          Les piliers du <span className="text-accent">SEO local.</span>
        </>
      }
      services={[
        {
          title: "Étape 1 : Créer et optimiser votre Google Business Profile",
          desc: "La base du SEO local Marrakech est une fiche Google Business Profile complète et optimisée. Choisissez la catégorie principale la plus précise, remplissez toutes les sections (description, services, attributs, horaires spéciaux), ajoutez minimum 10 photos professionnelles et publiez des posts hebdomadaires. Une fiche complète à 100 % génère en moyenne 70 % d'appels supplémentaires par rapport à une fiche basique."
        },
        {
          title: "Étape 2 : Construire votre réputation d'avis locaux",
          desc: "Les avis Google sont le deuxième facteur de classement local le plus important après la pertinence de votre fiche. Objectif minimum : 20 avis avec une note de 4,3 étoiles ou plus. Mettez en place un système de collecte d'avis systematique : QR code à l'accueil, SMS post-achat, email de suivi. Répondez à TOUS les avis, positifs comme négatifs, dans les 24h. Chaque réponse est une opportunité d'intégrer des mots-clés locaux naturellement."
        },
        {
          title: "Étape 3 : Créer des pages locales sur votre site",
          desc: "Créez des pages dédiées à chaque zone géographique et à chaque service sur votre site web. Exemples : /restaurant-marrakech-gueliz, /dentiste-marrakech-hivernage. Ces pages doivent contenir au minimum 500 mots de contenu unique, intégrer le balisage LocalBusiness Schema.org, inclure une Google Maps embed et être liées depuis votre fiche Google Business."
        },
        {
          title: "Étape 4 : Construire des citations NAP cohérentes",
          desc: "Les citations locales (mentions de votre Nom, Adresse et Téléphone sur des sites tiers) renforcent la confiance de Google dans votre implantation locale à Marrakech. Inscrivez-vous sur les principaux annuaires : Yabiladi, Bizcommunity.ma, Cylex.ma, TripAdvisor, Yelp et les annuaires sectoriels. Vérifiez que vos informations NAP sont identiques sur tous ces sites — une incohérence peut nuire à votre référencement local."
        }
      ]}
      richContent={[
        {
          heading: "Pourquoi le SEO local est fondamentalement différent du SEO classique",
          body: [
            "Le SEO classique (référencement organique) vise à positionner votre site sur des requêtes générales dans les résultats de recherche standard de Google. Le SEO local, lui, cible spécifiquement les requêtes avec une intention géographique — c'est-à-dire les recherches effectuées par des utilisateurs qui cherchent un produit ou un service dans une zone précise. Ces deux disciplines partagent des fondamentaux communs mais divergent sur des aspects critiques.",
            "La différence la plus visible est l'affichage des résultats. Pour une requête locale comme « boulangerie Marrakech » ou « agence web Guéliz », Google affiche d'abord le Pack Local — une carte Google Maps avec trois fiches d'établissement — avant les résultats organiques classiques. Ce Pack Local capte environ 44 % des clics sur les requêtes locales. Apparaître dans ce pack est souvent plus rapide et plus rentable que de ranker en première page des résultats organiques classiques.",
            "Les facteurs de classement du Pack Local sont également différents : la pertinence de votre fiche Google Business Profile, la proximité géographique de l'utilisateur et la notoriété (signaux d'avis, de citations et d'autorité) pèsent plus lourd que les backlinks et le contenu de page — critères dominants en SEO classique.",
          ],
        },
        {
          heading: "Les facteurs de classement local en 2026 : ce qui compte vraiment",
          sub: [
            {
              heading: "La pertinence de votre fiche Google Business Profile",
              body: "Google évalue dans quelle mesure votre fiche correspond à ce que l'internaute cherche. Cela signifie : catégorie principale bien choisie, description avec mots-clés naturels, liste exhaustive de vos services, attributs (accessibilité, paiements acceptés, langue), et photos régulièrement mises à jour. Une fiche remplie à 100 % obtient en moyenne 70 % plus de clics qu'une fiche basique.",
            },
            {
              heading: "Les signaux d'avis et la gestion de la réputation",
              body: "Le volume, la qualité et la régularité des avis Google sont le deuxième facteur de classement local le plus important. Google préfère les établissements qui reçoivent des avis de manière continue plutôt que ceux qui en ont eu beaucoup à un moment puis plus rien. La réponse aux avis est également analysée : un établissement qui répond à tous ses avis (positifs comme négatifs) envoie un signal fort d'engagement.",
            },
            {
              heading: "Les citations NAP et la cohérence des informations",
              body: "Les citations locales sont des mentions de votre Nom, Adresse et Téléphone (NAP) sur des sites tiers : annuaires, réseaux sociaux, sites d'avis. Google croise ces informations pour vérifier la légitimité de votre établissement. Une incohérence (numéro de téléphone différent sur TripAdvisor et sur votre site, adresse écrite différemment) peut nuire à votre classement local. L'audit et la correction des citations NAP est souvent l'action avec le meilleur ratio effort/résultat en SEO local.",
            },
            {
              heading: "Les signaux de proximité et la densité des recherches",
              body: "L'algorithme local de Google tient compte de la distance entre l'utilisateur et votre établissement, mais aussi de la densité de recherches dans votre zone. À Marrakech, les quartiers touristiques (Médina, Guéliz, Hivernage) génèrent des volumes de recherches locales très différents des quartiers résidentiels. Votre stratégie de mots-clés doit intégrer ces spécificités géographiques.",
            },
          ],
        },
        {
          heading: "La stratégie de contenu local : un levier sous-exploité à Marrakech",
          body: [
            "La plupart des entreprises à Marrakech se concentrent sur leur fiche Google Business Profile et négligent le contenu de leur site web dans leur stratégie SEO locale. C'est une erreur. Les pages de contenu local bien construites (pages de quartier, pages de service géolocalisées) renforcent l'autorité thématique de votre site et améliorent aussi votre positionnement dans le Pack Local.",
            "Une page dédiée à votre service dans un quartier spécifique (« restaurant en terrasse à Guéliz Marrakech », « salon de coiffure Hivernage Marrakech ») cible des requêtes de longue traîne moins compétitives mais très qualifiées. Ces pages doivent contenir du contenu authentique, des photos géolocalisées et le balisage Schema.org LocalBusiness correctement configuré.",
            <>Pour aller plus loin dans votre stratégie de référencement, notre guide complet sur le <Link to="/referencement-seo-marrakech">référencement SEO à Marrakech</Link> couvre les aspects techniques et éditoriaux que le SEO local seul ne suffit pas à adresser.</>,
          ],
        },
        {
          heading: 'Erreurs fréquentes en SEO local',
          bullets: [
            'Fiche Google incomplète ou horaires obsolètes',
            'Aucune réponse aux avis clients',
            'NAP incohérent entre site, réseaux et annuaires',
            'Photos de mauvaise qualité ou absentes',
            'Site sans page locale ni contenu utile',
          ],
        },
        {
          heading: 'Comment Supra v3 peut vous aider',
          body: [
            <>Nous auditons votre fiche Google, votre site et vos citations, puis priorisons les actions à fort impact. Pour les restaurants et commerces, voir aussi notre page <Link to="/agence-communication-restaurant-marrakech">communication restaurant à Marrakech</Link>.</>,
          ],
        },
        {
          heading: "Cas pratique : comment un restaurant de Marrakech a multiplié ses réservations par 3",
          body: [
            "Un restaurant situé dans le quartier Guéliz de Marrakech nous a contactés avec une problématique courante : une excellente cuisine, des avis TripAdvisor satisfaisants, mais une quasi-invisibilité sur Google. La fiche Google Business Profile existait mais était remplie à 30 % — pas de photos, horaires incorrects, aucune réponse aux avis, description absente.",
            "En 90 jours, nous avons mis en œuvre un plan en 4 étapes : optimisation complète de la fiche GBP avec 25 photos professionnelles et des publications hebdomadaires, mise en place d'un système de collecte d'avis via QR code en salle (résultat : 47 nouveaux avis en 3 mois), audit et correction de 28 citations NAP incohérentes sur les principaux annuaires, et création d'une page dédiée sur le site avec balisage Schema.org et contenu de 800 mots. Résultat : passage de la 7e à la 2e position dans le Pack Local sur la requête principale, et augmentation de 180 % des appels entrants depuis Google.",
          ],
        },
      ]}
      faq={[
        {
          q: "Combien de temps faut-il pour apparaître dans le Pack Local à Marrakech ?",
          a: "Avec une optimisation sérieuse de votre fiche Google Business Profile et une collecte active d'avis, les premières améliorations de position locale apparaissent en 4 à 8 semaines. Pour des secteurs très compétitifs à Marrakech (hôtellerie, restauration, immobilier), atteindre le top 3 du Pack Local peut prendre 3 à 6 mois. La régularité et la patience sont essentielles."
        },
        {
          q: "Mon site web est-il obligatoire pour faire du SEO local à Marrakech ?",
          a: "Non, il est possible d'apparaître dans le Pack Local Google uniquement avec une fiche Google Business Profile, sans site web. Cependant, un site web bien optimisé renforce considérablement votre autorité locale et vous permet de capter aussi le trafic organique en dehors du Pack Local. Nous recommandons toujours de combiner les deux."
        },
        {
          q: "Le SEO local fonctionne-t-il aussi pour les entreprises sans adresse physique à Marrakech ?",
          a: "Google Business Profile permet aux entreprises itinérantes (plombiers, électriciens, traiteurs) de créer une fiche sans afficher d'adresse publique. Vous indiquez votre zone de service (Marrakech et ses quartiers) et Google vous positionne pour les recherches locales dans cette zone. Cette option est moins puissante qu'une adresse fixe mais reste efficace."
        }
      ]}
      internalLinks={[
        { label: 'Création site web', path: '/creation-site-web-marrakech', desc: 'Pages locales et site rapide.' },
        { label: 'Marketing digital', path: '/marketing-digital-marrakech', desc: 'Stratégie digitale complète.' },
        { label: 'Contact', path: '/contact', desc: 'Demander un diagnostic SEO local.' },
      ]}
    />
  )
}
