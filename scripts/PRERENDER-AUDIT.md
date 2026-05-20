# Audit prerender — suprav3.com

Classification au **2026-05-20**. Principe : moins de pages, plus fortes — pas de doublons pré-rendus.

## Groupe A — Prerender obligatoire (28 URLs)

| URL | Intention | Composant |
|-----|-----------|-----------|
| `/` | Agence 360 Marrakech | App.jsx |
| `/agence-communication-marrakech` | Pilier SEO local | AgenceCommunicationMarrakech |
| `/contact` | Conversion contact | Contact |
| `/devis-gratuit` | Conversion devis | DevisGratuit |
| `/creation-site-web-marrakech` | Service web principal | CreationSiteWebMarrakech |
| `/site-vitrine-marrakech` | Long-tail vitrine | SiteVitrineMarrakech |
| `/site-ecommerce-marrakech` | Long-tail e-commerce | SiteEcommerceMarrakech |
| `/refonte-site-web` | Refonte + SEO | RefonteSiteWeb |
| `/branding-marrakech` | Branding | BrandingMarrakech |
| `/creation-logo-marrakech` | Logo | CreationLogoMarrakech |
| `/charte-graphique` | Charte graphique | CharteGraphique |
| `/agence-video-marrakech` | Vidéo / contenu (URL canonique) | ProductionContenu |
| `/marketing-digital-marrakech` | Marketing digital | MarketingDigitalMarrakech |
| `/referencement-seo-marrakech` | SEO naturel | ReferencementSeoMarrakech |
| `/seo-local-marrakech` | Service SEO local | SeoLocalMarrakech |
| `/publicite-marrakech` | Ads Meta/Google | PubliciteMarrakech |
| `/gestion-reseaux-sociaux-marrakech` | Social (URL canonique) | CommunityManagementMarrakech |
| `/automatisation-ia-marrakech` | IA (URL canonique) | AutomatisationIa |
| `/chatbot-ia-marrakech` | Chatbot WhatsApp | ChatbotIaMarrakech |
| `/agence-communication-immobilier-marrakech` | Sectoriel immo | AgenceImmobilierMarrakech |
| `/agence-communication-restaurant-marrakech` | Sectoriel resto | AgenceRestaurantMarrakech |
| `/agence-communication-hotel-marrakech` | Sectoriel hôtel | AgenceHotelMarrakech |
| `/personal-branding-marrakech` | Sectoriel personal brand | PersonalBrandingMarrakech |
| `/blog` | Hub éditorial | Blog |
| `/blog/combien-coute-site-web-marrakech` | Article budget (sans prix publics) | ArticlePrixSiteWeb |
| `/blog/seo-local-guide-marrakech` | Article SEO local | ArticleSeoLocal |
| `/blog/comment-choisir-agence-communication` | Article choix agence | ArticleChoisirAgence |
| `/blog/ia-communication-entreprise` | Article IA com | ArticleIaCommunication |

## Groupe B — Indexables, hors prerender

| URL | Raison |
|-----|--------|
| `/a-propos` | Page crédibilité, contenu correct mais secondaire vs pilier |
| `/portfolio` | Preuve sociale, peu de texte unique (4 blocs) |
| `/services` | Hub récap ; risque chevauchement avec `/` et pilier |
| `/agence-web-marrakech` | Proche de `/creation-site-web-marrakech` + pilier |
| `/application-mobile-marrakech` | Service niche, volume recherche plus faible |
| `/application-saas` | Service niche B2B |
| `/audit-seo` | Sous-service de `/referencement-seo-marrakech` |
| `/redaction-web-seo` | Sous-service SEO |
| `/community-management-marrakech` | **Doublon** de `/gestion-reseaux-sociaux-marrakech` (route conservée) |
| `/production-contenu` | **Doublon** de `/agence-video-marrakech` (route conservée) |
| `/automatisation-ia` | **Doublon** de `/automatisation-ia-marrakech` (route conservée) |
| `/mentions-legales` | Obligatoire légal, faible valeur SEO |

## Groupe C — Ne pas pousser en SEO / pas prerender

| URL | Raison |
|-----|--------|
| `/works` | Même rendu que sections homepage (App.jsx) |
| `*` (404) | Technique |
| `/api/*` | Technique (robots Disallow) |

## Doublons sitemap (à surveiller)

Le sitemap liste encore les alias B (`/community-management-marrakech`, `/production-contenu`, `/automatisation-ia`). Les URLs restent actives (pas de 301) mais **seule l’URL canonique du groupe A est pré-rendue** pour éviter le duplicate content côté HTML source.
