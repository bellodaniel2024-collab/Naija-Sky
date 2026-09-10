import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useWeather } from '../hooks/useWeather'
import CurrentWeather from '../components/weather/CurrentWeather'
import HourlyForecast from '../components/weather/HourlyForecast'
import DailyForecast from '../components/weather/DailyForecast'
import WeatherMetrics from '../components/weather/WeatherMetrics'
import SunriseSunset from '../components/weather/SunriseSunset'
import PrecipitationChart from '../components/weather/PrecipitationChart'
import FavoritesPanel from '../components/ui/FavoritesPanel'
import SearchBar from '../components/ui/SearchBar'
import LocationButton from '../components/ui/LocationButton'
import ErrorState from '../components/ui/ErrorState'
import {
  HeroSkeleton, HourlyForecastSkeleton,
  DailyForecastSkeleton, MetricsSkeleton,
} from '../components/ui/LoadingSkeleton'
import './HomePage.css'

export default function HomePage() {
  const { activeLocation, setActiveLocation } = useApp()
  const { weather, loading, error, isStale, refresh } = useWeather(activeLocation)

  // Dynamic page title
  useEffect(() => {
    if (activeLocation?.name) {
      document.title = `Weather in ${activeLocation.name}, Nigeria | Heatwave Sky`
    }
  }, [activeLocation?.name])

  const today = weather?.daily?.[0]

  return (
    <main className="homepage" aria-label="Weather dashboard">

      {/* ── Hero Search Bar (above current weather) ── */}
      <div className="homepage__search-hero">
        <div className="container">
          <div className="homepage__search-wrap">
            <SearchBar
              onSelect={setActiveLocation}
              placeholder="Search any city, state or location in Nigeria..."
              large
            />
            <LocationButton compact onLocated={setActiveLocation} />
          </div>
          {isStale && weather && (
            <p className="homepage__stale-warn" role="status">
              ⚠ Showing cached data — refresh when online
            </p>
          )}
        </div>
      </div>

      {/* ── Current Weather Hero ── */}
      {loading && !weather ? (
        <div className="container"><HeroSkeleton /></div>
      ) : error && !weather ? (
        <div className="container homepage__error">
          <ErrorState type="api" message={error} onRetry={refresh} />
        </div>
      ) : weather ? (
        <CurrentWeather
          weather={weather}
          location={activeLocation}
          onRefresh={refresh}
        />
      ) : null}

      {/* ── Dashboard Content ── */}
      <div className="container">
        <div className="homepage__dashboard">

          {/* Left Column */}
          <div className="homepage__main">
            {loading && !weather ? (
              <>
                <HourlyForecastSkeleton />
                <DailyForecastSkeleton />
              </>
            ) : weather ? (
              <>
                <HourlyForecast hourly={weather.hourly} />
                <DailyForecast daily={weather.daily} />
                <PrecipitationChart hourly={weather.hourly} />
              </>
            ) : null}
          </div>

          {/* Right Column */}
          <div className="homepage__sidebar">
            {loading && !weather ? (
              <MetricsSkeleton />
            ) : weather ? (
              <>
                <WeatherMetrics current={weather.current} />
                <SunriseSunset today={today} />
              </>
            ) : null}
            <FavoritesPanel onSelect={setActiveLocation} />
          </div>
        </div>
      </div>
    </main>
  )
}
