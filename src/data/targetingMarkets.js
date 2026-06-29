import { OFFICE_LAT, OFFICE_LNG } from './officeLocation.js'

export const TARGETING_HUB = {
  id: 'marrakech',
  name: 'Marrakech',
  lng: OFFICE_LNG,
  lat: OFFICE_LAT,
}

/** Curvature sign fans arcs apart; emphasis = subtle orange glow on key routes. */
export const TARGETING_MARKETS = [
  { id: 'montreal', name: 'Montréal', lng: -73.5673, lat: 45.5017, region: 'americas', curvature: 0.36, emphasis: true },
  { id: 'london', name: 'London', lng: -0.1276, lat: 51.5074, region: 'europe', curvature: -0.3 },
  { id: 'paris', name: 'Paris', lng: 2.3522, lat: 48.8566, region: 'europe', curvature: 0.28, emphasis: true },
  { id: 'brussels', name: 'Brussels', lng: 4.3517, lat: 50.8503, region: 'europe', curvature: -0.24 },
  { id: 'madrid', name: 'Madrid', lng: -3.7038, lat: 40.4168, region: 'europe', curvature: 0.22 },
  { id: 'dubai', name: 'Dubai', lng: 55.2708, lat: 25.2048, region: 'middle-east', curvature: -0.34, emphasis: true },
  { id: 'doha', name: 'Doha', lng: 51.531, lat: 25.2854, region: 'middle-east', curvature: 0.32 },
  { id: 'casablanca', name: 'Casablanca', lng: -7.5898, lat: 33.5731, region: 'africa', showArc: false },
]

export const TARGETING_GLOBE_VIEW = {
  center: [TARGETING_HUB.lng, TARGETING_HUB.lat],
  zoom: 1.02,
  pitch: 0,
  bearing: 12,
}
