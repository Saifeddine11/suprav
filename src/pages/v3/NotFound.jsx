import PageV3 from './PageV3.jsx'
import PageHero, { Swash } from './PageHero.jsx'
import { Btn } from './ui.jsx'

/* Page 404 : même habillage que le site, non indexée. */
export default function NotFound() {
  return (
    <PageV3 seo={{ title: 'Page introuvable | Supra v3', description: 'Cette page n’existe pas ou a été déplacée. Retrouvez nos réalisations, nos services, notre blog ou contactez Supra v3 à Marrakech.', path: '/404', noindex: true }} cta={false}>
      <PageHero
        crumbs={[{ label: 'Page introuvable' }]}
        kicker="Erreur 404"
        title={<>Cette page s’est <Swash>perdue</Swash>.</>}
        lede="Elle n’existe pas ou a été déplacée. Voici par où reprendre."
      >
        <Btn to="/">Retour à l’accueil</Btn>
        <Btn to="/realisations" tone="dk">Nos réalisations</Btn>
        <Btn to="/blog" tone="dk">Le blog</Btn>
      </PageHero>
    </PageV3>
  )
}
