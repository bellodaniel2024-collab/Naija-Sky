import { useEffect, useRef, useState } from 'react'
import { NIGERIAN_STATES, NIGERIA_CENTER } from '../../data/nigerianStates'
import { getWeatherInfo } from '../../utils/weatherCodes'
import { fetchCurrentOnly } from '../../services/weatherService'
import { useApp } from '../../context/AppContext'
import './WeatherMap.css'

// Lazy-load Leaflet only when the map mounts
let L = null

export default function WeatherMap({ onLocationSelect }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const { setActiveLocation, displayShort } = useApp()
  const [mapReady, setMapReady] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let mounted = true

    async function initMap() {
      try {
        // Dynamically import leaflet
        const leaflet = await import('leaflet')
        L = leaflet.default || leaflet
        await import('leaflet/dist/leaflet.css')

        if (!mounted || !mapRef.current || mapInstanceRef.current) return

        const map = L.map(mapRef.current, {
          center: [NIGERIA_CENTER.lat, NIGERIA_CENTER.lon],
          zoom: 6,
          zoomControl: true,
          attributionControl: true,
        })

        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
          }
        ).addTo(map)

        mapInstanceRef.current = map
        if (mounted) setMapReady(true)

        // Add markers for all states (lightweight — no weather fetch on init)
        NIGERIAN_STATES.forEach(state => {
          const marker = L.circleMarker([state.lat, state.lon], {
            radius: 7,
            fillColor: '#0ea5e9',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.85,
          }).addTo(map)

          marker.bindPopup(
            `<div class="map-popup">
              <p class="map-popup__name">${state.capital}</p>
              <p class="map-popup__state">${state.name} State</p>
              <p class="map-popup__loading">Loading weather...</p>
            </div>`,
            { maxWidth: 200, className: 'leaflet-weather-popup' }
          )

          marker.on('click', async () => {
            const loc = {
              name: state.capital,
              state: state.name,
              country: 'Nigeria',
              lat: state.lat,
              lon: state.lon,
            }
            // Update popup with live weather
            try {
              const w = await fetchCurrentOnly(state.lat, state.lon)
              const info = getWeatherInfo(w.weatherCode)
              marker.setPopupContent(
                `<div class="map-popup">
                  <p class="map-popup__name">${state.capital}</p>
                  <p class="map-popup__state">${state.name} State</p>
                  <p class="map-popup__temp">${Math.round(w.temp)}°C</p>
                  <p class="map-popup__cond">${info.condition}</p>
                  <p class="map-popup__rain">Rain: ${w.precipitation > 0 ? `${w.precipitation.toFixed(1)} mm` : '0%'}</p>
                  <button class="map-popup__btn" onclick="window.__hwsMapSelect && window.__hwsMapSelect()">
                    View full forecast →
                  </button>
                </div>`
              )
            } catch {
              marker.setPopupContent(
                `<div class="map-popup">
                  <p class="map-popup__name">${state.capital}</p>
                  <p class="map-popup__state">${state.name}</p>
                  <p class="map-popup__error">Weather unavailable</p>
                </div>`
              )
            }
            // Expose callback for the popup button
            window.__hwsMapSelect = () => {
              setActiveLocation(loc)
              onLocationSelect?.(loc)
              marker.closePopup()
            }
          })
        })
      } catch (err) {
        console.error('Map init error', err)
        if (mounted) setLoadError(true)
      }
    }

    initMap()
    return () => {
      mounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      delete window.__hwsMapSelect
    }
  }, [])

  if (loadError) {
    return (
      <div className="weather-map weather-map--error">
        <p>Map could not be loaded. Please refresh the page.</p>
      </div>
    )
  }

  return (
    <div className="weather-map card" aria-label="Interactive Nigeria weather map">
      {!mapReady && (
        <div className="weather-map__loading" aria-live="polite" aria-busy="true">
          <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
          <p className="weather-map__loading-text">Loading map...</p>
        </div>
      )}
      <div
        ref={mapRef}
        className="weather-map__container"
        style={{ opacity: mapReady ? 1 : 0 }}
        aria-label="Nigeria weather map — click a location marker to view weather"
        role="application"
      />
    </div>
  )
}
