import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import SearchBar from '../ui/SearchBar'
import ThemeToggle from '../ui/ThemeToggle'
import UnitToggle from '../ui/UnitToggle'
import './Header.css'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { resolvedTheme } = useApp()
  const menuRef = useRef(null)
  const navigate = useNavigate()

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false)
      }
    }
    if (mobileMenuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [mobileMenuOpen])

  // Close menu on route change
  const handleNavClick = () => setMobileMenuOpen(false)

  const navLinks = [
    { to: '/',        label: 'Home',     icon: HomeIcon },
    { to: '/nigeria', label: 'Nigeria',  icon: MapPinIcon },
    { to: '/map',     label: 'Map',      icon: GlobeIcon },
    { to: '/favorites', label: 'Favorites', icon: HeartIcon },
  ]

  return (
    <header className="header" role="banner">
      <div className="header__inner container">

        {/* ── Logo ── */}
        <Link to="/" className="header__logo" aria-label="Heatwave Sky — Home">
          <LogoIcon />
          <span className="header__logo-text">
            <span className="header__logo-heat">Heatwave</span>
            <span className="header__logo-sky"> Sky</span>
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="header__nav" aria-label="Main navigation">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
              }
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* ── Desktop Controls ── */}
        <div className="header__controls">
          <button
            className="header__search-btn btn btn-ghost btn-icon"
            onClick={() => setSearchOpen(true)}
            aria-label="Search locations"
          >
            <SearchIcon />
          </button>
          <ThemeToggle />
          <UnitToggle />
        </div>

        {/* ── Mobile Controls ── */}
        <div className="header__mobile-controls">
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <SearchIcon />
          </button>
          <button
            className="btn btn-ghost btn-icon header__hamburger"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="header__mobile-menu animate-slide-down" ref={menuRef} role="dialog" aria-label="Mobile navigation">
          <nav className="header__mobile-nav">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `header__mobile-link ${isActive ? 'header__mobile-link--active' : ''}`
                }
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="header__mobile-footer">
            <ThemeToggle showLabel />
            <UnitToggle showLabel />
          </div>
        </div>
      )}

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </header>
  )
}

function SearchOverlay({ onClose }) {
  const { setActiveLocation } = useApp()
  const navigate = useNavigate()

  const handleSelect = (loc) => {
    setActiveLocation(loc)
    onClose()
    navigate('/')
  }

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search locations">
      <div className="search-overlay__backdrop" onClick={onClose} />
      <div className="search-overlay__panel animate-scale-in">
        <div className="search-overlay__header">
          <h2 className="search-overlay__title">Search Location</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close search">
            <CloseIcon />
          </button>
        </div>
        <SearchBar
          onSelect={handleSelect}
          autoFocus
          large
          placeholder="Search any city, state or location in Nigeria..."
        />
      </div>
    </div>
  )
}

// ── Inline SVG icons ────────────────────────────────────────────────────────
function LogoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hdr-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9"/>
          <stop offset="100%" stopColor="#f97316"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#hdr-logo-g)"/>
      <circle cx="13" cy="13" r="5" fill="#fde68a" opacity="0.95"/>
      <g stroke="#fde68a" strokeWidth="1.4" strokeLinecap="round">
        <line x1="13" y1="5" x2="13" y2="7.5"/>
        <line x1="13" y1="18.5" x2="13" y2="21"/>
        <line x1="5" y1="13" x2="7.5" y2="13"/>
        <line x1="18.5" y1="13" x2="21" y2="13"/>
        <line x1="7.5" y1="7.5" x2="9.5" y2="9.5"/>
        <line x1="16.5" y1="16.5" x2="18.5" y2="18.5"/>
        <line x1="18.5" y1="7.5" x2="16.5" y2="9.5"/>
        <line x1="9.5" y1="16.5" x2="7.5" y2="18.5"/>
      </g>
      <ellipse cx="20" cy="21" rx="7" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="15" cy="22.5" rx="5" ry="3.5" fill="white" opacity="0.9"/>
      <ellipse cx="24" cy="22.5" rx="4" ry="3" fill="white" opacity="0.8"/>
    </svg>
  )
}
function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
}
function HomeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
function MapPinIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
}
function GlobeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
}
function HeartIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
}
function MenuIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
}
function CloseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
