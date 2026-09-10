import { useApp } from '../../context/AppContext'
import { useGeolocation } from '../../hooks/useGeolocation'
import './LocationButton.css'

export default function LocationButton({ onLocated, compact = false }) {
  const { setActiveLocation } = useApp()
  const { loading, error, getLocation } = useGeolocation()

  const handleClick = async () => {
    const loc = await getLocation()
    if (loc) {
      setActiveLocation(loc)
      onLocated?.(loc)
    }
  }

  return (
    <div className="loc-btn-wrap">
      <button
        className={`loc-btn btn ${compact ? 'btn-secondary btn-sm' : 'btn-secondary'}`}
        onClick={handleClick}
        disabled={loading}
        aria-label="Use my current location"
        aria-busy={loading}
      >
        {loading ? <SpinnerIcon /> : <TargetIcon />}
        {compact ? 'My Location' : 'Use My Location'}
      </button>
      {error && (
        <p className="loc-btn__error" role="alert" aria-live="polite">
          <WarnIcon /> {error}
        </p>
      )}
    </div>
  )
}

function TargetIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>
}
function SpinnerIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" style={{ animation: 'spin-slow 0.7s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
}
function WarnIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}
