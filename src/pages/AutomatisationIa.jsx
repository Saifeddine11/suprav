import SeoPageTemplate from '../components/SeoPageTemplate.jsx'

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Automatisation IA à Marrakech",
  "description": "Supra v3 aide les entreprises de Marrakech à automatiser leurs processus grâce à l'intelligence artificielle : workflows automatisés, chatbots et intégrations no-code.",
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
  "url": "https://suprav3.com/automatisation-ia",
  "serviceType": "Automatisation IA"
}

export default function AutomatisationIa() {
  return (
    <SeoPageTemplate
      seo={{
        title: "Automatisation IA Marrakech — Workflows & Processus Intelligents | Supra v3",
        description: "Automatisez vos processus à Marrakech avec l'IA : Make, Zapier, n8n et LLM. Supra v3 conçoit vos workflows intelligents pour gagner du temps et réduire vos coûts.",
        path: "/automatisation-ia",
        schema
      }}
      breadcrumb={[
        { label: "Accueil", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Automatisation IA" }
      ]}
      title="Automatisation IA à Marrakech"
      subtitle="Libérez votre équipe des tâches répétitives grâce à l'intelligence artificielle"
      intro="L'automatisation IA Marrakech est la prochaine frontière de productivité pour les entreprises qui souhaitent faire plus avec moins : moins de temps perdu sur des tâches répétitives, moins d'erreurs humaines et moins de coûts opérationnels. Supra v3 accompagne les TPE, PME et startups de Marrakech dans l'identification de leurs processus automatisables et le déploiement de solutions no-code et IA (Make, Zapier, n8n, GPT-4) adaptées à leur taille et leur budget. Du simple workflow de qualification de leads au système de reporting automatique, nous concevons des automatisations qui fonctionnent 24h/24 sans intervention humaine."
      services={[
        {
          title: "Audit de processus & cartographie",
          desc: "Analyse de vos processus opérationnels pour identifier les tâches les plus chronophages et automatisables : saisie de données, envoi d'emails, génération de rapports, qualification de leads. Nous estimons le gain de temps et le ROI de chaque automatisation avant de la développer."
        },
        {
          title: "Automatisation no-code (Make, Zapier, n8n)",
          desc: "Création de workflows automatisés qui connectent vos outils existants : CRM, Google Sheets, WhatsApp Business, Calendly, email, facturation. Exemples : notification automatique à chaque nouveau lead, génération de devis et envoi sans action manuelle."
        },
        {
          title: "Intégration IA générative (GPT-4, Claude)",
          desc: "Intégration des LLM dans vos workflows pour automatiser la rédaction d'emails personnalisés, la qualification de leads par IA, la génération de rapports ou la réponse aux questions fréquentes de vos clients. L'IA rédige, votre équipe valide."
        },
        {
          title: "Automatisation marketing & CRM",
          desc: "Nurturing automatique de vos leads via email et WhatsApp selon leur comportement, scoring des prospects par IA, relances automatiques et synchronisation en temps réel entre votre site, votre CRM et vos outils marketing. Vos équipes se concentrent sur les prospects chauds."
        }
      ]}
      faq={[
        {
          q: "Faut-il être une grande entreprise pour bénéficier de l'automatisation IA ?",
          a: "Non, l'automatisation IA est accessible et rentable dès 3 à 5 employés. Les TPE de Marrakech ont souvent les processus les plus simples à automatiser et les gains de temps les plus significatifs en proportion. Un workflow de qualification de leads automatisé peut économiser 2 à 3h de travail par jour dès la première semaine."
        },
        {
          q: "Quels outils utilisez-vous pour l'automatisation ?",
          a: "Nous utilisons principalement Make (ex-Integromat), n8n (self-hosted pour la confidentialité des données) et Zapier selon le budget et les besoins. Pour l'IA générative, nous intégrons GPT-4 (OpenAI) ou Claude (Anthropic) selon les cas d'usage. Nous choisissons toujours l'outil le plus adapté, pas le plus populaire."
        },
        {
          q: "Mes données sont-elles sécurisées avec ces automatisations ?",
          a: "La sécurité des données est notre priorité. Nous utilisons des connexions chiffrées, des accès à permissions minimales et des solutions self-hosted lorsque la confidentialité est critique. Nous sommes transparents sur les données traitées par chaque outil et respectons les exigences RGPD."
        }
      ]}
    />
  )
}
