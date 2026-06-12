import { useState } from 'react'
import { Settings, Bell, Wallet, Globe, CircleHelp, LogOut, ChevronRight, TrendingDown } from 'lucide-react'
import Spark from '../../components/Spark.jsx'
import { user, clubs, recentMatches } from '../../data/mock.js'

const TABS = [
  { id: 'records', label: 'Records' },
  { id: 'clubs', label: 'Clubs' },
  { id: 'settings', label: 'Settings' },
]

/* Caddie Profile — tabbed identity hub (a "player card"), not a settings dump. */
export default function Profile() {
  const [tab, setTab] = useState('records')

  return (
    <>
      <div className="appbar">
        <span className="title">My</span>
        <span className="actions"><Settings size={20} strokeWidth={1.8} /></span>
      </div>

      <div className="screen">
        {/* Player card */}
        <div className="cd-playercard">
          <div className="cd-pc-top">
            <div>
              <div className="cd-pc-name">{user.name} · {user.nameEn}</div>
              <div className="cd-pc-sub">Organizer · member {user.joinedYears}yr</div>
            </div>
            <div className="cd-pc-index">
              <span className="num">{user.handicap}.4</span>
              <small>INDEX</small>
            </div>
          </div>
        </div>

        {/* In-profile tabs */}
        <div className="cd-tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`cd-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'records' && (
          <>
            <div className="cd-trend">
              <div className="cd-trend-head">
                <span>Last 10 rounds</span>
                <span className="cd-trend-delta"><TrendingDown size={15} strokeWidth={2.2} /> improving</span>
              </div>
              <Spark points={[88, 86, 87, 84, 85, 82, 83, 80, 82, 79]} />
            </div>
            <div className="cd-list">
              {recentMatches.map((m) => (
                <div className="cd-rec-row" key={m.id}>
                  <span className="cd-rec-score num">{m.score}</span>
                  <div className="cd-rec-mid">
                    <div className="cd-rec-course">{m.course}</div>
                    <div className="cd-rec-meta num">Net {m.net.toFixed(1)} · {m.date}</div>
                  </div>
                  <ChevronRight size={17} className="cd-chev" />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'clubs' && (
          <div className="cd-list">
            {clubs.map((c) => (
              <div className="cd-club-row" key={c.id}>
                <div className="cd-club-name">
                  {c.nameKr}
                  <small>{c.members} members · {c.roleEn}</small>
                </div>
                {c.role === '총무' && <span className="badge badge-role">총무</span>}
                {c.unpaid > 0 && <span className="badge badge-unpaid num">미정산 {c.unpaid}</span>}
                <ChevronRight size={17} className="cd-chev" />
              </div>
            ))}
          </div>
        )}

        {tab === 'settings' && (
          <div className="cd-list">
            {[
              { Icon: Bell, label: 'Notifications · 알림' },
              { Icon: Wallet, label: 'Payments & settlement', accent: true },
              { Icon: Globe, label: 'Language · 한국어' },
              { Icon: CircleHelp, label: 'Help center · FAQ' },
            ].map((s) => (
              <div className="cd-set-row" key={s.label}>
                <s.Icon size={18} strokeWidth={1.8} className={s.accent ? 'cd-set-ico accent' : 'cd-set-ico'} />
                <span className="cd-set-label">{s.label}</span>
                <ChevronRight size={17} className="cd-chev" />
              </div>
            ))}
            <div className="cd-set-row danger">
              <LogOut size={18} strokeWidth={1.8} className="cd-set-ico danger" />
              <span className="cd-set-label">Log out · 로그아웃</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
