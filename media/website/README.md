# Assets sites web

Dossier dédié aux visuels des projets affichés sur `/realisations/websites`.

## Structure

| Dossier   | Contenu                                              |
|-----------|------------------------------------------------------|
| `images/` | Captures d’écran et images des projets web           |
| `videos/` | Vidéos ou enregistrements d’écran (si nécessaire)    |

## Images (`images/`)

Formats recommandés : `.jpg`, `.webp` ou `.png`.  
Privilégier des captures nettes, ratio paysage (ex. 16:10), zone utile en haut de page.

**Convention de nommage** (slug du projet, minuscules, tirets) :

- `emara-estates.jpg`
- `hachkar.jpg`
- `by-merrachi.jpg`
- `africa-beauty.jpg`
- `gatsby-barber.jpg`
- `verde-paris.jpg`

## Vidéos (`videos/`)

Formats recommandés : `.mp4` (H.264), fichiers légers si possible.

**Convention de nommage** (même slug que l’image) :

- `emara-estates.mp4`
- `hachkar.mp4`
- `by-merrachi.mp4`
- etc.

## Utilisation dans le code

Les chemins actuels des projets pointent encore vers `media/site-screens/` (build Vite).  
Après avoir déposé les fichiers ici, une mise à jour de `src/data/websiteProjects.js` pourra référencer par exemple `/website/images/emara-estates.jpg` (fichiers servis tels quels depuis `public/`).

Ne pas renommer ou déplacer les assets existants tant que la migration n’est pas faite.
