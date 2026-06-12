import { createContext, useContext, useMemo, useState } from 'react'
import { THEMES, THEME_ORDER } from './themes.js'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState('kakao')

  const value = useMemo(() => {
    const theme = THEMES[themeKey]
    return {
      themeKey,
      theme,
      setTheme: setThemeKey,
      order: THEME_ORDER,
      themes: THEMES,
    }
  }, [themeKey])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
