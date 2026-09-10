import { useState, useCallback } from 'react'
import { reverseGeocode } from '../services/weatherService'

/**
 * Browser geolocation hook with reverse geocoding.
 */
export function useGeolocation() {
  const [state, setState] = useState({
    location: null,
    loading: false,
    error: null,
  })

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState(s => ({
        ...s,
        error: 'Geolocation is not supported by your browser.',
      }))
      return
    }

    setState({ location: null, loading: true, error: null })

    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        })
      )

      const { latitude: lat, longitude: lon } = position.coords
      const place = await reverseGeocode(lat, lon)

      setState({
        location: { ...place, lat, lon },
        loading: false,
        error: null,
      })

      return { ...place, lat, lon }
    } catch (err) {
      const msg = getGeoError(err)
      setState({ location: null, loading: false, error: msg })
      return null
    }
  }, [])

  return { ...state, getLocation }
}

function getGeoError(err) {
  switch (err?.code) {
    case 1:
      return 'Location access denied. Please allow location permission and try again.'
    case 2:
      return 'Location unavailable. Please search for your city manually.'
    case 3:
      return 'Location request timed out. Please try again.'
    default:
      return 'Unable to determine your location. Please search manually.'
  }
}
