import { Settings, ChevronRight, TrendingDown } from 'lucide-react'
import Spark from '../../components/Spark.jsx'
import { user, clubs } from '../../data/mock.js'

/* Index Profile — "Quiet Data". Identity is your numbers and trend, not a
   photo. Settings demoted to the app bar; performance chart is the hero. */
export default function Profile() {
  return (
    <>
      <div className="appbar">
        <span className="title">Profile</span>
        <span className="actions"><Settings size={20} strokeWidth={1.8} /></span>
      </div>

      <div className="screen">
        <div className="ix-id">
          <div className="ix-id-name">{user.name} · {user.nameEn}</div>
          <div className="ix-id-sub num">Index {user.handicap}.4 · Organizer</div>
        </div>

        {/* Stat rail */}
        <div className="ix-statrail">
          <div className="ix-stat"><span className="ix-stat-v num">{user.avg}</span><span className="ix-stat-l">Avg</span></div>
          <div className="ix-stat"><span className="ix-stat-v num">{user.best}</span><span className="ix-stat-l">Best</span></div>
          <div className="ix-stat"><span className="ix-stat-v num">{user.games}</span><span className="ix-stat-l">Rounds</span></div>
        </div>

        {/* Performance chart */}
        <div className="ix-chartcard">
          <div className="ix-chart-head">
            <span>Scoring trend</span>
            <span className="ix-chart-tag"><TrendingDown size={14} strokeWidth={2.2} /> 6 months</span>
          </div>
          <Spark points={[89, 87, 88, 85, 86, 84, 85, 83, 84, 82, 83, 80]} w={300} h={64} strokeWidth={2.4} />
        </div>

        {/* Clubs */}
        <div className="ix-label">Clubs</div>
        <div className="ix-group">
          {clubs.map((c) => (
            <div className="ix-row" key={c.id}>
              <span className="ix-row-k">{c.nameKr}</span>
              <span className="ix-row-v">
                {c.roleEn}{c.unpaid > 0 ? ` · ${c.unpaid} unpaid` : ''}
              </span>
              <ChevronRight size={17} className="ix-chev" />
            </div>
          ))}
        </div>

        {/* Account */}
        <div className="ix-label">Account</div>
        <div className="ix-group">
          <div className="ix-row"><span className="ix-row-k">Payments & settlement</span><ChevronRight size={17} className="ix-chev" /></div>
          <div className="ix-row"><span className="ix-row-k">Language</span><span className="ix-row-v">한국어</span><ChevronRight size={17} className="ix-chev" /></div>
          <div className="ix-row danger"><span className="ix-row-k">Log out</span></div>
        </div>
      </div>
    </>
  )
}
