/**
 * Open-Meteo WMO Weather Interpretation Codes
 * Maps WMO codes → condition, description, icon key, gradient
 */

export const WEATHER_CODES = {
  0:  { condition: 'Clear Sky',          description: 'Clear and sunny',              icon: 'sun',              gradient: 'sunny',       isRain: false },
  1:  { condition: 'Mostly Clear',        description: 'Mainly clear skies',           icon: 'sun-cloud',        gradient: 'sunny',       isRain: false },
  2:  { condition: 'Partly Cloudy',       description: 'Partly cloudy skies',          icon: 'partly-cloudy',    gradient: 'partly-cloudy', isRain: false },
  3:  { condition: 'Overcast',            description: 'Overcast / Cloudy',            icon: 'cloud',            gradient: 'cloudy',      isRain: false },
  45: { condition: 'Foggy',               description: 'Fog',                          icon: 'fog',              gradient: 'foggy',       isRain: false },
  48: { condition: 'Rime Fog',            description: 'Depositing rime fog',          icon: 'fog',              gradient: 'foggy',       isRain: false },
  51: { condition: 'Light Drizzle',       description: 'Light drizzle',                icon: 'drizzle',          gradient: 'rainy',       isRain: true  },
  53: { condition: 'Moderate Drizzle',    description: 'Moderate drizzle',             icon: 'drizzle',          gradient: 'rainy',       isRain: true  },
  55: { condition: 'Dense Drizzle',       description: 'Dense intensity drizzle',      icon: 'drizzle',          gradient: 'rainy',       isRain: true  },
  61: { condition: 'Light Rain',          description: 'Slight rain',                  icon: 'rain',             gradient: 'rainy',       isRain: true  },
  63: { condition: 'Moderate Rain',       description: 'Moderate rain',                icon: 'rain',             gradient: 'rainy',       isRain: true  },
  65: { condition: 'Heavy Rain',          description: 'Heavy intensity rain',         icon: 'heavy-rain',       gradient: 'stormy',      isRain: true  },
  71: { condition: 'Light Snow',          description: 'Slight snow fall',             icon: 'snow',             gradient: 'snowy',       isRain: false },
  73: { condition: 'Moderate Snow',       description: 'Moderate snow fall',           icon: 'snow',             gradient: 'snowy',       isRain: false },
  75: { condition: 'Heavy Snow',          description: 'Heavy snow fall',              icon: 'snow',             gradient: 'snowy',       isRain: false },
  77: { condition: 'Snow Grains',         description: 'Snow grains',                  icon: 'snow',             gradient: 'snowy',       isRain: false },
  80: { condition: 'Light Showers',       description: 'Slight rain showers',          icon: 'rain-shower',      gradient: 'rainy',       isRain: true  },
  81: { condition: 'Rain Showers',        description: 'Moderate rain showers',        icon: 'rain-shower',      gradient: 'rainy',       isRain: true  },
  82: { condition: 'Violent Showers',     description: 'Violent rain showers',         icon: 'heavy-rain',       gradient: 'stormy',      isRain: true  },
  85: { condition: 'Snow Showers',        description: 'Slight snow showers',          icon: 'snow',             gradient: 'snowy',       isRain: false },
  86: { condition: 'Heavy Snow Showers',  description: 'Heavy snow showers',           icon: 'snow',             gradient: 'snowy',       isRain: false },
  95: { condition: 'Thunderstorm',        description: 'Thunderstorm',                 icon: 'thunderstorm',     gradient: 'storm',       isRain: true  },
  96: { condition: 'Thunderstorm + Hail', description: 'Thunderstorm with slight hail',icon: 'thunderstorm',    gradient: 'storm',       isRain: true  },
  99: { condition: 'Thunderstorm + Hail', description: 'Thunderstorm with heavy hail', icon: 'thunderstorm',    gradient: 'storm',       isRain: true  },
}

/**
 * Get weather info from WMO code
 */
export function getWeatherInfo(code, isNight = false) {
  const info = WEATHER_CODES[code] || WEATHER_CODES[0]
  return {
    ...info,
    icon: isNight && code <= 2 ? `${info.icon}-night` : info.icon
  }
}

/**
 * Determine if it's night time based on sunrise/sunset
 */
export function isNightTime(sunrise, sunset) {
  const now = new Date()
  const sunriseTime = new Date(sunrise)
  const sunsetTime = new Date(sunset)
  return now < sunriseTime || now > sunsetTime
}

/**
 * Atmospheric gradient classes based on weather + time
 */
export const GRADIENTS = {
  'sunny':         'gradient-sunny',
  'partly-cloudy': 'gradient-partly-cloudy',
  'cloudy':        'gradient-cloudy',
  'foggy':         'gradient-foggy',
  'rainy':         'gradient-rainy',
  'stormy':        'gradient-stormy',
  'storm':         'gradient-storm',
  'snowy':         'gradient-snowy',
  'night':         'gradient-night',
  'night-cloudy':  'gradient-night-cloudy',
  'night-rain':    'gradient-night-rain',
}

export function getGradientClass(weatherCode, isNight = false) {
  const info = WEATHER_CODES[weatherCode] || WEATHER_CODES[0]
  if (isNight) {
    if (info.isRain) return GRADIENTS['night-rain']
    if (info.gradient === 'cloudy' || info.gradient === 'foggy') return GRADIENTS['night-cloudy']
    return GRADIENTS['night']
  }
  return GRADIENTS[info.gradient] || GRADIENTS['sunny']
}

/**
 * Wind direction from degrees
 */
export function getWindDirection(degrees) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return dirs[Math.round(degrees / 22.5) % 16]
}

/**
 * UV Index description
 */
export function getUVDescription(uv) {
  if (uv <= 2) return { label: 'Low', color: '#22c55e' }
  if (uv <= 5) return { label: 'Moderate', color: '#eab308' }
  if (uv <= 7) return { label: 'High', color: '#f97316' }
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' }
  return { label: 'Extreme', color: '#7c3aed' }
}

/**
 * Visibility description
 */
export function getVisibilityDescription(km) {
  if (km >= 10) return 'Excellent'
  if (km >= 5) return 'Good'
  if (km >= 2) return 'Moderate'
  if (km >= 1) return 'Poor'
  return 'Very Poor'
}

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(c) {
  return Math.round((c * 9) / 5 + 32)
}

/**
 * Format temperature with unit
 */
export function formatTemp(celsius, unit = 'C') {
  if (unit === 'F') return `${celsiusToFahrenheit(celsius)}°F`
  return `${Math.round(celsius)}°C`
}

/**
 * Format time from ISO string
 */
export function formatTime(isoString, options = {}) {
  return new Date(isoString).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options
  })
}

/**
 * Format date from ISO string
 */
export function formatDate(isoString, options = {}) {
  return new Date(isoString).toLocaleDateString('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options
  })
}

/**
 * Get day name from ISO date string
 */
export function getDayName(isoString, short = true) {
  const date = new Date(isoString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

  return date.toLocaleDateString('en-NG', { weekday: short ? 'short' : 'long' })
}

/**
 * Calculate day length from sunrise/sunset
 */
export function getDayLength(sunrise, sunset) {
  const diff = new Date(sunset) - new Date(sunrise)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

/**
 * Relative time string ("5 minutes ago")
 */
export function getRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  return 'Over a day ago'
}
