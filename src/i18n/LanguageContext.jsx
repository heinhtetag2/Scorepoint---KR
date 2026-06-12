import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import STR from './strings.js'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ko')

  const t = useCallback((key, vars) => {
    const entry = STR[key]
    let s = entry ? (entry[lang] ?? entry.ko) : key
    if (vars) for (const k in vars) s = s.replaceAll(`{${k}}`, vars[k])
    return s
  }, [lang])

  // pick(koValue, enValue) — choose a data field by current language.
  const pick = useCallback((ko, en) => (lang === 'en' ? (en ?? ko) : ko), [lang])

  const value = useMemo(() => ({
    lang,
    setLang,
    toggle: () => setLang((l) => (l === 'ko' ? 'en' : 'ko')),
    t,
    pick,
  }), [lang, t, pick])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
