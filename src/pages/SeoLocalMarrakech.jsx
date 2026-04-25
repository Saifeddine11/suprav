import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "SEO local à Marrakech — Google Business",
  "description": "Supra v. optimise votre présence locale sur Google à Marrakech : fiche Google Business Profile, SEO local et avis clients pour attirer plus de clients de proximité.",
  "provider": {
    "@type": "Organization",
    "name": "Supra v.",
    "url": "https://suprav3.com",
    "telephone": "+33744208673",
    "email": "contact@suprav3.com"
  },
  "areaServed": {
    "@type": "City",
    "name": "Marrakech"
  },
  "url": "https://suprav3.com/seo-local-marrakech",
  "serviceType": "SEO local"
}

export default function SeoLocalMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "SEO Local Marrakech — Google Business Profile Optimisé | Supra v.",
        description: "Dominez les recherches locales à Marrakech avec Supra v. : optimisation Google Business Profile, SEO local et stratégie d'avis clients. Apparaissez dans le Pack Local Google.",
        path: "/seo-local-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "SEO Local Marrakech" }
      ]}
      title="SEO local à Marrakech — Dominez Google Maps"
      subtitle="Attirez les clients qui cherchent votre activité près de chez eux à Marrakech"
      intro="Le SEO local Marrakech Google Business est la stratégie digitale la plus efficace pour les commerces, restaurants, hôtels et prestataires de services qui dépendent d'une clientèle de proximité. Lorsqu'un touriste cherche « restaurant Marrakech médina » ou qu'un habitant tape « plombier Guéliz », le Pack Local de Google (les 3 fiches Maps en haut des résultats) capte plus de 40 % des clics. Supra v. optimise votre fiche Google Business Profile et votre SEO local pour vous positionner dans ce Pack Local convoité à Marrakech, là où vos concurrents n'ont pas encore investi."
      services={[
        {
          title: "Optimisation Google Business Profile",
          desc: "Création ou audit de votre fiche Google Business Profile : catégories, description optimisée avec mots-clés locaux, horaires, photos professionnelles, attributs et services. Une fiche complète et optimisée double en moyenne le nombre d'appels téléphoniques."
        },
        {
          title: "Stratégie de collecte d'avis Google",
          desc: "Mise en place d'un système de collecte d'avis clients automatisé (QR code, SMS, email post-service). Réponse professionnelle à tous vos avis positifs et négatifs. Un profil avec 4,5 étoiles et 50+ avis génère 3 fois plus de clics à Marrakech."
        },
        {
          title: "Citations locales & annuaires marocains",
          desc: "Inscription et cohérence de vos informations NAP (Nom, Adresse, Téléphone) sur les principaux annuaires locaux marocains (Yabiladi, Bizcommunity.ma, etc.) et internationaux (Yelp, TripAdvisor). La cohérence des citations renforce votre autorité locale."
        },
        {
          title: "Pages locales SEO sur votre site",
          desc: "Création de pages locales optimisées sur votre site (ex: /restaurant-marrakech-gueliz) avec balisage LocalBusiness Schema.org, Google Maps intégré et contenu ciblant les recherches locales. Ces pages renforcent le signal local de votre site pour Google."
        }
      ]}
      faq={[
        {
          q: "Combien de temps faut-il pour apparaître dans le Pack Local Google à Marrakech ?",
          a: "Avec une fiche Google Business Profile bien optimisée et une stratégie d'avis actives, les premières améliorations de positionnement local sont visibles en 4 à 8 semaines. Pour des secteurs très concurrentiels à Marrakech (hôtellerie, restauration), comptez 3 à 4 mois pour atteindre le Pack Local."
        },
        {
          q: "Mon commerce a-t-il vraiment besoin d'une fiche Google Business ?",
          a: "Absolument, et c'est gratuit. Toute entreprise avec une adresse physique à Marrakech devrait avoir une fiche Google Business Profile optimisée. C'est le premier endroit que regardent vos clients potentiels, avant même votre site web. 97 % des consommateurs cherchent une entreprise locale en ligne avant de se déplacer."
        },
        {
          q: "Gérez-vous la fiche Google Business en continu ou juste à la création ?",
          a: "Nous proposons les deux options. La mise en place initiale (optimisation complète de la fiche) est une prestation ponctuelle. La gestion continue mensuelle inclut la publication de posts Google Business hebdomadaires, la réponse aux avis et le suivi des statistiques de la fiche."
        }
      ]}
    />
  )
}
