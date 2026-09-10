import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import WeatherMap from '../components/map/WeatherMap'
import './MapPage.css'

export default function MapPage() {
  const { setActiveLocation } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Nigeria Weather Map | Heatwave Sky'
  }, [])

  const handleLocationSelect = (loc) => {
    setActiveLocation(loc)
    navigate('/')
  }

  return (
    <main className="map-page" aria-label="Nigeria weather map">
      <div className="map-page__hero">
        <div className="container">
          <div className="animate-fade-up">
            <span className="badge badge-blue">Interactive Map</span>
            <h1 className="map-page__title">Nigeria Weather Map</h1>
            <p className="map-page__sub">
              Click any location marker to see current conditions. Select a location to view full forecast.
            </p>
          </div>
        </div>
      </div>

      <div className="container map-page__content">
        <WeatherMap onLocationSelect={handleLocationSelect} />

        <div className="map-page__legend card card-md">
          <h3 className="section-title">Map Guide</h3>
          <div className="map-page__legend-items">
            <div className="map-page__legend-item">
              <span className="map-page__legend-dot" style={{ background: '#0ea5e9' }} />
              <span>State capitals — click for weather</span>
            </div>
            <div className="map-page__legend-item">
              <span className="map-page__legend-dot" style={{ background: '#10b981' }} />
              <span>Your current location</span>
            </div>
          </div>
          <p className="map-page__legend-note">
            Map tiles by <a href="https://carto.com" target="_blank" rel="noopener noreferrer">CARTO</a> ·
            Data © <a href="https://openstreetmap.org" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
          </p>
        </div>
      </div>
    </main>
  )
}
