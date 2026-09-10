import './LoadingSkeleton.css'

function Bone({ width = '100%', height = '1rem', radius = 'var(--radius-md)', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  )
}

export function HeroSkeleton() {
  return (
    <div className="skeleton-hero" aria-label="Loading current weather" aria-busy="true">
      <div className="skeleton-hero__inner">
        <Bone width="180px" height="1.2rem" style={{ marginBottom: '1.5rem' }} />
        <Bone width="140px" height="6rem" radius="var(--radius-lg)" style={{ marginBottom: '1rem' }} />
        <Bone width="200px" height="1.5rem" style={{ marginBottom: '0.75rem' }} />
        <Bone width="160px" height="1rem" style={{ marginBottom: '0.5rem' }} />
        <Bone width="120px" height="0.875rem" />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {[1,2,3,4].map(i => <Bone key={i} width="60px" height="60px" radius="var(--radius-md)" />)}
        </div>
      </div>
    </div>
  )
}

export function HourlyForecastSkeleton() {
  return (
    <div className="skeleton-section" aria-label="Loading hourly forecast" aria-busy="true">
      <Bone width="160px" height="1rem" style={{ marginBottom: '1rem' }} />
      <div style={{ display: 'flex', gap: '0.75rem', overflow: 'hidden' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-hourly-card">
            <Bone width="40px" height="0.75rem" />
            <Bone width="44px" height="44px" radius="50%" style={{ margin: '0.75rem 0' }} />
            <Bone width="40px" height="0.875rem" />
            <Bone width="30px" height="0.75rem" style={{ marginTop: '0.25rem' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DailyForecastSkeleton() {
  return (
    <div className="skeleton-section" aria-label="Loading 7-day forecast" aria-busy="true">
      <Bone width="120px" height="1rem" style={{ marginBottom: '1rem' }} />
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="skeleton-daily-row">
          <Bone width="70px" height="0.875rem" />
          <Bone width="36px" height="36px" radius="50%" />
          <Bone width="100px" height="0.875rem" />
          <Bone width="80px" height="0.875rem" />
        </div>
      ))}
    </div>
  )
}

export function MetricsSkeleton() {
  return (
    <div className="skeleton-section" aria-label="Loading weather details" aria-busy="true">
      <Bone width="140px" height="1rem" style={{ marginBottom: '1rem' }} />
      <div className="skeleton-metrics-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-metric-card">
            <Bone width="32px" height="32px" radius="50%" />
            <Bone width="60px" height="0.75rem" style={{ marginTop: '0.75rem' }} />
            <Bone width="80px" height="1.25rem" style={{ marginTop: '0.5rem' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function StateCardSkeleton({ count = 12 }) {
  return (
    <div className="skeleton-state-grid" aria-label="Loading state weather cards" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-state-card">
          <Bone width="90px" height="1.1rem" style={{ marginBottom: '0.5rem' }} />
          <Bone width="60px" height="0.75rem" style={{ marginBottom: '1rem' }} />
          <Bone width="48px" height="48px" radius="50%" style={{ marginBottom: '0.75rem' }} />
          <Bone width="70px" height="1.5rem" />
          <Bone width="100px" height="0.875rem" style={{ marginTop: '0.5rem' }} />
        </div>
      ))}
    </div>
  )
}
