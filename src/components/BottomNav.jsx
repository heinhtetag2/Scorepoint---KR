import { useState } from 'react'
import { House, ChartColumn, Users, Flag, CircleUser } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext.jsx'

/* Korean-standard 5-tab bottom navigation with text labels under line icons.
   Tabs whose screens aren't built yet are marked `soon`: dimmed, badged, and
   non-navigating — tapping shows a brief "coming soon" toast instead. */
const ITEMS = [
  { id: 'home', key: 'navHome', screen: 'home', Icon: House },
  { id: 'myscore', key: 'navScore', screen: 'myscore', Icon: ChartColumn },
  { id: 'club', key: 'navClub', screen: 'club', Icon: Users },
  { id: 'event', key: 'navEvent', screen: 'events', Icon: Flag },
  { id: 'my', key: 'navMy', screen: 'profile', Icon: CircleUser },
]

export default function BottomNav({ navKey, onNav }) {
  const { t } = useLang()
  const [toast, setToast] = useState(false)

  const handleSoon = () => {
    setToast(true)
    window.clearTimeout(handleSoon._t)
    handleSoon._t = window.setTimeout(() => setToast(false), 1800)
  }

  return (
    <nav className="bottom-nav">
      {toast && <div className="nav-toast" role="status">{t('soonToast')}</div>}
      {ITEMS.map(({ id, key, screen, Icon, soon }) => (
        <button
          key={id}
          className={`nav-item ${navKey === id ? 'active' : ''} ${soon ? 'soon' : ''}`}
          aria-disabled={soon ? 'true' : undefined}
          onClick={() => (soon ? handleSoon() : onNav(id, screen))}
        >
          <span className="nav-ico">
            <Icon size={21} strokeWidth={navKey === id ? 2.3 : 1.8} />
            {soon && <span className="nav-soon-dot" />}
          </span>
          <span className="nav-label">{t(key)}</span>
        </button>
      ))}
    </nav>
  )
}
