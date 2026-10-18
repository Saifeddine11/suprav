/** @type {import('../blogPosts.js').BlogPost} */
export default {
  slug: 'agent-ia-riad-agence-immobiliere',
  title: 'Ce qu’un agent IA fait vraiment pour un riad ou une agence immobilière',
  metaTitle: 'Agent IA WhatsApp : riad et agence immobilière | Supra v3',
  metaDescription:
    'Agent IA WhatsApp pour riad ou agence immobilière : ce qu’il fait, ce qu’il ne fait pas, les règles de Meta, la loi 09-08 et les étapes d’un projet au Maroc.',
  excerpt:
    'Répondre à toute heure, qualifier, envoyer disponibilités ou fiches de biens, prendre rendez-vous : ce qu’un agent IA sur WhatsApp fait réellement, ses limites et ce qu’il faut prévoir avant de le lancer.',
  category: 'IA & automatisation',
  tags: ['agent IA', 'WhatsApp', 'riad', 'immobilier', 'automatisation'],
  intent: 'informationnelle',
  mainKeyword: 'agent ia whatsapp',
  secondaryKeywords: ['chatbot whatsapp riad', 'automatisation agence immobilière', 'ia hôtel maroc'],
  publishedAt: '2026-10-17',
  updatedAt: '2026-10-17',
  author: 'L’équipe Supra v3',
  readingTime: '8 min',
  visual: 'ai',
  takeaways: [
    'Un agent IA WhatsApp répond à toute heure, qualifie la demande, envoie disponibilités ou fiches de biens et propose un rendez-vous.',
    'Il ne négocie pas, ne remplace pas l’accueil et ne doit jamais inventer une disponibilité : dans le doute, il passe la main à un humain.',
    'Il passe par la WhatsApp Business Platform de Meta, avec ses règles : fenêtre de 24 heures, modèles de messages approuvés, accord des clients.',
    'Des données à jour et le respect de la loi 09-08, contrôlée par la CNDP, comptent autant que l’IA elle-même.',
  ],
  sections: [
    {
      type: 'p',
      content:
        'Un **agent IA WhatsApp** répond à vos clients à toute heure, en français, en anglais et, s’il est configuré pour, en arabe ou en darija. Il qualifie la demande, envoie les disponibilités ou les fiches de biens, propose un rendez-vous et passe la main à votre équipe dès que la conversation l’exige. Il ne négocie pas, ne remplace pas l’accueil et n’invente rien : il travaille uniquement avec les données que vous lui donnez.',
    },
    { type: 'h2', id: 'ce-que-fait-un-agent-ia-whatsapp', content: 'Ce que fait un agent IA WhatsApp, concrètement' },
    {
      type: 'p',
      content:
        'Un agent IA n’est pas un menu à choix multiples. Il comprend une question écrite librement (« vous avez une chambre pour quatre la semaine prochaine ? »), cherche la réponse dans vos données et répond en phrases complètes. Pour un riad comme pour une agence, ses tâches sont les mêmes ; seul le contenu change.',
    },
    {
      type: 'table',
      caption: 'Les tâches d’un agent IA WhatsApp, côté riad et côté agence immobilière',
      head: ['Tâche', 'Riad ou hôtel', 'Agence immobilière'],
      rows: [
        ['Répondre à toute heure', 'Question d’un voyageur envoyée en pleine nuit depuis Londres', 'Demande reçue un dimanche soir sur une annonce'],
        ['Qualifier la demande', 'Dates, nombre de personnes, budget, type de chambre', 'Achat ou location, type de bien, quartier, budget, délai'],
        ['Envoyer l’information', 'Disponibilités réelles, tarifs publiés, photos des chambres', 'Fiches des biens correspondants, photos, localisation'],
        ['Prendre un rendez-vous', 'Transfert depuis l’aéroport, dîner, hammam', 'Visite d’un bien, rendez-vous à l’agence'],
        ['Relancer', 'Rappel avant l’arrivée, demande d’avis après le séjour', 'Relance après une visite, nouveau bien correspondant'],
        ['Passer la main', 'Groupe, réclamation, demande particulière', 'Offre de prix, négociation, financement'],
      ],
    },
    {
      type: 'p',
      content:
        'Le premier bénéfice est la rapidité : la demande est qualifiée avant même qu’un membre de l’équipe ne la lise. Votre réceptionniste ou votre négociateur reprend une conversation déjà résumée, avec les informations utiles sous les yeux.',
    },
    { type: 'h3', content: 'Les langues' },
    {
      type: 'p',
      content:
        'Le français et l’anglais posent peu de difficultés aux modèles actuels. L’arabe et la darija, écrite en lettres arabes ou latines, demandent plus de travail : prévoyez-les dès le cadrage et testez-les sur de vrais messages de vos clients avant la mise en ligne.',
    },
    { type: 'h2', id: 'ce-qu-il-ne-fait-pas', content: 'Ce qu’un agent IA ne fait pas' },
    {
      type: 'ul',
      items: [
        '**Négocier seul.** Une remise, un prix de vente ou des conditions de location se décident entre humains. L’agent transmet l’offre, il ne l’accepte pas.',
        '**Remplacer l’accueil.** L’arrivée au riad, la visite d’une villa à la Palmeraie, la gestion d’un imprévu restent humaines. L’agent libère du temps pour ces moments.',
        '**Inventer une disponibilité.** S’il n’a pas accès au calendrier à jour, il dit qu’il vérifie et passe la main. Il ne confirme jamais une chambre ou un bien au hasard.',
        '**Répondre à tout.** Une question hors de son périmètre, comme un litige ou une question juridique, part directement vers l’équipe.',
      ],
    },
    {
      type: 'p',
      content:
        'Ces limites s’écrivent noir sur blanc dans la configuration : sujets autorisés, réponses interdites, situations qui déclenchent le transfert vers un humain. Un agent bien cadré écrit « je transmets à Yasmine, elle vous répond dans la matinée » plutôt que d’improviser.',
    },
    { type: 'h2', id: 'whatsapp-business-platform', content: 'Ce que Meta exige : la WhatsApp Business Platform' },
    {
      type: 'p',
      content:
        'Pour brancher un agent IA dans les règles, il faut passer par la WhatsApp Business Platform, l’API de Meta, avec un portefeuille business Meta, un compte WhatsApp Business et un numéro enregistré. Les règles principales, d’après la documentation officielle :',
    },
    {
      type: 'ul',
      items: [
        '**La fenêtre de 24 heures.** Quand un client vous écrit, une fenêtre de service client de 24 heures s’ouvre et l’agent peut répondre librement. Une fois la fenêtre fermée, seuls des modèles de messages préapprouvés peuvent être envoyés.',
        '**Les modèles de messages.** Chaque modèle appartient à une catégorie (marketing, utilitaire ou authentification) et doit avoir le statut « approuvé » avant tout envoi. Une relance après une visite ou un rappel avant l’arrivée passe donc par un modèle validé à l’avance.',
        '**L’accord du client.** La politique de WhatsApp Business ne permet de contacter une personne que si elle a accepté de recevoir vos messages. Un ancien fichier de numéros ne vaut pas accord.',
        '**Les limites d’envoi.** Selon Meta, un nouveau portefeuille business peut écrire hors fenêtre de service à 250 numéros différents par période glissante de 24 heures. Cette limite peut passer à 2 000 après l’un des parcours prévus, dont la vérification de l’entreprise ; Meta examine alors la qualité de vos messages.',
        '**Un humain joignable.** La même politique autorise l’automatisation dans la fenêtre de 24 heures, à condition d’offrir des moyens rapides, clairs et directs de joindre un humain : transfert dans la conversation, téléphone, e-mail ou formulaire.',
      ],
    },
    {
      type: 'p',
      content:
        'Si votre riad utilise déjà l’application WhatsApp Business, Meta prévoit une procédure pour connecter ce même numéro à l’API : l’équipe continue d’écrire depuis l’application et l’historique reste synchronisé. Certaines fonctions sont alors désactivées, dont les listes de diffusion. Pesez ces points avant de choisir entre votre numéro actuel et un nouveau.',
    },
    { type: 'h2', id: 'donnees-a-jour', content: 'Le vrai prérequis : des données à jour' },
    {
      type: 'p',
      content:
        'Un agent IA ne sait que ce qu’on lui donne. La justesse de ses réponses dépend directement de la fraîcheur de vos données.',
    },
    { type: 'h3', content: 'Pour un riad ou un hôtel' },
    {
      type: 'ul',
      items: [
        'Le calendrier des disponibilités, idéalement lu en direct dans votre PMS (logiciel de gestion hôtelière) ou dans le channel manager qui synchronise déjà vos plateformes de réservation.',
        'Les tarifs publiés, les conditions d’annulation et les règles de la maison (enfants, paiement, horaires).',
        'Les réponses aux questions fréquentes : accès dans la Médina, parking, transfert depuis l’aéroport, petit-déjeuner, terrasse.',
      ],
    },
    { type: 'h3', content: 'Pour une agence immobilière' },
    {
      type: 'ul',
      items: [
        'La liste des biens à jour, avec statut (disponible, sous offre, vendu ou loué), prix, quartier, surface et photos, exportée de votre logiciel ou de votre CRM.',
        'Les critères de qualification qui comptent pour vos négociateurs : budget, financement, délai, achat ou location.',
        'Les créneaux de visite de chaque négociateur, pour proposer de vrais rendez-vous.',
      ],
    },
    {
      type: 'p',
      content:
        'Si le calendrier n’est pas connecté, l’agent ne confirme aucune disponibilité : il recueille la demande et la transmet. C’est moins spectaculaire en démonstration, mais c’est la seule option honnête tant que la donnée n’est pas fiable.',
    },
    { type: 'h2', id: 'loi-09-08-cndp', content: 'Données personnelles : ce que dit la loi 09-08' },
    {
      type: 'p',
      content:
        'Un agent IA traite des données personnelles : noms, numéros, dates de séjour, budgets. Au Maroc, ces traitements relèvent de la loi n° 09-08 du 18 février 2009 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel. Son application est contrôlée par la CNDP, la Commission nationale de contrôle de la protection des données à caractère personnel.',
    },
    {
      type: 'ul',
      items: [
        '**Déclarer le traitement.** Sauf dispositions particulières, la loi soumet le traitement à une déclaration préalable ou, dans certains cas, à une autorisation préalable (article 12). Les formulaires sont sur le site de la CNDP.',
        '**Obtenir le consentement et informer.** Le traitement suppose en principe que la personne ait « indubitablement donné son consentement » (article 4). Elle doit aussi être informée, notamment de l’identité du responsable du traitement (article 5). Le message d’accueil de l’agent peut porter cette information.',
        '**Respecter les droits.** Le client peut demander l’accès à ses données, leur rectification ou s’opposer à leur traitement (articles 7 à 9). L’agent doit savoir transmettre ces demandes.',
        '**Vérifier les transferts à l’étranger.** Les serveurs de Meta et du fournisseur du modèle d’IA sont en général hors du Maroc. Or l’article 43 n’autorise le transfert vers un État étranger que si celui-ci assure un niveau de protection suffisant.',
      ],
    },
    {
      type: 'note',
      title: 'Bon à savoir',
      content:
        'Cet article n’est pas un avis juridique. Faites valider la déclaration et les mentions d’information par votre conseil, ou directement auprès de la CNDP, avant la mise en ligne. Ne collectez que les informations utiles à la demande.',
    },
    { type: 'h2', id: 'etapes-projet-agent-ia', content: 'Les étapes d’un projet d’agent IA' },
    {
      type: 'p',
      content:
        'Chez Supra v3, un projet IA prend de 4 à 12 semaines selon son périmètre, et le planning exact est écrit dans le devis. Le délai dépend surtout de l’accès à vos outils existants et de l’état de vos données.',
    },
    {
      type: 'table',
      caption: 'Les étapes d’un projet d’agent IA WhatsApp',
      head: ['Étape', 'Ce qui se passe', 'Ce que vous fournissez'],
      rows: [
        ['Cadrage', 'Scénarios couverts, langues, règles de passage à l’humain, indicateurs suivis', 'Vos questions fréquentes, des exemples de conversations réelles'],
        ['Données et connexions', 'Connexion au PMS, au channel manager ou au CRM, import de la liste des biens', 'Accès aux outils, exports de données'],
        ['Compte WhatsApp', 'Portefeuille business, numéro, vérification de l’entreprise, modèles soumis à Meta', 'Documents de l’entreprise, choix du numéro'],
        ['Rédaction et réglages', 'Ton, réponses types, limites, transferts vers l’équipe', 'Validation des réponses'],
        ['Tests', 'Conversations de test avec l’équipe, dans chaque langue prévue', 'Du temps de l’équipe pour tester'],
        ['Mise en ligne et suivi', 'Lancement, relecture des conversations, ajustements', 'Retours de l’équipe'],
      ],
    },
    {
      type: 'p',
      content:
        'Les agents IA font partie de [nos services](/#systeme), aux côtés des sites web et de la publicité. Notre [méthode](/#methode) détaille la façon dont nous menons un projet, du cadrage au suivi.',
    },
    {
      type: 'cta',
      title: 'Cadrer votre agent IA',
      content:
        'Lors d’un appel de cadrage gratuit, nous regardons vos demandes actuelles, vos outils et vos données, puis nous vous disons ce qu’un agent peut prendre en charge. Devis détaillé sous 48 heures.',
    },
    { type: 'h2', id: 'mesurer-agent-ia', content: 'Comment savoir si l’agent fonctionne' },
    {
      type: 'p',
      content:
        'Fixez les indicateurs avant le lancement, et relisez des conversations chaque semaine au début. Les plus utiles :',
    },
    {
      type: 'ul',
      items: [
        'La part des demandes traitées sans intervention, et la part transmise à l’équipe.',
        'Le délai de première réponse, de jour comme de nuit.',
        'Les rendez-vous, visites ou réservations directes issus de WhatsApp.',
        'Les erreurs relevées : information fausse, transfert manqué, ton inadapté.',
      ],
    },
    {
      type: 'p',
      content:
        'Si vos demandes arrivent par la publicité, reliez les deux : une annonce qui ouvre WhatsApp ne vaut que si quelqu’un répond vite. Notre article [Meta, TikTok ou Snapchat au Maroc](/blog/meta-tiktok-snapchat-maroc) détaille le suivi côté campagnes, et [site vitrine, one page ou e-commerce](/blog/site-vitrine-one-page-ou-e-commerce) aide à choisir la page qui reçoit ces visiteurs.',
    },
  ],
  faq: [
    {
      q: 'Un agent IA WhatsApp peut-il répondre en darija ?',
      a: 'Oui, s’il est configuré et testé pour. Les modèles actuels comprennent la darija écrite en lettres arabes ou latines, mais la qualité varie davantage qu’en français ou en anglais. Testez l’agent sur de vrais messages de vos clients, et fixez une règle simple : en cas de doute sur le sens, il reformule ou passe la main.',
    },
    {
      q: 'Peut-on garder son numéro WhatsApp actuel ?',
      a: 'C’est possible. Meta prévoit une procédure pour connecter à l’API un numéro déjà utilisé dans l’application WhatsApp Business, avec un historique synchronisé entre les deux. Certaines fonctions de l’application sont alors désactivées, dont les listes de diffusion. L’autre option consiste à enregistrer un nouveau numéro réservé à l’agent et à l’équipe.',
    },
    {
      q: 'Faut-il déclarer un agent IA à la CNDP ?',
      a: 'Ce n’est pas l’agent qui se déclare, mais le traitement de données personnelles qu’il réalise : noms, numéros, dates, budgets. La loi 09-08 prévoit une déclaration préalable ou, dans certains cas, une autorisation (article 12), et encadre les transferts vers l’étranger (article 43). Faites valider votre dossier par votre conseil ou par la CNDP.',
    },
    {
      q: 'Combien de temps faut-il pour mettre en place un agent IA ?',
      a: 'Chez Supra v3, un projet IA prend de 4 à 12 semaines selon son périmètre : scénarios, langues, outils à connecter. Le planning exact figure dans le devis, envoyé sous 48 heures après un appel de cadrage gratuit. Prévoyez dans ce calendrier la vérification de l’entreprise et l’approbation des modèles de messages par Meta.',
    },
  ],
  sources: [
    {
      label: 'Meta for Developers — WhatsApp Cloud API : messages de service et fenêtre de 24 heures',
      url: 'https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages',
    },
    {
      label: 'Meta for Developers — WhatsApp : principes des modèles de messages',
      url: 'https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates',
    },
    { label: 'Meta for Developers — WhatsApp : limites d’envoi', url: 'https://developers.facebook.com/docs/whatsapp/messaging-limits' },
    {
      label: 'Meta for Developers — Connecter un numéro de l’application WhatsApp Business',
      url: 'https://developers.facebook.com/docs/whatsapp/embedded-signup/custom-flows/onboarding-business-app-users',
    },
    { label: 'WhatsApp — Politique de messagerie WhatsApp Business', url: 'https://whatsappbusiness.com/policy/' },
    { label: 'CNDP — Loi n° 09-08 du 18 février 2009 (texte intégral)', url: 'https://www.cndp.ma/wp-content/uploads/2023/11/Loi-09-08-Fr.pdf' },
  ],
  relatedPosts: ['meta-tiktok-snapchat-maroc', 'site-vitrine-one-page-ou-e-commerce'],
}
