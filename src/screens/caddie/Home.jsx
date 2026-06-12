import { Search, Bell, Flag, ChevronRight, CircleCheck, Trophy, CalendarClock } from 'lucide-react'
import { user, events, recentMatches } from '../../data/mock.js'

/* Caddie Home — "Next + Feed".
   One spotlighted next round + a single unified chronological timeline that
   mixes upcoming events and past results (no separate sections). */
export default function Home({ onOpenEvent }) {
  const next = events[0]

  // Unified, time-sorted activity feed (results + upcoming in one stream).
  const feed = [
    { kind: 'logged', Icon: CircleCheck, title: `Logged · ${recentMatches[0].score} (Net ${recentMatches[0].net.toFixed(0)})`, meta: `${recentMatches[0].course} · ${recentMatches[0].date}`, tone: 'positive' },
    { kind: 'result', Icon: Trophy, title: 'Result · 2nd place', meta: 'Lakeside Cup · 4/18', tone: 'brand' },
    { kind: 'logged', Icon: CircleCheck, title: `Logged · ${recentMatches[2].score} (Net ${recentMatches[2].net.toFixed(0)})`, meta: `${recentMatches[2].course} · ${recentMatches[2].date}`, tone: 'positive' },
    { kind: 'upcoming', Icon: CalendarClock, title: 'Upcoming · Company Cup', meta: `${events[1].date} · D-${events[1].dday}`, tone: 'muted' },
  ]

  return (
    <>
      <div className="appbar">
        <span className="brand">Caddie</span>
        <span className="actions">
          <Search size={20} strokeWidth={1.8} />
          <span className="dot-badge"><Bell size={20} strokeWidth={1.8} /></span>
        </span>
      </div>

      <div className="screen">
        {/* Spotlight: the single next round */}
        <div className="cd-spot" onClick={() => onOpenEvent(next.id)}>
          <div className="cd-spot-head">
            <span className="cd-spot-eyebrow">NEXT ROUND</span>
            <span className="cd-dday">D-{next.dday}</span>
          </div>
          <div className="cd-spot-course">{next.course} · 남서울CC</div>
          <div className="cd-spot-meta num">Tue {next.date.split(' ')[0]} · {next.time} · {next.joined}/{next.capacity}</div>
          <button className="cd-spot-action" onClick={(e) => { e.stopPropagation(); onOpenEvent(next.id) }}>
            <Flag size={18} strokeWidth={2} />
            <span>Register · 참가 신청</span>
            <ChevronRight size={18} className="cd-spot-chev" />
          </button>
        </div>

        {/* Club context rail */}
        <div className="cd-section-label">My Clubs</div>
        <div className="cd-rail">
          {['Gangnam', 'Work', 'Weekend'].map((c, i) => (
            <button key={c} className={`cd-club-chip ${i === 0 ? 'active' : ''}`}>{c}</button>
          ))}
          <button className="cd-club-chip ghost">+ 추가</button>
        </div>

        {/* Unified activity timeline */}
        <div className="cd-section-label">Activity · 활동</div>
        <div className="cd-timeline">
          {feed.map((f, i) => (
            <div className="cd-tl-row" key={i}>
              <div className="cd-tl-rail">
                <span className={`cd-tl-node tone-${f.tone}`}><f.Icon size={15} strokeWidth={2.1} /></span>
                {i < feed.length - 1 && <span className="cd-tl-line" />}
              </div>
              <div className="cd-tl-body">
                <div className="cd-tl-title">{f.title}</div>
                <div className="cd-tl-meta num">{f.meta}</div>
              </div>
              {f.kind === 'upcoming' && (
                <ChevronRight size={18} className="cd-tl-chev" onClick={() => onOpenEvent(events[1].id)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
