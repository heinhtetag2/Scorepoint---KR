import { ArrowLeft, Share2, Flag, MapPin, Users, ChevronRight, Check, Megaphone } from 'lucide-react'
import { eventDetail as ev } from '../../data/mock.js'

/* Caddie Detail — the event as a round-lifecycle STEPPER (state machine).
   The current stage is expanded inline; others are collapsed nodes. */
const STAGES = [
  { id: 'recruit', label: 'Recruiting · 모집중', state: 'done' },
  { id: 'play', label: 'Playing · 라운딩', state: 'current' },
  { id: 'tally', label: 'Tallying · 집계', state: 'todo' },
  { id: 'settle', label: 'Settlement · 정산', state: 'todo' },
  { id: 'closed', label: 'Closed · 마감', state: 'todo' },
]

export default function Detail({ onBack }) {
  return (
    <>
      <div className="appbar">
        <button className="cd-iconbtn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
        <span className="title" style={{ flex: 1, textAlign: 'center' }}>{ev.titleEn}</span>
        <button className="cd-iconbtn" aria-label="Share"><Share2 size={19} strokeWidth={1.8} /></button>
      </div>

      <div className="screen">
        <div className="cd-detail-title">{ev.course}</div>
        <div className="cd-detail-sub num">{ev.date} · {ev.time}</div>

        <div className="cd-stepper">
          {STAGES.map((s, i) => (
            <div className={`cd-step ${s.state}`} key={s.id}>
              <div className="cd-step-rail">
                <span className="cd-step-node">
                  {s.state === 'done' ? <Check size={13} strokeWidth={3} /> : s.state === 'current' ? <span className="cd-step-pulse" /> : null}
                </span>
                {i < STAGES.length - 1 && <span className="cd-step-line" />}
              </div>

              <div className="cd-step-body">
                <div className="cd-step-label">
                  {s.label}
                  {s.state !== 'current' && <ChevronRight size={16} className="cd-chev" />}
                </div>

                {s.state === 'current' && (
                  <div className="cd-step-card">
                    <div className="cd-step-row"><Users size={16} strokeWidth={1.9} /><span className="num">{ev.joined}/{ev.capacity} joined · {ev.formatKr}</span></div>
                    <div className="cd-step-row"><MapPin size={16} strokeWidth={1.9} /><span>{ev.course} · tee times & 4-ball groups</span></div>
                    <div className="cd-step-note"><Megaphone size={15} strokeWidth={1.9} />{ev.noticeKr}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky-cta">
          <button className="cd-cta">
            <Flag size={18} strokeWidth={2.2} />
            Register · {ev.fee}
          </button>
        </div>
      </div>
    </>
  )
}
