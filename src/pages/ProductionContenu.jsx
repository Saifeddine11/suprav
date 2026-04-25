import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Production vidéo et contenu à Marrakech",
  "description": "Supra v. produit vos contenus vidéo, photos et visuels digitaux à Marrakech pour alimenter votre communication sur tous les canaux.",
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
  "url": "https://suprav3.com/production-contenu",
  "serviceType": "Production vidéo et contenu"
}

export default function ProductionContenu() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Production Vidéo Marrakech — Photos & Contenus Digitaux | Supra v.",
        description: "Production vidéo professionnelle à Marrakech : films d'entreprise, reels Instagram, shooting photo produit et motion design. Devis gratuit.",
        path: "/production-contenu",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Production Contenu" }
      ]}
      title="Production vidéo et contenu à Marrakech"
      subtitle="Des contenus visuels qui captivent votre audience et renforcent votre image"
      intro="La production vidéo Marrakech est devenue incontournable à l'ère des réseaux sociaux : une vidéo génère en moyenne 12 fois plus d'engagement qu'un post photo et multiplie le temps passé sur votre site web. Supra v. dispose d'une équipe de réalisation complète à Marrakech — réalisateur, caméraman, drone, monteur et motion designer — pour produire des contenus vidéo et photo à la hauteur de votre ambition, qu'il s'agisse d'un film institutionnel, de reels Instagram ou d'une campagne publicitaire. Chaque contenu est pensé pour votre stratégie de communication et votre plateforme cible."
      services={[
        {
          title: "Films institutionnels & corporate",
          desc: "Présentation de votre entreprise, de vos valeurs et de vos équipes en format 2 à 5 minutes. Idéal pour votre site web, votre page LinkedIn et vos pitchs clients. Tournage à Marrakech et post-production complète inclus."
        },
        {
          title: "Reels & contenus réseaux sociaux",
          desc: "Production de reels Instagram, TikTok et YouTube Shorts optimisés pour l'engagement. Nous gérons le script, le tournage et le montage avec sous-titres, musique et habillage graphique. Forfaits mensuels disponibles (4, 8 ou 12 vidéos/mois)."
        },
        {
          title: "Shooting photo produit & lifestyle",
          desc: "Photographie professionnelle de vos produits, de vos espaces (hôtel, restaurant, boutique) ou de vos équipes à Marrakech. Photos haute résolution livrées retouchées, avec et sans fond, prêtes pour votre site et vos catalogues."
        },
        {
          title: "Motion design & animations",
          desc: "Animations de logo (logo reveal), infographies animées, explainer vidéos et templates After Effects pour vos stories. Le motion design amplifie votre message et rend votre contenu plus mémorable sur tous les formats."
        }
      ]}
      faq={[
        {
          q: "Combien coûte une vidéo d'entreprise à Marrakech ?",
          a: "Un film institutionnel de 2-3 minutes avec une journée de tournage et post-production complète démarre à 8 000 MAD chez Supra v. Les forfaits mensuels de contenu réseaux sociaux (4 reels/mois) sont disponibles à partir de 3 500 MAD/mois tout inclus."
        },
        {
          q: "Vous déplacez-vous en dehors de Marrakech pour les tournages ?",
          a: "Oui, nous réalisons des tournages dans tout le Maroc. Des frais de déplacement s'appliquent pour les destinations hors Marrakech. Contactez-nous avec votre localisation et nous vous proposerons un tarif adapté."
        },
        {
          q: "Quel est le délai de livraison d'une vidéo ?",
          a: "Une vidéo simple (reel, témoignage client) est livrée en 5 à 7 jours ouvrés après le tournage. Un film institutionnel complet avec animation graphique nécessite 2 à 3 semaines de post-production. Nous offrons un délai express sur demande."
        }
      ]}
    />
  )
}
