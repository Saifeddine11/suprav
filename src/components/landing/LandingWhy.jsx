import { AUDIENCE, CLIENTS, WHY } from '../../data/landingContent.js'
import { Reveal } from './LandingPrimitives.jsx'

/** « Ils comprennent la stratégie, pas seulement le design. » */
export function LandingWhy() {
  return (
    <section className="lp-section lp-why" aria-labelledby="lp-why-title">
      <div className="lp-container">
        <div className="lp-why__head">
          <Reveal>
            <h2 className="lp-title" id="lp-why-title">
              {WHY.title} <span className="lp-accent">{WHY.highlight}</span>
            </h2>
          </Reveal>
          <Reveal className="lp-why__text" delay={0.12}>
            {WHY.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>

        <ul className="lp-why__pillars">
          {WHY.pillars.map((pillar, index) => (
            <Reveal as="li" key={pillar.title} className="lp-why__pillar" delay={index * 0.1} amount={0.4}>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Pour qui : quatre familles de clients. */
export function LandingAudience() {
  return (
    <section className="lp-section lp-audience" aria-labelledby="lp-audience-title">
      <div className="lp-container">
        <Reveal>
          <h2 className="lp-title" id="lp-audience-title">{AUDIENCE.title}</h2>
        </Reveal>

        <ul className="lp-audience__grid">
          {AUDIENCE.items.map((item, index) => (
            <Reveal as="li" key={item.title} className="lp-audience__item" delay={index * 0.08} amount={0.4}>
              <span className="lp-audience__num" aria-hidden="true">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Preuve sociale : logos et noms réels. Les témoignages n’apparaissent que s’ils existent. */
export function LandingClients() {
  return (
    <section className="lp-section lp-clients" aria-labelledby="lp-clients-title">
      <div className="lp-container">
        <Reveal>
          <h2 className="lp-title" id="lp-clients-title">{CLIENTS.title}</h2>
        </Reveal>

        <Reveal className="lp-clients__logos" delay={0.1} amount={0.2} aria-hidden="true">
          {CLIENTS.logos.map((logo) => (
            <span className="lp-clients__logo" key={logo}>
              <img src={logo} alt="" width={600} height={600} loading="lazy" decoding="async" />
            </span>
          ))}
        </Reveal>

        <Reveal as="p" className="lp-clients__names" delay={0.15}>
          {CLIENTS.names.join(' · ')}
        </Reveal>

        {CLIENTS.testimonials.length > 0 ? (
          <ul className="lp-clients__quotes">
            {CLIENTS.testimonials.map((item) => (
              <Reveal as="li" key={item.name} className="lp-clients__quote">
                <blockquote>
                  <p>« {item.quote} »</p>
                  <footer>
                    — {item.name}
                    <span>{item.company}</span>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
