import { MediaCloudsSection } from '../App.jsx'
import LandingProjet from './LandingProjet.jsx'
import { LANDING_VIDEO_ITEMS, shuffleVideoItems } from '../data/videoProjects.js'

/*
 * Landing /votre-projet avec son bandeau vidéo (même composant que l'ancienne page d'accueil,
 * limité aux vidéos du dossier « Landing page videos », dans un ordre aléatoire à chaque chargement).
 * Chargée à la demande : l'ancien App.jsx et son CSS ne pèsent plus sur la nouvelle page d'accueil.
 */
const videoSection = <MediaCloudsSection items={shuffleVideoItems(LANDING_VIDEO_ITEMS)} showHeader={false} />

export default function LandingProjetRoute() {
  return <LandingProjet videoSection={videoSection} />
}
