import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">
        <div className="footer__brand">
          <LogoIcon />
          <div>
            <p className="footer__brand-name">
              <span className="footer__heat">Heatwave</span>
              <span className="footer__sky"> Sky</span>
            </p>
            <p className="footer__tagline">Weather, wherever you are in Nigeria.</p>
          </div>
        </div>

        <nav className="footer__links" aria-label="Footer navigation">
          <div className="footer__col">
            <h3 className="footer__col-title">Explore</h3>
            <Link to="/" className="footer__link">Home</Link>
            <Link to="/nigeria" className="footer__link">Nigeria Weather</Link>
            <Link to="/map" className="footer__link">Weather Map</Link>
            <Link to="/favorites" className="footer__link">My Favorites</Link>
          </div>
          <div className="footer__col">
            <h3 className="footer__col-title">States</h3>
            <Link to="/weather/lagos" className="footer__link">Lagos</Link>
            <Link to="/weather/abuja" className="footer__link">Abuja (FCT)</Link>
            <Link to="/weather/rivers" className="footer__link">Rivers</Link>
            <Link to="/weather/kano" className="footer__link">Kano</Link>
          </div>
          <div className="footer__col">
            <h3 className="footer__col-title">More States</h3>
            <Link to="/weather/oyo" className="footer__link">Oyo</Link>
            <Link to="/weather/delta" className="footer__link">Delta</Link>
            <Link to="/weather/enugu" className="footer__link">Enugu</Link>
            <Link to="/weather/kogi" className="footer__link">Kogi</Link>
          </div>
        </nav>
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">
          © {year} Heatwave Sky. Weather data by{' '}
          <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="footer__ext-link">
            Open-Meteo
          </a>
          {' '}· Maps by{' '}
          <a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer" className="footer__ext-link">
            Leaflet
          </a>
          {' '}·{' '}
          <a href="https://openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="footer__ext-link">
            OpenStreetMap
          </a>
        </p>
      </div>
    </footer>
  )
}

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ft-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9"/>
          <stop offset="100%" stopColor="#f97316"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#ft-logo-g)"/>
      <circle cx="13" cy="13" r="5" fill="#fde68a" opacity="0.95"/>
      <g stroke="#fde68a" strokeWidth="1.3" strokeLinecap="round">
        <line x1="13" y1="5" x2="13" y2="7.5"/>
        <line x1="13" y1="18.5" x2="13" y2="21"/>
        <line x1="5" y1="13" x2="7.5" y2="13"/>
        <line x1="18.5" y1="13" x2="21" y2="13"/>
      </g>
      <ellipse cx="20" cy="21" rx="7" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="15" cy="22.5" rx="5" ry="3.5" fill="white" opacity="0.9"/>
    </svg>
  )
}
