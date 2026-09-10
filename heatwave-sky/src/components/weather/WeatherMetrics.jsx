import { useApp } from '../../context/AppContext'
import {
  getWindDirection,
  getUVDescription,
  getVisibilityDescription,
} from '../../utils/weatherCodes'
import './WeatherMetrics.css'

export default function WeatherMetrics({ current }) {
  if (!current) return null
  const { display } = useApp()

  const uvInfo = current.uvIndex != null ? getUVDescription(current.uvIndex) : null
  const windDir = current.windDirection != null ? getWindDirection(current.windDirection) : null

  const metrics = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: current.humidity != null ? `${current.humidity}%` : 'N/A',
      sub: humidityDescription(current.humidity),
      icon: <DropIcon />,
      gauge: current.humidity,
      gaugeColor: '#3b82f6',
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: current.windSpeed != null ? `${Math.round(current.windSpeed)} km/h` : 'N/A',
      sub: windDir ? `Direction: ${windDir}` : null,
      icon: <WindIcon />,
      gauge: current.windSpeed != null ? Math.min(current.windSpeed / 120 * 100, 100) : null,
      gaugeColor: '#0ea5e9',
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: current.pressure != null ? `${Math.round(current.pressure)} hPa` : 'N/A',
      sub: pressureDescription(current.pressure),
      icon: <GaugeIcon />,
      gauge: current.pressure != null ? Math.min(((current.pressure - 980) / 60) * 100, 100) : null,
      gaugeColor: '#8b5cf6',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: current.visibility != null ? `${current.visibility.toFixed(1)} km` : 'N/A',
      sub: current.visibility != null ? getVisibilityDescription(current.visibility) : null,
      icon: <EyeIcon />,
      gauge: current.visibility != null ? Math.min((current.visibility / 20) * 100, 100) : null,
      gaugeColor: '#10b981',
    },
    {
      id: 'uv',
      label: 'UV Index',
      value: current.uvIndex != null ? Math.round(current.uvIndex).toString() : 'N/A',
      sub: uvInfo?.label,
      icon: <UVIcon />,
      gauge: current.uvIndex != null ? Math.min((current.uvIndex / 12) * 100, 100) : null,
      gaugeColor: uvInfo?.color || '#f59e0b',
    },
    {
      id: 'cloud',
      label: 'Cloud Cover',
      value: current.cloudCover != null ? `${current.cloudCover}%` : 'N/A',
      sub: cloudDescription(current.cloudCover),
      icon: <CloudIcon />,
      gauge: current.cloudCover,
      gaugeColor: '#94a3b8',
    },
    {
      id: 'precipitation',
      label: 'Precipitation',
      value: current.precipitation != null ? `${current.precipitation.toFixed(1)} mm` : 'N/A',
      sub: current.precipitation > 0 ? 'Active precipitation' : 'None at this time',
      icon: <RainIcon />,
      gauge: current.precipitation != null ? Math.min(current.precipitation / 20 * 100, 100) : 0,
      gaugeColor: '#60a5fa',
    },
    {
      id: 'windgusts',
      label: 'Wind Gusts',
      value: current.windGusts != null ? `${Math.round(current.windGusts)} km/h` : 'N/A',
      sub: current.windGusts != null ? gustDescription(current.windGusts) : null,
      icon: <GustIcon />,
      gauge: current.windGusts != null ? Math.min(current.windGusts / 150 * 100, 100) : null,
      gaugeColor: '#f97316',
    },
  ]

  return (
    <section className="metrics card" aria-label="Weather details">
      <h2 className="section-title">
        <DetailsIcon />
        Weather Details
      </h2>
      <div className="metrics__grid">
        {metrics.map(m => (
          <article
            key={m.id}
            className="metrics__card"
            aria-label={`${m.label}: ${m.value}${m.sub ? ', ' + m.sub : ''}`}
          >
            <div className="metrics__card-header">
              <span className="metrics__icon">{m.icon}</span>
              <span className="metrics__label">{m.label}</span>
            </div>
            <div className="metrics__value">{m.value}</div>
            {m.sub && <div className="metrics__sub">{m.sub}</div>}
            {m.gauge != null && (
              <div className="metrics__bar" aria-hidden="true">
                <div
                  className="metrics__bar-fill"
                  style={{
                    width: `${Math.max(0, Math.min(100, m.gauge))}%`,
                    background: m.gaugeColor,
                  }}
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function humidityDescription(h) {
  if (h == null) return null
  if (h < 30) return 'Very Dry'
  if (h < 50) return 'Comfortable'
  if (h < 70) return 'Moderate'
  if (h < 85) return 'Humid'
  return 'Very Humid'
}
function pressureDescription(p) {
  if (p == null) return null
  if (p < 1000) return 'Low pressure'
  if (p < 1013) return 'Normal'
  return 'High pressure'
}
function cloudDescription(c) {
  if (c == null) return null
  if (c < 10) return 'Clear sky'
  if (c < 30) return 'Mostly clear'
  if (c < 60) return 'Partly cloudy'
  if (c < 90) return 'Mostly cloudy'
  return 'Overcast'
}
function gustDescription(g) {
  if (g < 30) return 'Light'
  if (g < 60) return 'Moderate'
  if (g < 90) return 'Strong'
  return 'Dangerous'
}

function DropIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 2C6 9.5 5 13 5 15a7 7 0 0 0 14 0c0-2-1-5.5-7-13Z"/></svg> }
function WindIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg> }
function GaugeIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12 8 8"/><circle cx="12" cy="12" r="2"/></svg> }
function EyeIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> }
function UVIcon()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg> }
function CloudIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg> }
function RainIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg> }
function GustIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg> }
function DetailsIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> }
