import { TARGETING_HUB, TARGETING_MARKETS } from '../../data/targetingMarkets.js'
import { buildSvgArcPath, projectMarketPoint, shouldDrawArc } from '../../utils/mapArcUtils.js'

const HUB_POINT = projectMarketPoint(
  TARGETING_HUB.lng,
  TARGETING_HUB.lat,
  TARGETING_HUB.lng,
  TARGETING_HUB.lat,
)

const MARKET_POINTS = TARGETING_MARKETS.map((market) => ({
  ...market,
  point: projectMarketPoint(market.lng, market.lat, TARGETING_HUB.lng, TARGETING_HUB.lat),
  drawArc: shouldDrawArc(TARGETING_HUB, market),
}))

export default function TargetingGlobeFallback({ className = '', spinSphere = false }) {
  return (
    <svg
      className={`targeting-globe-fallback${className ? ` ${className}` : ''}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="targeting-globe-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(232, 72, 28, 0.22)" />
          <stop offset="55%" stopColor="rgba(232, 72, 28, 0.06)" />
          <stop offset="100%" stopColor="rgba(232, 72, 28, 0)" />
        </radialGradient>
        <filter id="targeting-hub-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className={`targeting-globe-fallback__sphere${spinSphere ? ' is-spinning' : ''}`}>
        <circle cx="50" cy="50" r="42" fill="url(#targeting-globe-glow)" />
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="0.35"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="14"
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="0.25"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="26"
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth="0.2"
        />

        {MARKET_POINTS.filter((market) => market.drawArc).map((market) => (
          <path
            key={market.id}
            d={buildSvgArcPath(HUB_POINT, market.point, (market.curvature ?? 0.22) * 0.85)}
            className={`targeting-globe-fallback__arc${market.emphasis ? ' is-emphasis' : ''}`}
            fill="none"
          />
        ))}

        {MARKET_POINTS.map((market) => (
          <circle
            key={`${market.id}-dot`}
            cx={market.point.x}
            cy={market.point.y}
            r={market.emphasis ? 1.25 : 1.05}
            className={`targeting-globe-fallback__dest${market.emphasis ? ' is-emphasis' : ''}`}
          />
        ))}
      </g>

      <circle
        cx={HUB_POINT.x}
        cy={HUB_POINT.y}
        r="3.2"
        className="targeting-globe-fallback__hub"
        filter="url(#targeting-hub-glow)"
      />
      <circle cx={HUB_POINT.x} cy={HUB_POINT.y} r="1.4" className="targeting-globe-fallback__hub-core" />
      <text
        x={HUB_POINT.x}
        y={HUB_POINT.y - 5.2}
        textAnchor="middle"
        className="targeting-globe-fallback__hub-label"
      >
        {TARGETING_HUB.name}
      </text>
    </svg>
  )
}
