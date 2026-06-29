import { useEffect, useRef } from 'react'
import { TARGETING_GLOBE_VIEW } from '../../data/targetingMarkets.js'

const ROTATION_CYCLE_MS = 48000
const MOBILE_ROTATION_CYCLE_MS = 62000

/**
 * Slowly rotates a MapLibre globe map bearing. Pauses when not visible.
 */
export function useGlobeBearingRotation(mapRef, { enabled, isVisible }) {
  const bearingRef = useRef(TARGETING_GLOBE_VIEW.bearing ?? 0)
  const lastFrameRef = useRef(0)

  useEffect(() => {
    if (!enabled || !isVisible) return undefined

    const map = mapRef.current
    if (!map) return undefined

    const cycleMs = window.matchMedia('(max-width: 960px)').matches
      ? MOBILE_ROTATION_CYCLE_MS
      : ROTATION_CYCLE_MS

    let frameId = 0

    const tick = (timestamp) => {
      const mapInstance = mapRef.current
      if (!mapInstance) return

      if (!lastFrameRef.current) {
        lastFrameRef.current = timestamp
      }

      const delta = timestamp - lastFrameRef.current
      lastFrameRef.current = timestamp
      const baseBearing = TARGETING_GLOBE_VIEW.bearing ?? 0
      const spin = ((bearingRef.current - baseBearing) + (delta / cycleMs) * 360) % 360
      bearingRef.current = baseBearing + spin
      mapInstance.setBearing(bearingRef.current)

      frameId = requestAnimationFrame(tick)
    }

    lastFrameRef.current = 0
    frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      lastFrameRef.current = 0
    }
  }, [enabled, isVisible, mapRef])
}
