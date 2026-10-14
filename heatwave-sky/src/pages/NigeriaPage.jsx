import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { NIGERIAN_STATES } from '../data/nigerianStates'
import { fetchMultipleLocations } from '../services/weatherService'
import { getWeatherInfo } from '../utils/weatherCodes'
import WeatherIcon from '../components/weather/WeatherIcon'
import { useApp } from '../context/AppContext'
import { StateCardSkeleton } from '../components/ui/LoadingSkeleton'
import AdBanner from '../components/ui/AdBanner'
import './NigeriaPage.css'

const REGIONS = ['All', 'South West', 'South South', 'South East', 'North Central', 'North West', 'North East']

export default function NigeriaPage() {
  const { setActiveLocation, displayShort } = useApp()
  const navigate = useNavigate()
  const [stateWeather, setStateWeather] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')
  const [sort, setSort] = useState('name')

  useEffect(() => {
    document.title = 'Nigeria Weather — All States | Heatwave Sky'
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const locs = NIGERIAN_STATES.map(s => ({ id: s.id, name: s.capital, state: s.name, lat: s.lat, lon: s.lon }))
        const results = await fetchMultipleLocations(locs)
        if (!cancelled) {
          const map = {}
          results.forEach(r => { map[r.id] = r.weather })
          setStateWeather(map)
        }
      } catch (e) {
        console.error('Nigeria page load error', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    let list = [...NIGERIAN_STATES]
    if (region !== 'All') list = list.filter(s => s.region === region)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.capital.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q)
      )
    }
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'temp') {
      list.sort((a, b) => {
        const wa = stateWeather[a.id]?.temp ?? -999
        const wb = stateWeather[b.id]?.temp ?? -999
        return wb - wa
      })
    }
    return list
  }, [search, region, sort, stateWeather])

  const handleStateClick = (state) => {
    setActiveLocation({ name: state.capital, state: state.name, country: 'Nigeria', lat: state.lat, lon: state.lon })
    navigate(`/weather/${state.slug}`)
  }

  return (
    <main className="nigeria-page" aria-label="Nigeria state weather overview">
      <div className="nigeria-page__hero">
        <div className="container">
          <div className="nigeria-page__hero-inner animate-fade-up">
            <span className="badge badge-blue">🇳🇬 Nigeria</span>
            <h1 className="text-h1">Nigeria Weather</h1>
            <p className="nigeria-page__tagline">
              Real-time weather conditions across all 36 states and the FCT.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Controls */}
        <div className="nigeria-page__controls">
          <div className="nigeria-page__search-wrap">
            <SearchIcon />
            <input
              className="nigeria-page__search input"
              type="search"
              placeholder="Search states..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search Nigerian states"
            />
          </div>

          <div className="nigeria-page__filters">
            <select
              className="nigeria-page__select input"
              value={region}
              onChange={e => setRegion(e.target.value)}
              aria-label="Filter by region"
            >
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select
              className="nigeria-page__select input"
              value={sort}
              onChange={e => setSort(e.target.value)}
              aria-label="Sort states"
            >
              <option value="name">Sort: A–Z</option>
              <option value="temp">Sort: Temperature</option>
            </select>
          </div>
        </div>

        <p className="nigeria-page__count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'state' : 'states'} shown
        </p>

        {/* Ad — above state grid */}
        <AdBanner slot="0000000003" format="horizontal" className="nigeria-page__ad" />

        {/* State Cards Grid */}
        {loading ? (
          <StateCardSkeleton count={12} />
        ) : (
          <div className="nigeria-page__grid" role="list">
            {filtered.map(state => {
              const w = stateWeather[state.id]
              const info = w ? getWeatherInfo(w.weatherCode, w.isDay === 0) : null

              return (
                <article
                  key={state.id}
                  className="state-card card"
                  role="listitem"
                  aria-label={`${state.name}: ${w ? `${Math.round(w.temp)}°C, ${info?.condition}` : 'Loading'}`}
                  onClick={() => handleStateClick(state)}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleStateClick(state)}
                >
                  <div className="state-card__region badge badge-blue">{state.region}</div>
                  <div className="state-card__icon">
                    {info
                      ? <WeatherIcon icon={info.icon} size={52} />
                      : <div className="skeleton" style={{ width: 52, height: 52, borderRadius: '50%' }} />
                    }
                  </div>
                  <div className="state-card__name">{state.name}</div>
                  <div className="state-card__capital">{state.capital}</div>
                  {w ? (
                    <>
                      <div className="state-card__temp">{Math.round(w.temp)}°</div>
                      <div className="state-card__cond">{info?.condition}</div>
                    </>
                  ) : (
                    <>
                      <div className="skeleton" style={{ width: 60, height: 28, borderRadius: 6, margin: '0.25rem auto' }} />
                      <div className="skeleton" style={{ width: 90, height: 14, borderRadius: 4 }} />
                    </>
                  )}
                  <Link
                    to={`/weather/${state.slug}`}
                    className="state-card__link"
                    aria-label={`View full forecast for ${state.name}`}
                    onClick={e => e.stopPropagation()}
                  >
                    Full forecast →
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nigeria-page__search-icon" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
}
