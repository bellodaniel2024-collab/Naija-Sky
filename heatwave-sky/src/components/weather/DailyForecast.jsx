import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import WeatherIcon from './WeatherIcon'
import {
  getWeatherInfo,
  getDayName,
  formatTime,
  getDayLength,
} from '../../utils/weatherCodes'
import './DailyForecast.css'

export default function DailyForecast({ daily = [] }) {
  const { display, displayShort } = useApp()
  const [expanded, setExpanded] = useState(null)

  if (!daily.length) return null

  // Temperature range for bar scaling
  const globalMin = Math.min(...daily.map(d => d.tempMin))
  const globalMax = Math.max(...daily.map(d => d.tempMax))
  const range = globalMax - globalMin || 1

  return (
    <section className="daily card" aria-label="7-day forecast">
      <h2 className="section-title">
        <CalendarIcon />
        7-Day Forecast
      </h2>

      <div className="daily__list" role="list">
        {daily.map((day, i) => {
          const info = getWeatherInfo(day.weatherCode)
          const dayName = getDayName(day.time, false)
          const isExpanded = expanded === i
          const barLeft = ((day.tempMin - globalMin) / range) * 100
          const barWidth = ((day.tempMax - day.tempMin) / range) * 100

          return (
            <div key={day.time} role="listitem">
              <button
                className={`daily__row ${isExpanded ? 'daily__row--expanded' : ''}`}
                onClick={() => setExpanded(isExpanded ? null : i)}
                aria-expanded={isExpanded}
                aria-controls={`daily-detail-${i}`}
                aria-label={`${dayName}: High ${display(day.tempMax)}, Low ${display(day.tempMin)}, ${info.condition}`}
              >
                {/* Day */}
                <span className="daily__day">
                  <span className="daily__day-name">{dayName}</span>
                  <span className="daily__day-date">
                    {new Date(day.time).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                  </span>
                </span>

                {/* Icon + Condition */}
                <span className="daily__condition">
                  <WeatherIcon icon={info.icon} size={32} />
                  <span className="daily__condition-text">{info.condition}</span>
                </span>

                {/* Rain */}
                <span className={`daily__rain ${day.precipProbability > 0 ? 'daily__rain--active' : ''}`}>
                  <RainDropIcon />
                  {day.precipProbability}%
                </span>

                {/* Temp range bar */}
                <span className="daily__range" aria-hidden="true">
                  <span className="daily__range-low">{displayShort(day.tempMin)}</span>
                  <span className="daily__range-bar-wrap">
                    <span
                      className="daily__range-bar"
                      style={{ left: `${barLeft}%`, width: `${barWidth}%` }}
                    />
                  </span>
                  <span className="daily__range-high">{displayShort(day.tempMax)}</span>
                </span>

                <span className="daily__chevron" aria-hidden="true">
                  {isExpanded ? '▲' : '▼'}
                </span>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div
                  id={`daily-detail-${i}`}
                  className="daily__detail animate-slide-down"
                >
                  <div className="daily__detail-grid">
                    {[
                      { label: 'Sunrise', value: day.sunrise ? formatTime(day.sunrise) : 'N/A', icon: <SunriseIcon /> },
                      { label: 'Sunset', value: day.sunset ? formatTime(day.sunset) : 'N/A', icon: <SunsetIcon /> },
                      { label: 'Day Length', value: day.sunrise && day.sunset ? getDayLength(day.sunrise, day.sunset) : 'N/A', icon: <DaylightIcon /> },
                      { label: 'UV Index', value: day.uvIndexMax != null ? Math.round(day.uvIndexMax) : 'N/A', icon: <UVIcon /> },
                      { label: 'Rain', value: day.rainSum > 0 ? `${day.rainSum.toFixed(1)} mm` : '0 mm', icon: <RainMmIcon /> },
                      { label: 'Max Wind', value: day.windSpeedMax != null ? `${Math.round(day.windSpeedMax)} km/h` : 'N/A', icon: <WindIcon /> },
                    ].map(({ label, value, icon }) => (
                      <div className="daily__detail-item" key={label}>
                        <span className="daily__detail-icon">{icon}</span>
                        <span className="daily__detail-label">{label}</span>
                        <span className="daily__detail-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function CalendarIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function RainDropIcon() { return <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12 2C6 9.5 5 13 5 15a7 7 0 0 0 14 0c0-2-1-5.5-7-13Z"/></svg> }
function SunriseIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg> }
function SunsetIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 9 8 5"/></svg> }
function DaylightIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function UVIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg> }
function RainMmIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 2C6 9.5 5 13 5 15a7 7 0 0 0 14 0c0-2-1-5.5-7-13Z"/></svg> }
function WindIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg> }
