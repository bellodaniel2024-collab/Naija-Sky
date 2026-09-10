import './ErrorState.css'

const errorIcons = {
  offline: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="28" fill="rgba(239,68,68,0.08)"/>
      <path d="M14 28C14 20.3 20.3 14 28 14C33.2 14 37.8 16.8 40.4 21" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M20 34C21.8 31 24.7 29 28 29C31.3 29 34.2 31 36 34" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="28" cy="40" r="2.5" fill="#ef4444"/>
      <line x1="10" y1="10" x2="46" y2="46" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  notfound: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="28" fill="rgba(14,165,233,0.08)"/>
      <circle cx="24" cy="24" r="10" stroke="#0ea5e9" strokeWidth="2.5"/>
      <line x1="31" y1="31" x2="44" y2="44" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="20" y1="24" x2="28" y2="24" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="20" x2="24" y2="28" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/>
      <line x1="19" y1="19" x2="29" y2="29" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  ),
  api: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="28" fill="rgba(245,158,11,0.08)"/>
      <path d="M28 16V30" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="28" cy="38" r="2.5" fill="#f59e0b"/>
      <path d="M14 28C14 20.3 20.3 14 28 14C35.7 14 42 20.3 42 28C42 35.7 35.7 42 28 42C20.3 42 14 35.7 14 28Z" stroke="#f59e0b" strokeWidth="2"/>
    </svg>
  ),
  location: (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="28" fill="rgba(14,165,233,0.08)"/>
      <path d="M28 14C22.5 14 18 18.5 18 24C18 32 28 44 28 44C28 44 38 32 38 24C38 18.5 33.5 14 28 14Z" stroke="#0ea5e9" strokeWidth="2.5"/>
      <circle cx="28" cy="24" r="4" stroke="#0ea5e9" strokeWidth="2"/>
      <line x1="18" y1="14" x2="38" y2="34" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    </svg>
  ),
}

export default function ErrorState({
  type = 'api',
  title,
  message,
  onRetry,
  compact = false,
}) {
  const defaults = {
    offline:   { title: 'No Internet Connection', message: 'Check your network and try again.' },
    notfound:  { title: 'Location Not Found',      message: 'We couldn\'t find that location. Try a different search term.' },
    api:       { title: 'Something Went Wrong',    message: 'Weather data is temporarily unavailable. Please try again.' },
    location:  { title: 'Location Access Denied',  message: 'Please allow location access or search for your city manually.' },
  }
  const t = title   || defaults[type]?.title   || defaults.api.title
  const m = message || defaults[type]?.message || defaults.api.message

  return (
    <div className={`error-state ${compact ? 'error-state--compact' : ''} animate-fade-up`} role="alert" aria-live="polite">
      <div className="error-state__icon">{errorIcons[type] || errorIcons.api}</div>
      <h3 className="error-state__title">{t}</h3>
      <p className="error-state__message">{m}</p>
      {onRetry && (
        <button className="btn btn-primary btn-sm error-state__btn" onClick={onRetry}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13.65 2.35A8 8 0 1 0 15 8h-2a6 6 0 1 1-1.14-3.46L10 6h5V1l-1.35 1.35Z" fill="currentColor"/>
          </svg>
          Try Again
        </button>
      )}
    </div>
  )
}
