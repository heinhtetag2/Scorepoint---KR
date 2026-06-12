import { Bell, Camera, Calendar, Trophy, Wallet, ChevronRight, TrendingDown } from 'lucide-react'
import Spark from '../../components/Spark.jsx'
import { user, events, recentMatches } from '../../data/mock.js'

/* Index Home — "Index-led".
   The handicap Index is the anchor number (Toss-balance pattern), followed by
   a precise 2x2 module grid where each module carries one live datum. */
const MODULES = [
  { id: 'reg', Icon: Camera, name: 'Register', datum: `Last ${recentMatches[0].date}`, screen: 'home' },
  { id: 'evt', Icon: Calendar, name: 'Events', datum: '2 upcoming', screen: 'detail' },
  { id: 'rnk', Icon: Trophy, name: 'Rankings', datum: '2nd · Lakeside', screen: 'profile' },
  { id: 'set', Icon: Wallet, name: 'Settlement', datum: '1 pending', accent: true, screen: 'detail' },
]

export default function Home({ onOpenEvent, onModule }) {
  const next = events[0]
  return (
    <>
      <div className="appbar">
        <span className="title">Home</span>
        <span className="actions"><span className="dot-badge"><Bell size={20} strokeWidth={1.8} /></span></span>
      </div>

      <div className="screen">
        {/* Anchor number */}
        <div className="ix-anchor">
          <div className="ix-anchor-label">Handicap Index</div>
          <div className="ix-anchor-row">
            <span className="ix-anchor-num num">{user.handicap}.4</span>
            <span className="ix-anchor-delta"><TrendingDown size={16} strokeWidth={2.2} /> 0.6</span>
          </div>
          <div className="ix-anchor-spark">
            <Spark points={[14.1, 13.8, 13.9, 13.2, 13.4, 12.9, 13.0, 12.4]} w={300} h={40} />
            <span className="ix-anchor-range num">30-day</span>
          </div>
        </div>

        {/* Module grid */}
        <div className="ix-grid">
          {MODULES.map((m) => (
            <button key={m.id} className="ix-mod" onClick={() => onModule(m.screen)}>
              <span className={`ix-mod-ico ${m.accent ? 'accent' : ''}`}><m.Icon size={20} strokeWidth={1.9} /></span>
              <span className="ix-mod-name">{m.name}</span>
              <span className={`ix-mod-datum num ${m.accent ? 'accent' : ''}`}>{m.datum}</span>
            </button>
          ))}
        </div>

        {/* Up next — one quiet agenda row */}
        <div className="ix-label">Up next</div>
        <button className="ix-upnext" onClick={() => onOpenEvent(next.id)}>
          <div className="ix-upnext-main">
            <div className="ix-upnext-title">{next.course}</div>
            <div className="ix-upnext-meta num">Tue {next.time} · {next.joined}/{next.capacity}</div>
          </div>
          <span className="ix-upnext-dday num">D-{next.dday}</span>
          <ChevronRight size={18} className="ix-chev" />
        </button>
      </div>
    </>
  )
}
