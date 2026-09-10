import { useOnline } from '../../hooks/useOnline'
import './OfflineBanner.css'

export default function OfflineBanner() {
  const isOnline = useOnline()
  if (isOnline) return null

  return (
    <div className="offline-banner" role="alert" aria-live="assertive">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M1 1L23 23M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>You're offline — showing last available weather data</span>
    </div>
  )
}
