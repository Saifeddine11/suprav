import MediaCloudsSection from '../components/landing/MediaCloudsSection.jsx'
import LandingProjet from './LandingProjet.jsx'
import PageLayout from '../layouts/PageLayout.jsx'
import { LANDING_VIDEO_ITEMS, shuffleVideoItems } from '../data/videoProjects.js'

/*
 * Landing /votre-projet avec son bandeau vidéo (même composant que l'ancienne page d'accueil,
 * limité aux vidéos du dossier « Landing page videos », dans un ordre aléatoire à chaque chargement).
 * Chargée à la demande, avec son habillage : rien de tout cela ne pèse sur les pages v3.
 */
const videoSection = <MediaCloudsSection items={shuffleVideoItems(LANDING_VIDEO_ITEMS)} showHeader={false} />

/* La landing garde son ancien habillage (PageLayout), chargé seulement sur cette page. */
export default function LandingProjetRoute() {
  return (
    <PageLayout footer={null} topNavbar={false} mobileNav={false}>
      <LandingProjet videoSection={videoSection} />
    </PageLayout>
  )
}
