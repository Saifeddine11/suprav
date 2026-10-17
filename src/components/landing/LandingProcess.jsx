import { useRef } from 'react'
import { PROCESS } from '../../data/landingContent.js'
import { Reveal } from './LandingPrimitives.jsx'
import { gsap, openPanelScene, useScrollScene } from './landingMotion.js'

/* La ligne du process se remplit avec le scroll : horizontale sur grand écran, verticale sur mobile. */
function processScene(root, context) {
  openPanelScene(root, context)

  const fill = root.querySelector('.lp-process__line-fill')
  const steps = root.querySelector('.lp-process__steps')
  if (!fill || !steps) return

  const axis = context.desktop ? 'scaleX' : 'scaleY'
  gsap.fromTo(
    fill,
    { [axis]: 0 },
    {
      [axis]: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: steps,
        start: 'top 82%',
        end: context.desktop ? 'top 36%' : 'bottom 62%',
        scrub: true,
      },
    },
  )
}

/** « Ils ont une façon claire de le résoudre » : quatre étapes, grandes et lisibles. */
export default function LandingProcess() {
  const rootRef = useRef(null)

  useScrollScene(rootRef, processScene)

  return (
    <section className="lp-block lp-process" id="process" ref={rootRef} aria-labelledby="lp-process-title">
      <div className="lp-panel lp-process__panel">
        <Reveal>
          <h2 className="lp-title lp-title--on-dark" id="lp-process-title">{PROCESS.title}</h2>
        </Reveal>

        <div className="lp-process__track">
          <span className="lp-process__line" aria-hidden="true">
            <span className="lp-process__line-fill" />
          </span>

          <ol className="lp-process__steps">
            {PROCESS.steps.map((step, index) => (
              <Reveal as="li" key={step.num} className="lp-process__step" delay={index * 0.1} amount={0.3}>
                <span className="lp-process__num" aria-hidden="true">{step.num}</span>
                <h3 className="lp-process__title">{step.title}</h3>
                <p className="lp-process__text">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
