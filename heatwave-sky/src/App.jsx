import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy, Component } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import OfflineBanner from './components/ui/OfflineBanner'
import HomePage from './pages/HomePage'

// Lazy-load heavy pages
const NigeriaPage   = lazy(() => import('./pages/NigeriaPage'))
const MapPage       = lazy(() => import('./pages/MapPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const StatePage     = lazy(() => import('./pages/StatePage'))

// ── Error Boundary ────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('[Heatwave Sky] Render error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '2rem', textAlign: 'center', gap: '1rem',
          background: 'var(--bg-primary, #f0f9ff)',
          color: 'var(--text-primary, #0c4a6e)',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}>
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#0ea5e9"/>
            <circle cx="13" cy="13" r="5" fill="#fde68a"/>
            <ellipse cx="20" cy="21" rx="7" ry="4" fill="white" opacity="0.9"/>
            <ellipse cx="15" cy="22.5" rx="5" ry="3.5" fill="white" opacity="0.9"/>
          </svg>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            <span style={{ color: '#f97316' }}>Heatwave</span>
            <span style={{ color: '#0ea5e9' }}> Sky</span>
          </h1>
          <p style={{ color: '#475569', maxWidth: 360, lineHeight: 1.6 }}>
            Something went wrong loading the app. Please refresh the page.
          </p>
          {this.state.error && (
            <details style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: 480 }}>
              <summary style={{ cursor: 'pointer' }}>Error details</summary>
              <pre style={{ marginTop: '0.5rem', textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '0.5rem', padding: '0.625rem 1.5rem',
              background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
              color: '#fff', border: 'none', borderRadius: '999px',
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Page Suspense Loader ──────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: '0.75rem',
      color: 'var(--text-muted, #64748b)',
      fontSize: '0.9rem', fontWeight: 600,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        style={{ animation: 'spin-slow 0.7s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Loading…
    </div>
  )
}

// ── 404 ───────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh',
      gap: '1rem', textAlign: 'center', padding: '2rem',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--brand-primary)' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Page not found</h2>
      <p style={{ color: 'var(--text-muted)' }}>The page you're looking for doesn't exist.</p>
      <a href="/" className="btn btn-primary">← Go Home</a>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <div className="page-wrapper">
        <OfflineBanner />
        <Header />
        <div className="main-content">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"              element={<HomePage />} />
              <Route path="/nigeria"       element={<NigeriaPage />} />
              <Route path="/map"           element={<MapPage />} />
              <Route path="/favorites"     element={<FavoritesPage />} />
              <Route path="/weather/:slug" element={<StatePage />} />
              <Route path="*"              element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}
