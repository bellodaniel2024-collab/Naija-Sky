import { useRef, useEffect, useState } from 'react'
import { useSearch } from '../../hooks/useSearch'
import './SearchBar.css'

export default function SearchBar({
  onSelect,
  placeholder = 'Search any city, state or location in Nigeria...',
  autoFocus = false,
  large = false,
}) {
  const { query, setQuery, results, loading, clearSearch } = useSearch()
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [autoFocus])

  useEffect(() => {
    setOpen(results.length > 0 && query.length >= 2)
    setActiveIdx(-1)
  }, [results, query])

  const handleSelect = (loc) => {
    clearSearch()
    setOpen(false)
    onSelect?.(loc)
  }

  const handleKeyDown = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      handleSelect(results[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const typeLabel = { state: 'State', city: 'City' }

  return (
    <div className={`searchbar ${large ? 'searchbar--large' : ''}`} role="search">
      <div className="searchbar__input-wrap">
        <span className="searchbar__icon" aria-hidden="true">
          {loading ? <SpinnerIcon /> : <SearchIcon />}
        </span>
        <input
          ref={inputRef}
          className="searchbar__input"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search Nigerian locations"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={open}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            className="searchbar__clear btn btn-ghost"
            onClick={() => { clearSearch(); inputRef.current?.focus() }}
            aria-label="Clear search"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {open && (
        <ul
          id="search-results"
          className="searchbar__results animate-slide-down"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
        >
          {results.map((r, i) => (
            <li key={r.id || i} role="option" aria-selected={i === activeIdx}>
              <button
                className={`searchbar__result-item ${i === activeIdx ? 'searchbar__result-item--active' : ''}`}
                onClick={() => handleSelect(r)}
                onMouseEnter={() => setActiveIdx(i)}
                type="button"
              >
                <span className="searchbar__result-icon" aria-hidden="true">
                  <LocationPinIcon />
                </span>
                <span className="searchbar__result-info">
                  <span className="searchbar__result-name">{r.name}</span>
                  <span className="searchbar__result-meta">
                    {r.state && <>{r.state}, </>}
                    {r.country || 'Nigeria'}
                    {r.type && (
                      <span className="searchbar__result-type badge badge-blue">
                        {typeLabel[r.type] || r.type}
                      </span>
                    )}
                  </span>
                </span>
                <span className="searchbar__result-arrow" aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
}
function CloseIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
function LocationPinIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
}
function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" style={{ animation: 'spin-slow 0.7s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  )
}
