import { formatTime, getDayLength } from '../../utils/weatherCodes'
import './SunriseSunset.css'

export default function SunriseSunset({ today }) {
  if (!today?.sunrise || !today?.sunset) return null

  const sunrise = new Date(today.sunrise)
  const sunset  = new Date(today.sunset)
  const now     = new Date()

  // Sun position as % across the arc (0 = sunrise, 100 = sunset)
  const total  = sunset - sunrise
  const elapsed = now - sunrise
  const progress = Math.max(0, Math.min(100, (elapsed / total) * 100))
  const isDay = now >= sunrise && now <= sunset

  // Map progress 0-100 → angle on a semicircle
  const angle  = (progress / 100) * 180 - 90   // -90° to 90°
  const rad    = (angle * Math.PI) / 180
  const cx = 50, cy = 80, rx = 44, ry = 44
  const sunX   = cx + rx * Math.cos(rad + Math.PI / 2 - Math.PI)
  const sunY   = cy - ry * Math.sin(rad + Math.PI / 2 - Math.PI)

  const dayLen = getDayLength(today.sunrise, today.sunset)

  return (
    <section className="sunrise-sunset card" aria-label="Sunrise and sunset times">
      <h2 className="section-title">
        <SunIcon />
        Sunrise &amp; Sunset
      </h2>

      <div className="sunrise-sunset__visual" aria-hidden="true">
        <svg viewBox="0 0 100 90" className="sunrise-sunset__arc" role="img" aria-label="Sun path arc">
          {/* Horizon */}
          <line x1="3" y1="80" x2="97" y2="80" stroke="var(--border)" strokeWidth="1"/>
          {/* Arc track */}
          <path
            d="M 6 80 A 44 44 0 0 1 94 80"
            fill="none"
            stroke="var(--border)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* Filled arc progress */}
          <path
            d="M 6 80 A 44 44 0 0 1 94 80"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="2"
            strokeDasharray={`${progress * 1.38} 138`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#fb923c"/>
              <stop offset="50%"  stopColor="#fde68a"/>
              <stop offset="100%" stopColor="#f97316"/>
            </linearGradient>
          </defs>
          {/* Sun dot */}
          {isDay && (
            <circle
              cx={sunX}
              cy={sunY}
              r="4.5"
              fill="#fbbf24"
              stroke="white"
              strokeWidth="1.2"
              filter="url(#sunGlow)"
            />
          )}
          <defs>
            <filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      <div className="sunrise-sunset__times">
        <div className="sunrise-sunset__time">
          <span className="sunrise-sunset__time-icon sunrise-sunset__time-icon--rise">
            <SunriseIcon />
          </span>
          <span className="sunrise-sunset__time-label">Sunrise</span>
          <span className="sunrise-sunset__time-value">{formatTime(today.sunrise)}</span>
        </div>

        <div className="sunrise-sunset__day-length">
          <span className="sunrise-sunset__dl-label">Day length</span>
          <span className="sunrise-sunset__dl-value">{dayLen}</span>
        </div>

        <div className="sunrise-sunset__time">
          <span className="sunrise-sunset__time-icon sunrise-sunset__time-icon--set">
            <SunsetIcon />
          </span>
          <span className="sunrise-sunset__time-label">Sunset</span>
          <span className="sunrise-sunset__time-value">{formatTime(today.sunset)}</span>
        </div>
      </div>
    </section>
  )
}

function SunIcon()     { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> }
function SunriseIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg> }
function SunsetIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 9 8 5"/></svg> }
