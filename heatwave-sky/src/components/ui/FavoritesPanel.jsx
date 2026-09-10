import { useApp } from '../../context/AppContext'
import './FavoritesPanel.css'

export default function FavoritesPanel({ onSelect }) {
  const { favorites, removeFavorite, activeLocation } = useApp()

  if (!favorites.length) {
    return (
      <div className="favpanel favpanel--empty">
        <div className="favpanel__empty-icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <p className="favpanel__empty-title">No saved locations</p>
        <p className="favpanel__empty-text">
          Search for a location and tap the heart icon to save it here.
        </p>
      </div>
    )
  }

  return (
    <div className="favpanel">
      <h3 className="favpanel__title">
        <HeartIcon />
        My Locations
        <span className="badge badge-blue">{favorites.length}</span>
      </h3>
      <ul className="favpanel__list" aria-label="Saved locations">
        {favorites.map(fav => {
          const isActive =
            activeLocation?.name === fav.name &&
            Math.abs((activeLocation?.lat ?? 0) - fav.lat) < 0.01

          return (
            <li key={fav.id}>
              <div
                className={`favpanel__item ${isActive ? 'favpanel__item--active' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => onSelect?.(fav)}
                onKeyDown={e => e.key === 'Enter' && onSelect?.(fav)}
                aria-label={`View weather for ${fav.name}`}
                aria-current={isActive ? 'location' : undefined}
              >
                <span className="favpanel__item-pin" aria-hidden="true"><PinIcon /></span>
                <span className="favpanel__item-info">
                  <span className="favpanel__item-name">{fav.name}</span>
                  {fav.state && (
                    <span className="favpanel__item-state">{fav.state}</span>
                  )}
                </span>
                <button
                  className="favpanel__remove btn btn-ghost"
                  onClick={e => { e.stopPropagation(); removeFavorite(fav.id) }}
                  aria-label={`Remove ${fav.name} from favorites`}
                  title="Remove"
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function HeartIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
}
function PinIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
}
function TrashIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
}
