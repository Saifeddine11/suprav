import { useEffect, useRef, useState } from 'react'
import {
  MAP_STYLE_URL,
  OFFICE_LAT,
  OFFICE_LNG,
  OFFICE_MAPS_URL,
  OFFICE_NAME,
  OFFICE_TAGLINE,
} from '../data/officeLocation.js'
import '../styles/map-location.css'

export default function MapLibreLocation({ className = '' }) {
  const wrapperRef = useRef(null)
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const node = wrapperRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '180px 0px', threshold: 0.01 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad || !containerRef.current) return undefined

    let cancelled = false
    let map

    async function initMap() {
      const maplibregl = (await import('maplibre-gl')).default
      await import('maplibre-gl/dist/maplibre-gl.css')

      if (cancelled || !containerRef.current) return

      map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE_URL,
        center: [OFFICE_LNG, OFFICE_LAT],
        zoom: 14.5,
        pitch: 0,
        bearing: 0,
        interactive: true,
        attributionControl: false,
      })

      mapRef.current = map

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

      const markerEl = document.createElement('div')
      markerEl.className = 'map-location__marker'
      markerEl.setAttribute('role', 'img')
      markerEl.setAttribute('aria-label', `Emplacement ${OFFICE_NAME} à Marrakech`)

      new maplibregl.Marker({ element: markerEl, anchor: 'center' })
        .setLngLat([OFFICE_LNG, OFFICE_LAT])
        .addTo(map)

      map.on('load', () => {
        if (!cancelled) setIsReady(true)
      })
    }

    initMap().catch(() => {
      if (!cancelled) setIsReady(false)
    })

    return () => {
      cancelled = true
      map?.remove()
      mapRef.current = null
    }
  }, [shouldLoad])

  return (
    <div
      ref={wrapperRef}
      className={`map-location${className ? ` ${className}` : ''}`}
      aria-label="Carte de localisation de Supra v3 à Marrakech"
    >
      <div className={`map-location__placeholder${isReady ? ' is-hidden' : ''}`} aria-hidden={isReady}>
        <span className="map-location__placeholder-pin" />
        <span className="map-location__placeholder-label">Marrakech</span>
      </div>
      <div ref={containerRef} className="map-location__canvas" />
      <div className="map-location__overlay">
        <p className="map-location__overlay-title">{OFFICE_NAME}</p>
        <p className="map-location__overlay-text">{OFFICE_TAGLINE}</p>
        <a
          className="map-location__overlay-link"
          href={OFFICE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Voir l&apos;itinéraire
        </a>
      </div>
    </div>
  )
}
