import { createContext, useContext, useState, useCallback } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useUnit } from '../hooks/useUnit'
import { useFavorites } from '../hooks/useFavorites'

const AppContext = createContext(null)

// Default location: Lagos, Nigeria
const DEFAULT_LOCATION = {
  name: 'Lagos',
  state: 'Lagos State',
  country: 'Nigeria',
  lat: 6.5244,
  lon: 3.3792,
}

export function AppProvider({ children }) {
  const [activeLocation, setActiveLocationState] = useState(() => {
    try {
      const saved = localStorage.getItem('hws_last_location')
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION
    } catch {
      return DEFAULT_LOCATION
    }
  })

  const setActiveLocation = useCallback((loc) => {
    setActiveLocationState(loc)
    try {
      localStorage.setItem('hws_last_location', JSON.stringify(loc))
    } catch { /* ignore */ }
  }, [])

  const theme = useTheme()
  const unit = useUnit()
  const favorites = useFavorites()

  return (
    <AppContext.Provider value={{
      activeLocation,
      setActiveLocation,
      ...theme,
      ...unit,
      ...favorites,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
