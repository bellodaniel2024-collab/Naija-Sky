import { useApp } from '../../context/AppContext'
import './FavoriteButton.css'

export default function FavoriteButton({ location, size = 'md' }) {
  const { isFavorite, toggleFavorite } = useApp()
  const saved = isFavorite(location)

  return (
    <button
      className={`fav-btn fav-btn--${size} ${saved ? 'fav-btn--active' : ''} btn btn-ghost btn-icon`}
      onClick={(e) => { e.stopPropagation(); toggleFavorite(location) }}
      aria-label={saved ? `Remove ${location?.name} from favorites` : `Save ${location?.name} to favorites`}
      aria-pressed={saved}
      title={saved ? 'Remove from favorites' : 'Save to favorites'}
    >
      <HeartIcon filled={saved} />
    </button>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}
