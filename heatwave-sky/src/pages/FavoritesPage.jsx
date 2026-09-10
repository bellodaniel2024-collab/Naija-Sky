import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useWeather } from '../hooks/useWeather'
import WeatherIcon from '../components/weather/WeatherIcon'
import { getWeatherInfo } from '../utils/weatherCodes'
import FavoritesPanel from '../components/ui/FavoritesPanel'
import './FavoritesPage.css'

export default function FavoritesPage() {
  const { setActiveLocation, favorites } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'My Favorite Locations | Heatwave Sky'
  }, [])

  const handleSelect = (loc) => {
    setActiveLocation(loc)
    navigate('/')
  }

  return (
    <main className="fav-page" aria-label="Favorite locations">
      <div className="fav-page__hero">
        <div className="container">
          <div className="animate-fade-up">
            <span className="badge badge-blue">My Locations</span>
            <h1 className="fav-page__title">Favorites</h1>
            <p className="fav-page__sub">
              Your saved weather locations. No account needed — stored on this device.
            </p>
          </div>
        </div>
      </div>

      <div className="container fav-page__content">
        {favorites.length === 0 ? (
          <div className="fav-page__empty card card-lg animate-fade-up">
            <div className="fav-page__empty-icon" aria-hidden="true">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-faint)' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 className="fav-page__empty-title">No saved locations yet</h2>
            <p className="fav-page__empty-text">
              Search for a Nigerian city or state, then tap the heart icon to save it here for quick access.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Search locations →
            </button>
          </div>
        ) : (
          <div className="fav-page__grid">
            {favorites.map(fav => (
              <FavCard key={fav.id} fav={fav} onSelect={handleSelect} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function FavCard({ fav, onSelect }) {
  const { weather, loading } = useWeather(fav)
  const { displayShort } = useApp()
  const info = weather?.current
    ? getWeatherInfo(weather.current.weatherCode, weather.current.isDay === 0)
    : null

  return (
    <article
      className="fav-card card"
      onClick={() => onSelect(fav)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(fav)}
      aria-label={`${fav.name}: ${info ? `${Math.round(weather.current.temp)}°, ${info.condition}` : 'Loading'}`}
    >
      <div className="fav-card__top">
        <div>
          <p className="fav-card__name">{fav.name}</p>
          {fav.state && <p className="fav-card__state">{fav.state}</p>}
        </div>
        {info && <WeatherIcon icon={info.icon} size={48} />}
      </div>
      {loading && !weather ? (
        <div className="skeleton" style={{ width: 80, height: 40, borderRadius: 8 }} />
      ) : weather?.current ? (
        <>
          <p className="fav-card__temp">{displayShort(weather.current.temp)}</p>
          <p className="fav-card__cond">{info?.condition}</p>
        </>
      ) : (
        <p className="fav-card__error">Unavailable</p>
      )}
      <span className="fav-card__cta">View forecast →</span>
    </article>
  )
}
