/**
 * WeatherIcon — Centralized SVG weather icon component.
 * Accepts an `icon` string key (from weatherCodes.js) and a `size`.
 */

const icons = {
  'sun': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`@keyframes sun-pulse{0%,100%{filter:drop-shadow(0 0 6px rgba(253,230,138,.7))}50%{filter:drop-shadow(0 0 18px rgba(253,186,48,1))}}`}</style>
      <g style={{animation:'sun-pulse 3s ease-in-out infinite'}}>
        <circle cx="32" cy="32" r="12" fill="#FDE68A" stroke="#FBBF24" strokeWidth="1.5"/>
        <g stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round">
          <line x1="32" y1="6" x2="32" y2="12"/>
          <line x1="32" y1="52" x2="32" y2="58"/>
          <line x1="6" y1="32" x2="12" y2="32"/>
          <line x1="52" y1="32" x2="58" y2="32"/>
          <line x1="13.5" y1="13.5" x2="17.8" y2="17.8"/>
          <line x1="46.2" y1="46.2" x2="50.5" y2="50.5"/>
          <line x1="50.5" y1="13.5" x2="46.2" y2="17.8"/>
          <line x1="17.8" y1="46.2" x2="13.5" y2="50.5"/>
        </g>
      </g>
    </svg>
  ),

  'sun-night': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="36" cy="32" r="14" fill="#1e1b4b" opacity="0.4"/>
      <path d="M38 16C28.6 16 21 23.6 21 33C21 42.4 28.6 50 38 50C44.2 50 49.6 46.8 52.6 42C49.2 43.2 45.6 43.6 42 42.6C33.4 40.4 27.8 31.8 30 23.2C31 19.2 33.6 15.6 38 13.8C37.2 13.8 37.6 16 38 16Z" fill="#c7d2fe" stroke="#a5b4fc" strokeWidth="1.5"/>
      <circle cx="44" cy="12" r="1.5" fill="#fde68a" opacity="0.8"/>
      <circle cx="52" cy="20" r="1" fill="#fde68a" opacity="0.6"/>
      <circle cx="48" cy="28" r="1" fill="#fde68a" opacity="0.5"/>
    </svg>
  ),

  'sun-cloud': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="22" r="9" fill="#FDE68A" stroke="#FBBF24" strokeWidth="1.5"/>
      <g stroke="#FBBF24" strokeWidth="2" strokeLinecap="round">
        <line x1="24" y1="8" x2="24" y2="12"/>
        <line x1="24" y1="32" x2="24" y2="36"/>
        <line x1="10" y1="22" x2="14" y2="22"/>
        <line x1="34" y1="22" x2="38" y2="22"/>
        <line x1="13.5" y1="12" x2="16.5" y2="15"/>
        <line x1="31.5" y1="29" x2="34.5" y2="32"/>
        <line x1="34.5" y1="12" x2="31.5" y2="15"/>
        <line x1="16.5" y1="29" x2="13.5" y2="32"/>
      </g>
      <ellipse cx="40" cy="42" rx="16" ry="9" fill="white" stroke="#e0f2fe" strokeWidth="1"/>
      <ellipse cx="30" cy="44" rx="11" ry="8" fill="white" stroke="#e0f2fe" strokeWidth="1"/>
      <ellipse cx="50" cy="45" rx="9" ry="7" fill="white" stroke="#e0f2fe" strokeWidth="1"/>
    </svg>
  ),

  'partly-cloudy': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="22" cy="24" r="8" fill="#FDE68A" stroke="#FBBF24" strokeWidth="1.5"/>
      <g stroke="#FBBF24" strokeWidth="2" strokeLinecap="round">
        <line x1="22" y1="11" x2="22" y2="14.5"/>
        <line x1="22" y1="33.5" x2="22" y2="37"/>
        <line x1="9" y1="24" x2="12.5" y2="24"/>
        <line x1="31.5" y1="24" x2="35" y2="24"/>
        <line x1="13" y1="15" x2="15.5" y2="17.5"/>
        <line x1="28.5" y1="30.5" x2="31" y2="33"/>
        <line x1="31" y1="15" x2="28.5" y2="17.5"/>
        <line x1="15.5" y1="30.5" x2="13" y2="33"/>
      </g>
      <ellipse cx="40" cy="40" rx="16" ry="9.5" fill="white" stroke="#bae6fd" strokeWidth="1"/>
      <ellipse cx="28" cy="43" rx="13" ry="9" fill="white" stroke="#bae6fd" strokeWidth="1"/>
      <ellipse cx="50" cy="43" rx="10" ry="8" fill="white" stroke="#bae6fd" strokeWidth="1"/>
    </svg>
  ),

  'cloud': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="36" cy="36" rx="20" ry="12" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5"/>
      <ellipse cx="24" cy="40" rx="14" ry="10" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5"/>
      <ellipse cx="46" cy="40" rx="11" ry="9" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5"/>
      <ellipse cx="34" cy="28" rx="12" ry="10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1"/>
    </svg>
  ),

  'fog': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
        <line x1="10" y1="22" x2="54" y2="22"/>
        <line x1="14" y1="30" x2="50" y2="30"/>
        <line x1="10" y1="38" x2="54" y2="38"/>
        <line x1="16" y1="46" x2="48" y2="46"/>
      </g>
      <ellipse cx="32" cy="20" rx="18" ry="8" fill="#e2e8f0" opacity="0.6"/>
    </svg>
  ),

  'drizzle': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="36" cy="24" rx="18" ry="10" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1"/>
      <ellipse cx="24" cy="27" rx="13" ry="9" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1"/>
      <ellipse cx="46" cy="28" rx="10" ry="8" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1"/>
      <g stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" opacity="0.9">
        <line x1="22" y1="40" x2="20" y2="48"/>
        <line x1="32" y1="42" x2="30" y2="50"/>
        <line x1="42" y1="40" x2="40" y2="48"/>
      </g>
    </svg>
  ),

  'rain': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="36" cy="22" rx="18" ry="10" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1"/>
      <ellipse cx="24" cy="25" rx="13" ry="9" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1"/>
      <ellipse cx="46" cy="26" rx="10" ry="8" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1"/>
      <g stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round">
        <line x1="20" y1="38" x2="16" y2="52"/>
        <line x1="30" y1="38" x2="26" y2="52"/>
        <line x1="40" y1="38" x2="36" y2="52"/>
        <line x1="50" y1="38" x2="46" y2="52"/>
      </g>
    </svg>
  ),

  'heavy-rain': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="36" cy="20" rx="18" ry="10" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1.5"/>
      <ellipse cx="24" cy="23" rx="13" ry="9" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1.5"/>
      <ellipse cx="46" cy="24" rx="10" ry="8" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1.5"/>
      <g stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round">
        <line x1="18" y1="35" x2="12" y2="53"/>
        <line x1="28" y1="35" x2="22" y2="53"/>
        <line x1="38" y1="35" x2="32" y2="53"/>
        <line x1="48" y1="35" x2="42" y2="53"/>
      </g>
    </svg>
  ),

  'rain-shower': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="26" cy="18" r="7" fill="#FDE68A" stroke="#FBBF24" strokeWidth="1.2"/>
      <g stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round">
        <line x1="26" y1="7" x2="26" y2="10"/>
        <line x1="37" y1="18" x2="40" y2="18"/>
        <line x1="33.9" y1="11.1" x2="36" y2="9"/>
      </g>
      <ellipse cx="40" cy="30" rx="16" ry="9" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1"/>
      <ellipse cx="29" cy="33" rx="11" ry="8" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1"/>
      <g stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round">
        <line x1="26" y1="44" x2="23" y2="54"/>
        <line x1="35" y1="44" x2="32" y2="54"/>
        <line x1="44" y1="44" x2="41" y2="54"/>
      </g>
    </svg>
  ),

  'thunderstorm': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="36" cy="18" rx="18" ry="10" fill="#475569" stroke="#334155" strokeWidth="1.5"/>
      <ellipse cx="24" cy="21" rx="13" ry="9" fill="#475569" stroke="#334155" strokeWidth="1.5"/>
      <ellipse cx="46" cy="22" rx="10" ry="8" fill="#475569" stroke="#334155" strokeWidth="1.5"/>
      <path d="M34 32L28 45H34L28 58" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <g stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" opacity="0.6">
        <line x1="18" y1="35" x2="14" y2="47"/>
        <line x1="46" y1="35" x2="42" y2="47"/>
      </g>
    </svg>
  ),

  'snow': ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="36" cy="22" rx="18" ry="10" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1"/>
      <ellipse cx="24" cy="25" rx="13" ry="9" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1"/>
      <g stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round">
        <line x1="22" y1="38" x2="22" y2="50"/>
        <line x1="16" y1="44" x2="28" y2="44"/>
        <line x1="17" y1="39" x2="27" y2="49"/>
        <line x1="27" y1="39" x2="17" y2="49"/>
        <line x1="40" y1="40" x2="40" y2="52"/>
        <line x1="34" y1="46" x2="46" y2="46"/>
        <line x1="35" y1="41" x2="45" y2="51"/>
        <line x1="45" y1="41" x2="35" y2="51"/>
      </g>
    </svg>
  ),
}

// ── Fallback icon ──
const Fallback = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="32" cy="32" r="20" fill="#FDE68A" stroke="#FBBF24" strokeWidth="2"/>
    <circle cx="32" cy="32" r="8" fill="#FBBF24"/>
  </svg>
)

export default function WeatherIcon({ icon = 'sun', size = 64, className = '', style = {} }) {
  const IconComponent = icons[icon] || Fallback
  return (
    <span
      className={`weather-icon ${className}`}
      style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
      aria-hidden="true"
    >
      <IconComponent size={size} />
    </span>
  )
}
