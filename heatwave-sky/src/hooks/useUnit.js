import { useState, useCallback } from 'react'
import { celsiusToFahrenheit } from '../utils/weatherCodes'

const UNIT_KEY = 'hws_unit'

/**
 * Temperature unit preference hook.
 */
export function useUnit() {
  const [unit, setUnitState] = useState(() => {
    return localStorage.getItem(UNIT_KEY) || 'C'
  })

  const setUnit = useCallback((u) => {
    setUnitState(u)
    localStorage.setItem(UNIT_KEY, u)
  }, [])

  const toggleUnit = useCallback(() => {
    setUnit(unit === 'C' ? 'F' : 'C')
  }, [unit, setUnit])

  /**
   * Convert and display a Celsius value with unit label.
   * Returns just the number (no label) if `labelOnly` is false.
   */
  const display = useCallback((celsius, { round = true, label = true } = {}) => {
    if (celsius == null) return 'N/A'
    let value = unit === 'F' ? celsiusToFahrenheit(celsius) : (round ? Math.round(celsius) : celsius)
    return label ? `${value}°${unit}` : `${value}`
  }, [unit])

  const displayShort = useCallback((celsius) => {
    if (celsius == null) return '--'
    const value = unit === 'F' ? celsiusToFahrenheit(celsius) : Math.round(celsius)
    return `${value}°`
  }, [unit])

  return { unit, setUnit, toggleUnit, display, displayShort }
}
