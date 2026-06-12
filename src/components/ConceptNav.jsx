import {
  Home, CalendarDays, Camera, UsersRound, User,
  LayoutGrid, BarChart3, Calendar, CircleUser,
} from 'lucide-react'

/* Caddie — 4 tabs + a raised center capture FAB (the hero verb). */
const CADDIE_ITEMS = [
  { id: 'cd-home', screen: 'home', Icon: Home, label: 'Home' },
  { id: 'cd-events', screen: 'detail', Icon: CalendarDays, label: 'Events' },
  { id: 'cd-cap', screen: 'home', Icon: Camera, label: '', fab: true },
  { id: 'cd-clubs', screen: 'profile', Icon: UsersRound, label: 'Clubs' },
  { id: 'cd-my', screen: 'profile', Icon: User, label: 'My' },
]

export function CaddieNav({ navKey, onNav }) {
  return (
    <nav className="cd-nav">
      {CADDIE_ITEMS.map(({ id, screen, Icon, label, fab }) =>
        fab ? (
          <button key={id} className="cd-fab" onClick={() => onNav('cd-home', 'home')} aria-label="Capture scorecard">
            <Icon size={24} strokeWidth={2.2} />
          </button>
        ) : (
          <button
            key={id}
            className={`cd-nav-item ${navKey === id ? 'active' : ''}`}
            onClick={() => onNav(id, screen)}
          >
            <Icon size={21} strokeWidth={navKey === id ? 2.4 : 1.8} />
            <span>{label}</span>
          </button>
        ),
      )}
    </nav>
  )
}

/* Index — 4 thin, label-light tabs. */
const INDEX_ITEMS = [
  { id: 'ix-home', screen: 'home', Icon: LayoutGrid, label: 'Home' },
  { id: 'ix-stats', screen: 'profile', Icon: BarChart3, label: 'Stats' },
  { id: 'ix-events', screen: 'detail', Icon: Calendar, label: 'Events' },
  { id: 'ix-me', screen: 'profile', Icon: CircleUser, label: 'Profile' },
]

export function IndexNav({ navKey, onNav }) {
  return (
    <nav className="ix-nav">
      {INDEX_ITEMS.map(({ id, screen, Icon, label }) => (
        <button
          key={id}
          className={`ix-nav-item ${navKey === id ? 'active' : ''}`}
          onClick={() => onNav(id, screen)}
        >
          <Icon size={20} strokeWidth={navKey === id ? 2.4 : 1.7} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
