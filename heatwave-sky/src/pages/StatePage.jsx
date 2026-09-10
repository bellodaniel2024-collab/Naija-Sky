import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getStateBySlug } from '../data/nigerianStates'
import { useWeather } from '../hooks/useWeather'
import { useApp } from '../context/AppContext'
import CurrentWeather from '../components/weather/CurrentWeather'
import HourlyForecast from '../components/weather/HourlyForecast'
import DailyForecast from '../components/weather/DailyForecast'
import WeatherMetrics from '../components/weather/WeatherMetrics'
import SunriseSunset from '../components/weather/SunriseSunset'
import PrecipitationChart from '../components/weather/PrecipitationChart'
import ErrorState from '../components/ui/ErrorState'
import { HeroSkeleton, HourlyForecastSkeleton, DailyForecastSkeleton } from '../components/ui/LoadingSkeleton'
import FavoriteButton from '../components/ui/FavoriteButton'
import './StatePage.css'

export default function StatePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { setActiveLocation } = useApp()
  const state = getStateBySlug(slug)

  const location = state
    ? { name: state.capital, state: state.name, country: 'Nigeria', lat: state.lat, lon: state.lon }
    : null

  const { weather, loading, error, refresh } = useWeather(location)

  useEffect(() => {
    if (state) {
      document.title = `Weather in ${state.capital}, ${state.name} | Heatwave Sky`
    } else {
      document.title = 'State Not Found | Heatwave Sky'
    }
  }, [state])

  if (!state) {
    return (
      <div className="state-page__not-found container">
        <ErrorState
          type="notfound"
          title="State Not Found"
          message={`"${slug}" is not a recognised Nigerian state. Please check the URL.`}
          onRetry={() => navigate('/nigeria')}
        />
        <Link to="/nigeria" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          ← View All States
        </Link>
      </div>
    )
  }

  const today = weather?.daily?.[0]

  return (
    <main className="state-page" aria-label={`Weather for ${state.name}`}>

      {/* Breadcrumb */}
      <div className="state-page__breadcrumb container">
        <nav aria-label="Breadcrumb">
          <ol className="state-page__crumbs">
            <li><Link to="/">Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link to="/nigeria">Nigeria</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">{state.name}</li>
          </ol>
        </nav>
        <div className="state-page__header-actions">
          <span className="badge badge-blue">{state.region}</span>
          <FavoriteButton location={location} size="lg" />
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setActiveLocation(location); navigate('/') }}
          >
            Set as home
          </button>
        </div>
      </div>

      {/* Meta info */}
      <div className="state-page__meta container">
        <h1 className="state-page__title">{state.name} State</h1>
        <p className="state-page__capital">Capital: <strong>{state.capital}</strong></p>
        <p className="state-page__desc">
          Get the latest weather conditions, hourly and 7-day forecast for {state.name} State, Nigeria.
        </p>
      </div>

      {/* Current Weather */}
      {loading && !weather ? (
        <div className="container"><HeroSkeleton /></div>
      ) : error && !weather ? (
        <div className="container state-page__error">
          <ErrorState type="api" message={error} onRetry={refresh} />
        </div>
      ) : weather ? (
        <CurrentWeather weather={weather} location={location} onRefresh={refresh} />
      ) : null}

      {/* Dashboard */}
      <div className="container">
        <div className="state-page__dashboard">
          <div className="state-page__main">
            {loading && !weather ? (
              <><HourlyForecastSkeleton /><DailyForecastSkeleton /></>
            ) : weather ? (
              <>
                <HourlyForecast hourly={weather.hourly} />
                <DailyForecast daily={weather.daily} />
                <PrecipitationChart hourly={weather.hourly} />
              </>
            ) : null}
          </div>
          <div className="state-page__sidebar">
            {weather && (
              <>
                <WeatherMetrics current={weather.current} />
                <SunriseSunset today={today} />
              </>
            )}

            {/* Major cities */}
            <div className="state-page__cities card card-md">
              <h3 className="section-title">Major Cities</h3>
              <div className="state-page__city-list">
                {state.majorCities.map(city => (
                  <span key={city} className="state-page__city badge badge-blue">{city}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
