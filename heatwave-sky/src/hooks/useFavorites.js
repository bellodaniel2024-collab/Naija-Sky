import { useState, useEffect, useCallback } from 'react'

const FAVORITES_KEY = 'hws_favorites'
const MAX_FAVORITES = 10

/**
 * Favorites management — persisted in localStorage, no account needed.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch {
      // Storage full
    }
  }, [favorites])

  const addFavorite = useCallback((location) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === location.id || (
        Math.abs(f.lat - location.lat) < 0.01 &&
        Math.abs(f.lon - location.lon) < 0.01
      ))) {
        return prev // already saved
      }
      const entry = {
        id: location.id || `${location.lat.toFixed(3)}_${location.lon.toFixed(3)}`,
        name: location.name,
        state: location.state || '',
        country: location.country || 'Nigeria',
        lat: location.lat,
        lon: location.lon,
        savedAt: new Date().toISOString(),
      }
      return [entry, ...prev].slice(0, MAX_FAVORITES)
    })
  }, [])

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => prev.filter(f => f.id !== id))
  }, [])

  const isFavorite = useCallback((location) => {
    if (!location) return false
    return favorites.some(f =>
      f.id === location.id ||
      (Math.abs(f.lat - location.lat) < 0.01 &&
       Math.abs(f.lon - location.lon) < 0.01)
    )
  }, [favorites])

  const toggleFavorite = useCallback((location) => {
    if (isFavorite(location)) {
      const existing = favorites.find(f =>
        Math.abs(f.lat - location.lat) < 0.01 &&
        Math.abs(f.lon - location.lon) < 0.01
      )
      if (existing) removeFavorite(existing.id)
    } else {
      addFavorite(location)
    }
  }, [favorites, isFavorite, addFavorite, removeFavorite])

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }
}
