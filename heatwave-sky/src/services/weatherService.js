/**
 * Heatwave Sky — Weather Service
 * All Open-Meteo API communication lives here.
 * Components never call fetch/axios directly.
 */

import axios from 'axios'

const WEATHER_BASE = 'https://api.open-meteo.com/v1'
const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1'

// Shared axios instance with sensible defaults
const weatherApi = axios.create({ baseURL: WEATHER_BASE, timeout: 10000 })
const geoApi = axios.create({ baseURL: GEO_BASE, timeout: 8000 })

// ─── Geocoding ────────────────────────────────────────────────────────────────

/**
 * Search for Nigerian locations by name using Open-Meteo geocoding.
 * Returns up to `count` results filtered to Nigeria.
 */
export async function searchLocations(query, count = 10) {
  if (!query || query.trim().length < 2) return []

  const { data } = await geoApi.get('/search', {
    params: {
      name: query.trim(),
      count,
      language: 'en',
      format: 'json',
      country_code: 'NG',
    },
  })

  if (!data.results) return []

  return data.results.map(r => ({
    id: r.id,
    name: r.name,
    state: r.admin1 || '',
    country: r.country || 'Nigeria',
    lat: r.latitude,
    lon: r.longitude,
    elevation: r.elevation,
    timezone: r.timezone,
  }))
}

/**
 * Reverse-geocode lat/lon to a place name.
 * Open-Meteo does not offer reverse geocoding, so we use the
 * Nominatim OSM API (free, no key, ToS-compliant for light use).
 */
export async function reverseGeocode(lat, lon) {
  const response = await axios.get(
    'https://nominatim.openstreetmap.org/reverse',
    {
      params: { lat, lon, format: 'json', addressdetails: 1 },
      headers: { 'Accept-Language': 'en', 'User-Agent': 'HeatwaveSky/1.0' },
      timeout: 8000,
    }
  )

  const addr = response.data.address || {}
  return {
    name:
      addr.city ||
      addr.town ||
      addr.village ||
      addr.hamlet ||
      addr.county ||
      'Unknown location',
    state: addr.state || addr.state_district || '',
    country: addr.country || 'Nigeria',
    lat,
    lon,
  }
}

// ─── Current + Forecast Weather ───────────────────────────────────────────────

/**
 * Fetch full weather data for a lat/lon coordinate.
 * Returns a normalised object used by all components.
 */
export async function fetchWeatherData(lat, lon, timezone = 'Africa/Lagos') {
  const { data } = await weatherApi.get('/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      timezone,
      forecast_days: 7,

      // Current conditions
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'visibility',
      ].join(','),

      // Hourly — next 48 hours
      hourly: [
        'temperature_2m',
        'apparent_temperature',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'visibility',
        'wind_speed_10m',
        'relative_humidity_2m',
        'is_day',
      ].join(','),

      // Daily — 7-day
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'daylight_duration',
        'uv_index_max',
        'precipitation_sum',
        'rain_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_direction_10m_dominant',
      ].join(','),
    },
  })

  return normaliseWeatherData(data)
}

// ─── Normalisation ────────────────────────────────────────────────────────────

function normaliseWeatherData(raw) {
  const c = raw.current
  const h = raw.hourly
  const d = raw.daily

  // Build hourly array (48 hrs)
  const hourly = (h.time || []).slice(0, 48).map((time, i) => ({
    time,
    temp: h.temperature_2m[i],
    apparentTemp: h.apparent_temperature[i],
    precipProbability: h.precipitation_probability[i] ?? 0,
    precipitation: h.precipitation[i] ?? 0,
    weatherCode: h.weather_code[i],
    visibility: h.visibility[i] ?? null,
    windSpeed: h.wind_speed_10m[i] ?? null,
    humidity: h.relative_humidity_2m[i] ?? null,
    isDay: h.is_day[i] ?? 1,
  }))

  // Build daily array (7 days)
  const daily = (d.time || []).map((time, i) => ({
    time,
    weatherCode: d.weather_code[i],
    tempMax: d.temperature_2m_max[i],
    tempMin: d.temperature_2m_min[i],
    apparentMax: d.apparent_temperature_max[i],
    apparentMin: d.apparent_temperature_min[i],
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
    daylightDuration: d.daylight_duration[i],
    uvIndexMax: d.uv_index_max[i] ?? null,
    precipitationSum: d.precipitation_sum[i] ?? 0,
    rainSum: d.rain_sum[i] ?? 0,
    precipProbability: d.precipitation_probability_max[i] ?? 0,
    windSpeedMax: d.wind_speed_10m_max[i] ?? null,
    windDirection: d.wind_direction_10m_dominant[i] ?? null,
  }))

  const today = daily[0] || {}

  return {
    fetchedAt: new Date().toISOString(),
    timezone: raw.timezone,

    current: {
      temp: c.temperature_2m,
      apparentTemp: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      precipitation: c.precipitation ?? 0,
      weatherCode: c.weather_code,
      cloudCover: c.cloud_cover ?? null,
      pressure: c.pressure_msl ?? c.surface_pressure ?? null,
      windSpeed: c.wind_speed_10m ?? null,
      windDirection: c.wind_direction_10m ?? null,
      windGusts: c.wind_gusts_10m ?? null,
      visibility: c.visibility != null ? c.visibility / 1000 : null, // convert m→km
      isDay: c.is_day ?? 1,
      // Pull today's high/low from daily
      tempMax: today.tempMax ?? null,
      tempMin: today.tempMin ?? null,
      uvIndex: today.uvIndexMax ?? null,
      sunrise: today.sunrise ?? null,
      sunset: today.sunset ?? null,
      precipProbability: today.precipProbability ?? 0,
    },

    hourly,
    daily,
  }
}

// ─── Batch fetch for Nigeria state cards ─────────────────────────────────────

/**
 * Fetch lightweight current-conditions for multiple locations in parallel.
 * Used by the Nigeria Weather page to populate all 37 state cards.
 * Rate-limited to avoid hammering the API — fires in batches of 6.
 */
export async function fetchMultipleLocations(locations) {
  const BATCH = 6
  const results = []

  for (let i = 0; i < locations.length; i += BATCH) {
    const batch = locations.slice(i, i + BATCH)
    const fetched = await Promise.allSettled(
      batch.map(loc =>
        fetchCurrentOnly(loc.lat, loc.lon).then(w => ({ ...loc, weather: w }))
      )
    )
    fetched.forEach((r, idx) => {
      if (r.status === 'fulfilled') {
        results.push(r.value)
      } else {
        results.push({ ...batch[idx], weather: null, error: true })
      }
    })
    // Small pause between batches to be a good API citizen
    if (i + BATCH < locations.length) {
      await new Promise(res => setTimeout(res, 200))
    }
  }

  return results
}

/**
 * Lightweight current-only fetch (no hourly/daily overhead).
 */
export async function fetchCurrentOnly(lat, lon, timezone = 'Africa/Lagos') {
  const { data } = await weatherApi.get('/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      timezone,
      current: [
        'temperature_2m',
        'weather_code',
        'relative_humidity_2m',
        'wind_speed_10m',
        'is_day',
        'precipitation',
      ].join(','),
    },
  })

  const c = data.current
  return {
    temp: c.temperature_2m,
    weatherCode: c.weather_code,
    humidity: c.relative_humidity_2m,
    windSpeed: c.wind_speed_10m,
    isDay: c.is_day ?? 1,
    precipitation: c.precipitation ?? 0,
    fetchedAt: new Date().toISOString(),
  }
}

// ─── Local cache helpers ──────────────────────────────────────────────────────

const CACHE_KEY_PREFIX = 'hws_weather_'
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

export function cacheWeatherData(locationKey, data) {
  try {
    localStorage.setItem(
      `${CACHE_KEY_PREFIX}${locationKey}`,
      JSON.stringify({ data, cachedAt: new Date().toISOString() })
    )
  } catch {
    // Storage full — silently ignore
  }
}

export function getCachedWeather(locationKey) {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}${locationKey}`)
    if (!raw) return null
    const { data, cachedAt } = JSON.parse(raw)
    const age = Date.now() - new Date(cachedAt).getTime()
    return { data, cachedAt, isStale: age > CACHE_TTL_MS }
  } catch {
    return null
  }
}

export function clearWeatherCache() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(CACHE_KEY_PREFIX))
    .forEach(k => localStorage.removeItem(k))
}
