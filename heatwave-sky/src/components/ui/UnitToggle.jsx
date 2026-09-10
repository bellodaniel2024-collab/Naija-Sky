import { useApp } from '../../context/AppContext'
import './UnitToggle.css'

export default function UnitToggle({ showLabel = false }) {
  const { unit, toggleUnit } = useApp()

  return (
    <button
      className={`unit-toggle btn btn-ghost ${showLabel ? 'unit-toggle--labeled' : ''}`}
      onClick={toggleUnit}
      aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
      title={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
    >
      <span className="unit-toggle__track" aria-hidden="true">
        <span className={`unit-toggle__option ${unit === 'C' ? 'unit-toggle__option--active' : ''}`}>°C</span>
        <span className={`unit-toggle__option ${unit === 'F' ? 'unit-toggle__option--active' : ''}`}>°F</span>
      </span>
      {showLabel && (
        <span className="unit-toggle__label">Temperature unit</span>
      )}
    </button>
  )
}
