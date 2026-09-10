import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import WeatherIcon from './WeatherIcon'
import FavoriteButton from '../ui/FavoriteButton'
import {
  getWeatherInfo,
  getGradientClass,
  getWindDirection,
  getUVDescription,
  formatTime,
  getRelativeTime,
} from '../../utils/weatherCodes'
import './CurrentWeather.css'

export default function CurrentWeather({ weather, location, onRefresh }) {
  const { display, displayShort } = useApp()
  const current = weather?.current
  const today = weather?.daily?.[0]

  const isNight = current?.isDay === 0
  const weatherInfo = useMemo(
    () => getWeatherInfo(current?.weatherCode ?? 0, isNight),
    [current?.weatherCode, isNight]
  )
  const gradientClass = useMemo(
    () => getGradientClass(current?.weatherCode ?? 0, isNight),
    [current?.weatherCode, isNight]
  )

  const windDir = current?.windDirection != null
    ? getWindDirection(current.windDirection)
    : null

  const uvInfo = current?.uvIndex != null
    ? getUVDescription(current.uvIndex)
    : null

  return (
    <section
      className={`current-weather ${gradientClass}`}
      aria-label={`Current weather for ${location?.name}`}
    >
      {/* Atmospheric particles */}
      <AtmosphericEffect code={current?.weatherCode ?? 0} isNight={isNight} />

      <div className="current-weather__inner container">
        <div className="current-weather__layout">

          {/* ── Left: Main Info ── */}
          <div className="current-weather__main">
            {/* Location */}
            <div className="current-weather__location animate-fade-up">
              <PinIcon />
              <span className="current-weather__city">{location?.name ?? '—'}</span>
              {location?.state && (
                <span className="current-weather__state">{location.state}</span>
              )}
              <FavoriteButton location={location} size="md" />
            </div>

            {/* Temperature */}
            <div className="current-weather__temp-row animate-fade-up" style={{ animationDelay: '0.05s' }}>
              <div className="current-weather__temp" aria-label={`Temperature: ${display(current?.temp)}`}>
                {current?.temp != null ? displayShort(current.temp) : '--°'}
              </div>
              <div className="current-weather__icon-wrap">
                <WeatherIcon icon={weatherInfo.icon} size={96} />
              </div>
            </div>

            {/* Condition */}
            <div className="current-weather__condition animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="current-weather__condition-text">{weatherInfo.condition}</span>
            </div>

            {/* Feels like + H/L */}
            <div className="current-weather__sub animate-fade-up" style={{ animationDelay: '0.15s' }}>
              {current?.apparentTemp != null && (
                <span>Feels like <strong>{display(current.apparentTemp)}</strong></span>
              )}
              {today && (
                <span className="current-weather__hl">
                  <span title="Today's high">H: <strong>{displayShort(today.tempMax)}</strong></span>
                  <span className="current-weather__hl-sep">·</span>
                  <span title="Today's low">L: <strong>{displayShort(today.tempMin)}</strong></span>
                </span>
              )}
            </div>

            {/* Updated timestamp */}
            {weather?.fetchedAt && (
              <p className="current-weather__updated animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <ClockIcon />
                Updated {getRelativeTime(weather.fetchedAt)}
                <button
                  className="current-weather__refresh btn btn-ghost"
                  onClick={onRefresh}
                  aria-label="Refresh weather data"
                  title="Refresh"
                >
                  <RefreshIcon />
                </button>
              </p>
            )}
          </div>

          {/* ── Right: Quick Stats ── */}
          <div className="current-weather__stats animate-fade-up" style={{ animationDelay: '0.25s' }}>
            {[
              {
                icon: <DropIcon />,
                label: 'Humidity',
                value: current?.humidity != null ? `${current.humidity}%` : 'N/A',
              },
              {
                icon: <WindIcon />,
                label: 'Wind',
                value: current?.windSpeed != null
                  ? `${Math.round(current.windSpeed)} km/h${windDir ? ` ${windDir}` : ''}`
                  : 'N/A',
              },
              {
                icon: <UmbrellaIcon />,
                label: 'Rain chance',
                value: `${today?.precipProbability ?? current?.precipProbability ?? 0}%`,
              },
              {
                icon: <EyeIcon />,
                label: 'Visibility',
                value: current?.visibility != null
                  ? `${current.visibility.toFixed(1)} km`
                  : 'N/A',
              },
              {
                icon: uvInfo
                  ? <UVIcon color={uvInfo.color} />
                  : <UVIcon color="currentColor" />,
                label: 'UV Index',
                value: current?.uvIndex != null
                  ? `${Math.round(current.uvIndex)} · ${uvInfo?.label}`
                  : 'N/A',
              },
              {
                icon: <GaugeIcon />,
                label: 'Pressure',
                value: current?.pressure != null
                  ? `${Math.round(current.pressure)} hPa`
                  : 'N/A',
              },
            ].map(({ icon, label, value }) => (
              <div className="current-weather__stat" key={label}>
                <span className="current-weather__stat-icon">{icon}</span>
                <span className="current-weather__stat-label">{label}</span>
                <span className="current-weather__stat-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Atmospheric Effects ── */
function AtmosphericEffect({ code, isNight }) {
  const isRain = [51,53,55,61,63,65,80,81,82,95,96,99].includes(code)
  const isClear = code <= 1

  if (isNight && isClear) return <StarField />
  if (isRain) return <RainEffect />
  if (isClear) return <SunGlow />
  return null
}

function SunGlow() {
  return (
    <div className="atm-glow" aria-hidden="true">
      <div className="atm-glow__orb" />
    </div>
  )
}

function RainEffect() {
  const drops = Array.from({ length: 20 })
  return (
    <div className="rain-container" aria-hidden="true">
      {drops.map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${0.6 + Math.random() * 0.8}s`,
            animationDelay: `${Math.random() * 1.5}s`,
            opacity: 0.3 + Math.random() * 0.4,
            height: `${12 + Math.random() * 12}px`,
          }}
        />
      ))}
    </div>
  )
}

function StarField() {
  const stars = Array.from({ length: 30 })
  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: `${Math.random() * 70}%`,
            left: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Icons ── */
function PinIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> }
function ClockIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function RefreshIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> }
function DropIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 2C6 9.5 5 13 5 15a7 7 0 0 0 14 0c0-2-1-5.5-7-13Z"/></svg> }
function WindIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg> }
function UmbrellaIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/></svg> }
function EyeIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> }
function UVIcon({ color }) { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> }
function GaugeIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12 8 8"/><circle cx="12" cy="12" r="2"/></svg> }
