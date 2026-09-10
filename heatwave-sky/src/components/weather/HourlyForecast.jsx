import { useRef } from 'react'
import { useApp } from '../../context/AppContext'
import WeatherIcon from './WeatherIcon'
import { getWeatherInfo, formatTime } from '../../utils/weatherCodes'
import './HourlyForecast.css'

export default function HourlyForecast({ hourly = [] }) {
  const { displayShort } = useApp()
  const scrollRef = useRef(null)

  const now = new Date()
  // Show next 24 hours starting from current hour
  const visible = hourly.filter(h => new Date(h.time) >= now).slice(0, 24)
  if (!visible.length) return null

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  return (
    <section className="hourly card" aria-label="Hourly forecast">
      <div className="hourly__header">
        <h2 className="section-title">
          <ClockIcon />
          24-Hour Forecast
        </h2>
        <div className="hourly__arrows" aria-hidden="true">
          <button className="btn btn-ghost btn-icon hourly__arrow" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
          <button className="btn btn-ghost btn-icon hourly__arrow" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
        </div>
      </div>

      <div className="hourly__scroll scroll-x" ref={scrollRef} role="list" aria-label="Hourly weather items">
        {visible.map((hour, i) => {
          const isNow = i === 0
          const info = getWeatherInfo(hour.weatherCode, hour.isDay === 0)
          const time = isNow ? 'Now' : formatTime(hour.time)
          const hasRain = hour.precipProbability > 0

          return (
            <div
              key={hour.time}
              className={`hourly__item ${isNow ? 'hourly__item--now' : ''}`}
              role="listitem"
              aria-label={`${time}: ${displayShort(hour.temp)}, ${info.condition}${hasRain ? `, ${hour.precipProbability}% rain` : ''}`}
            >
              <span className="hourly__time">{time}</span>
              <span className="hourly__icon">
                <WeatherIcon icon={info.icon} size={36} />
              </span>
              <span className="hourly__temp">{displayShort(hour.temp)}</span>
              {hasRain ? (
                <span className="hourly__rain">
                  <RainDropIcon />
                  {hour.precipProbability}%
                </span>
              ) : (
                <span className="hourly__rain hourly__rain--none">—</span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ClockIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function RainDropIcon() { return <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12 2C6 9.5 5 13 5 15a7 7 0 0 0 14 0c0-2-1-5.5-7-13Z"/></svg> }
