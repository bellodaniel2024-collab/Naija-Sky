import { useState, useEffect, useCallback, useRef } from 'react'
import {
  fetchWeatherData,
  cacheWeatherData,
  getCachedWeather,
} from '../services/weatherService'

/**
 * Primary weather hook — fetches full forecast for a location.
 * Handles loading, error, caching, and stale-data display.
 */
export function useWeather(location) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isStale, setIsStale] = useState(false)
  const abortRef = useRef(null)

  const loadWeather = useCallback(async (loc) => {
    if (!loc?.lat || !loc?.lon) return

    const cacheKey = `${loc.lat.toFixed(3)}_${loc.lon.toFixed(3)}`
    setLoading(true)
    setError(null)

    // Show cached data immediately while fetching fresh
    const cached = getCachedWeather(cacheKey)
    if (cached) {
      setWeather(cached.data)
      setIsStale(cached.isStale)
      if (!cached.isStale) {
        setLoading(false)
        return
      }
    }

    try {
      const data = await fetchWeatherData(loc.lat, loc.lon)
      setWeather(data)
      setIsStale(false)
      cacheWeatherData(cacheKey, data)
    } catch (err) {
      if (err.name === 'CanceledError') return
      if (!cached) {
        setError(getErrorMessage(err))
      }
      // If we have cached data, keep showing it with stale flag
      setIsStale(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWeather(location)
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [location, loadWeather])

  const refresh = useCallback(() => {
    if (location) loadWeather(location)
  }, [location, loadWeather])

  return { weather, loading, error, isStale, refresh }
}

function getErrorMessage(err) {
  if (!navigator.onLine) return 'You appear to be offline. Please check your connection.'
  if (err.code === 'ECONNABORTED' || err.message?.includes('timeout'))
    return 'Request timed out. Please try again.'
  if (err.response?.status === 429) return 'Too many requests. Please wait a moment.'
  if (err.response?.status >= 500) return 'Weather service is temporarily unavailable.'
  return 'Failed to load weather data. Please try again.'
}
