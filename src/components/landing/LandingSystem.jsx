import { useRef } from 'react'
import { SYSTEM } from '../../data/landingContent.js'
import { MaskLines, Reveal } from './LandingPrimitives.jsx'
import { ScrollTrigger, useScrollScene } from './landingMotion.js'
import SystemIcon from './SystemIcons.jsx'

const pad = (value) => String(value).padStart(2, '0')

/*
 * Les icônes 3D ne tournent que lorsque les blocs sont à l’écran (data-live posé par ScrollTrigger).
 * Sans animation (mouvement réduit, capture statique), elles restent dans leur pose de repos.
 */
function systemScene(root) {
  const cards = root.querySelector('.lp-sys__cards')
  if (!cards) return undefined

  const trigger = ScrollTrigger.create({
    trigger: cards,
    start: 'top 96%',
    end: 'bottom 4%',
    onToggle: (self) => root.toggleAttribute('data-live', self.isActive),
  })

  return () => {
    trigger.kill()
    root.removeAttribute('data-live')
  }
}

/** Le système complet : quatre services, quatre blocs carrés avec une icône 3D animée. */
export default function LandingSystem() {
  const rootRef = useRef(null)

  useScrollScene(rootRef, systemScene)

  return (
    <section className="lp-sys" ref={rootRef} aria-labelledby="lp-sys-title">
      <div className="lp-sys__grid">
        <div className="lp-sys__copy">
          <Reveal as="p" className="lp-eyebrow">{SYSTEM.eyebrow}</Reveal>
          <MaskLines id="lp-sys-title" className="lp-title" lines={SYSTEM.title} />
          <Reveal className="lp-sys__text" delay={0.15}>
            {SYSTEM.text.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? 'lp-sys__lead' : undefined}>{paragraph}</p>
            ))}
          </Reveal>
        </div>

        <ol className="lp-sys__cards">
          {SYSTEM.services.map((service, index) => (
            <Reveal
              as="li"
              key={service.id}
              className={`lp-sys__card lp-sys__card--${service.id}`}
              delay={index * 0.09}
              amount={0.2}
            >
              <div className="lp-sys__head">
                <SystemIcon name={service.icon} />
                <span className="lp-sys__num">{pad(index + 1)}</span>
              </div>
              <div className="lp-sys__body">
                <h3 className="lp-sys__label">{service.label}</h3>
                <p className="lp-sys__note">{service.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
