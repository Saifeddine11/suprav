import { useEffect, useRef, useState } from 'react'
import { MAP_STYLE_URL } from '../../data/officeLocation.js'
import { TARGETING_GLOBE_VIEW, TARGETING_HUB, TARGETING_MARKETS } from '../../data/targetingMarkets.js'
import { buildArcGeoJSON } from '../../utils/mapArcUtils.js'
import { createDestMarkerElement, createHubMarkerElement } from './targetingGlobeMarkers.js'
import TargetingGlobeFallback from './TargetingGlobeFallback.jsx'
import { useGlobeBearingRotation } from './useGlobeBearingRotation.js'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function TargetingGlobeVisual() {
  const wrapperRef = useRef(null)
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [skipMap] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const node = wrapperRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !skipMap) {
          setShouldLoad(true)
        }
        setIsVisible(entry.isIntersecting)
      },
      { rootMargin: '120px 0px', threshold: 0.05 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [skipMap])

  useEffect(() => {
    if (skipMap || !shouldLoad || !containerRef.current) return undefined

    let cancelled = false
    let map
    const markers = []

    async function initMap() {
      const maplibregl = (await import('maplibre-gl')).default
      await import('maplibre-gl/dist/maplibre-gl.css')

      if (cancelled || !containerRef.current) return

      const arcData = buildArcGeoJSON(TARGETING_HUB, TARGETING_MARKETS)

      map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE_URL,
        center: TARGETING_GLOBE_VIEW.center,
        zoom: TARGETING_GLOBE_VIEW.zoom,
        pitch: TARGETING_GLOBE_VIEW.pitch,
        bearing: TARGETING_GLOBE_VIEW.bearing,
        projection: { type: 'globe' },
        renderWorldCopies: false,
        interactive: false,
        attributionControl: false,
        fadeDuration: 0,
        dragPan: false,
        scrollZoom: false,
        boxZoom: false,
        dragRotate: false,
        keyboard: false,
        doubleClickZoom: false,
        touchZoomRotate: false,
      })

      mapRef.current = map

      map.on('load', () => {
        if (cancelled) return

        map.setProjection({ type: 'globe' })

        map.addSource('targeting-arcs', { type: 'geojson', data: arcData })

        map.addLayer({
          id: 'targeting-arcs-glow',
          type: 'line',
          source: 'targeting-arcs',
          filter: ['==', ['get', 'emphasis'], 1],
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': 'rgba(232, 72, 28, 0.35)',
            'line-width': 3,
            'line-opacity': 0.22,
            'line-blur': 1.2,
            'line-dasharray': [3, 4],
          },
        })

        map.addLayer({
          id: 'targeting-arcs-line',
          type: 'line',
          source: 'targeting-arcs',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': [
              'case',
              ['==', ['get', 'emphasis'], 1],
              'rgba(255, 220, 195, 0.72)',
              'rgba(255, 236, 220, 0.52)',
            ],
            'line-width': [
              'case',
              ['==', ['get', 'emphasis'], 1],
              1.15,
              0.95,
            ],
            'line-opacity': [
              'case',
              ['==', ['get', 'emphasis'], 1],
              0.58,
              0.42,
            ],
            'line-dasharray': [3, 3],
          },
        })

        const hubMarker = new maplibregl.Marker({
          element: createHubMarkerElement(TARGETING_HUB.name),
          anchor: 'center',
        })
          .setLngLat([TARGETING_HUB.lng, TARGETING_HUB.lat])
          .addTo(map)
        markers.push(hubMarker)

        TARGETING_MARKETS.forEach((market) => {
          const marker = new maplibregl.Marker({
            element: createDestMarkerElement({ emphasis: market.emphasis }),
            anchor: 'center',
          })
            .setLngLat([market.lng, market.lat])
            .addTo(map)
          markers.push(marker)
        })

        setIsReady(true)
      })
    }

    initMap().catch(() => {
      if (!cancelled) setIsReady(false)
    })

    return () => {
      cancelled = true
      markers.forEach((marker) => marker.remove())
      map?.remove()
      mapRef.current = null
    }
  }, [shouldLoad, skipMap])

  useGlobeBearingRotation(mapRef, {
    enabled: !skipMap && isReady,
    isVisible,
  })

  const animateFallback = !skipMap && !isReady

  return (
    <div
      ref={wrapperRef}
      className={`targeting-globe${animateFallback ? ' targeting-globe--fallback-spin' : ''}`}
      aria-hidden="true"
    >
      <TargetingGlobeFallback
        className={`targeting-globe__fallback${isReady ? ' is-hidden' : ''}`}
        spinSphere={animateFallback}
      />
      {!skipMap ? (
        <div
          ref={containerRef}
          className={`targeting-globe__canvas${isReady ? ' is-ready' : ''}`}
        />
      ) : null}
      <div className="targeting-globe__vignette" aria-hidden="true" />
    </div>
  )
}
