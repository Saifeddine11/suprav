/*
 * Icônes 3D des quatre services — CSS pur, sans librairie ni WebGL.
 * Deux briques : `Slab` (forme plate extrudée par empilement de couches) et `Box` (pavé à six
 * faces). Tout est exprimé en `em` : la taille de l’icône est son font-size, posé en CSS.
 * Les animations (styles .i3 dans landing.css) ne tournent que lorsque la section est à l’écran.
 */

const LAYERS = 7

/** Forme plate extrudée : `layers` couches empilées sur Z, la dernière porte la couleur de face. */
function Slab({ className = '', layers = LAYERS, step = 0.022, z = 0, style }) {
  return (
    <span className={`i3-slab ${className}`.trim()} style={style}>
      {Array.from({ length: layers }, (_, index) => (
        <span key={index} style={{ '--z': `${(z + index * step).toFixed(3)}em` }} />
      ))}
    </span>
  )
}

/** Pavé à six faces : face avant, arrière, côtés, dessus et dessous. */
function Box({ className = '', w, h, d, style }) {
  return (
    <span className={`i3-box ${className}`.trim()} style={{ '--w': `${w}em`, '--h': `${h}em`, '--d': `${d}em`, ...style }}>
      <span className="i3-box__f" />
      <span className="i3-box__b" />
      <span className="i3-box__r" />
      <span className="i3-box__l" />
      <span className="i3-box__t" />
      <span className="i3-box__u" />
    </span>
  )
}

/* 01 — Vidéo & marque : une touche « lecture » épaisse, qui pivote lentement. */
function VideoIcon() {
  return (
    <span className="i3__rig i3__rig--video">
      <Slab className="i3-tile" layers={9} step={0.022} />
      <Slab className="i3-play" layers={6} step={0.012} z={0.18} />
      <span className="i3-float" style={{ '--delay': '-1.2s' }}>
        <Slab className="i3-rec" layers={4} step={0.02} z={0.34} />
        <Slab className="i3-rec__dot" layers={2} step={0.02} z={0.42} />
      </span>
    </span>
  )
}

/* 02 — Site & expérience digitale : trois écrans empilés, vus en perspective, qui flottent. */
function SiteIcon() {
  return (
    <span className="i3__rig i3__rig--site">
      <span className="i3-float" style={{ '--delay': '0s' }}>
        <Slab className="i3-plate i3-plate--base" layers={5} step={0.02} />
      </span>
      <span className="i3-float" style={{ '--delay': '-0.9s' }}>
        <Slab className="i3-plate i3-plate--mid" layers={4} step={0.02} z={0.2} />
        <Slab className="i3-plate__bar" layers={2} step={0.02} z={0.28} />
      </span>
      <span className="i3-float" style={{ '--delay': '-1.8s' }}>
        <Slab className="i3-plate i3-plate--top" layers={4} step={0.02} z={0.42} />
      </span>
    </span>
  )
}

/* 03 — Acquisition & leads : une cible en relief, avec une onde qui part du centre. */
function AdsIcon() {
  return (
    <span className="i3__rig i3__rig--ads">
      <Slab className="i3-ring i3-ring--outer" layers={4} step={0.022} />
      <Slab className="i3-ring i3-ring--inner" layers={4} step={0.022} z={0.1} />
      <Slab className="i3-core" layers={5} step={0.022} z={0.2} />
      <span className="i3-ping" style={{ '--delay': '0s' }} />
      <span className="i3-ping" style={{ '--delay': '-1.3s' }} />
    </span>
  )
}

/* 04 — CRM & suivi : trois barres qui montent sur un socle. */
const BARS = [
  { x: -0.27, h: 0.3, tone: 'ink' },
  { x: 0, h: 0.48, tone: 'ink' },
  { x: 0.27, h: 0.68, tone: 'accent' },
]

function CrmIcon() {
  return (
    <span className="i3__rig i3__rig--crm">
      <Box className="i3-base" w={0.9} h={0.06} d={0.46} style={{ left: '0.05em', top: '0.75em' }} />
      {BARS.map((bar, index) => (
        <Box
          key={bar.x}
          className={`i3-bar i3-bar--${bar.tone}`}
          w={0.17}
          h={bar.h}
          d={0.17}
          style={{
            left: `${(0.5 + bar.x - 0.085).toFixed(3)}em`,
            top: `${(0.75 - bar.h).toFixed(3)}em`,
            '--delay': `${index * 0.35}s`,
          }}
        />
      ))}
    </span>
  )
}

const ICONS = { video: VideoIcon, site: SiteIcon, ads: AdsIcon, crm: CrmIcon }

/** Icône 3D décorative d’un service ; `name` ∈ video | site | ads | crm. */
export default function SystemIcon({ name }) {
  const Icon = ICONS[name] || VideoIcon
  return (
    <span className={`i3 i3--${name}`} aria-hidden="true">
      <span className="i3__ground" />
      <span className="i3__scene">
        <Icon />
      </span>
    </span>
  )
}
