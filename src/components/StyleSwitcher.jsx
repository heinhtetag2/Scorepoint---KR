import { useTheme } from '../theme/ThemeContext.jsx'

/* Style switcher with two groups:
   CLASSIC skins (Kakao / Toss / Naver) | NEW concepts (Caddie / Index).
   Selecting any option re-skins (and, for concepts, re-lays-out) instantly. */
export default function StyleSwitcher() {
  const { themeKey, setTheme, order, themes } = useTheme()
  const classic = order.filter((k) => themes[k].family === 'classic')
  const concept = order.filter((k) => themes[k].family === 'concept')

  const Btn = (key) => {
    const t = themes[key]
    return (
      <button
        key={key}
        role="tab"
        aria-selected={themeKey === key}
        className={`switch-btn ${themeKey === key ? 'active' : ''}`}
        onClick={() => setTheme(key)}
      >
        <span className="switch-dot" style={{ background: t.accentDemo }} />
        <span className="switch-label">{t.label}</span>
        <span className="switch-sub">{t.subtitle}</span>
        {t.isNew && <span className="switch-new">NEW</span>}
      </button>
    )
  }

  return (
    <div className="switcher" role="tablist" aria-label="Design direction">
      {classic.map(Btn)}
      <span className="switch-div" aria-hidden="true" />
      {concept.map(Btn)}
    </div>
  )
}
