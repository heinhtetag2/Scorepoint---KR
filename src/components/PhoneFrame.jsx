import { useTheme } from '../theme/ThemeContext.jsx'

/* Device frame. Injects the active theme's CSS variables on .phone and stamps
   data-theme. Accepts a `nav` node so each design family can supply its own
   bottom navigation (classic 5-tab, Caddie FAB nav, Index 4-tab).
   `immersive` floats a transparent, white-text status bar over full-bleed
   content (e.g. the onboarding intro) so the graphic reaches the very top. */
export default function PhoneFrame({ nav, immersive = false, children }) {
  const { theme } = useTheme()
  return (
    <div className={`phone${immersive ? ' is-immersive' : ''}`} data-theme={theme.key} style={theme.vars}>
      <div className="notch" />
      <div className="statusbar">
        <span className="sb-time num">9:41</span>
        <span className="sb-right">
          <span className="sb-5g">5G</span>
          <svg className="sb-wifi" width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden>
            <path d="M8.5 1.8c2.5 0 4.78 1 6.43 2.6a.5.5 0 0 1 0 .72l-.7.7a.48.48 0 0 1-.68 0A7 7 0 0 0 8.5 3.9a7 7 0 0 0-5.05 1.92.48.48 0 0 1-.68 0l-.7-.7a.5.5 0 0 1 0-.72A9.18 9.18 0 0 1 8.5 1.8Zm0 3.4c1.5 0 2.87.58 3.9 1.53a.5.5 0 0 1 .02.72l-.72.72a.47.47 0 0 1-.66.01 4.07 4.07 0 0 0-5.08 0 .47.47 0 0 1-.66-.01l-.72-.72a.5.5 0 0 1 .02-.72A5.74 5.74 0 0 1 8.5 5.2Zm0 3.3c.66 0 1.27.25 1.72.66a.5.5 0 0 1 .02.74l-1.4 1.42a.48.48 0 0 1-.68 0l-1.4-1.42a.5.5 0 0 1 .02-.74A2.55 2.55 0 0 1 8.5 8.5Z" />
          </svg>
          <span className="sb-batt"><span className="sb-batt-fill" /></span>
        </span>
      </div>
      {children}
      {nav}
    </div>
  )
}
