/**
 * Équipe Supra v3 — source unique pour la page /agence.
 * Les pôles s'affichent toujours ; les cartes membres apparaissent dès que TEAM contient des entrées.
 * Photos : public/media/equipe/<prenom-nom>.webp (portrait 4:5, 900 px de large) et <prenom-nom>-480.webp.
 */

/**
 * @typedef {Object} Pole
 * @property {'video' | 'ads' | 'web' | 'brand' | 'ia'} id
 * @property {string} name
 * @property {string} text — ce que fait le pôle, en une phrase
 * @property {string} icon — clé de ICON (src/pages/home-v3/data/icons.js)
 */

/** @type {Pole[]} */
export const POLES = [
  { id: 'video', name: 'Vidéo & production', text: 'Script, tournage, montage et sous-titres, puis les déclinaisons pour Instagram, TikTok et Snapchat. Rien n’est sous-traité.', icon: 'video' },
  { id: 'ads', name: 'Publicité & acquisition', text: 'Campagnes Meta, TikTok et Snapchat avec un objectif chiffré, suivies sur un tableau de bord et ajustées chaque mois.', icon: 'target' },
  { id: 'web', name: 'Web & SEO', text: 'Sites vitrines et e-commerce qui reçoivent le trafic des vidéos, et référencement pour être trouvé sur Google.', icon: 'globe' },
  { id: 'brand', name: 'Branding & design', text: 'Logo, charte, typographies et supports : une identité reconnaissable sur chaque écran et chaque vitrine.', icon: 'palette' },
  { id: 'ia', name: 'IA & automatisation', text: 'Agents IA qui répondent aux demandes sur WhatsApp et le site, et automatisations qui font gagner du temps à l’équipe.', icon: 'bot' },
]

/**
 * @typedef {Object} TeamMember
 * @property {string} name — « Prénom Nom »
 * @property {string} role — intitulé du poste
 * @property {Pole['id']} pole
 * @property {string} photo — chemin public, ex. '/media/equipe/prenom-nom.webp'
 * @property {string} [photo480] — version légère pour mobile
 * @property {string} [instagram] — URL du profil, facultatif
 */

/** @type {TeamMember[]} */
export const TEAM = []
