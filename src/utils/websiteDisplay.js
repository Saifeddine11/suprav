/** Domaines affichés — alignés sur les projets réels lorsque l’URL publique existe */
const DOMAIN_BY_PROJECT_NAME = {
  'Verde Paris': 'verde-paris.fr',
  'By Merrachi': 'bymerrachi.com',
  Hachkar: 'hachkar.com',
  'Emara Estates': 'emaraestates.com',
  'Africa Beauty': 'salonafricabeauty.com',
  'Gatsby Barber': 'gatsby-barber.ma',
}

function slugFromName(name) {
  return (name || 'project')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Domaine affiché dans la barre d’adresse du mockup navigateur */
export function websiteDisplayDomain(project) {
  if (project?.name && DOMAIN_BY_PROJECT_NAME[project.name]) {
    return DOMAIN_BY_PROJECT_NAME[project.name]
  }

  if (project?.publicUrl) {
    try {
      return new URL(project.publicUrl).hostname.replace(/^www\./i, '')
    } catch {
      /* ignore */
    }
  }

  const slug = slugFromName(project?.name)
  return slug ? `${slug}.com` : 'suprav3.com'
}
