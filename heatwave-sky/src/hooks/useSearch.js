import { useState, useCallback, useRef, useEffect } from 'react'
import { searchLocations } from '../services/weatherService'
import { NIGERIAN_STATES } from '../data/nigerianStates'

const DEBOUNCE_MS = 350

/**
 * Search hook with debouncing, local state suggestions, and API geocoding.
 * Shows local Nigerian states/cities first, then hits the geocoding API.
 */
export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)

  const searchLocal = useCallback((q) => {
    const lower = q.toLowerCase().trim()
    if (!lower) return []

    const matches = []

    // States
    NIGERIAN_STATES.forEach(state => {
      if (
        state.name.toLowerCase().startsWith(lower) ||
        state.capital.toLowerCase().startsWith(lower)
      ) {
        matches.push({
          id: state.id,
          name: state.capital === state.name ? state.name : state.capital,
          displayName: state.name,
          state: state.name,
          country: 'Nigeria',
          lat: state.lat,
          lon: state.lon,
          type: 'state',
        })
      }
    })

    // Cities from state data
    NIGERIAN_STATES.forEach(state => {
      state.majorCities.forEach(city => {
        if (city.toLowerCase().startsWith(lower)) {
          matches.push({
            id: `${state.id}_${city}`,
            name: city,
            state: state.name,
            country: 'Nigeria',
            lat: state.lat,
            lon: state.lon,
            type: 'city',
          })
        }
      })
    })

    return matches.slice(0, 5)
  }, [])

  const performSearch = useCallback(async (q) => {
    const trimmed = q.trim()
    if (trimmed.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    // Local matches appear instantly
    const local = searchLocal(trimmed)
    if (local.length) setResults(local)

    setLoading(true)
    setError(null)

    try {
      const api = await searchLocations(trimmed, 8)
      // Merge: API results first (deduplicated by proximity to local)
      const merged = [
        ...api.filter(a =>
          !local.some(l =>
            Math.abs(l.lat - a.lat) < 0.1 && Math.abs(l.lon - a.lon) < 0.1
          )
        ),
        ...local,
      ].slice(0, 8)
      setResults(merged.length ? merged : local)
    } catch {
      // API failed — keep local results, don't block UX
      if (!local.length) setError('Search unavailable. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [searchLocal])

  useEffect(() => {
    clearTimeout(timerRef.current)
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    timerRef.current = setTimeout(() => performSearch(query), DEBOUNCE_MS)
    return () => clearTimeout(timerRef.current)
  }, [query, performSearch])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
  }, [])

  return { query, setQuery, results, loading, error, clearSearch }
}
