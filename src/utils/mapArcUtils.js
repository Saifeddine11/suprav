const toRad = (deg) => (deg * Math.PI) / 180

/** Great-circle distance in degrees (approximate, sufficient for arc filtering). */
export function hubDistanceDeg(hub, destination) {
  const lat1 = toRad(hub.lat)
  const lat2 = toRad(destination.lat)
  const dLat = toRad(destination.lat - hub.lat)
  const dLng = toRad(destination.lng - hub.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 180) / Math.PI
}

/** Quadratic Bézier arc between two lng/lat points (MapLibre line layers). */
export function buildArcCoordinates(from, to, curvature = 0.22, samples = 48) {
  const [x0, y0] = from
  const [x2, y2] = to
  const dx = x2 - x0
  const dy = y2 - y0
  const distance = Math.hypot(dx, dy)

  if (distance === 0 || curvature === 0) return [from, to]

  const mx = (x0 + x2) / 2
  const my = (y0 + y2) / 2
  const nx = -dy / distance
  const ny = dx / distance
  const offset = distance * curvature
  const cx = mx + nx * offset
  const cy = my + ny * offset

  const points = []
  const segments = Math.max(2, Math.floor(samples))
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments
    const inv = 1 - t
    points.push([
      inv * inv * x0 + 2 * inv * t * cx + t * t * x2,
      inv * inv * y0 + 2 * inv * t * cy + t * t * y2,
    ])
  }
  return points
}

const MIN_ARC_DISTANCE_DEG = 3.5

export function shouldDrawArc(hub, destination) {
  if (destination.showArc === false) return false
  return hubDistanceDeg(hub, destination) >= MIN_ARC_DISTANCE_DEG
}

export function buildArcGeoJSON(hub, destinations, defaultCurvature = 0.22, samples = 52) {
  return {
    type: 'FeatureCollection',
    features: destinations
      .filter((dest) => shouldDrawArc(hub, dest))
      .map((dest) => ({
        type: 'Feature',
        properties: {
          id: dest.id,
          name: dest.name,
          emphasis: dest.emphasis ? 1 : 0,
        },
        geometry: {
          type: 'LineString',
          coordinates: buildArcCoordinates(
            [hub.lng, hub.lat],
            [dest.lng, dest.lat],
            dest.curvature ?? defaultCurvature,
            samples,
          ),
        },
      })),
  }
}

/** Stylized azimuthal spread for SVG fallback (better than flat lng/lat scale). */
export function projectMarketPoint(lng, lat, hubLng, hubLat, width = 100, height = 100) {
  const meanLat = toRad((lat + hubLat) / 2)
  const dLng = (lng - hubLng) * Math.cos(meanLat)
  const dLat = lat - hubLat
  const spreadLng = 2.65
  const spreadLat = 2.85

  return {
    x: width / 2 + dLng * spreadLng,
    y: height / 2 - dLat * spreadLat,
  }
}

export function buildSvgArcPath(from, to, curvature = 0.18) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.hypot(dx, dy)
  if (distance === 0) return `M ${from.x} ${from.y} L ${to.x} ${to.y}`

  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const nx = -dy / distance
  const ny = dx / distance
  const offset = distance * curvature
  const cx = mx + nx * offset
  const cy = my + ny * offset

  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`
}
