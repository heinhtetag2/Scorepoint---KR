import { useTheme } from '../theme/ThemeContext.jsx'

/* Device frame. Injects the active theme's CSS variables on .phone and stamps
   data-theme. Accepts a `nav` node so each design family can supply its own
   bottom navigation (classic 5-tab, Caddie FAB nav, Index 4-tab). */
export default function PhoneFrame({ nav, children }) {
  const { theme } = useTheme()
  return (
    <div className="phone" data-theme={theme.key} style={theme.vars}>
      <div className="notch" />
      <div className="statusbar">
        <span className="num">9:41</span>
        <span className="sb-right num">5G ▮▮▮ 87%</span>
      </div>
      {children}
      {nav}
    </div>
  )
}
