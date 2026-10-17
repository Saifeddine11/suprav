import { IDEA } from '../../data/landingContent.js'
import { PrimaryCta, Reveal } from './LandingPrimitives.jsx'

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

/** La grande idée : ce n’est pas l’image seule, c’est tout ce qui fonctionne derrière. */
export default function LandingIdea() {
  return (
    <section className="lp-section lp-idea" aria-labelledby="lp-idea-title">
      <div className="lp-container">
        <Reveal className="lp-idea__head">
          <h2 className="lp-title" id="lp-idea-title">
            {IDEA.title} <span className="lp-accent">{IDEA.highlight}</span>
          </h2>
          <p className="lp-lead">
            {IDEA.text} <strong>{IDEA.conclusion}</strong>
          </p>
        </Reveal>

        <div className="lp-idea__grid">
          <Reveal className="lp-idea__gains" amount={0.2}>
            <h3 className="lp-eyebrow">{IDEA.listTitle}</h3>
            <ul className="lp-idea__list">
              {IDEA.list.map((item) => (
                <li key={item}>
                  <span className="lp-idea__check"><CheckIcon /></span>
                  {item}
                </li>
              ))}
            </ul>
            <PrimaryCta place="solution" className="lp-idea__cta" />
          </Reveal>

          <Reveal className="lp-idea__block" delay={0.12} amount={0.2}>
            <p className="lp-idea__block-title">{IDEA.block.title}</p>
            <p className="lp-idea__block-text">{IDEA.block.text}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
