import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Chatbot IA WhatsApp à Marrakech",
  "description": "Supra v3 développe des chatbots IA pour WhatsApp et votre site web à Marrakech : réponses automatiques 24h/24, qualification de leads et prise de rendez-vous.",
  "provider": {
    "@type": "Organization",
    "name": "Supra v3",
    "url": "https://suprav3.com",
    "telephone": "+33744208673",
    "email": "contact@suprav3.com"
  },
  "areaServed": {
    "@type": "City",
    "name": "Marrakech"
  },
  "url": "https://suprav3.com/chatbot-ia-marrakech",
  "serviceType": "Chatbot IA"
}

export default function ChatbotIaMarrakech() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Chatbot IA Marrakech — WhatsApp & Site Web Automatisé | Supra v3",
        description: "Déployez un chatbot IA à Marrakech sur WhatsApp et votre site web. Réponses 24h/24, qualification de leads et réservations automatiques. Devis gratuit.",
        path: "/chatbot-ia-marrakech",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/agence-communication-marrakech" },
        { label: "Chatbot IA Marrakech" }
      ]}
      title="Chatbot IA à Marrakech — WhatsApp & site web"
      subtitle="Répondez à vos clients 24h/24 et qualifiez vos leads sans effort humain"
      intro="Le chatbot IA Marrakech WhatsApp est devenu l'outil indispensable des entreprises qui reçoivent de nombreuses demandes de clients et souhaitent ne jamais laisser un message sans réponse, même à 2h du matin. Supra v3 développe et déploie des chatbots conversationnels alimentés par l'intelligence artificielle (GPT-4) pour WhatsApp Business, votre site web et Instagram DM à Marrakech. Ces assistants virtuels comprennent le français, l'arabe et l'anglais, répondent aux questions fréquentes, qualifient vos prospects et peuvent même prendre des rendez-vous directement dans votre agenda — le tout sans intervention humaine."
      services={[
        {
          title: "Chatbot WhatsApp Business IA",
          desc: "Chatbot connecté à votre numéro WhatsApp Business via l'API officielle Meta. Répond aux questions fréquentes (tarifs, horaires, disponibilités), collecte les informations des prospects et transfère les conversations complexes à votre équipe avec tout le contexte. Disponible 24h/24, 7j/7 à Marrakech."
        },
        {
          title: "Chat IA pour site web",
          desc: "Widget de chat IA intégré à votre site web : accueille les visiteurs, répond à leurs questions sur vos services, les guide vers les bonnes pages et collecte leurs coordonnées. Réduit le taux de rebond et augmente le nombre de leads qualifiés générés par votre site."
        },
        {
          title: "Prise de rendez-vous automatisée",
          desc: "Intégration avec Calendly, Google Calendar ou votre système de réservation pour que le chatbot propose les créneaux disponibles et confirme les rendez-vous sans aucune intervention humaine. Idéal pour les cabinets médicaux, agences immobilières, hôtels et prestataires de services à Marrakech."
        },
        {
          title: "Formation & enrichissement continu",
          desc: "Votre chatbot IA est entraîné sur votre documentation, vos FAQ et vos scripts de vente. Il s'améliore en continu grâce aux nouvelles conversations. Nous vous livrons un tableau de bord pour voir les questions fréquentes auxquelles le bot n'a pas pu répondre et enrichir sa base de connaissance."
        }
      ]}
      faq={[
        {
          q: "Le chatbot peut-il parler en arabe et en français ?",
          a: "Oui, nos chatbots IA sont multilingues et détectent automatiquement la langue du client. Ils répondent en français, arabe standard, darija (arabe dialectal marocain) et anglais selon le message reçu. Cette polyvalence est essentielle pour les entreprises de Marrakech qui servent une clientèle locale et internationale."
        },
        {
          q: "Combien coûte un chatbot IA pour WhatsApp à Marrakech ?",
          a: "Le périmètre dépend des canaux (WhatsApp, site), de la base de connaissance et du volume de conversations. Maintenance et hébergement sont précisés dans la proposition après cadrage."
        },
        {
          q: "Le chatbot peut-il remplacer complètement mon service client ?",
          a: "Le chatbot gère efficacement 70 à 80 % des demandes courantes en autonomie. Pour les situations complexes, il transfère automatiquement à un agent humain avec le résumé de la conversation. L'objectif est d'augmenter la productivité de votre équipe, pas de la remplacer entièrement."
        }
      ]}
    />
  )
}
