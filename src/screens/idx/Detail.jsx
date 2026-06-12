import { useState } from 'react'
import { ArrowLeft, Share2, Users, Trophy, Wallet, ChevronRight, X } from 'lucide-react'
import {
  eventDetail as ev, participants, leaderboard, settlement, won,
} from '../../data/mock.js'

/* Index Detail — summary-number header + progressive disclosure via bottom
   sheets. The main view stays calm; depth is one tap into a sheet. */
export default function Detail({ onBack }) {
  const [sheet, setSheet] = useState(null) // 'players' | 'rank' | 'settle' | null

  const rows = [
    { id: 'players', Icon: Users, label: 'Players', sub: `${ev.joined} registered · 2 unpaid` },
    { id: 'rank', Icon: Trophy, label: 'Leaderboard', sub: 'Posts after the round' },
    { id: 'settle', Icon: Wallet, label: 'Settlement', sub: `+${won(settlement.balance).replace('원', '')} balance`, accent: true },
  ]

  return (
    <>
      <div className="appbar">
        <button className="ix-iconbtn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{ev.course}</span>
        <button className="ix-iconbtn" aria-label="Share"><Share2 size={19} strokeWidth={1.8} /></button>
      </div>

      <div className="screen">
        {/* Summary header — numbers as hero */}
        <div className="ix-summary">
          <div className="ix-sum-top">
            <span className="ix-sum-dday num">D-{ev.dday}</span>
            <span className="ix-sum-date num">{ev.date} · {ev.time}</span>
          </div>
          <div className="ix-sum-figs">
            <div className="ix-fig"><span className="ix-fig-v num">{ev.joined}/{ev.capacity}</span><span className="ix-fig-l">Joined</span></div>
            <div className="ix-fig"><span className="ix-fig-v num">{ev.fee}</span><span className="ix-fig-l">Fee</span></div>
            <div className="ix-fig"><span className="ix-fig-v">New Peoria</span><span className="ix-fig-l">Format</span></div>
          </div>
        </div>

        {/* Disclosure rows → sheets */}
        <div className="ix-group">
          {rows.map((r) => (
            <button key={r.id} className="ix-disc" onClick={() => setSheet(r.id)}>
              <span className={`ix-disc-ico ${r.accent ? 'accent' : ''}`}><r.Icon size={19} strokeWidth={1.9} /></span>
              <span className="ix-disc-main">
                <span className="ix-disc-label">{r.label}</span>
                <span className="ix-disc-sub num">{r.sub}</span>
              </span>
              <ChevronRight size={18} className="ix-chev" />
            </button>
          ))}
        </div>

        <div className="sticky-cta">
          <button className="ix-cta">Register · {ev.fee}</button>
        </div>
      </div>

      {/* ── Bottom sheets ─────────────────────────────────────── */}
      {sheet && <div className="ix-scrim" onClick={() => setSheet(null)} />}
      <div className={`ix-sheet ${sheet ? 'open' : ''}`}>
        <div className="ix-sheet-grip" />
        <div className="ix-sheet-head">
          <span>{sheet === 'players' ? 'Players · 참가자' : sheet === 'rank' ? 'Leaderboard · 순위' : 'Settlement · 정산'}</span>
          <button className="ix-iconbtn" onClick={() => setSheet(null)} aria-label="Close"><X size={18} /></button>
        </div>

        {sheet === 'players' && (
          <div className="ix-sheet-body">
            {participants.map((p) => (
              <div className="ix-p-row" key={p.id}>
                <span className="ix-p-name">{p.nameKr}{p.role === '총무' && <span className="badge badge-role">총무</span>}</span>
                <span className="ix-p-grp num">G{p.group}</span>
                {p.paid ? <span className="badge badge-paid">Paid</span> : <span className="badge badge-unpaid">Unpaid</span>}
              </div>
            ))}
          </div>
        )}

        {sheet === 'rank' && (
          <div className="ix-sheet-body">
            {leaderboard.map((r) => (
              <div className="ix-lb-row" key={r.rank}>
                <span className="ix-lb-rank num">{r.rank}</span>
                <span className="ix-lb-name">{r.nameKr}</span>
                <span className="ix-lb-net num">Net {r.net.toFixed(1)}</span>
                <span className="ix-lb-prize num">{r.prize}</span>
              </div>
            ))}
          </div>
        )}

        {sheet === 'settle' && (
          <div className="ix-sheet-body">
            {settlement.rows.map((row, i) => (
              <div className="ix-led-row" key={i}>
                <span>{row.label}</span>
                <span className={`num ${row.amount > 0 ? 'pos' : 'neg'}`}>{row.amount > 0 ? '+' : ''}{won(row.amount)}</span>
              </div>
            ))}
            <div className="ix-led-bal">
              <span>Balance</span>
              <span className="num">{won(settlement.balance)}</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
