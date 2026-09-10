import { useState, useEffect, useCallback } from 'react'

const THEME_KEY = 'hws_theme'

function getSystemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function resolveTheme(theme) {
  if (theme === 'system') return getSystemTheme()
  return theme
}

/**
 * Theme management hook — light / dark / system
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'system'
    } catch {
      return 'system'
    }
  })

  // Derived — never calls window APIs synchronously in render
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(theme))

  useEffect(() => {
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)
    try {
      document.documentElement.setAttribute('data-theme', resolved)
      document.documentElement.classList.toggle('dark', resolved === 'dark')
    } catch {}
  }, [theme])

  // Listen for system preference changes when theme = 'system'
  useEffect(() => {
    if (theme !== 'system') return
    let mq
    try {
      mq = window.matchMedia('(prefers-color-scheme: dark)')
    } catch {
      return
    }
    const handler = (e) => {
      const resolved = e.matches ? 'dark' : 'light'
      setResolvedTheme(resolved)
      document.documentElement.setAttribute('data-theme', resolved)
      document.documentElement.classList.toggle('dark', e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((value) => {
    setThemeState(value)
    try {
      localStorage.setItem(THEME_KEY, value)
    } catch {}
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  return { theme, resolvedTheme, setTheme, toggleTheme }
}
