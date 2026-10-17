import { PROBLEM } from '../../data/landingContent.js'
import { MaskLines, Reveal } from './LandingPrimitives.jsx'

/** « Ils comprennent mon problème » : un constat, puis trois phrases que l’on s’entend dire. */
export default function LandingProblem() {
  return (
    <section className="lp-section lp-problem" aria-labelledby="lp-problem-title">
      <div className="lp-container">
        <div className="lp-problem__head">
          <MaskLines id="lp-problem-title" className="lp-title" lines={PROBLEM.title} />

          <Reveal className="lp-problem__text" delay={0.15}>
            <p>
              {PROBLEM.text.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className="lp-problem__conclusion">{PROBLEM.conclusion}</p>
          </Reveal>
        </div>

        <ol className="lp-problem__cards">
          {PROBLEM.cards.map((card, index) => (
            <Reveal as="li" key={card.quote} className="lp-problem__card" delay={index * 0.12} amount={0.25}>
              <span className="lp-problem__num" aria-hidden="true">0{index + 1}</span>
              <p className="lp-problem__quote">{card.quote}</p>
              <p className="lp-problem__answer">{card.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
