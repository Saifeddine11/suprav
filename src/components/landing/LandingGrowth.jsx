import { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'motion/react'
import { GROWTH } from '../../data/landingContent.js'
import { HandNote, MaskLines, Reveal } from './LandingPrimitives.jsx'
import { DURATION, EASE, useLandingMotion } from './landingMotion.js'

const PAD = { top: 18, right: 16, bottom: 26, left: 34 }
const FALLBACK_WIDTH = 600
const [BASELINE, SUPRA] = GROWTH.series
/* Graphique entièrement bleu + gris neutre : jamais l’orange Supra ici. */
const SERIES_COLOR = { baseline: '#9db4cc', supra: '#247bff' }

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/** Courbe lissée (Catmull-Rom → Bézier) : des données monotones, donc sans dépassement visible. */
function smoothPath(points) {
  if (points.length < 2) return ''
  let d = `M${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`
  }
  return d
}

/** Largeur réelle du cadre : le SVG est tracé en pixels, les textes gardent donc leur taille sur mobile. */
function useWidth(ref) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const node = ref.current
    if (!node || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref])
  return width
}

function GrowthChart() {
  const frameRef = useRef(null)
  const measured = useWidth(frameRef)
  const { animate } = useLandingMotion()
  const inView = useInView(frameRef, { once: true, amount: 0.45 })
  const [active, setActive] = useState(null)

  const width = measured || FALLBACK_WIDTH
  const compact = width < 420
  /* ≈ 200 px sur mobile, 280 px sur grand écran : la carte reste courte. */
  const height = Math.round(clamp(width * 0.44, 200, 280))
  const left = compact ? 28 : PAD.left
  const innerW = width - left - PAD.right
  const innerH = height - PAD.top - PAD.bottom
  const step = innerW / (GROWTH.periods.length - 1)

  const all = GROWTH.series.flatMap((serie) => serie.values)
  const yMin = Math.min(...all) - 20
  const yMax = Math.max(...all) + 25
  const toX = (index) => left + index * step
  const toY = (value) => PAD.top + innerH - ((value - yMin) / (yMax - yMin)) * innerH
  const points = (serie) => serie.values.map((value, index) => ({ x: toX(index), y: toY(value), value }))

  const basePts = points(BASELINE)
  const supraPts = points(SUPRA)
  const supraPath = smoothPath(supraPts)
  const areaPath = `${supraPath} L${supraPts[supraPts.length - 1].x},${PAD.top + innerH} L${supraPts[0].x},${PAD.top + innerH} Z`
  const ticks = [100, 200, 300].filter((tick) => tick >= yMin && tick <= yMax)

  const play = !animate || inView
  const draw = (delay) => ({
    initial: animate ? { pathLength: 0, opacity: 0 } : false,
    animate: play ? { pathLength: 1, opacity: 1 } : undefined,
    transition: {
      pathLength: { duration: DURATION.slow, ease: 'easeInOut', delay },
      opacity: { duration: 0.01, delay },
    },
  })
  const fade = (delay) => ({
    initial: animate ? { opacity: 0 } : false,
    animate: play ? { opacity: 1 } : undefined,
    transition: { duration: DURATION.fast, ease: EASE, delay },
  })

  const pick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    setActive(clamp(Math.round((x - left) / step), 0, GROWTH.periods.length - 1))
  }

  const tipW = 212
  const tipH = 62
  const tipX = active === null ? 0 : (toX(active) + 14 + tipW > width ? toX(active) - 14 - tipW : toX(active) + 14)
  const tipY = active === null ? 0 : clamp(supraPts[active].y - tipH / 2, 4, height - tipH - 4)

  return (
    <div className="lp-growth__frame" ref={frameRef}>
      <svg
        className="lp-growth__svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby="lp-growth-chart-title"
        aria-describedby="lp-growth-chart-desc"
      >
        <title id="lp-growth-chart-title">{GROWTH.chartTitle} : {SUPRA.label} contre {BASELINE.label}</title>
        <desc id="lp-growth-chart-desc">{GROWTH.disclaimer}</desc>
        <defs>
          <linearGradient id="lp-growth-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES_COLOR.supra} stopOpacity="0.16" />
            <stop offset="100%" stopColor={SERIES_COLOR.supra} stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((tick) => (
          <g key={tick} className="lp-growth__grid">
            <line x1={left} x2={width - PAD.right} y1={toY(tick)} y2={toY(tick)} />
            <text x={left - 8} y={toY(tick) + 4} textAnchor="end">{tick}</text>
          </g>
        ))}
        {GROWTH.periods.map((period, index) => (
          <text key={period} className="lp-growth__axis" x={toX(index)} y={height - 8} textAnchor="middle">
            {compact ? `M${period}` : `${GROWTH.periodLabel} ${period}`}
          </text>
        ))}

        <motion.path className="lp-growth__area" d={areaPath} {...fade(1.0)} />
        <motion.path className="lp-growth__line lp-growth__line--baseline" d={smoothPath(basePts)} {...draw(0.1)} />
        <motion.path className="lp-growth__line lp-growth__line--supra" d={supraPath} {...draw(0.25)} />

        <motion.g {...fade(1.25)}>
          <circle className="lp-growth__dot lp-growth__dot--baseline" cx={basePts[basePts.length - 1].x} cy={basePts[basePts.length - 1].y} r="4.5" />
          <circle className="lp-growth__dot lp-growth__dot--supra" cx={supraPts[supraPts.length - 1].x} cy={supraPts[supraPts.length - 1].y} r="5" />
          <text className="lp-growth__end" x={supraPts[supraPts.length - 1].x - 10} y={supraPts[supraPts.length - 1].y - 12} textAnchor="end">
            {SUPRA.values[SUPRA.values.length - 1]}
          </text>
          <text className="lp-growth__end lp-growth__end--muted" x={basePts[basePts.length - 1].x - 10} y={basePts[basePts.length - 1].y + 18} textAnchor="end">
            {BASELINE.values[BASELINE.values.length - 1]}
          </text>
        </motion.g>

        {active !== null ? (
          <g className="lp-growth__hover" aria-hidden="true">
            <line x1={toX(active)} x2={toX(active)} y1={PAD.top} y2={PAD.top + innerH} />
            <circle className="lp-growth__dot lp-growth__dot--baseline" cx={basePts[active].x} cy={basePts[active].y} r="4.5" />
            <circle className="lp-growth__dot lp-growth__dot--supra" cx={supraPts[active].x} cy={supraPts[active].y} r="5" />
            <g transform={`translate(${tipX}, ${tipY})`}>
              <rect className="lp-growth__tip" width={tipW} height={tipH} rx="10" />
              <text className="lp-growth__tip-title" x="12" y="19">{GROWTH.periodLabel} {GROWTH.periods[active]}</text>
              <circle cx="16" cy="35" r="3.5" fill={SERIES_COLOR.supra} />
              <text className="lp-growth__tip-row" x="25" y="39">{SUPRA.label}</text>
              <text className="lp-growth__tip-val" x={tipW - 12} y="39" textAnchor="end">{SUPRA.values[active]}</text>
              <circle cx="16" cy="51" r="3.5" fill={SERIES_COLOR.baseline} />
              <text className="lp-growth__tip-row" x="25" y="55">{BASELINE.label}</text>
              <text className="lp-growth__tip-val" x={tipW - 12} y="55" textAnchor="end">{BASELINE.values[active]}</text>
            </g>
          </g>
        ) : null}

        <rect
          className="lp-growth__hit"
          x={left - step / 2}
          y={0}
          width={innerW + step}
          height={height}
          onPointerMove={pick}
          onPointerDown={pick}
          onPointerLeave={() => setActive(null)}
        />
      </svg>
    </div>
  )
}

/** Les mêmes chiffres, en tableau : lecteurs d’écran et navigation clavier. */
function GrowthTable() {
  return (
    <table className="lp-sr">
      <caption>{GROWTH.chartTitle}. {GROWTH.disclaimer}</caption>
      <thead>
        <tr>
          <th scope="col">{GROWTH.periodLabel}</th>
          {GROWTH.series.map((serie) => <th scope="col" key={serie.id}>{serie.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {GROWTH.periods.map((period, index) => (
          <tr key={period}>
            <th scope="row">{period}</th>
            {GROWTH.series.map((serie) => <td key={serie.id}>{serie.values[index]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/**
 * « Plus de demandes. Plus de clients. » : la comparaison entre une acquisition sans structure
 * et le système Supra V3. Indice illustratif uniquement (voir GROWTH), jamais présenté comme
 * un résultat client ; la mention reste affichée sous le graphique.
 */
export default function LandingGrowth() {
  const max = Math.max(...GROWTH.metrics.flatMap((metric) => [metric.baseline, metric.supra]))

  return (
    <section className="lp-block lp-growth" aria-labelledby="lp-growth-title">
      <div className="lp-panel lp-growth__panel">
        <div className="lp-growth__glow" aria-hidden="true" />

        <div className="lp-growth__copy">
          <Reveal as="p" className="lp-eyebrow">{GROWTH.eyebrow}</Reveal>
          <MaskLines id="lp-growth-title" className="lp-title" lines={GROWTH.title} />
          <Reveal as="p" className="lp-lead lp-growth__lead" delay={0.12}>{GROWTH.lead}</Reveal>
          <Reveal className="lp-growth__message" delay={0.2}>
            {GROWTH.message.map((line, index) => (
              <p key={line} className={index === 0 ? 'lp-growth__message-lead' : undefined}>{line}</p>
            ))}
          </Reveal>
          <HandNote arrow="down" className="lp-growth__note" delay={0.6}>{GROWTH.note}</HandNote>
        </div>

        <Reveal className="lp-glass lp-growth__card" delay={0.15} amount={0.2}>
          <div className="lp-growth__head">
            <p className="lp-growth__chart-title">{GROWTH.chartTitle}</p>
            <ul className="lp-growth__legend" aria-label="Séries du graphique">
              {GROWTH.series.map((serie) => (
                <li key={serie.id} className={`lp-growth__key lp-growth__key--${serie.id}`}>
                  <span className="lp-growth__swatch" aria-hidden="true" />
                  <span>{serie.short}</span>
                </li>
              ))}
            </ul>
          </div>

          <GrowthChart />
          <GrowthTable />

          <ol className="lp-growth__stages" aria-label={GROWTH.stagesLabel}>
            {GROWTH.stages.map((stage) => <li key={stage}>{stage}</li>)}
          </ol>

          <dl className="lp-growth__metrics" aria-label={GROWTH.metricsLabel}>
            {GROWTH.metrics.map((metric) => (
              <div key={metric.id} className="lp-growth__metric">
                <dt>{metric.label}</dt>
                <dd>
                  <span className="lp-growth__bar lp-growth__bar--supra" style={{ '--lp-bar': `${(metric.supra / max) * 100}%` }}>
                    <i aria-hidden="true" />
                    <b>{metric.supra}</b>
                    <span className="lp-sr">{SUPRA.label}</span>
                  </span>
                  <span className="lp-growth__bar lp-growth__bar--baseline" style={{ '--lp-bar': `${(metric.baseline / max) * 100}%` }}>
                    <i aria-hidden="true" />
                    <b>{metric.baseline}</b>
                    <span className="lp-sr">{BASELINE.label}</span>
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="lp-growth__disclaimer">{GROWTH.disclaimer}</p>
        </Reveal>
      </div>
    </section>
  )
}
